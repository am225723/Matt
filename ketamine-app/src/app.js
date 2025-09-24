/**
 * Main Application Logic for Ketamine Question Bank
 */

import questionBank from './questionBank.js';
import AudioService from './services/audioService.js';
import AIService from './services/aiService.js';
import PDFService from './services/pdfService.js';
import SessionManager from './utils/sessionManager.js';
import SessionHistory from './components/SessionHistory.js';
import PdfExporter from './components/PdfExporter.js';

// DOM Elements
const currentQuestionEl = document.getElementById('current-question');
const newQuestionBtn = document.getElementById('new-question-btn');
const recordBtn = document.getElementById('record-btn');
const recordingStatus = document.getElementById('recording-status');
const recordingTime = document.getElementById('recording-time');
const audioPlayback = document.getElementById('audio-playback');
const transcriptionText = document.getElementById('transcription-text');
const editTranscriptionBtn = document.getElementById('edit-transcription-btn');
const aiFollowupBtn = document.getElementById('ai-followup-btn');
const followupText = document.getElementById('followup-text');
const exportPdfBtn = document.getElementById('export-pdf-btn');
const saveSessionBtn = document.getElementById('save-session-btn');
const historyBtn = document.getElementById('history-btn');

// Application State
const state = {
  currentQuestion: null,
  recording: false,
  audioService: null,
  recordingStartTime: null,
  recordingTimer: null,
  transcription: '',
  followupQuestion: '',
  sessionData: {
    questions: [],
    responses: [],
    followups: []
  },
  sessionHistory: null
};

// Initialize the application
function init() {
  // Check for browser compatibility
  if (!checkBrowserCompatibility()) {
    return;
  }
  
  // Initialize audio service
  state.audioService = new AudioService();
  
  // Initialize session history
  state.sessionHistory = new SessionHistory('session-history');
  state.sessionHistory.init();
  
  // Set up event listeners
  setupEventListeners();
  
  // Show welcome message
  showWelcomeMessage();
}

// Check if browser supports required APIs
function checkBrowserCompatibility() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showErrorMessage('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Edge.');
    return false;
  }
  
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    showWarningMessage('Speech recognition is not fully supported in this browser. Transcription will be limited.');
  }
  
  return true;
}

// Set up event listeners for all interactive elements
function setupEventListeners() {
  // New Question Button
  newQuestionBtn.addEventListener('click', getRandomQuestion);
  
  // Record Button
  recordBtn.addEventListener('click', toggleRecording);
  
  // Edit Transcription Button
  editTranscriptionBtn.addEventListener('click', makeTranscriptionEditable);
  
  // AI Followup Button
  aiFollowupBtn.addEventListener('click', generateAIFollowup);
  
  // Export PDF Button
  exportPdfBtn.addEventListener('click', exportToPDF);
  
  // Save Session Button
  saveSessionBtn.addEventListener('click', saveSession);
  
  // History Button
  historyBtn.addEventListener('click', toggleSessionHistory);
  
  // Listen for session loaded event
  document.addEventListener('sessionloaded', handleSessionLoaded);
}

// Show welcome message
function showWelcomeMessage() {
  const welcomeMessage = `
    <div class="welcome-message">
      <h2>Welcome to Ketamine Therapy Question Bank</h2>
      <p>This application helps you explore and reflect on your thoughts and feelings during ketamine therapy sessions.</p>
      <p>Click "New Question" to begin your reflection journey.</p>
    </div>
  `;
  
  currentQuestionEl.innerHTML = welcomeMessage;
}

// Get a random question from the question bank
function getRandomQuestion() {
  // Get a random index
  const randomIndex = Math.floor(Math.random() * questionBank.length);
  
  // Set the current question
  state.currentQuestion = questionBank[randomIndex];
  
  // Update the UI
  currentQuestionEl.textContent = state.currentQuestion;
  
  // Enable the record button
  recordBtn.disabled = false;
  
  // Reset the UI for a new question
  resetUI();
}

// Reset the UI for a new question
function resetUI() {
  // Reset recording state
  state.recording = false;
  state.transcription = '';
  state.followupQuestion = '';
  
  // Reset UI elements
  recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
  recordBtn.classList.remove('recording');
  recordingStatus.textContent = 'Not Recording';
  recordingStatus.classList.remove('active');
  recordingTime.textContent = '00:00';
  audioPlayback.src = '';
  audioPlayback.style.display = 'none';
  transcriptionText.value = '';
  transcriptionText.readOnly = true;
  followupText.textContent = 'AI follow-up question will appear here after generation...';
  
  // Disable buttons that require a recording
  editTranscriptionBtn.disabled = true;
  aiFollowupBtn.disabled = true;
  exportPdfBtn.disabled = true;
  saveSessionBtn.disabled = true;
}

// Toggle recording on/off
async function toggleRecording() {
  if (!state.recording) {
    // Start recording
    await startRecording();
  } else {
    // Stop recording
    stopRecording();
  }
}

// Start audio recording
async function startRecording() {
  try {
    // Start recording using audio service
    await state.audioService.startRecording();
    
    // Update state
    state.recording = true;
    
    // Update UI
    recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
    recordBtn.classList.add('recording');
    recordingStatus.textContent = 'Recording...';
    recordingStatus.classList.add('active');
    
    // Add recording pulse animation
    const pulseElement = document.createElement('span');
    pulseElement.className = 'recording-pulse';
    recordingStatus.prepend(pulseElement);
    
    // Start recording timer
    startRecordingTimer();
    
    // Set up transcription if supported
    if (state.audioService.isTranscriptionSupported()) {
      state.audioService.setupTranscription(
        (interimText) => {
          transcriptionText.value = interimText;
        },
        (finalText) => {
          state.transcription = finalText;
          transcriptionText.value = finalText;
        }
      );
    }
    
  } catch (error) {
    console.error('Error starting recording:', error);
    showErrorMessage('Could not access microphone. Please ensure you have granted permission.');
  }
}

// Stop audio recording
async function stopRecording() {
  if (state.recording) {
    try {
      // Update UI
      recordingStatus.textContent = 'Processing...';
      const pulseElement = recordingStatus.querySelector('.recording-pulse');
      if (pulseElement) {
        recordingStatus.removeChild(pulseElement);
      }
      
      // Stop recording timer
      stopRecordingTimer();
      
      // Stop recording using audio service
      const audioBlob = await state.audioService.stopRecording();
      
      // Update state
      state.recording = false;
      
      // Update UI
      recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
      recordBtn.classList.remove('recording');
      
      // Process the recording
      processRecording(audioBlob);
      
    } catch (error) {
      console.error('Error stopping recording:', error);
      showErrorMessage('Error processing recording. Please try again.');
      
      // Reset UI
      state.recording = false;
      recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
      recordBtn.classList.remove('recording');
      recordingStatus.textContent = 'Not Recording';
      recordingStatus.classList.remove('active');
    }
  }
}

// Process the recorded audio
function processRecording(audioBlob) {
  // Get audio URL for playback
  const audioUrl = state.audioService.getAudioUrl();
  
  // Update audio player
  audioPlayback.src = audioUrl;
  audioPlayback.style.display = 'block';
  
  // Update UI
  recordingStatus.textContent = 'Recording Complete';
  
  // Enable buttons
  editTranscriptionBtn.disabled = false;
  aiFollowupBtn.disabled = false;
  exportPdfBtn.disabled = false;
  saveSessionBtn.disabled = false;
  
  // Transcribe the audio if not already done by speech recognition
  if (!state.transcription) {
    transcribeAudio(audioBlob);
  }
}

// Transcribe audio using the audio service
async function transcribeAudio(audioBlob) {
  transcriptionText.value = "Transcribing...";
  
  try {
    // Get transcription from audio service
    const transcription = await state.audioService.transcribeAudio(audioBlob);
    
    // Update state and UI
    state.transcription = transcription;
    transcriptionText.value = transcription;
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
    transcriptionText.value = "[Transcription failed. Please edit this text to enter your response manually.]";
    makeTranscriptionEditable();
  }
}

// Make transcription editable
function makeTranscriptionEditable() {
  transcriptionText.readOnly = false;
  transcriptionText.focus();
  editTranscriptionBtn.innerHTML = '<i class="fas fa-save"></i> Save Edits';
  
  // Change the button function to save edits
  editTranscriptionBtn.removeEventListener('click', makeTranscriptionEditable);
  editTranscriptionBtn.addEventListener('click', saveTranscriptionEdits);
}

// Save transcription edits
function saveTranscriptionEdits() {
  state.transcription = transcriptionText.value;
  transcriptionText.readOnly = true;
  editTranscriptionBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Transcription';
  
  // Change the button function back to make editable
  editTranscriptionBtn.removeEventListener('click', saveTranscriptionEdits);
  editTranscriptionBtn.addEventListener('click', makeTranscriptionEditable);
  
  // Show confirmation
  showToast('Transcription saved', 'success');
}

// Generate AI follow-up question
async function generateAIFollowup() {
  // Disable button during generation
  aiFollowupBtn.disabled = true;
  
  // Show loading indicator
  followupText.innerHTML = 'Generating follow-up question... <div class="ai-thinking"><span></span><span></span><span></span></div>';
  
  try {
    // Get follow-up from AI service
    const followUp = await AIService.generateFollowUp(state.currentQuestion, state.transcription);
    
    // Update state and UI
    state.followupQuestion = followUp;
    followupText.textContent = followUp;
    
    // Add to session data
    state.sessionData.followups.push(followUp);
    
  } catch (error) {
    console.error('Error generating follow-up:', error);
    followupText.textContent = 'Could not generate follow-up question. Please try again.';
  } finally {
    // Re-enable button
    aiFollowupBtn.disabled = false;
  }
}

// Export responses to PDF
function exportToPDF() {
  // Save the current question and response to session data
  saveCurrentData();
  
  // Export using PDF exporter
  PdfExporter.exportToPDF(state.sessionData);
}

// Save current question and response to session data
function saveCurrentData() {
  if (state.currentQuestion && state.transcription) {
    // Check if this question is already in the session data
    const index = state.sessionData.questions.indexOf(state.currentQuestion);
    
    if (index === -1) {
      // Add new question and response
      state.sessionData.questions.push(state.currentQuestion);
      state.sessionData.responses.push(state.transcription);
      
      // If there's no follow-up yet, add a placeholder
      if (state.sessionData.followups.length < state.sessionData.questions.length) {
        state.sessionData.followups.push('');
      }
    } else {
      // Update existing question and response
      state.sessionData.responses[index] = state.transcription;
      
      // Update follow-up if it exists
      if (state.followupQuestion && index < state.sessionData.followups.length) {
        state.sessionData.followups[index] = state.followupQuestion;
      }
    }
  }
}

// Save the current session
function saveSession() {
  // Save the current question and response
  saveCurrentData();
  
  // Generate a session name based on date and time
  const sessionName = `session_${new Date().toISOString()}`;
  
  // Save using session manager
  const success = SessionManager.saveSession(state.sessionData, sessionName);
  
  if (success) {
    showToast('Session saved successfully', 'success');
  } else {
    showErrorMessage('Could not save session. Please try again.');
  }
}

// Toggle session history visibility
function toggleSessionHistory() {
  state.sessionHistory.toggle();
}

// Handle session loaded event
function handleSessionLoaded(event) {
  const sessionData = event.detail;
  
  if (!sessionData) return;
  
  // Update state
  state.sessionData = sessionData;
  
  // Show confirmation
  showToast('Session loaded successfully', 'success');
  
  // If there are questions in the session, load the first one
  if (sessionData.questions && sessionData.questions.length > 0) {
    // Load the first question
    state.currentQuestion = sessionData.questions[0];
    currentQuestionEl.textContent = state.currentQuestion;
    
    // Load the response if available
    if (sessionData.responses && sessionData.responses.length > 0) {
      state.transcription = sessionData.responses[0];
      transcriptionText.value = state.transcription;
    }
    
    // Load the follow-up if available
    if (sessionData.followups && sessionData.followups.length > 0) {
      state.followupQuestion = sessionData.followups[0];
      followupText.textContent = state.followupQuestion || 'AI follow-up question will appear here after generation...';
    }
    
    // Enable buttons
    recordBtn.disabled = false;
    editTranscriptionBtn.disabled = false;
    aiFollowupBtn.disabled = false;
    exportPdfBtn.disabled = false;
    saveSessionBtn.disabled = false;
  }
}

// Start recording timer
function startRecordingTimer() {
  state.recordingStartTime = Date.now();
  state.recordingTimer = setInterval(updateRecordingTime, 1000);
}

// Stop recording timer
function stopRecordingTimer() {
  if (state.recordingTimer) {
    clearInterval(state.recordingTimer);
    state.recordingTimer = null;
  }
}

// Update recording time display
function updateRecordingTime() {
  if (!state.recordingStartTime) return;
  
  const elapsedSeconds = Math.floor((Date.now() - state.recordingStartTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  
  recordingTime.textContent = `${minutes}:${seconds}`;
}

// Show error message
function showErrorMessage(message) {
  showToast(message, 'error');
}

// Show warning message
function showWarningMessage(message) {
  showToast(message, 'warning');
}

// Show toast notification
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <p>${message}</p>
    </div>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Show the toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);