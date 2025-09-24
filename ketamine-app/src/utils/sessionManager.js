/**
 * Session Manager for Ketamine Question Bank Application
 * Handles saving, loading, and managing user sessions
 */

class SessionManager {
  /**
   * Save a session to localStorage
   * @param {Object} sessionData - The session data to save
   * @param {String} sessionName - Optional name for the session
   * @returns {Boolean} - Whether the save was successful
   */
  static saveSession(sessionData, sessionName = null) {
    try {
      // Generate a session ID if not provided
      const sessionId = sessionName || `session_${new Date().toISOString()}`;
      
      // Add metadata
      const sessionWithMetadata = {
        ...sessionData,
        metadata: {
          id: sessionId,
          timestamp: new Date().toISOString(),
          questionCount: sessionData.questions.length
        }
      };
      
      // Save to localStorage
      localStorage.setItem(`ketamine_${sessionId}`, JSON.stringify(sessionWithMetadata));
      
      // Update session index
      this.updateSessionIndex(sessionId);
      
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  }
  
  /**
   * Update the session index with the new session
   * @param {String} sessionId - The ID of the session to add
   */
  static updateSessionIndex(sessionId) {
    try {
      // Get existing index or create new one
      let sessionIndex = JSON.parse(localStorage.getItem('ketamine_session_index')) || [];
      
      // Add new session if not already in index
      if (!sessionIndex.includes(sessionId)) {
        sessionIndex.push(sessionId);
        localStorage.setItem('ketamine_session_index', JSON.stringify(sessionIndex));
      }
    } catch (error) {
      console.error('Error updating session index:', error);
    }
  }
  
  /**
   * Load a session from localStorage
   * @param {String} sessionId - The ID of the session to load
   * @returns {Object|null} - The session data or null if not found
   */
  static loadSession(sessionId) {
    try {
      const sessionData = localStorage.getItem(`ketamine_${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }
  
  /**
   * Get a list of all saved sessions
   * @returns {Array} - Array of session metadata objects
   */
  static getAllSessions() {
    try {
      // Get session index
      const sessionIndex = JSON.parse(localStorage.getItem('ketamine_session_index')) || [];
      
      // Load metadata for each session
      return sessionIndex.map(sessionId => {
        const sessionData = this.loadSession(sessionId);
        return sessionData ? sessionData.metadata : null;
      }).filter(Boolean); // Remove any null values
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }
  
  /**
   * Delete a session
   * @param {String} sessionId - The ID of the session to delete
   * @returns {Boolean} - Whether the deletion was successful
   */
  static deleteSession(sessionId) {
    try {
      // Remove from localStorage
      localStorage.removeItem(`ketamine_${sessionId}`);
      
      // Update session index
      let sessionIndex = JSON.parse(localStorage.getItem('ketamine_session_index')) || [];
      sessionIndex = sessionIndex.filter(id => id !== sessionId);
      localStorage.setItem('ketamine_session_index', JSON.stringify(sessionIndex));
      
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }
  
  /**
   * Export all sessions as a JSON file
   * @returns {Blob} - JSON file as a Blob
   */
  static exportAllSessions() {
    try {
      // Get all sessions
      const sessions = {};
      const sessionIndex = JSON.parse(localStorage.getItem('ketamine_session_index')) || [];
      
      // Load each session
      sessionIndex.forEach(sessionId => {
        const sessionData = this.loadSession(sessionId);
        if (sessionData) {
          sessions[sessionId] = sessionData;
        }
      });
      
      // Create JSON blob
      const jsonBlob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
      return jsonBlob;
    } catch (error) {
      console.error('Error exporting sessions:', error);
      return null;
    }
  }
  
  /**
   * Import sessions from a JSON file
   * @param {Object} sessionsData - The sessions data to import
   * @returns {Number} - Number of sessions imported
   */
  static importSessions(sessionsData) {
    try {
      let importCount = 0;
      
      // Import each session
      Object.entries(sessionsData).forEach(([sessionId, sessionData]) => {
        localStorage.setItem(`ketamine_${sessionId}`, JSON.stringify(sessionData));
        this.updateSessionIndex(sessionId);
        importCount++;
      });
      
      return importCount;
    } catch (error) {
      console.error('Error importing sessions:', error);
      return 0;
    }
  }
}

export default SessionManager;