
import React from 'react';

interface WarBackgroundProps {
  children: React.ReactNode;
}

const WarBackground = ({ children }: WarBackgroundProps) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-war-texture opacity-10 pointer-events-none"></div>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/50 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default WarBackground;
