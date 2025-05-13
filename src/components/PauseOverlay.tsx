import React from "react";

interface Props {
  remaining: number;
  average: number;
  onSkip: () => void;
  isInterExercise: boolean;
  estimatedRemaining: string;
}

const PauseOverlay: React.FC<Props> = ({
  remaining,
  average,
  onSkip,
  isInterExercise,
  estimatedRemaining,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-4/5">
        <h2 className="text-2xl font-bold text-violet-700 mb-2">
          {isInterExercise ? "Übungspause" : "Satzpause"}
        </h2>
        <p className="text-lg mb-2">Verbleibend: {remaining} Sek</p>
        <p className="text-sm text-gray-600 mb-2">Ø Pause: {average} Sek</p>
        {isInterExercise && (
          <p className="text-sm text-gray-600">
            Geschätzte Restdauer: {estimatedRemaining}
          </p>
        )}
        <button
          className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-2xl"
          onClick={onSkip}
        >
          Frühzeitig beenden
        </button>
      </div>
    </div>
  );
};

export default PauseOverlay;
