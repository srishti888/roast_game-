import React from "react";

interface HeadlineDisplayProps {
  text: string;
}

const HeadlineDisplay: React.FC<HeadlineDisplayProps> = ({ text }) => {
  return (
    <div className="relative mb-6 p-4 bg-black/30 border border-war-gray/40">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-war-gray/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-war-gray/50 to-transparent"></div>
      
      <div className="flex items-center mb-2">
        <div className="h-3 w-3 rounded-full bg-war-orange animate-blink mr-2"></div>
        <h3 className="text-war-gray text-xs font-mono uppercase tracking-wider">Intercepted transmission</h3>
      </div>
      
      <p className="text-war-blue font-mono text-lg md:text-xl text-left leading-relaxed">{text}</p>
      
      <div className="mt-3 h-1 w-16 bg-war-gray/30"></div>
      <div className="mt-1 h-1 w-8 bg-war-gray/30"></div>
    </div>
  );
};

export default HeadlineDisplay;
