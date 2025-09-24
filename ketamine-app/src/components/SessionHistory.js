/**
 * Session History Component for Ketamine Question Bank Application
 * Displays a list of past sessions and allows loading them
 */

import SessionManager from '../utils/sessionManager.js';

class SessionHistory {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sessions = [];
    this.isVisible = false;
  }
  
  /**
   * Initialize the session history component
   */
  init() {
    // Create the session history UI
    this.createUI();
    
    // Load sessions
    this.loadSessions();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Create the session history UI
   */
  createUI() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'session-history';
      document.querySelector('main').appendChild(this.container);
    }
    
    // Set up the container
    this.container.className = 'session-history';
    this.container.style.display = 'none';
    
    // Create the HTML structure
    this.container.innerHTML = `
      <div class="history-header">
        <h3>Session History</h3>
        <button id="close-history-btn" class="btn secondary-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="history-content">
        <div id="session-list" class="session-list">
          <p class="empty-message">No saved sessions found.</p>
        </div>
      </div>
      <div class="history-footer">
        <button id="export-all-btn" class="btn secondary-btn">
          <i class="fas fa-download"></i> Export All Sessions
        </button>
        <button id="import-sessions-btn" class="btn secondary-btn">
          <i class="fas fa-upload"></i> Import Sessions
        </button>
      </div>
    `;
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById('close-history-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }
    
    // Export all button
    const exportAllBtn = document.getElementById('export-all-btn');
    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => this.exportAllSessions());
    }
    
    // Import sessions button
    const importBtn = document.getElementById('import-sessions-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => this.showImportDialog());
    }
  }
  
  /**
   * Load sessions from storage
   */
  loadSessions() {
    // Get all sessions
    this.sessions = SessionManager.getAllSessions();
    
    // Update the UI
    this.updateSessionList();
  }
  
  /**
   * Update the session list in the UI
   */
  updateSessionList() {
    const sessionList = document.getElementById('session-list');
    if (!sessionList) return;
    
    // Clear the list
    sessionList.innerHTML = '';
    
    // Show empty message if no sessions
    if (this.sessions.length === 0) {
      sessionList.innerHTML = '<p class="empty-message">No saved sessions found.</p>';
      return;
    }
    
    // Sort sessions by timestamp (newest first)
    const sortedSessions = [...this.sessions].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Create a list item for each session
    sortedSessions.forEach(session => {
      const sessionDate = new Date(session.timestamp).toLocaleDateString();
      const sessionTime = new Date(session.timestamp).toLocaleTimeString();
      
      const sessionItem = document.createElement('div');
      sessionItem.className = 'session-item';
      sessionItem.innerHTML = `
        <div class="session-info">
          <h4>${session.id.replace('session_', '')}</h4>
          <p>${sessionDate} at ${sessionTime}</p>
          <p>${session.questionCount} question${session.questionCount !== 1 ? 's' : ''}</p>
        </div>
        <div class="session-actions">
          <button class="btn small-btn load-session-btn" data-id="${session.id}">
            <i class="fas fa-folder-open"></i> Load
          </button>
          <button class="btn small-btn delete-session-btn" data-id="${session.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      // Add event listeners
      const loadBtn = sessionItem.querySelector('.load-session-btn');
      loadBtn.addEventListener('click', () => this.loadSession(session.id));
      
      const deleteBtn = sessionItem.querySelector('.delete-session-btn');
      deleteBtn.addEventListener('click', () => this.deleteSession(session.id));
      
      sessionList.appendChild(sessionItem);
    });
  }
  
  /**
   * Show the session history
   */
  show() {
    // Reload sessions
    this.loadSessions();
    
    // Show the container
    this.container.style.display = 'block';
    this.isVisible = true;
    
    // Add animation class
    setTimeout(() => {
      this.container.classList.add('visible');
    }, 10);
  }
  
  /**
   * Hide the session history
   */
  hide() {
    // Remove animation class
    this.container.classList.remove('visible');
    
    // Hide the container after animation
    setTimeout(() => {
      this.container.style.display = 'none';
      this.isVisible = false;
    }, 300);
  }
  
  /**
   * Toggle the session history visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  /**
   * Load a session
   * @param {String} sessionId - The ID of the session to load
   */
  loadSession(sessionId) {
    // Get the session data
    const sessionData = SessionManager.loadSession(sessionId);
    
    if (!sessionData) {
      alert('Could not load session. It may have been deleted or corrupted.');
      return;
    }
    
    // Dispatch a custom event with the session data
    const event = new CustomEvent('sessionloaded', { detail: sessionData });
    document.dispatchEvent(event);
    
    // Hide the session history
    this.hide();
  }
  
  /**
   * Delete a session
   * @param {String} sessionId - The ID of the session to delete
   */
  deleteSession(sessionId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this session? This cannot be undone.')) {
      return;
    }
    
    // Delete the session
    const success = SessionManager.deleteSession(sessionId);
    
    if (success) {
      // Reload sessions
      this.loadSessions();
    } else {
      alert('Could not delete session. Please try again.');
    }
  }
  
  /**
   * Export all sessions
   */
  exportAllSessions() {
    // Get all sessions as a JSON blob
    const sessionsBlob = SessionManager.exportAllSessions();
    
    if (!sessionsBlob) {
      alert('Could not export sessions. Please try again.');
      return;
    }
    
    // Create a download link
    const url = URL.createObjectURL(sessionsBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ketamine-sessions-${new Date().toISOString().split('T')[0]}.json`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Show the import dialog
   */
  showImportDialog() {
    // Create a file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    
    // Set up the change event
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Read the file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Parse the JSON
          const sessionsData = JSON.parse(e.target.result);
          
          // Import the sessions
          const importCount = SessionManager.importSessions(sessionsData);
          
          if (importCount > 0) {
            alert(`Successfully imported ${importCount} session(s).`);
            
            // Reload sessions
            this.loadSessions();
          } else {
            alert('No sessions were imported. The file may be invalid or empty.');
          }
        } catch (error) {
          console.error('Error importing sessions:', error);
          alert('Could not import sessions. The file may be invalid or corrupted.');
        }
      };
      
      reader.readAsText(file);
    });
    
    // Trigger the file input
    fileInput.click();
  }
}

export default SessionHistory;