// App.tsx
import React, { useRef, useState, useEffect } from "react";
import type { Exercise } from "@/types";
import ExerciseCard from "@/components/ExerciseCard";
import FloatingControls from "@/components/FloatingControls";
import PauseOverlay from "@/components/PauseOverlay";
import { v4 as uuidv4 } from "uuid";

const initialExercises: Exercise[] = [
  {
    id: uuidv4(),
    name: "Bench Press",
    weight: 60,
    sets: 3,
    completedSets: 0,
    pause: 60,
    restTime: 5,
    avgRepTime: 0,
    reps: 0,
  },
  {
    id: uuidv4(),
    name: "Deadlift",
    weight: 100,
    sets: 3,
    completedSets: 0,
    pause: 90,
    restTime: 5,
    avgRepTime: 0,
    reps: 0,
  },
  {
    id: uuidv4(),
    name: "Squats",
    weight: 80,
    sets: 3,
    completedSets: 0,
    pause: 75,
    restTime: 5,
    avgRepTime: 0,
    reps: 0,
  },
  {
    id: uuidv4(),
    name: "Squashes",
    weight: 80,
    sets: 3,
    completedSets: 0,
    pause: 75,
    restTime: 5,
    avgRepTime: 0,
    reps: 0,
  },
  {
    id: uuidv4(),
    name: "Commits",
    weight: 80,
    sets: 3,
    completedSets: 0,
    pause: 75,
    restTime: 5,
    avgRepTime: 0,
    reps: 0,
  },
];

export default function App() {
  const [exercises, setExercises] = useState(initialExercises);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTime, setPauseTime] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const pauseInterval = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const containerCenter =
        container.getBoundingClientRect().top + container.clientHeight / 2;
      let minDistance = Infinity;
      let closestIndex = 0;

      itemRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });

      scrollToIndex(closestIndex);
    }, 150);
  };

  const scrollToIndex = (index: number) => {
    const ref = itemRefs.current[index];
    if (ref && containerRef.current) {
      containerRef.current.scrollTo({
        top:
          ref.offsetTop -
          containerRef.current.clientHeight / 2 +
          ref.clientHeight / 2,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const adjustWeight = (delta: number) => {
    const updated = [...exercises];
    updated[activeIndex].weight += delta;
    setExercises(updated);
  };

  const completeSet = () => {
    const updated = [...exercises];
    const exercise = updated[activeIndex];

    if (exercise.completedSets < exercise.sets) {
      exercise.completedSets++;
      setExercises(updated);
      startPause(exercise.pause);

      // Wenn alle Sets fertig sind, zum nächsten springen
      if (
        exercise.completedSets === exercise.sets &&
        activeIndex < exercises.length - 1
      ) {
        setTimeout(() => scrollToIndex(activeIndex + 1), exercise.pause * 1000);
      }
    }
  };

  const startPause = (seconds: number) => {
    setIsPaused(true);
    setPauseTime(seconds);
    if (pauseInterval.current) clearInterval(pauseInterval.current);
    let timeLeft = seconds;
    pauseInterval.current = setInterval(() => {
      timeLeft--;
      setPauseTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(pauseInterval.current!);
        setIsPaused(false);
      }
    }, 1000);
  };

  const skipPause = () => {
    if (pauseInterval.current) clearInterval(pauseInterval.current);
    setIsPaused(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="relative h-screen bg-violet-100 text-gray-800">
      <div className="bg-violet-500 text-2xl p-4 font-bold">
        <p>Logo</p>
      </div>

      <div ref={containerRef} className="overflow-y-auto h-full snap-mandatory">
        <div className="h-[25vh]" />
        {exercises.map((exercise, i) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isActive={i === activeIndex}
            ref={(el) => (itemRefs.current[i] = el)}
          />
        ))}
        <div className="h-[25vh]" />
      </div>

      <FloatingControls
        onAdjustWeight={adjustWeight}
        onCompleteSet={completeSet}
        disabled={isPaused}
        onDeferExercise={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      {isPaused && (
        <PauseOverlay
          remaining={pauseTime}
          onSkip={skipPause}
          average={0}
          isInterExercise={false}
          estimatedRemaining={""}
        />
      )}
    </div>
  );
}
