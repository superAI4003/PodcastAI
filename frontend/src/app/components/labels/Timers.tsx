import React from 'react';

interface TimerProps {
  scriptTimers: string[];
  scriptTotalTimer: number;
  audioTimers: string[];
  audioTotalTimer: number;
  currentIndex: number;
  formatDuration: (duration: number) => string;
}

export const Timer: React.FC<TimerProps> = ({
  scriptTimers,
  scriptTotalTimer,
  audioTimers,
  audioTotalTimer,
  currentIndex,
  formatDuration,
}) => {
  return (
    <div className="absolute top-5 right-5 text-white">
      <p>
        Script Timer:{" "}
        {scriptTimers[currentIndex - 1]
          ? scriptTimers[currentIndex - 1]
          : "--:--"}
      </p>
      <p>
        Total Script Timer:{" "}
        {scriptTotalTimer
          ? formatDuration(scriptTotalTimer)
          : "--:--"}
      </p>
      <p>
        Audio Timer:{" "}
        {audioTimers[currentIndex - 1]
          ? audioTimers[currentIndex - 1]
          : "--:--"}
      </p>
      <p>
        Total Audio Timer:{" "}
        {audioTotalTimer
          ? formatDuration(audioTotalTimer)
          : "--:--"}
      </p>
    </div>
  );
};

