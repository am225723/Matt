import { SCENARIOS } from './scenarios';

export const ALL_BADGES = SCENARIOS.map(scenario => ({
  key: `badge_${scenario.key}`,
  name: `${scenario.label} Navigator`,
  description: `Successfully created a playbook for the "${scenario.label}" scenario.`,
  emoji: scenario.emoji,
}));

export const getBadgeByKey = (key) => {
  return ALL_BADGES.find(badge => badge.key === key);
};
