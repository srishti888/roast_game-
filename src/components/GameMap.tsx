
import React, { useEffect } from "react";
import { useGameContext } from "@/contexts/GameContext";
import GameCell from "./GameCell";

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
  const { map, generateMap, selectedCell } = useGameContext();
  
  useEffect(() => {
    generateMap(width, height);
  }, [width, height]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4">
        <div className="grid gap-0" style={{ 
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        }}>
          {map.map((row, y) => 
            row.map((cell, x) => (
              <GameCell key={cell.id} cell={cell} size={cellSize} />
            ))
          )}
        </div>
      </div>
      
      {selectedCell && (
        <div className="text-sm p-2 bg-gray-800 shadow rounded">
          Selected: ({selectedCell.x}, {selectedCell.y}) - {selectedCell.type}
        </div>
      )}
    </div>
  );
};

export default GameMap;