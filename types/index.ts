export type Mission = {
  id: string;
  label: string;
  completed: boolean;
  date: string;
};

export type WaterLog = {
  date: string;
  amountMl: number;
  goalMl: number;
};

export type WeightEntry = {
  id: string;
  date: string;
  weightKg: number;
  comment?: string;
};

export type DailyRecap = {
  id: string;
  date: string;
  mood: number;
  energy: number;
  hunger: number;
  stress: number;
  success: string;
  difficulty: string;
  note?: string;
};

export type SleepEntry = {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  durationHours: number;
  quality: number;
  comment?: string;
};

export type SportType = "Push" | "Pull" | "Legs" | "Cardio" | "Autre";

export type ExerciseSet = {
  id: string;
  reps: number;
  weightKg?: number;
  restSeconds?: number;
};

export type Exercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
  comment?: string;
};

export type SportSession = {
  id: string;
  date: string;
  type: SportType;
  durationMinutes: number;
  feeling: number;
  notes?: string;
  exercises: Exercise[];
};

export type HistoryKind = "missions" | "eau" | "poids" | "sport" | "recap" | "sommeil";

export type HistoryItem = {
  id: string;
  date: string;
  type: HistoryKind;
  title: string;
  detail: string;
};
