import React, { forwardRef } from "react";
import type { Exercise } from "@/types";

interface Props {
  exercise: Exercise;
  isActive: boolean;
}

const ExerciseCard = forwardRef<HTMLDivElement, Props>(
  ({ exercise, isActive }, ref) => {
    return (
      <div
        ref={ref}
        className={`snap-center flex flex-col items-center justify-center h-[40vh] mx-4 my-8 rounded-2xl p-6 transition-all duration-300 shadow-md ${
          isActive
            ? "bg-violet-500 text-white scale-105"
            : "bg-violet-200 text-gray-700 opacity-50"
        }`}
      >
        <h2 className="text-2xl font-bold">{exercise.name}</h2>
        <p className="text-lg mt-2">Gewicht: {exercise.weight} kg</p>
        <p className="text-lg">
          Sets: {exercise.completedSets}/{exercise.sets}
        </p>
      </div>
    );
  }
);

export default ExerciseCard;
