import { v4 as uuidv4 } from 'uuid';

const LIBRARY_KEY = 'resiliencePlaybookLibrary';

/**
 * Loads all plans from the library.
 * @returns {Array} An array of plan objects.
 */
export const loadPlansFromLibrary = () => {
  const library = localStorage.getItem(LIBRARY_KEY);
  if (library) {
    try {
      return JSON.parse(library);
    } catch (error) {
      console.error("Error parsing plan library:", error);
      return [];
    }
  }
  return [];
};

/**
 * Saves a plan to the library.
 * @param {Object} plan - The plan object to save.
 * @returns {Object} The saved plan with a unique ID and timestamp.
 */
export const savePlanToLibrary = (plan) => {
  const library = loadPlansFromLibrary();
  const newPlan = {
    ...plan,
    id: uuidv4(),
    savedAt: new Date().toISOString(),
  };
  library.push(newPlan);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  return newPlan;
};

/**
 * Retrieves a single plan from the library by its ID.
 * @param {string} planId - The ID of the plan to retrieve.
 * @returns {Object|null} The plan object, or null if not found.
 */
export const getPlanFromLibrary = (planId) => {
  const library = loadPlansFromLibrary();
  return library.find(plan => plan.id === planId) || null;
};

/**
 * Deletes a plan from the library.
 * @param {string} planId - The ID of the plan to delete.
 */
export const deletePlanFromLibrary = (planId) => {
  let library = loadPlansFromLibrary();
  library = library.filter(plan => plan.id !== planId);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
};

/**
 * Updates an existing plan in the library.
 * @param {string} planId - The ID of the plan to update.
 * @param {Object} updatedPlan - The updated plan object.
 */
export const updatePlanInLibrary = (planId, updatedPlan) => {
  let library = loadPlansFromLibrary();
  const planIndex = library.findIndex(plan => plan.id === planId);
  if (planIndex !== -1) {
    library[planIndex] = { ...library[planIndex], ...updatedPlan };
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  }
};
