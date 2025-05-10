import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color: "red" | "green" | "gray" | "blue";
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, color }) => {
  const colorClasses = {
    red: "bg-war-red hover:bg-red-700 border-red-500/50",
    green: "bg-green-600 hover:bg-green-700 border-green-500/50",
    gray: "bg-war-gray hover:bg-war-cool-gray border-gray-500/50",
    blue: "bg-war-blue hover:bg-blue-600 border-blue-500/50"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`relative group ${colorClasses[color]} text-white px-6 py-3 rounded border transition-all transform active:scale-95`}
    >
      <span className="absolute inset-0 overflow-hidden rounded">
        <span className="absolute inset-0 opacity-0 group-hover:opacity-20 group-active:opacity-30 bg-white transition-opacity"></span>
      </span>
      
      {/* Top shine line */}
      <span className="absolute top-0 left-0 right-0 h-[1px] bg-white/20"></span>
      
      {/* Children */}
      <span className="relative z-10 flex items-center justify-center font-mono tracking-wide">
        {children}
      </span>
    </button>
  );
};

export default ActionButton;
