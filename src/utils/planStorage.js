export const savePlan = (scenario, customScenario, answers) => {
  const plan = {
    scenario,
    customScenario,
    answers,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem("resiliencePlan", JSON.stringify(plan));
  return plan;
};

export const loadPlan = () => {
  const saved = localStorage.getItem("resiliencePlan");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing saved plan:", error);
      return null;
    }
  }
  return null;
};

export const exportPlan = (scenario, customScenario, answers) => {
  const plan = {
    scenario,
    customScenario,
    answers,
    timestamp: new Date().toISOString()
  };
  const dataStr = JSON.stringify(plan, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resilience-plan-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const clearPlan = () => {
  localStorage.removeItem("resiliencePlan");
};

export const hasSavedPlan = () => {
  return !!localStorage.getItem("resiliencePlan");
};