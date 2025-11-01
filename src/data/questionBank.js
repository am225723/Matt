export const questionBank = {
  anxiety: {
    title: "Anxiety Exploration",
    description: "Explore and understand your anxiety patterns",
    icon: "⚡",
    questions: [
      "What thoughts or worries come up for you in the mornings?",
      "Are there specific situations or tasks you anticipate that might be contributing to your anxiety?",
      "How does your body feel when you wake up?",
      "Have you noticed any patterns or triggers that worsen your morning anxiety?",
      "What activities or practices have helped you manage anxiety in the past?",
      "If your anxiety had a voice, what would it be saying?",
      "What's the very first thing you notice about your body when you wake up?",
      "If your anxiety had a color, what would it be?",
      "What does your anxiety feel like in your body?",
      "If you could talk to your anxiety, what would you say?",
      "What does your anxiety want you to know?",
      "Is there a younger version of yourself that needs comfort or reassurance?",
      "What would it feel like to let go of this anxiety, even for a moment?",
      "If you could offer your anxiety some compassion, what would that look like?",
      "Can you identify any positive intentions behind your anxiety?",
      "Imagine your anxiety as a cloud passing through the sky. Can you observe it without judgment?",
      "If you could create a safe space for yourself, where would it be?",
      "What are you most afraid would happen if you weren't anxious?",
      "If you could give your anxiety a name, what would it be?",
      "What is your anxiety trying to protect you from?",
      "When in your life did you first experience this feeling?",
      "When you notice the anxiety rising, what thoughts are present in your mind?",
      "What stories do you tell yourself about the anxiety and its causes?",
      "If you were to write down every thought you're having right now, what would they be?"
    ]
  },
  depression: {
    title: "Depression & Mood",
    description: "Explore feelings of sadness and low mood",
    icon: "🌧️",
    questions: [
      "What does this heaviness in your chest feel like?",
      "When did you first notice feeling this way?",
      "What activities used to bring you joy that don't anymore?",
      "If your depression could speak, what would it say?",
      "What do you need most right now in this moment?",
      "Is there a part of you that still has hope? What does it look like?",
      "What would it feel like to be gentle with yourself right now?",
      "When was the last time you felt truly okay?",
      "What beliefs do you hold about yourself when you're feeling low?",
      "If you could tell someone how you really feel, what would you say?",
      "What does your inner critic say to you?",
      "Is there something you're grieving that hasn't been acknowledged?",
      "What would a future version of yourself who has healed say to you now?",
      "What small thing could bring you a moment of peace today?",
      "How does your body hold this sadness?",
      "What are you afraid might happen if you let yourself fully feel this?",
      "What does rest look like for you?",
      "If this feeling had a shape, what would it be?"
    ]
  },
  trauma: {
    title: "Repressed Trauma",
    description: "Gently explore unprocessed experiences",
    icon: "🌊",
    questions: [
      "What memory feels like it's been locked away?",
      "When do you notice yourself becoming numb or disconnected?",
      "What feelings are you most afraid to feel?",
      "Is there an experience from your past that still feels unfinished?",
      "What does your body remember that your mind has forgotten?",
      "If you could talk to your younger self during a difficult time, what would you say?",
      "What situations make you feel suddenly unsafe, even when you logically know you're safe?",
      "What sensations in your body feel familiar but unexplained?",
      "Is there something you've never told anyone?",
      "What do you think would happen if you allowed yourself to remember?",
      "How do you protect yourself from pain?",
      "What would healing look like for you?",
      "Is there a part of your story you've been avoiding?",
      "What does your body need to feel safe right now?",
      "If you could release one thing you've been carrying, what would it be?",
      "What emotions arise when you think about the past?",
      "How has this experience shaped who you are today?"
    ]
  },
  fears: {
    title: "Unacknowledged Fears",
    description: "Bring hidden fears into the light",
    icon: "🕯️",
    questions: [
      "What fear do you avoid thinking about?",
      "What are you most afraid will happen if people really knew you?",
      "What keeps you awake at night?",
      "If your deepest fear came true, what would that mean about you?",
      "What are you afraid of losing?",
      "What would you do if you weren't afraid?",
      "What does your fear protect you from having to face?",
      "If fear wasn't a factor, what would you choose?",
      "What's the worst thing you imagine could happen?",
      "What fear did you inherit from your family?",
      "What are you afraid people will think of you?",
      "What vulnerability scares you the most?",
      "If you could face one fear today, what would it be?",
      "What would it feel like to be truly seen?",
      "What are you afraid of wanting?",
      "What does courage mean to you?",
      "What fear keeps you from being yourself?"
    ]
  },
  selfImage: {
    title: "Self-Image",
    description: "Explore how you see yourself",
    icon: "🪞",
    questions: [
      "How do you see yourself when you look in the mirror?",
      "What do you believe about yourself that might not be true?",
      "Who did you think you would become?",
      "What parts of yourself do you hide from others?",
      "If you could describe yourself with complete honesty, what would you say?",
      "What do you criticize yourself for most often?",
      "When do you feel most like yourself?",
      "What would you change about yourself if you could?",
      "Who told you that you weren't enough?",
      "What do you value most about who you are?",
      "How does your self-image differ from how others see you?",
      "What masks do you wear?",
      "If you treated yourself like you treat your best friend, how would that look?",
      "What parts of yourself have you rejected?",
      "Who are you without all the labels and roles?",
      "What would self-acceptance feel like?",
      "What story about yourself are you ready to let go of?"
    ]
  },
  coreSelf: {
    title: "Core Self",
    description: "Connect with your authentic self",
    icon: "✨",
    questions: [
      "What makes you feel most alive?",
      "What do you know to be true about yourself?",
      "When do you feel most connected to who you really are?",
      "What values guide your life?",
      "What brings you a sense of meaning or purpose?",
      "If you stripped away everything external, who would you be?",
      "What does your intuition tell you?",
      "What parts of yourself do you want to reclaim?",
      "What does authenticity mean to you?",
      "What would you do if you trusted yourself completely?",
      "What does your soul need right now?",
      "What gifts do you have to offer the world?",
      "What does home feel like to you?",
      "If you could live aligned with your deepest truth, what would change?",
      "What does your heart know that your mind hasn't accepted?",
      "What makes you feel whole?",
      "Who are you becoming?"
    ]
  }
};

export const getTopicById = (topicId) => {
  return questionBank[topicId];
};

export const getAllTopics = () => {
  return Object.keys(questionBank).map(key => ({
    id: key,
    ...questionBank[key]
  }));
};
