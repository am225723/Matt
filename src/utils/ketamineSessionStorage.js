const STORAGE_KEY = 'ketamineSessionHistory';

/**
 * Retrieves all saved sessions from localStorage.
 * @returns {Array} An array of session objects.
 */
export const getSessions = () => {
  try {
    const sessions = localStorage.getItem(STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error("Error loading sessions from localStorage:", error);
    return [];
  }
};

/**
 * Saves a new session to localStorage.
 * @param {object} sessionData - The session data to save.
 */
export const saveSession = (sessionData) => {
  try {
    const sessions = getSessions();
    // Add a timestamp and a unique ID to the session
    const newSession = {
      ...sessionData,
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
    };
    sessions.unshift(newSession); // Add to the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    console.error("Error saving session to localStorage:", error);
    return null;
  }
};

/**
 * Deletes a session from localStorage.
 * @param {string} sessionId - The ID of the session to delete.
 */
export const deleteSession = (sessionId) => {
    try {
        let sessions = getSessions();
        sessions = sessions.filter(session => session.id !== sessionId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        return sessions;
    } catch (error) {
        console.error("Error deleting session from localStorage:", error);
        return null;
    }
};
