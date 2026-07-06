import type { Mission, WeightEntry } from "@/types";

export const START_WEIGHT_KG = 118.3;
export const GOAL_WEIGHT_KG = 103.3;
export const WATER_GOAL_ML = 2000;

export function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

export function missionCompletion(missions: Mission[]) {
  return percent(missions.filter((mission) => mission.completed).length, missions.length);
}

export function currentWeight(entries: WeightEntry[]) {
  if (entries.length === 0) return START_WEIGHT_KG;
  return [...entries].sort((a, b) => b.date.localeCompare(a.date))[0].weightKg;
}

export function weightLoss(entries: WeightEntry[]) {
  return Number((START_WEIGHT_KG - currentWeight(entries)).toFixed(1));
}

export function weightGoalProgress(entries: WeightEntry[]) {
  const totalToLose = START_WEIGHT_KG - GOAL_WEIGHT_KG;
  return percent(weightLoss(entries), totalToLose);
}
