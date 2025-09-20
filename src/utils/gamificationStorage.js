const GAMIFICATION_KEY = 'resiliencePlaybookGamification';

const defaultGamificationData = {
  badges: [],
  streak: 0,
  lastVisit: null,
};

/**
 * Loads the user's gamification data.
 * @returns {Object} The user's gamification data.
 */
export const loadGamificationData = () => {
  const data = localStorage.getItem(GAMIFICATION_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing gamification data:", error);
      return defaultGamificationData;
    }
  }
  return defaultGamificationData;
};

/**
 * Saves the user's gamification data.
 * @param {Object} data - The gamification data to save.
 */
export const saveGamificationData = (data) => {
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
};

/**
 * Awards a badge to the user if they don't already have it.
 * @param {string} badgeName - The name of the badge to award.
 * @returns {boolean} True if a new badge was awarded, false otherwise.
 */
export const awardBadge = (badgeName) => {
  const data = loadGamificationData();
  if (!data.badges.includes(badgeName)) {
    data.badges.push(badgeName);
    saveGamificationData(data);
    return true;
  }
  return false;
};

/**
 * Updates the user's streak.
 * This should be called once per day on app load.
 */
export const updateStreak = () => {
  const data = loadGamificationData();
  const today = new Date().toDateString();
  const lastVisit = data.lastVisit ? new Date(data.lastVisit).toDateString() : null;

  if (lastVisit === today) {
    // Already visited today, do nothing.
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  if (lastVisit === yesterdayString) {
    // Continued the streak.
    data.streak += 1;
  } else {
    // Streak is broken.
    data.streak = 1;
  }

  data.lastVisit = new Date().toISOString();
  saveGamificationData(data);
};
