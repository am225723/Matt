import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Copy, Download,
  Heart, Briefcase, Users, Dumbbell, Brain, TrendingUp, Star,
  RotateCcw, ArrowRight, MessageSquare, Lightbulb, Zap, Save,
  Clock, Calendar, Trash2, X, Check
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateContent } from '@/utils/perplexity';

const ExcuseReframerAdvanced = ({ onBack }) => {
  const { toast } = useToast();
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form data
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [originalExcuse, setOriginalExcuse] = useState('');
  const [identifiedBeliefs, setIdentifiedBeliefs] = useState([]);
  const [aiReframes, setAiReframes] = useState([]);
  const [selectedReframe, setSelectedReframe] = useState(null);
  
  // Storage
  const [savedReframes, setSavedReframes] = useState([]);
  const [viewingSaved, setViewingSaved] = useState(false);

  // Load saved reframes
  useEffect(() => {
    const saved = localStorage.getItem('excuseReframes');
    if (saved) {
      setSavedReframes(JSON.parse(saved));
    }
  }, []);

  // Save reframes to localStorage
  useEffect(() => {
    if (savedReframes.length > 0) {
      localStorage.setItem('excuseReframes', JSON.stringify(savedReframes));
    }
  }, [savedReframes]);

  const categories = [
    {
      id: 'work',
      name: 'Work & Career',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      examples: [
        "I'm not qualified enough for this promotion",
        "I don't have time to learn new skills",
        "I'm too old to change careers"
      ]
    },
    {
      id: 'relationships',
      name: 'Relationships',
      icon: <Users className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-500',
      examples: [
        "I'm not good at making friends",
        "People always leave me",
        "I'm too introverted to network"
      ]
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      icon: <Dumbbell className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      examples: [
        "I don't have time to exercise",
        "I'm too tired to work out",
        "Healthy eating is too expensive"
      ]
    },
    {
      id: 'personal',
      name: 'Personal Growth',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-500',
      examples: [
        "I'm not creative enough",
        "I'm just not a morning person",
        "I can't change who I am"
      ]
    },
    {
      id: 'financial',
      name: 'Financial',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      examples: [
        "I'll never be able to save money",
        "I'm bad with finances",
        "I need to make more money first"
      ]
    }
  ];

  const steps = [
    { id: 0, name: 'Choose Category', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 1, name: 'State Your Excuse', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 2, name: 'Identify Beliefs', icon: <Brain className="w-5 h-5" /> },
    { id: 3, name: 'AI Reframes', icon: <Sparkles className="w-5 h-5" /> },
    { id: 4, name: 'Review & Save', icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  // Generate AI reframes
  const generateReframes = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `You are an expert cognitive behavioral therapist helping someone reframe limiting beliefs.

Original excuse/limiting belief: "${originalExcuse}"

Category: ${selectedCategory.name}

Identified underlying beliefs: ${identifiedBeliefs.join(', ')}

Please provide 4 powerful, empowering reframes of this excuse. Each reframe should:
1. Acknowledge the concern without dismissing it
2. Challenge the limiting belief with evidence or alternative perspectives
3. Offer a growth-oriented, actionable mindset shift
4. Be specific and personally relevant

Format your response as a JSON array with 4 objects, each containing:
- "title": A short, catchy title for the reframe (5-7 words)
- "reframe": The full reframed statement (2-3 sentences)
- "action": A specific, small first step they could take (1 sentence)
- "insight": A deeper psychological insight about why this reframe works (1 sentence)

Return ONLY the JSON array, no other text.`;

      const systemContext = "You are an expert cognitive behavioral therapist. Always return valid JSON.";
      const response = await generateContent(systemContext, prompt);
      
      if (response) {
        try {
          // Try to parse JSON from response
          let parsed;
          // First try to parse the entire response
          try {
            parsed = JSON.parse(response);
          } catch {
            // If that fails, try to extract JSON array
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              parsed = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('No JSON array found in response');
            }
          }
          
          if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => item.title && item.reframe && item.action && item.insight)) {
            setAiReframes(parsed);
            setCurrentStep(3);
            toast({
              title: 'Reframes Generated!',
              description: `Created ${parsed.length} empowering perspectives for you.`,
            });
          } else {
            console.warn('Invalid reframe format, using fallback. Response:', response);
            throw new Error('Invalid response format - missing required fields');
          }
        } catch (parseError) {
          // Fallback: create manual reframes
          console.error('Parse error:', parseError, 'Response:', response);
          toast({
            title: 'Using Template Reframes',
            description: 'AI response was invalid. Using proven reframe templates.',
            variant: 'default',
          });
          setAiReframes(generateFallbackReframes());
          setCurrentStep(3);
        }
      } else {
        console.warn('Empty AI response, using fallback');
        toast({
          title: 'Using Template Reframes',
          description: 'No AI response received. Using proven reframe templates.',
          variant: 'default',
        });
        setAiReframes(generateFallbackReframes());
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error generating reframes:', error);
      toast({
        title: 'Using Template Reframes',
        description: 'AI unavailable. Using proven reframe templates.',
        variant: 'default',
      });
      setAiReframes(generateFallbackReframes());
      setCurrentStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback reframes
  const generateFallbackReframes = () => {
    return [
      {
        title: "Turn Obstacles into Opportunities",
        reframe: `Instead of "${originalExcuse}", consider that every expert was once a beginner. What feels like a limitation today is actually the starting point for your growth journey.`,
        action: "Identify one small skill or habit you can start developing today, even if it's just 10 minutes of focused effort.",
        insight: "Growth mindset research shows that our beliefs about our abilities are more important than our current skill level."
      },
      {
        title: "Reframe Time as Investment",
        reframe: `Rather than seeing this as something you can't do, recognize that you're choosing how to invest your time and energy. The question isn't whether you can, but whether this aligns with your priorities.`,
        action: "List your top 3 priorities this week and honestly assess where this fits. If it matters, schedule it like any important appointment.",
        insight: "We often make time for what we truly value. Acknowledging this puts the power of choice back in your hands."
      },
      {
        title: "Challenge the All-or-Nothing Thinking",
        reframe: `This belief assumes perfection or nothing, but real progress happens in small, consistent steps. You don't need to be perfect or have everything figured out to start.`,
        action: "Take the smallest possible action toward this goal today - even if it feels insignificant, it breaks the pattern of inaction.",
        insight: "Progress, not perfection, is the key to sustainable change. Small wins build momentum and confidence."
      },
      {
        title: "Your Past Doesn't Define Your Future",
        reframe: `While past experiences shape us, they don't determine our capacity for change. Every moment is a chance to write a new story about who you are and what you're capable of.`,
        action: "Write down one example of a time you surprised yourself by doing something you thought you couldn't do. Let that be evidence of your capacity for growth.",
        insight: "Neuroplasticity research confirms that our brains can change at any age. Your history is not your destiny."
      }
    ];
  };

  // Save selected reframe
  const saveReframe = () => {
    if (!selectedReframe) return;
    
    const newSaved = {
      id: Date.now(),
      date: new Date().toISOString(),
      category: selectedCategory.name,
      originalExcuse: originalExcuse,
      beliefs: identifiedBeliefs,
      reframe: selectedReframe,
      favorite: false
    };
    
    setSavedReframes(prev => [newSaved, ...prev]);
    
    toast({
      title: 'Reframe Saved!',
      description: 'Your empowering new perspective has been saved.',
    });
    
    // Reset wizard
    resetWizard();
  };

  // Copy reframe to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Reframe copied to clipboard.',
    });
  };

  // Export reframe
  const exportReframe = (reframe) => {
    const text = `EXCUSE REFRAME

Date: ${new Date(reframe.date).toLocaleDateString()}
Category: ${reframe.category}

ORIGINAL LIMITING BELIEF:
${reframe.originalExcuse}

UNDERLYING BELIEFS:
${reframe.beliefs.join('\n')}

NEW EMPOWERING PERSPECTIVE:
${reframe.reframe.title}

${reframe.reframe.reframe}

ACTION STEP:
${reframe.reframe.action}

INSIGHT:
${reframe.reframe.insight}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reframe-${new Date(reframe.date).toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exported!',
      description: 'Reframe has been downloaded.',
    });
  };

  // Toggle favorite
  const toggleFavorite = (id) => {
    setSavedReframes(prev => prev.map(r => 
      r.id === id ? { ...r, favorite: !r.favorite } : r
    ));
  };

  // Delete saved reframe
  const deleteSaved = (id) => {
    setSavedReframes(prev => prev.filter(r => r.id !== id));
    toast({
      title: 'Deleted',
      description: 'Reframe has been removed.',
    });
  };

  // Reset wizard
  const resetWizard = () => {
    setCurrentStep(0);
    setSelectedCategory(null);
    setOriginalExcuse('');
    setIdentifiedBeliefs([]);
    setAiReframes([]);
    setSelectedReframe(null);
  };

  // Next step
  const nextStep = () => {
    if (currentStep === 2) {
      generateReframes();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedCategory !== null;
      case 1: return originalExcuse.trim().length > 10;
      case 2: return identifiedBeliefs.length > 0;
      case 3: return selectedReframe !== null;
      default: return false;
    }
  };

  if (viewingSaved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setViewingSaved(false)}
                variant="outline"
                size="sm"
                className="bg-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Reframer
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Saved Reframes
                </h1>
                <p className="text-gray-600 mt-1">{savedReframes.length} empowering perspectives</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedReframes.length === 0 ? (
              <Card className="col-span-2 bg-white shadow-xl">
                <CardContent className="py-16">
                  <div className="text-center">
                    <Star className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Reframes</h2>
                    <p className="text-gray-600">Your saved reframes will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              savedReframes.map((reframe) => (
                <motion.div
                  key={reframe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all h-full border-l-4 border-purple-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{reframe.category}</Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(reframe.date).toLocaleDateString()}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{reframe.reframe.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => toggleFavorite(reframe.id)}
                            size="sm"
                            variant="ghost"
                            className={reframe.favorite ? 'text-yellow-500' : ''}
                          >
                            <Star className={`w-4 h-4 ${reframe.favorite ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            onClick={() => deleteSaved(reframe.id)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs text-gray-500">Original Excuse</Label>
                        <p className="text-sm text-gray-700 italic">"{reframe.originalExcuse}"</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Empowering Reframe</Label>
                        <p className="text-sm text-gray-800">{reframe.reframe.reframe}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Next Action</Label>
                        <p className="text-sm text-purple-700 font-medium">{reframe.reframe.action}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => copyToClipboard(`${reframe.reframe.title}\n\n${reframe.reframe.reframe}\n\nAction: ${reframe.reframe.action}`)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => exportReframe(reframe)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Excuse Reframer
              </h1>
              <p className="text-gray-600 mt-1">Transform limiting beliefs into empowering perspectives</p>
            </div>
          </div>
          <Button
            onClick={() => setViewingSaved(true)}
            variant="outline"
            className="bg-white"
          >
            <Star className="w-4 h-4 mr-2" />
            Saved ({savedReframes.length})
          </Button>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="max-w-5xl mx-auto mb-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      index < currentStep ? 'bg-green-500 text-white' :
                      index === currentStep ? 'bg-purple-600 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      index === currentStep ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="mt-6" />
          </CardContent>
        </Card>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Choose Category */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle>Choose a Category</CardTitle>
                  <CardDescription>Select the area of life where you're experiencing this limiting belief</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedCategory?.id === category.id
                              ? 'ring-4 ring-purple-500 shadow-xl'
                              : 'hover:shadow-lg'
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white flex-shrink-0`}>
                                {React.cloneElement(category.icon, { className: 'w-6 h-6' })}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold mb-1">{category.name}</h3>
                                <p className="text-xs text-gray-500 italic truncate">"{category.examples[0]}"</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: State Your Excuse */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center text-white mb-4`}>
                    {selectedCategory.icon}
                  </div>
                  <CardTitle>State Your Limiting Belief</CardTitle>
                  <CardDescription>
                    Write out the excuse or limiting belief that's holding you back in {selectedCategory.name.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Your Excuse or Limiting Belief</Label>
                    <Textarea
                      value={originalExcuse}
                      onChange={(e) => setOriginalExcuse(e.target.value)}
                      placeholder="E.g., I don't have time to exercise..."
                      className="mt-2 min-h-32 text-lg"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Be honest and specific. The more detailed you are, the better the reframe.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Examples from {selectedCategory.name}:</h4>
                    <ul className="space-y-1">
                      {selectedCategory.examples.map((example, i) => (
                        <li key={i} className="text-sm text-purple-700 italic">• "{example}"</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Identify Beliefs */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle>Identify Underlying Beliefs</CardTitle>
                  <CardDescription>
                    What deeper beliefs might be driving this excuse? Check all that apply.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Your excuse:</p>
                    <p className="text-lg font-medium text-gray-900 italic">"{originalExcuse}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "I'm not good enough",
                      "I don't deserve success",
                      "Change is too hard",
                      "I'm too old/young",
                      "Other people are better than me",
                      "I've failed before, I'll fail again",
                      "I don't have the resources I need",
                      "Success requires luck, not effort",
                      "I'm protecting myself from disappointment",
                      "This isn't the 'right time'"
                    ].map((belief) => (
                      <div
                        key={belief}
                        onClick={() => {
                          if (identifiedBeliefs.includes(belief)) {
                            setIdentifiedBeliefs(prev => prev.filter(b => b !== belief));
                          } else {
                            setIdentifiedBeliefs(prev => [...prev, belief]);
                          }
                        }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          identifiedBeliefs.includes(belief)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            identifiedBeliefs.includes(belief)
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}>
                            {identifiedBeliefs.includes(belief) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{belief}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {identifiedBeliefs.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm font-semibold text-purple-900 mb-2">
                        Selected beliefs ({identifiedBeliefs.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {identifiedBeliefs.map((belief) => (
                          <Badge key={belief} variant="secondary">
                            {belief}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: AI Reframes */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    AI-Generated Reframes
                  </CardTitle>
                  <CardDescription>
                    Choose the reframe that resonates most with you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="py-16 text-center">
                      <Sparkles className="w-16 h-16 mx-auto text-purple-400 animate-pulse mb-4" />
                      <p className="text-lg text-gray-600">Generating empowering reframes...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Before/After Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                          <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                            <X className="w-5 h-5" />
                            Limiting Belief
                          </h4>
                          <p className="text-sm text-red-700 italic">"{originalExcuse}"</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            Empowering Mindset
                          </h4>
                          <p className="text-sm text-green-700">
                            {selectedReframe ? selectedReframe.title : 'Select a reframe below'}
                          </p>
                        </div>
                      </div>

                      {/* Reframe Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiReframes.map((reframe, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all ${
                                selectedReframe === reframe
                                  ? 'ring-4 ring-purple-500 shadow-xl'
                                  : 'hover:shadow-lg'
                              }`}
                              onClick={() => setSelectedReframe(reframe)}
                            >
                              <CardContent className="p-6 space-y-3">
                                <div className="flex items-start justify-between">
                                  <h4 className="text-lg font-bold text-purple-900 flex-1">
                                    {reframe.title}
                                  </h4>
                                  {selectedReframe === reframe && (
                                    <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 ml-2" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-700">{reframe.reframe}</p>
                                <div className="bg-purple-100 p-3 rounded-lg border border-purple-200">
                                  <p className="text-xs font-semibold text-purple-900 mb-1">Next Action:</p>
                                  <p className="text-sm text-gray-900">{reframe.action}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">Why This Works:</p>
                                  <p className="text-sm text-gray-900">{reframe.insight}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Review & Save */}
          {currentStep === 4 && selectedReframe && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    Your Transformation
                  </CardTitle>
                  <CardDescription>
                    Review your reframe and save it for future reference
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-red-700 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        Before: Limiting Belief
                      </h3>
                      <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                        <Badge className="mb-3">{selectedCategory.name}</Badge>
                        <p className="text-gray-800 italic">"{originalExcuse}"</p>
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Underlying beliefs:</p>
                          <div className="flex flex-wrap gap-2">
                            {identifiedBeliefs.slice(0, 3).map((belief) => (
                              <Badge key={belief} variant="destructive" className="text-xs">
                                {belief}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-green-700 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        After: Empowering Mindset
                      </h3>
                      <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                        <h4 className="text-xl font-bold text-green-900 mb-3">
                          {selectedReframe.title}
                        </h4>
                        <p className="text-gray-800 mb-4">{selectedReframe.reframe}</p>
                        <div className="bg-white p-4 rounded-lg border border-green-300">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            <Zap className="w-4 h-4 inline mr-1" />
                            Action Step:
                          </p>
                          <p className="text-sm text-green-700 font-medium">{selectedReframe.action}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insight */}
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg border-2 border-purple-300">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-purple-900 mb-2">Why This Reframe Works:</h4>
                        <p className="text-purple-800">{selectedReframe.insight}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={saveReframe}
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save Reframe
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(`${selectedReframe.title}\n\n${selectedReframe.reframe}\n\nAction: ${selectedReframe.action}`)}
                      size="lg"
                      variant="outline"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={resetWizard}
                      size="lg"
                      variant="outline"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      New Reframe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 0 || isGenerating}
            className="bg-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 && (
            <Button
              onClick={nextStep}
              disabled={!canProceed() || isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {currentStep === 2 ? (
                <>
                  Generate Reframes
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
          
          {currentStep === 3 && !isGenerating && (
            <Button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedReframe}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Review & Save
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcuseReframerAdvanced;
