export interface Exercise {
  id: string;
  name: string;
  weight: number;
  sets: number;
  completedSets: number;
  pause: number; // in seconds
  restTime: number; // in seconds
}
