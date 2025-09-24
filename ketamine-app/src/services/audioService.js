/**
 * Audio Service for Ketamine Question Bank Application
 * Handles audio recording, playback, and transcription
 */

class AudioService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    this.stream = null;
    this.recognition = null;
    
    // Initialize speech recognition if available
    this.initSpeechRecognition();
  }
  
  /**
   * Initialize speech recognition
   */
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }
  
  /**
   * Check if the browser supports audio recording
   * @returns {Boolean} - Whether recording is supported
   */
  isRecordingSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  
  /**
   * Check if the browser supports speech recognition
   * @returns {Boolean} - Whether speech recognition is supported
   */
  isTranscriptionSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  
  /**
   * Request microphone access and start recording
   * @returns {Promise} - Resolves when recording starts, rejects on error
   */
  async startRecording() {
    if (!this.isRecordingSupported()) {
      throw new Error('Recording is not supported in this browser');
    }
    
    try {
      // Reset audio chunks
      this.audioChunks = [];
      
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording
      this.mediaRecorder.start();
      
      // Start speech recognition if available
      if (this.recognition) {
        this.recognition.start();
      }
      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }
  
  /**
   * Stop recording
   * @returns {Promise} - Resolves with the audio blob when recording stops
   */
  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }
      
      // Set up onstop handler
      this.mediaRecorder.onstop = () => {
        // Create audio blob
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Create URL for audio playback
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        
        // Stop all tracks
        this.stream.getTracks().forEach(track => track.stop());
        
        // Stop speech recognition if active
        if (this.recognition && this.recognition.state === 'active') {
          this.recognition.stop();
        }
        
        resolve(this.audioBlob);
      };
      
      // Stop recording
      this.mediaRecorder.stop();
    });
  }
  
  /**
   * Get the audio URL for playback
   * @returns {String} - URL for audio playback
   */
  getAudioUrl() {
    return this.audioUrl;
  }
  
  /**
   * Get the audio blob
   * @returns {Blob} - Audio blob
   */
  getAudioBlob() {
    return this.audioBlob;
  }
  
  /**
   * Set up speech recognition for transcription
   * @param {Function} onInterimResult - Callback for interim results
   * @param {Function} onFinalResult - Callback for final results
   */
  setupTranscription(onInterimResult, onFinalResult) {
    if (!this.recognition) {
      return false;
    }
    
    let finalTranscript = '';
    
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          if (onFinalResult) {
            onFinalResult(finalTranscript);
          }
        } else {
          interimTranscript += event.results[i][0].transcript;
          if (onInterimResult) {
            onInterimResult(interimTranscript);
          }
        }
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    return true;
  }
  
  /**
   * Transcribe audio using a server API
   * @param {Blob} audioBlob - The audio blob to transcribe
   * @returns {Promise} - Resolves with transcription text
   */
  async transcribeAudio(audioBlob = null) {
    // In a real application, this would send the audio to a server API
    // For now, we'll return a placeholder message
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a placeholder for actual transcription. In a real application, the audio would be sent to a server for processing using a service like Google Speech-to-Text, Amazon Transcribe, or a similar API.");
      }, 1500);
    });
  }
}

export default AudioService;