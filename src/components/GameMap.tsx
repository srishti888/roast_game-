import React, { useEffect } from "react";
import { useGameContext, Cell } from "@/contexts/GameContext";
import GameCell from "./GameCell";
import { Target, Shield, Crosshair, MapPin, Star, Sparkles } from "lucide-react";
import GameSounds from "./GameSounds";
import { useGameSounds } from "@/hooks/use-game-sounds";

interface GameMapProps {
  width?: number;
  height?: number;
  cellSize?: number;
}

const GameMap = ({ 
  width = 10, 
  height = 7,
  cellSize = 52
}: GameMapProps) => {  const { 
    map, 
    generateMap, 
    selectedCell, 
    activeItem, 
    deployItemOnCell,
    remainingTargets,
    isGameComplete,
    mapLevel,
    user
  } = useGameContext();

  const sounds = useGameSounds();
  // Play intro sound and generate map
  useEffect(() => {
    if (!map || map.length === 0 || map[0].length !== width || map.length !== height) {
      generateMap(width, height);
    }
  }, [width, height, generateMap, map]);
  
  // Play intro sound only once when component mounts
  useEffect(() => {
    sounds.playTacticalNuke();
    // Empty dependency array ensures this only runs once on mount
  }, []);
  // Handle cell click with sound effects
  const handleCellClick = React.useCallback((cell: Cell) => {
    if (activeItem) {
      if (cell.type === 'base') {
        sounds.superExplosion();
      } else {
        sounds.playAlarmDanger();
      }
      deployItemOnCell(activeItem, cell);
    }
  }, [activeItem, deployItemOnCell, sounds]);

  // Play victory sound when map is cleared
  useEffect(() => {
    if (isGameComplete) {
      sounds.playWarioWon();
    }
  }, [isGameComplete, sounds]);

  return (
    <div className="flex flex-col items-center w-full max-w-full">
      <GameSounds />      <div className="relative p-6 rounded-xl w-full border-2 animate-fade-in bg-gray-950/50">
        {/* Map glow effect */}
        <div className="absolute inset-0 rounded-xl blur-xl"></div>
        <div className="absolute -inset-0.5 bg-gray-900 rounded-xl blur-md opacity-70"></div>
        
        <div className="relative flex items-center justify-center min-h-[440px]">
          {/* Top radar ping animation */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 flex items-center justify-center">
            <span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          </div>
          
          {/* HUD elements */}
          <div className="absolute -top-1 -right-1 bg-red-950/90 px-3 py-1 text-xs text-red-300 rounded-md border border-red-800/70 flex items-center gap-1.5 shadow-lg">
            <Crosshair className="w-3.5 h-3.5" />
            <span className="font-mono tracking-wider">
              MAP LVL {mapLevel} • CMD LVL {user?.level || 1}
            </span>
          </div>
            <div className="absolute -top-1 -left-1 bg-gray-950/90 px-3 py-1 text-xs text-gray-300 rounded-md border border-gray-700/70 flex items-center gap-1.5 shadow-lg">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="font-mono tracking-wider flex gap-2">
              <span>{width}x{height}</span>
              <span className="text-red-400">Map Level: {mapLevel}</span>
            </span>
          </div>
            {/* Grid border glow */}
          <div className="absolute inset-0 border-2 border-red-800/10 rounded-lg blur-sm"></div>
          
          {/* Actual grid */}
          <div 
            className="grid gap-0.5 mx-auto relative z-10 mt-16" 
            style={{ 
              gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
              boxShadow: "0 0 40px rgba(200, 0, 0, 0.1)",
              maxHeight: `calc(${height} * ${cellSize}px + ${height - 1} * 0.125rem)`,
              maxWidth: `calc(${width} * ${cellSize}px + ${width - 1} * 0.125rem)`
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