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
    this.finalTranscript = '';
    
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
      // Reset audio chunks and transcript
      this.audioChunks = [];
      this.finalTranscript = '';
      
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
   * @param {Function} onResult - Callback for interim and final results
   * @param {Function} onEnd - Callback for when recognition ends
   */
  setupTranscription(onResult, onEnd) {
    if (!this.recognition) {
      return false;
    }
    
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      onResult(this.finalTranscript, interimTranscript);
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      onEnd();
    };
    
    return true;
  }
  
  /**
   * Converts a Blob to a base64 encoded string.
   * @param {Blob} blob - The blob to convert.
   * @returns {Promise<string>} - A promise that resolves with the base64 encoded string.
   * @private
   */
  _blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Transcribe audio using OpenAI Whisper API via secure backend proxy.
   * @param {Blob} audioBlob - The audio blob to transcribe.
   * @returns {Promise<string>} - A promise that resolves with the transcription text.
   */
  async transcribeAudio(audioBlob) {
    // Use backend proxy to securely handle API key
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const apiEndpoint = `${backendUrl}/api/transcribe`;

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Transcription failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const transcription = data.text?.trim();
      return transcription || "";
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
}

export default AudioService;
