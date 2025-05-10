import React from "react";

interface ResultDisplayProps {
  result: string;
  isCorrect?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isCorrect }) => {
  // Determine text color based on result type
  const colorClass = isCorrect === true ? "text-green-400" : 
                     isCorrect === false ? "text-war-red" :
                     "text-war-gray";
  
  return (
    <div className="relative p-3 bg-war-dark border border-war-gray/30 mb-4">
      <div className={`font-mono ${colorClass} text-center`}>
        <div className="flex items-center justify-center gap-2">
          {isCorrect === true && <span className="text-xl">✓</span>}
          {isCorrect === false && <span className="text-xl">✗</span>}
          <span>{result}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
