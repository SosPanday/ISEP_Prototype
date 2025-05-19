import { useState } from "react";
import type { ExerciseList } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseList) => void;
  exercises: ExerciseList[];
};

export default function ExercisePickerModal({
  isOpen,
  onClose,
  onSelect,
  exercises,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const filtered = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterGroup === "" || ex.muscleGroup === filterGroup)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
        <div className="text-lg font-bold">Übung auswählen</div>
        <Input
          placeholder="Suche nach Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {["", "Rücken", "Brust", "Beine", "Trizeps", "Bizeps"].map(
            (group) => (
              <Button
                key={group}
                variant={filterGroup === group ? "default" : "outline"}
                onClick={() => setFilterGroup(group)}
                className="text-xs"
              >
                {group || "Alle"}
              </Button>
            )
          )}
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2 grid grid-cols-2 gap-2">
          {filtered.map((ex) => (
            <div
              key={ex.id}
              onClick={() => {
                onSelect(ex);
                onClose();
              }}
              className="border p-2 rounded cursor-pointer"
            >
              <img
                src={`${ex.image}`}
                alt={`${ex.name}`}
                className="rounded-sm"
              />
              <div className="font-medium">{ex.name}</div>
              <div className="text-sm text-gray-500">{ex.muscleGroup}</div>
            </div>
          ))}
        </div>
        <Button onClick={onClose} className="w-full">
          Schließen
        </Button>
      </div>
    </div>
  );
}
