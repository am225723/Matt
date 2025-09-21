const LOGBOOK_KEY = 'resiliencePlaybookExcuseLogbook';

/**
 * Loads the user's excuse logbook data.
 * @returns {Array<Object>} The user's excuse logbook data.
 */
export const loadLogbook = () => {
  const data = localStorage.getItem(LOGBOOK_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing logbook data:", error);
      return [];
    }
  }
  return [];
};

/**
 * Saves the user's excuse logbook data.
 * @param {Array<Object>} logbook - The logbook data to save.
 */
export const saveLogbook = (logbook) => {
  localStorage.setItem(LOGBOOK_KEY, JSON.stringify(logbook));
};

/**
 * Adds a new entry to the excuse logbook.
 * @param {string} excuse - The user's excuse.
 * @param {string} reframe - The reframed solution.
 */
export const addLogEntry = (excuse, reframe) => {
  const logbook = loadLogbook();
  const newEntry = {
    excuse,
    reframe,
    timestamp: new Date().toISOString(),
  };
  logbook.push(newEntry);
  saveLogbook(logbook);
};
