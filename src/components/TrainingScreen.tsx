// src/screens/TrainingScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import FloatingControls from "../components/FloatingControls";
import PauseOverlay from "../components/PauseOverlay";
import type { Exercise, AppPhase } from "../types";

const initialExercises: Exercise[] = [
  {
    id: "1",
    name: "Bankdrücken",
    weight: 60,
    sets: 3,
    completedSets: 0,
    restTime: 60,
    avgRepTime: 3,
    reps: 10,
  },
  {
    id: "2",
    name: "Kniebeuge",
    weight: 80,
    sets: 3,
    completedSets: 0,
    restTime: 75,
    avgRepTime: 3,
    reps: 8,
  },
  {
    id: "3",
    name: "Kniebeuge",
    weight: 80,
    sets: 3,
    completedSets: 0,
    restTime: 75,
    avgRepTime: 3,
    reps: 8,
  },
  {
    id: "4",
    name: "Kniebeuge",
    weight: 80,
    sets: 3,
    completedSets: 0,
    restTime: 75,
    avgRepTime: 3,
    reps: 8,
  },
];

const TrainingsScreen: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    /* Initialdaten */
  ]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<AppPhase>("exercise");
  const [pauseRemaining, setPauseRemaining] = useState(0);
  const [trainingStartTime, setTrainingStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const exerciseRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setExercises(initialExercises);
  }, []);

  useEffect(() => {
    if (!trainingStartTime) setTrainingStartTime(new Date());

    const id = setInterval(() => {
      setElapsedTime(
        Math.floor(
          (new Date().getTime() - (trainingStartTime?.getTime() ?? 0)) / 1000
        )
      );
    }, 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [trainingStartTime]);

  useEffect(() => {
    if (phase === "rest" && pauseRemaining > 0) {
      const id = setInterval(() => {
        setPauseRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setPhase("exercise");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [phase, pauseRemaining]);

  const currentExercise = exercises[activeExerciseIndex];

  const handleAdjustWeight = (delta: number) => {
    const updated = [...exercises];
    updated[activeExerciseIndex].weight += delta;
    setExercises(updated);
  };

  const handleCompleteSet = () => {
    const updated = [...exercises];
    updated[activeExerciseIndex].completedSets++;
    setExercises(updated);

    if (
      updated[activeExerciseIndex].completedSets <
      updated[activeExerciseIndex].sets
    ) {
      setPauseRemaining(updated[activeExerciseIndex].restTime);
      setPhase("rest");
    } else {
      if (activeExerciseIndex + 1 < exercises.length) {
        setActiveExerciseIndex((prev) => prev);
        setPauseRemaining(30); // Inter-Exercise Pause
        setPhase("inter-exercise");
        setTimeout(() => {
          exerciseRefs.current[activeExerciseIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        // Training abgeschlossen
        setPhase("exercise");
        if (intervalId) clearInterval(intervalId);
      }
    }
  };

  const handleDeferExercise = () => {
    const updated = [...exercises];
    const [deferred] = updated.splice(activeExerciseIndex, 1);
    updated.push(deferred);
    setExercises(updated);
    setActiveExerciseIndex(0);
    setTimeout(() => {
      exerciseRefs.current[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleSkipPause = () => {
    setPauseRemaining(0);
    setPhase("exercise");
  };

  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const completedSets = exercises.reduce((acc, e) => acc + e.completedSets, 0);

  const activeExercises = exercises.filter((ex) => ex.completedSets < ex.sets);
  const completedExercises = exercises.filter(
    (ex) => ex.completedSets >= ex.sets
  );

  return (
    <div className="pt-4 pb-32 overflow-y-scroll snap-y snap-mandatory h-screen">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Trainingszeit: {Math.floor(elapsedTime / 60)}:
          {(elapsedTime % 60).toString().padStart(2, "0")}
        </p>
        <p className="text-sm text-gray-600">
          Fortschritt: {completedSets}/{totalSets} Sets
        </p>
      </div>
      {activeExercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          ref={(el) => (exerciseRefs.current[index] = el)}
          exercise={exercise}
          isActive={index === activeExerciseIndex}
          isCompleted={exercise.completedSets >= exercise.sets}
        />
      ))}

      {completedExercises.length > 0 && (
        <div className="mt-6 border-t-2 border-gray-300 pt-4">
          <h3 className="text-center text-gray-500 mb-2">
            ✅ Abgeschlossene Übungen
          </h3>
          {completedExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isActive={false}
              isCompleted={true}
            />
          ))}
        </div>
      )}

      <FloatingControls
        onAdjustWeight={handleAdjustWeight}
        onCompleteSet={handleCompleteSet}
        onDeferExercise={handleDeferExercise}
        disabled={phase !== "exercise"}
      />

      {(phase === "rest" || phase === "inter-exercise") && (
        <PauseOverlay
          remaining={pauseRemaining}
          average={currentExercise?.restTime ?? 0}
          estimatedRemaining={""} // Optional: Berechnung der Gesamtzeit
          onSkip={handleSkipPause}
          isInterExercise={phase === "inter-exercise"}
        />
      )}
    </div>
  );
};

export default TrainingsScreen;
