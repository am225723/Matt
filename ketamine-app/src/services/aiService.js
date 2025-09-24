/**
 * AI Service for Ketamine Question Bank Application
 * Handles AI follow-up question generation
 */

class AIService {
  /**
   * Generate a follow-up question based on the original question and user's response
   * @param {String} question - The original question
   * @param {String} response - The user's response
   * @returns {Promise} - Resolves with the follow-up question
   */
  static async generateFollowUp(question, response) {
    // In a real application, this would call an AI API like OpenAI
    // For now, we'll use predefined follow-ups based on the original question
    
    // Predefined follow-up questions for each original question
    const followups = {
      "What thoughts or worries come up for you in the mornings?": 
        "How do these morning thoughts affect the rest of your day?",
      
      "Are there specific situations or tasks you anticipate that might be contributing to your anxiety?": 
        "What would it feel like to approach these situations without the weight of anxiety?",
      
      "How does your body feel when you wake up?": 
        "Have you noticed any connection between your physical sensations upon waking and your emotional state?",
      
      "Have you noticed any patterns or triggers that worsen your morning anxiety?": 
        "What small change could you make to interrupt one of these patterns?",
      
      "What activities or practices have helped you manage anxiety in the past?": 
        "What prevents you from engaging in these helpful practices more consistently?",
      
      "If your anxiety had a voice, what would it be saying?": 
        "Where do you think those messages originally came from in your life?",
      
      "What's the very first thing you notice about your body when you wake up?": 
        "How might focusing on different physical sensations change your morning experience?",
      
      "If your anxiety had a color, what would it be?": 
        "If you could gradually transform this color into something more peaceful, what would that process look like?",
      
      "What does your anxiety feel like in your body?": 
        "When you feel this sensation, what do you typically do in response?",
      
      "If you could talk to your anxiety, what would you say?": 
        "What do you think your anxiety might say in response?",
      
      "What does your anxiety want you to know?": 
        "How might acknowledging this message change your relationship with your anxiety?",
      
      "Is there a younger version of yourself that needs comfort or reassurance?": 
        "What specific words or actions would be most comforting to this younger self?",
      
      "What would it feel like to let go of this anxiety, even for a moment?": 
        "What's one small step you could take toward experiencing that feeling more often?",
      
      "If you could offer your anxiety some compassion, what would that look like?": 
        "How might showing compassion to your anxiety change how it manifests in your life?",
      
      "Can you identify any positive intentions behind your anxiety?": 
        "How might you honor those intentions in a way that feels less distressing?",
      
      "Imagine your anxiety as a cloud passing through the sky. Can you observe it without judgment?": 
        "What happens to the intensity of your anxiety when you observe it this way?",
      
      "If you could create a safe space for yourself, where would it be?": 
        "What elements of this safe space could you incorporate into your daily environment?",
      
      "What are you most afraid would happen if you weren't anxious?": 
        "How might your life be different if this fear didn't hold such power?",
      
      "If you could give your anxiety a name, what would it be?": 
        "How might naming your anxiety change your relationship with it?",
      
      "What is your anxiety trying to protect you from?": 
        "Is this protection still necessary in your current life circumstances?",
      
      "When in your life did you first experience this feeling?": 
        "How has your relationship with this feeling evolved since then?",
      
      "When you notice the anxiety rising, what thoughts are present in your mind?": 
        "Which of these thoughts feels most powerful, and why do you think that is?",
      
      "What stories do you tell yourself about the anxiety and its causes?": 
        "How might reframing these stories impact your experience of anxiety?",
      
      "If you were to write down every thought you're having right now, what would they be?": 
        "Looking at these thoughts objectively, which ones are based on facts versus assumptions?"
    };
    
    // Return a promise to simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get the follow-up for the current question or use a default
        const followUp = followups[question] || 
          "How does exploring this question make you feel about your anxiety?";
        
        resolve(followUp);
      }, 1500);
    });
  }
  
  /**
   * Generate a more personalized follow-up based on the original question and user's response
   * This would use the actual response content in a real implementation
   * @param {String} question - The original question
   * @param {String} response - The user's response
   * @returns {Promise} - Resolves with the personalized follow-up question
   */
  static async generatePersonalizedFollowUp(question, response) {
    // In a real application, this would analyze the response and generate a personalized follow-up
    // For now, we'll simulate this with a delay and return a generic follow-up
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, we would send the question and response to an AI API
        // and get back a personalized follow-up question
        
        // For now, use a generic follow-up based on the question category
        let followUp = "How does reflecting on this make you feel?";
        
        // Simple categorization based on keywords
        if (question.includes("body") || question.includes("feel")) {
          followUp = "How might these physical sensations be connected to your emotional state?";
        } else if (question.includes("thoughts") || question.includes("worries")) {
          followUp = "Where do you think these thought patterns originated in your life?";
        } else if (question.includes("anxiety")) {
          followUp = "What would it feel like to approach this anxiety with curiosity rather than resistance?";
        } else if (question.includes("activities") || question.includes("practices")) {
          followUp = "What small step could you take today to incorporate more of these helpful practices?";
        }
        
        resolve(followUp);
      }, 2000);
    });
  }
}

export default AIService;