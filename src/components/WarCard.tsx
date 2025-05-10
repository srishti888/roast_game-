import React from "react";

interface WarCardProps {
  children: React.ReactNode;
  glowing?: boolean;
}

const WarCard: React.FC<WarCardProps> = ({ children, glowing = false }) => {
  return (
    <div className={`relative p-1 ${glowing ? 'animate-pulse' : ''}`}>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500 opacity-80"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500 opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500 opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500 opacity-80"></div>
      
      <div className="bg-war-charcoal/90 border border-war-gray/30 backdrop-blur-sm p-4 rounded-sm">
        {/* Top card header accent */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[1px] bg-war-blue px-8 py-0.5 text-xs font-mono text-war-dark rounded-b-sm">
          INTEL ANALYSIS
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default WarCard;
