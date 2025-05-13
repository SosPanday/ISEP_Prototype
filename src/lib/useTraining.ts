function deferExercise() {
  const deferred = exercises[currentIndex];
  const remaining = exercises.filter((_, i) => i !== currentIndex);
  setExercises([...remaining, deferred]);
}

function calculateEstimatedRemainingTime(): number {
  const remainingExercises = exercises.slice(currentIndex);
  let total = 0;
  for (const ex of remainingExercises) {
    const setsLeft = ex.sets - ex.completedSets;
    total += setsLeft * (ex.reps * ex.avgRepTime + ex.restTime);
  }
  return total;
}
