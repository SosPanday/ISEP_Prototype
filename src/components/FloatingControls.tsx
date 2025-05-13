import React, { useState, useRef } from "react";

interface Props {
  onAdjustWeight: (delta: number) => void;
  onCompleteSet: () => void;
  onDeferExercise: () => void;
  disabled: boolean;
}

const FloatingControls: React.FC<Props> = ({
  onAdjustWeight,
  onCompleteSet,
  onDeferExercise,
  disabled,
}) => {
  const [showWeightOptions, setShowWeightOptions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleWeightHold = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowWeightOptions(true);
  };

  const handleWeightRelease = () => {
    timeoutRef.current = setTimeout(() => setShowWeightOptions(false), 3000);
  };

  const weightSteps = [2.5, 5, 10];

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 px-4 z-40">
      {showWeightOptions && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setShowWeightOptions(false)}
        />
      )}
      <div
        onTouchStart={handleWeightHold}
        onTouchEnd={handleWeightRelease}
        onMouseDown={handleWeightHold}
        onMouseUp={handleWeightRelease}
        className="relative z-40"
      >
        <button
          className="bg-violet-500 text-white px-4 py-2 rounded-2xl shadow-md disabled:opacity-50"
          onClick={() => onAdjustWeight(-2.5)}
          disabled={disabled}
        >
          -2.5kg
        </button>
        {showWeightOptions && (
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white border p-2 rounded-xl shadow-lg">
            {weightSteps.map((w) => (
              <button
                key={w}
                className="block text-sm py-1 px-2 text-violet-500 hover:bg-violet-100 w-full text-center"
                onClick={() => onAdjustWeight(-w)}
              >
                -{w}kg
              </button>
            ))}
            <button
              className="block text-sm mt-2 text-center text-gray-500 hover:underline w-full"
              onClick={() => setShowWeightOptions(false)}
            >
              Schließen
            </button>
          </div>
        )}
      </div>

      <button
        className="bg-green-500 text-white px-6 py-2 rounded-2xl shadow-md disabled:opacity-50 z-40"
        onClick={onCompleteSet}
        disabled={disabled}
      >
        Set abschließen
      </button>

      <div className="z-40">
        <button
          className="bg-violet-500 text-white px-4 py-2 rounded-2xl shadow-md disabled:opacity-50"
          onClick={() => onAdjustWeight(2.5)}
          disabled={disabled}
        >
          +2.5kg
        </button>
        <button
          className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded-2xl shadow-md text-sm"
          onClick={onDeferExercise}
        >
          Nach hinten verschieben
        </button>
      </div>
    </div>
  );
};

export default FloatingControls;
