import type { DailyRecap, Mission, SleepEntry, SportSession, WaterLog } from "@/types";

export type Badge = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export function calculateXp(data: {
  missions: Mission[];
  water: WaterLog[];
  recaps: DailyRecap[];
  sport: SportSession[];
  sleep: SleepEntry[];
}) {
  const completedMissions = data.missions.filter((mission) => mission.completed).length;
  const waterGoals = data.water.filter((entry) => entry.amountMl >= entry.goalMl).length;
  const goodSleep = data.sleep.filter((entry) => entry.durationHours >= 7).length;

  return completedMissions * 10 + waterGoals * 25 + data.recaps.length * 20 + data.sport.length * 40 + goodSleep * 20;
}

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / 250) + 1;
  const currentLevelXp = xp % 250;
  return { level, currentLevelXp, nextLevelXp: 250 };
}

export function buildBadges(data: {
  missions: Mission[];
  water: WaterLog[];
  recaps: DailyRecap[];
  sport: SportSession[];
  sleep: SleepEntry[];
}) {
  const completedMissions = data.missions.filter((mission) => mission.completed).length;
  const waterGoals = data.water.filter((entry) => entry.amountMl >= entry.goalMl).length;
  const goodSleep = data.sleep.filter((entry) => entry.durationHours >= 7).length;

  return [
    {
      id: "first-recap",
      title: "Premier bilan",
      description: "Enregistrer ton premier récap de journée.",
      unlocked: data.recaps.length >= 1
    },
    {
      id: "mission-25",
      title: "Routine lancée",
      description: "Valider 25 missions.",
      unlocked: completedMissions >= 25
    },
    {
      id: "hydration-7",
      title: "Hydratation solide",
      description: "Atteindre l'objectif d'eau 7 jours.",
      unlocked: waterGoals >= 7
    },
    {
      id: "sport-3",
      title: "Semaine active",
      description: "Enregistrer 3 séances de sport.",
      unlocked: data.sport.length >= 3
    },
    {
      id: "sleep-5",
      title: "Recharge",
      description: "Dormir au moins 7 h sur 5 nuits.",
      unlocked: goodSleep >= 5
    }
  ] satisfies Badge[];
}
