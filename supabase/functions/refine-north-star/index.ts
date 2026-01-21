import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MILESTONE_BREAKDOWN = {
  '3-month': {
    count: 3,
    labels: ['Month 1', 'Month 2', 'Month 3']
  },
  '6-month': {
    count: 3,
    labels: ['Months 1-2', 'Months 3-4', 'Months 5-6']
  },
  '1-year': {
    count: 4,
    labels: ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)']
  },
  '3-year': {
    count: 3,
    labels: ['Year 1', 'Year 2', 'Year 3']
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
    
    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY is not configured')
    }

    const { raw_goal, timeframe } = await req.json()

    if (!raw_goal || !timeframe) {
      return new Response(
        JSON.stringify({ error: 'Missing raw_goal or timeframe' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const breakdown = MILESTONE_BREAKDOWN[timeframe as keyof typeof MILESTONE_BREAKDOWN]
    if (!breakdown) {
      return new Response(
        JSON.stringify({ error: 'Invalid timeframe. Use: 3-month, 6-month, 1-year, or 3-year' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt = `You are an expert executive coach with access to real-time data. The user will give you a "North Star" goal and a timeframe. You must:

1. **Research & Verify**: Use your real-time knowledge to assess if this goal is realistic for the given timeframe. Consider industry benchmarks, typical timelines, health/safety factors, and practical constraints.

2. **SMART Goal Rewrite**: Transform their goal into a strict SMART format:
   - Specific: Clearly defined outcome
   - Measurable: Quantifiable success metrics
   - Achievable: Realistic given the timeframe
   - Relevant: Aligned with personal growth
   - Time-bound: With the exact timeframe specified

3. **Milestone Breakdown**: Create exactly ${breakdown.count} milestones for these periods: ${breakdown.labels.join(', ')}. Each milestone should be:
   - A concrete, actionable checkpoint
   - Progressive (building on previous milestones)
   - Measurable

4. **Reality Check**: Provide honest feedback about:
   - Whether this goal is achievable in the timeframe
   - Any risks, challenges, or considerations
   - Suggestions for adjustment if needed

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "smart_goal": "The rewritten SMART goal as a single paragraph",
  "milestones": [
    {"label": "${breakdown.labels[0]}", "description": "First milestone description", "completed": false},
    {"label": "${breakdown.labels[1]}", "description": "Second milestone description", "completed": false}
    // ... continue for all ${breakdown.count} milestones
  ],
  "reality_check": "Your honest assessment including any warnings or encouragement"
}

Do not include any text outside the JSON object.`

    const userPrompt = `My North Star Goal: "${raw_goal}"
Timeframe: ${timeframe}

Please analyze this goal, convert it to SMART format, create ${breakdown.count} milestones for (${breakdown.labels.join(', ')}), and provide your reality check.`

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        top_p: 0.9,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Perplexity API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    let parsedResponse
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      parsedResponse = {
        smart_goal: raw_goal,
        milestones: breakdown.labels.map((label: string) => ({
          label,
          description: `Work towards your goal during ${label}`,
          completed: false
        })),
        reality_check: "Unable to analyze goal at this time. Please try again."
      }
    }

    if (!Array.isArray(parsedResponse.milestones)) {
      parsedResponse.milestones = breakdown.labels.map((label: string) => ({
        label,
        description: `Work towards your goal during ${label}`,
        completed: false
      }))
    }

    parsedResponse.milestones = parsedResponse.milestones.map((m: any) => ({
      ...m,
      completed: m.completed || false
    }))

    return new Response(
      JSON.stringify(parsedResponse),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Refine North Star error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to refine goal', message: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
