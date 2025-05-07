import React from "react";

interface Props {
  remaining: number;
  onSkip: () => void;
}

const PauseOverlay: React.FC<Props> = ({ remaining, onSkip }) => {
  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-70 flex items-center justify-center z-50">
      <div className="inset-0 text-2xl text-white font-bold text-center">
        "random quote hier" z.B Alles mit der Ruhe, Erhol dich gut, Nimm dir
        deine Zeit
      </div>
      <div className="fixed bottom-4 left-4 right-4 bg-violet-700 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="text-lg font-semibold">Pause: {remaining}s</div>
        <button
          onClick={onSkip}
          className="bg-white text-violet-700 px-4 py-2 rounded-full font-bold"
        >
          Überspringen
        </button>
      </div>
    </div>
  );
};

export default PauseOverlay;
