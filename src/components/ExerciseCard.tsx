// src/components/ExerciseCard.tsx
import React, { forwardRef } from "react";
import type { Exercise } from "../types";

interface Props {
  exercise: Exercise;
  isActive: boolean;
  isCompleted: boolean;
}

const ExerciseCard = forwardRef<HTMLDivElement, Props>(
  ({ exercise, isActive, isCompleted }, ref) => {
    const estimatedTimePerSet = exercise.avgRepTime * exercise.reps;
    const estimatedTotalTime =
      estimatedTimePerSet * (exercise.sets - exercise.completedSets);

    return (
      <div
        ref={ref}
        className={`snap-center flex flex-col items-center justify-center h-[40vh] mx-4 my-2 rounded-2xl p-6 transition-all duration-300 shadow-md ${
          isCompleted
            ? "bg-gray-200 text-gray-400 opacity-50"
            : isActive
            ? "bg-violet-500 text-white scale-105"
            : "bg-violet-200 text-gray-700"
        }`}
      >
        <h2 className="text-2xl font-bold text-center">{exercise.name}</h2>
        <p className="text-lg mt-2">Gewicht: {exercise.weight} kg</p>
        <p className="text-lg">
          Sets: {exercise.completedSets}/{exercise.sets}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Ø Satzdauer: {estimatedTimePerSet.toFixed(1)} Sek
        </p>
        <p className="text-sm text-gray-600">
          Ø Restdauer: {estimatedTotalTime.toFixed(1)} Sek
        </p>
      </div>
    );
  }
);

export default ExerciseCard;
