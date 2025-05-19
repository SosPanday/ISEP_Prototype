import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, GripVertical, Plus } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import type { ExerciseList } from "@/types";
import ExercisePickerModal from "@/components/ExercisePickerModal";

// type Exercise = {
//   id: string;
//   name: string;
//   sets: number;
//   reps: number;
//   weight: number;
//   muscleGroup?: string;
//   image?: string;
// };

// const availableExercises = [
//   "Bench Press",
//   "Deadlift",
//   "Squat",
//   "Pull Ups",
//   "Shoulder Press",
// ];

export default function TrainingPlanEditor() {
  const [planName, setPlanName] = useState("Mein Trainingsplan");
  const [editingName, setEditingName] = useState(false);
  const [exercises, setExercises] = useState<ExerciseList[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const allExercises: ExerciseList[] = [
    {
      id: "latzug",
      name: "Latzug",
      muscleGroup: "Rücken",
      image: "/images/latzug.png",
      sets: 3,
      reps: 12,
      weight: 20,
      restTime: 0,
    },
    {
      id: "skullcrushers",
      name: "Skullcrushers",
      muscleGroup: "Trizeps",
      image: "/images/skullcrushers.png",
      sets: 3,
      reps: 10,
      weight: 10,
      restTime: 0,
    },
    {
      id: "beinpresse",
      name: "Beinpresse",
      muscleGroup: "Beine",
      image: "/images/beinpresse.png",
      sets: 4,
      reps: 8,
      weight: 100,
      restTime: 0,
    },
  ];

  const updateExercise = (
    id: string,
    key: keyof ExerciseList,
    value: string | number
  ) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? {
              ...ex,
              [key]: typeof value === "string" ? parseInt(value) || 0 : value,
            }
          : ex
      )
    );
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  // DnD Kit setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return; // 🛡️ Abbrechen, wenn kein Ziel vorhanden

    if (active.id !== over.id) {
      const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
      const newIndex = exercises.findIndex((ex) => ex.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setExercises((ex) => arrayMove(ex, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        {editingName ? (
          <Input
            className="text-xl font-bold"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            onBlur={() => setEditingName(false)}
            autoFocus
          />
        ) : (
          <h1
            className="text-2xl font-bold flex items-center gap-2 cursor-pointer"
            onClick={() => setEditingName(true)}
          >
            {planName}
            <Pencil className="w-4 h-4 text-gray-500" />
          </h1>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={exercises.map((ex) => ex.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {exercises.map((ex) => (
              <SortableExerciseCard
                key={ex.id}
                exercise={ex}
                onChange={updateExercise}
                onRemove={removeExercise}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div
        className="border-2 border-dashed rounded-xl p-4 text-center text-gray-500 hover:bg-gray-50 transition cursor-pointer mt-6"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex justify-center mb-2">
          <Plus className="w-6 h-6" />
        </div>
        <div>Übung hinzufügen</div>
      </div>
      <ExercisePickerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(exercise) => {
          setExercises((prev) => [
            ...prev,
            {
              ...exercise,
              id: Date.now().toString(), // Neue ID für diese Instanz
            },
          ]);
        }}
        exercises={allExercises}
      />
    </div>
  );
}

type SortableCardProps = {
  exercise: ExerciseList;
  onChange: (
    id: string,
    key: keyof ExerciseList,
    value: string | number
  ) => void;
  onRemove: (id: string) => void;
};

function SortableExerciseCard({
  exercise,
  onChange,
  onRemove,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onRemove(exercise.id),
    delta: 50,
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...swipeHandlers}
      className="border rounded-xl p-4 bg-white shadow flex flex-col gap-4 relative group"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-lg">{exercise.name}</div>
          <div className="text-sm text-gray-500">
            Pause: <span className="font-medium">{exercise.restTime}s</span>
          </div>
        </div>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex flex-row gap-3">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Sätze</label>
          <Input
            type="number"
            value={exercise.sets}
            onChange={(e) => onChange(exercise.id, "sets", +e.target.value)}
            placeholder="Sets"
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Wiederholungen
          </label>
          <Input
            type="number"
            value={exercise.reps}
            onChange={(e) => onChange(exercise.id, "reps", +e.target.value)}
            placeholder="Reps"
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Gewicht (kg)
          </label>
          <Input
            type="number"
            value={exercise.weight}
            onChange={(e) => onChange(exercise.id, "weight", +e.target.value)}
            placeholder="Weight"
            inputMode="decimal"
          />
        </div>
      </div>

      <div className="absolute top-2 right-3 text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Nach links wischen zum Entfernen
      </div>
    </div>
  );
}
