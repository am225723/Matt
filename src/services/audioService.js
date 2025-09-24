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
   * Set up speech recognition for real-time transcription.
   * @param {Function} onUpdate - A single callback that receives the latest full transcript.
   */
  setupTranscription(onUpdate) {
    if (!this.recognition) {
      return false;
    }
    
    this.recognition.onresult = (event) => {
      let final_transcript = '';
      let interim_transcript = '';

      for (let i = 0; i < event.results.length; ++i) {
        const transcript_piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final_transcript += transcript_piece;
        } else {
          interim_transcript += transcript_piece;
        }
      }

      onUpdate(final_transcript + interim_transcript);
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    return true;
  }
  
  /**
   * Transcribe audio using the OpenAI Whisper API.
   * @param {Blob} audioBlob - The audio blob to transcribe.
   * @returns {Promise<string>} - A promise that resolves with the transcription text.
   */
  async transcribeAudio(audioBlob) {
    // IMPORTANT: In a real-world application, you should NEVER expose your API key
    // on the client side. This API call should be made from a secure backend server
    // or a serverless function that holds the API key securely.
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const apiEndpoint = 'https://api.openai.com/v1/audio/transcriptions';

    if (!apiKey) {
      throw new Error("OpenAI API key is not set in the .env file.");
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.error.message}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio with Whisper API:', error);
      throw error;
    }
  }
}

export default AudioService;
