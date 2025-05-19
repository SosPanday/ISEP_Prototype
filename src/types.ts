// src/types.ts
export interface Exercise {
  pause: number;
  id: string;
  name: string;
  weight: number;
  sets: number;
  completedSets: number;
  restTime: number; // in seconds
  avgRepTime: number; // average time per rep in seconds
  reps: number;
}

export type ExerciseList = {
  id: string;
  name: string;
  muscleGroup: string;
  image?: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number; // in seconds
};

export type AppPhase = "exercise" | "rest" | "inter-exercise";

export interface TimerState {
  remaining: number;
  intervalId: NodeJS.Timeout | null;
}

export interface TrainingStats {
  estimatedRemainingSeconds: number;
  averageRestBetweenExercises: number;
}
