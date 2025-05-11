import React, { useEffect } from "react";
import { useGameContext, Cell } from "@/contexts/GameContext";
import GameCell from "./GameCell"; // Assuming Cell type is in a types file - adjust if necessary
import { Target, Shield, Crosshair, MapPin, Star, Sparkles } from "lucide-react";

interface GameMapProps {
  width?: number;
  height?: number;
  cellSize?: number;
}

const GameMap = ({ 
  width = 15, 
  height = 10,
  cellSize = 40
}: GameMapProps) => {
  const { 
    map, 
    generateMap, 
    selectedCell, 
    activeItem, 
    applyItemToCell, // Renamed from useItemOnCell to avoid hook naming confusion
    remainingTargets,
    isGameComplete
  } = useGameContext();
  
  // Fix the infinite loop by using a proper dependency array
  useEffect(() => {
    // Only generate the map once when the component mounts
    // or when width/height explicitly changes
    generateMap(width, height);
  }, [width, height]); // Remove generateMap from dependencies to prevent loop
  // Use proper typing for the cell parameter
  const handleCellClick = (cell: Cell) => {
    if (activeItem) {
      applyItemToCell(activeItem, cell);
    }
  };

  




  
  return (
    <div className="flex flex-col items-center w-full max-w-full">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.7)] w-full border-2 border-gray-700/50 animate-fade-in">
        {/* Map glow effect */}
        <div className="absolute inset-0 bg-red-500/5 rounded-xl blur-xl"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-900/30 via-yellow-900/20 to-red-900/30 rounded-xl blur-md opacity-70"></div>
        
        <div className="relative flex items-center justify-center">
          {/* Top radar ping animation */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 flex items-center justify-center">
            <span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          </div>
          
          {/* HUD elements */}
          <div className="absolute -top-1 -right-1 bg-red-950/90 px-3 py-1 text-xs text-red-300 rounded-md border border-red-800/70 flex items-center gap-1.5 shadow-lg">
            <Crosshair className="w-3.5 h-3.5" />
            <span className="font-mono tracking-wider">TACTICAL VIEW</span>
          </div>
          
          <div className="absolute -top-1 -left-1 bg-gray-950/90 px-3 py-1 text-xs text-gray-300 rounded-md border border-gray-700/70 flex items-center gap-1.5 shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="font-mono tracking-wider">{width}x{height}</span>
          </div>
          
          {/* Grid border glow */}
          <div className="absolute inset-0 border-2 border-red-800/10 rounded-lg blur-sm"></div>
          
          {/* Actual grid */}
          <div className="grid gap-0.5 mx-auto relative z-10" style={{ 
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
            boxShadow: "0 0 40px rgba(200, 0, 0, 0.1)"
          }}>
            {map.map((row, y) => 
              row.map((cell, x) => (
                <GameCell 
                  key={cell.id} 
                  cell={cell} 
                  size={cellSize} 
                  onClick={() => handleCellClick(cell)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="text-sm p-3.5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shadow-md rounded-lg w-full border border-gray-700/50 mt-3.5 backdrop-blur-sm">
        {activeItem ? (
          <span className="text-white font-medium flex items-center justify-center gap-2">
            <span className="px-2.5 py-1.5 bg-gray-900 rounded text-yellow-300 border border-yellow-900/50 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              <span>Selected Weapon: {activeItem.name}</span>
            </span>
            <span className="text-gray-300">({activeItem.quantity} remaining)</span>
            <span className="text-xs text-gray-400 italic">- Click on target to deploy</span>
          </span>
        ) : selectedCell ? (
          <span className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-1.5 bg-gray-900 rounded border border-gray-700/50">{selectedCell.type.charAt(0).toUpperCase() + selectedCell.type.slice(1)}</span>
            <span className="text-gray-400">Coordinates: ({selectedCell.x}, {selectedCell.y})</span>
            {selectedCell.isTarget && <span className="text-red-400 font-medium flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Enemy Stronghold</span>}
            {selectedCell.health ? <span className="text-green-400 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Integrity: {selectedCell.health}</span> : ''}
          </span>
        ) : (
          <span className="text-gray-400 italic">Select terrain or deploy weapon</span>
        )}
      </div>
      
      {remainingTargets > 0 && (
        <div className="mt-2.5 text-sm p-3 bg-gradient-to-r from-red-950/70 to-red-900/50 shadow-md rounded-lg w-full border border-red-900/40 animate-pulse">
          <span className="text-red-400 font-bold flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            <span>Enemy Strongholds Remaining: {remainingTargets}</span>
            <Target className="w-4 h-4" />
          </span>
        </div>
      )}
      
      {isGameComplete && (
        <div className="p-3.5 mt-2.5 rounded-lg bg-gradient-to-r from-green-900/60 to-emerald-900/50 border-2 border-green-500/40 flex items-center gap-3 animate-pulse w-full justify-center">
          <Target className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-300 font-bold text-lg">MISSION ACCOMPLISHED! All enemy strongholds neutralized!</span>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      )}
    </div>
  );
};

export default GameMap;