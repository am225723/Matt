import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Resource database
const resourceDatabase = {
  // Resources for specific body parts
  bodyParts: {
    'Head': [
      {
        title: 'Progressive Muscle Relaxation for Headache Relief',
        type: 'exercise',
        duration: '5 min',
        description: 'This guided exercise helps relieve tension in your head and neck muscles.',
        content: `
          1. Find a comfortable seated position
          2. Take a deep breath in through your nose
          3. As you exhale, gently tilt your head forward
          4. Feel the stretch in the back of your neck
          5. Hold for 5 seconds, then release
          6. Next, tense your forehead muscles tightly for 5 seconds
          7. Release and notice the difference
          8. Repeat with your jaw, squeezing tight then releasing
          9. Notice the sensation of relaxation spreading through your face and head
        `
      },
      {
        title: 'Mindful Awareness for Head Tension',
        type: 'meditation',
        duration: '3 min',
        description: 'A brief mindfulness practice to reduce head tension and mental stress.',
        content: `
          1. Close your eyes and bring awareness to your breath
          2. Notice any sensations in your head without judgment
          3. Imagine each breath sending warmth to areas of tension
          4. Visualize the tension dissolving with each exhale
          5. Continue for 3 minutes, returning to the breath whenever your mind wanders
        `
      }
    ],
    'Chest': [
      {
        title: 'Box Breathing for Chest Tightness',
        type: 'breathing',
        duration: '2 min',
        description: 'A simple breathing technique to relieve chest tightness and anxiety.',
        content: `
          1. Sit comfortably with your back straight
          2. Exhale completely through your mouth
          3. Inhale through your nose for 4 counts
          4. Hold your breath for 4 counts
          5. Exhale through your mouth for 4 counts
          6. Hold your breath for 4 counts
          7. Repeat this cycle for 2 minutes
        `
      },
      {
        title: 'Heart-Centered Meditation',
        type: 'meditation',
        duration: '5 min',
        description: 'A meditation focused on releasing chest tension and opening the heart.',
        content: `
          1. Place your hand over your heart
          2. Feel the warmth of your hand and your heartbeat
          3. Breathe deeply into your chest area
          4. With each inhale, imagine light filling your chest
          5. With each exhale, feel tension releasing
          6. Continue for 5 minutes, maintaining awareness of your heart area
        `
      }
    ],
    'Stomach': [
      {
        title: 'Belly Breathing for Digestive Calm',
        type: 'breathing',
        duration: '3 min',
        description: 'A breathing technique to calm stomach discomfort and anxiety.',
        content: `
          1. Lie down or sit comfortably
          2. Place one hand on your chest and the other on your stomach
          3. Breathe in slowly through your nose, feeling your stomach rise
          4. Your chest should remain relatively still
          5. Exhale slowly through pursed lips
          6. Feel your stomach gently fall
          7. Repeat for 3 minutes, focusing on the rising and falling sensation
        `
      },
      {
        title: 'Stomach Tension Release',
        type: 'exercise',
        duration: '4 min',
        description: 'Physical exercises to release tension in the abdominal area.',
        content: `
          1. Lie on your back with knees bent
          2. Place hands on your stomach
          3. Inhale deeply, allowing your stomach to expand
          4. As you exhale, gently contract your abdominal muscles
          5. Hold for 5 seconds, then release
          6. Next, bring knees to chest and hold for 10 seconds
          7. Release and repeat the entire sequence 3 times
        `
      }
    ],
    'Hands': [
      {
        title: 'Hand and Finger Stretches',
        type: 'exercise',
        duration: '2 min',
        description: 'Simple stretches to release tension in hands and fingers.',
        content: `
          1. Extend your arms in front of you
          2. Spread your fingers wide for 5 seconds
          3. Make a tight fist for 5 seconds
          4. Release and shake out your hands
          5. Gently pull each finger to stretch
          6. Massage the palm of each hand with the thumb of the opposite hand
          7. Repeat the sequence twice
        `
      },
      {
        title: 'Grounding Through Touch',
        type: 'exercise',
        duration: '3 min',
        description: 'A sensory awareness exercise using your hands to ground yourself.',
        content: `
          1. Find an object with an interesting texture
          2. Hold it in your hands and close your eyes
          3. Explore the object with your fingertips
          4. Notice temperature, texture, weight, and shape
          5. Focus entirely on the sensations in your hands
          6. If your mind wanders, gently return to the sensations
          7. Continue for 3 minutes
        `
      }
    ]
  },
  
  // Resources for specific sensations
  sensations: {
    'Racing Heart': [
      {
        title: 'Heart Rate Lowering Breath',
        type: 'breathing',
        duration: '2 min',
        description: 'A breathing technique specifically designed to slow heart rate.',
        content: `
          1. Sit comfortably or lie down
          2. Place your hand over your heart
          3. Inhale for 4 counts
          4. Hold for 2 counts
          5. Exhale slowly for 6 counts
          6. Pause for 2 counts
          7. Repeat for 2 minutes
          8. Focus on extending your exhale longer than your inhale
        `
      },
      {
        title: 'Progressive Relaxation for Heart Calm',
        type: 'exercise',
        duration: '5 min',
        description: 'A body scan to reduce heart rate and overall tension.',
        content: `
          1. Lie down in a comfortable position
          2. Starting with your toes, tense the muscles for 5 seconds
          3. Release and notice the relaxation
          4. Move up to your calves, thighs, and so on
          5. When you reach your chest, place both hands there
          6. Take 5 deep breaths, focusing on your heartbeat
          7. Continue the body scan up to your head
          8. Notice how your heart rate has slowed
        `
      }
    ],
    'Shortness of Breath': [
      {
        title: 'Pursed Lip Breathing',
        type: 'breathing',
        duration: '2 min',
        description: 'A technique to slow breathing and increase oxygen.',
        content: `
          1. Sit upright in a comfortable position
          2. Relax your neck and shoulders
          3. Inhale slowly through your nose for 2 counts
          4. Purse your lips as if you're going to whistle
          5. Exhale slowly and gently through pursed lips for 4 counts
          6. Focus on the sensation of air leaving your lungs
          7. Repeat for 2 minutes
        `
      },
      {
        title: 'Diaphragmatic Breathing',
        type: 'breathing',
        duration: '3 min',
        description: 'Deep breathing exercise to maximize lung capacity and oxygen intake.',
        content: `
          1. Lie on your back with knees bent
          2. Place one hand on your upper chest and the other below your ribcage
          3. Breathe in slowly through your nose, feeling your stomach push against your hand
          4. Your chest should remain as still as possible
          5. Tighten your stomach muscles and let them fall inward as you exhale
          6. The hand on your chest should remain relatively still
          7. Repeat for 3 minutes
        `
      }
    ],
    'Tightness': [
      {
        title: 'Body Scan for Tension Release',
        type: 'meditation',
        duration: '5 min',
        description: 'A guided body scan to identify and release areas of tightness.',
        content: `
          1. Lie down in a comfortable position
          2. Close your eyes and bring awareness to your breath
          3. Starting with your feet, notice any sensations present
          4. If you detect tightness, breathe into that area
          5. Imagine the tension dissolving with each exhale
          6. Slowly move up through your entire body
          7. Spend extra time on areas that feel particularly tight
          8. End by noticing how your body feels as a whole
        `
      },
      {
        title: 'Gentle Stretching Sequence',
        type: 'exercise',
        duration: '4 min',
        description: 'A series of gentle stretches to release physical tension.',
        content: `
          1. Start in a seated position
          2. Gently roll your shoulders backward 5 times
          3. Roll your shoulders forward 5 times
          4. Tilt your head right, holding for 5 seconds
          5. Tilt your head left, holding for 5 seconds
          6. Raise your arms overhead and stretch upward
          7. Gently twist your torso to each side
          8. Finish with 5 deep breaths
        `
      }
    ]
  },
  
  // General resources
  general: [
    {
      title: '5-4-3-2-1 Grounding Technique',
      type: 'exercise',
      duration: '3 min',
      description: 'A sensory awareness exercise to ground yourself during anxiety.',
      content: `
        1. Look around and name 5 things you can see
        2. Notice 4 things you can touch or feel
        3. Acknowledge 3 things you can hear
        4. Identify 2 things you can smell (or like the smell of)
        5. Name 1 thing you can taste (or like the taste of)
        6. Take a deep breath and notice how you feel
      `
    },
    {
      title: 'Quick Anxiety Relief Breathing',
      type: 'breathing',
      duration: '1 min',
      description: 'A rapid breathing technique for immediate anxiety relief.',
      content: `
        1. Inhale deeply through your nose for 4 counts
        2. Hold your breath for 7 counts
        3. Exhale completely through your mouth for 8 counts
        4. Repeat this cycle 3-4 times
        5. Return to normal breathing and notice the difference
      `
    },
    {
      title: 'Mindful Awareness Practice',
      type: 'meditation',
      duration: '5 min',
      description: 'A brief mindfulness meditation to center yourself.',
      content: `
        1. Find a comfortable seated position
        2. Close your eyes or maintain a soft gaze
        3. Bring attention to your breath without changing it
        4. Notice the sensation of breathing at your nostrils or chest
        5. When your mind wanders, gently return to your breath
        6. Continue for 5 minutes
        7. Before finishing, notice how your mind and body feel
      `
    }
  ]
};

const AnxietyResources = ({ recentEntries = [] }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [recommendedResources, setRecommendedResources] = useState([]);

  // Generate recommendations based on recent entries
  useEffect(() => {
    if (!recentEntries || recentEntries.length === 0) {
      // If no entries, show general resources
      setRecommendedResources(resourceDatabase.general);
      return;
    }

    // Get the most recent entry
    const latestEntry = recentEntries[0];
    const resources = [];

    // Add body part specific resources
    if (latestEntry.bodyParts && latestEntry.bodyParts.length > 0) {
      latestEntry.bodyParts.forEach(part => {
        if (resourceDatabase.bodyParts[part]) {
          resources.push(...resourceDatabase.bodyParts[part]);
        }
      });
    }

    // Add sensation specific resources
    if (latestEntry.sensations && latestEntry.sensations.length > 0) {
      latestEntry.sensations.forEach(sensation => {
        if (resourceDatabase.sensations[sensation]) {
          resources.push(...resourceDatabase.sensations[sensation]);
        }
      });
    }

    // Add some general resources
    resources.push(...resourceDatabase.general);

    // Remove duplicates and limit to 5 resources
    const uniqueResources = Array.from(new Set(resources.map(r => r.title)))
      .map(title => resources.find(r => r.title === title))
      .slice(0, 5);

    setRecommendedResources(uniqueResources);
  }, [recentEntries]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Actionable Tools & Resources</h3>

      {selectedResource ? (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-medium">{selectedResource.title}</h4>
              <div className="flex items-center mt-1 space-x-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {selectedResource.type}
                </span>
                <span className="text-sm text-gray-500">{selectedResource.duration}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedResource(null)}
            >
              Back to resources
            </Button>
          </div>
          
          <p className="text-gray-700 mb-4">{selectedResource.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h5 className="font-medium mb-2">Instructions:</h5>
            <div className="whitespace-pre-line text-gray-700">
              {selectedResource.content}
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">
            Based on your recent anxiety entries, here are some tools that might help:
          </p>
          
          {recommendedResources.map((resource, index) => (
            <Card 
              key={index} 
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {resource.type}
                  </span>
                  <span className="text-sm text-gray-500">{resource.duration}</span>
                </div>
              </div>
            </Card>
          ))}
          
          {recommendedResources.length === 0 && (
            <p className="text-gray-500 italic">
              No resources available. Try adding some anxiety entries first.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnxietyResources;