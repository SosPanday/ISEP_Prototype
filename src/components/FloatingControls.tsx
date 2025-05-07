// src/components/FloatingControls.tsx
import React, { useState, useRef } from "react";

interface Props {
  onAdjustWeight: (delta: number) => void;
  onCompleteSet: () => void;
  disabled: boolean;
}

const weightOptions = [2.5, 5, 10];

const FloatingControls: React.FC<Props> = ({
  onAdjustWeight,
  onCompleteSet,
  disabled,
}) => {
  const [showMenu, setShowMenu] = useState<"plus" | "minus" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHold = (type: "plus" | "minus") => {
    timeoutRef.current = setTimeout(() => {
      setShowMenu(type);
    }, 500);
  };

  const clearHold = (type: "plus" | "minus") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (showMenu === null) {
      // normal click fallback
      onAdjustWeight(type === "plus" ? 2.5 : -2.5);
    }
  };

  const renderWeightMenu = (type: "plus" | "minus") => (
    <div className="absolute bottom-14 bg-white rounded-xl shadow-lg py-2 px-3 flex flex-col gap-2 z-40">
      {weightOptions.map((val) => (
        <button
          key={val}
          className="bg-violet-200 hover:bg-violet-400 text-violet-800 font-semibold py-1 px-2 rounded-lg"
          onClick={() => {
            onAdjustWeight(type === "plus" ? val : -val);
            setShowMenu(null);
          }}
        >
          {type === "plus" ? "+" : "-"}
          {val}kg
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 z-30">
      <div className="bg-white rounded-2xl shadow-xl flex justify-between gap-4 items-center px-2 py-4">
        <div className="relative">
          <button
            className="text-violet-500 font-bold px-4 py-2 rounded-2xl  disabled:opacity-50 select-none"
            onMouseDown={() => handleHold("minus")}
            onMouseUp={() => clearHold("minus")}
            onTouchStart={() => handleHold("minus")}
            onTouchEnd={() => clearHold("minus")}
            disabled={disabled}
          >
            -2.5kg
          </button>
          {showMenu === "minus" && renderWeightMenu("minus")}
        </div>

        <button
          className="bg-violet-500 text-white font-bold px-6 py-2 rounded-2xl shadow-md disabled:opacity-50 select-none"
          onClick={onCompleteSet}
          disabled={disabled}
        >
          Set Fertig
        </button>

        <div className="relative">
          <button
            className="text-violet-500 font-bold px-4 py-2 rounded-2xl  disabled:opacity-50 select-none"
            onMouseDown={() => handleHold("plus")}
            onMouseUp={() => clearHold("plus")}
            onTouchStart={() => handleHold("plus")}
            onTouchEnd={() => clearHold("plus")}
            disabled={disabled}
          >
            +2.5kg
          </button>
          {showMenu === "plus" && renderWeightMenu("plus")}
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;
