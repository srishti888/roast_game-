import React from "react";

interface StatusBarProps {
  timeLeft: number;
  score: number;
  questionCount: number;
  totalQuestions: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ timeLeft, score, questionCount, totalQuestions }) => {
  const timePercentage = (timeLeft / 9) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1 font-mono text-xs text-war-gray">
        <div>TIME REMAINING</div>
        <div>INTEL SCORE</div>
        <div>BRIEFING</div>
      </div>
      
      <div className="flex gap-2 justify-between">
        {/* Timer bar */}
        <div className="flex-grow h-8 bg-war-charcoal border border-war-gray/30 relative overflow-hidden">
          <div
            className="absolute h-full bg-war-red/40 transition-all duration-1000 ease-linear"
            style={{ width: `${timePercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-orange-500 font-bold font-mono text-lg">
            {timeLeft}s
          </div>
        </div>
        
        {/* Score */}
        <div className="h-8 px-4 bg-war-charcoal border border-war-gray/30 flex items-center justify-center">
          <span className="text-orange-500 font-bold font-mono text-lg">{score}</span>
        </div>
        
        {/* Question counter */}
        <div className="h-8 px-4 bg-war-charcoal border border-war-gray/30 flex items-center justify-center">
          <span className="text-orange-500 font-bold font-mono text-lg">{questionCount}/{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
