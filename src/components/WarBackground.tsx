
// import React from 'react';

// interface WarBackgroundProps {
//   children: React.ReactNode;
// }

// const WarBackground = ({ children }: WarBackgroundProps) => {
//   return (
//     <div className="min-h-screen w-full relative overflow-hidden">
//       {/* Subtle grid overlay */}
//       <div className="absolute inset-0 bg-war-texture opacity-10 pointer-events-none"></div>
      
//       {/* Vignette effect */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
//       <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/50 pointer-events-none"></div>
      
//       {/* Content */}
//       <div className="relative z-10 h-full">{children}</div>
//     </div>
//   );
// };

// export default WarBackground;
import React from "react";

interface WarBackgroundProps {
  children: React.ReactNode;
}

const WarBackground: React.FC<WarBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-war-dark relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-10 z-0"></div>
      
      {/* Radars and decorative elements */}
      <div className="absolute top-10 right-10 w-36 h-36 border-2 border-war-gray rounded-full opacity-20 flex items-center justify-center">
        <div className="w-24 h-24 border border-war-gray rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border border-war-gray rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1/2 bg-war-orange origin-top rounded-full animate-radar-scan">
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-war-orange rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute bottom-16 left-16 w-24 h-24 border border-war-gray rounded opacity-20">
        <div className="absolute inset-0 border-t-2 border-war-orange animate-blink"></div>
      </div>
      
      {/* Top status bar */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-war-charcoal z-10 flex items-center px-4 text-xs text-war-gray">
        <div className="animate-blink mr-2 w-2 h-2 rounded-full bg-war-red"></div>
        <span>SECURE INTELLIGENCE NETWORK</span>
        <div className="ml-auto flex gap-2">
          <span className="animate-pulse">●</span>
          <span>TOP SECRET</span>
        </div>
      </div>
      
      {/* Side decorative elements */}
      <div className="absolute left-0 top-6 bottom-0 w-6 bg-war-charcoal/70 z-10 flex flex-col">
        <div className="h-16 border-b border-war-gray/30 flex items-center justify-center">
          <div className="w-3 h-3 bg-war-red rounded-full animate-blink"></div>
        </div>
        <div className="flex-1 flex flex-col justify-around items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-4 h-1 bg-war-gray/40"></div>
          ))}
        </div>
      </div>
      
      <div className="absolute right-0 top-6 bottom-0 w-6 bg-war-charcoal/70 z-10 flex flex-col">
        <div className="h-16 border-b border-war-gray/30 flex items-center justify-center">
          <div className="w-3 h-3 bg-war-blue rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 flex flex-col justify-around items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-4 h-1 bg-war-gray/40"></div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 pt-6 pl-6 pr-6">
        {children}
      </div>
    </div>
  );
};

export default WarBackground;
