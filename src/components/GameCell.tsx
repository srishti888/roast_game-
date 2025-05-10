
import React from "react";
import { Cell, useGameContext } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

interface GameCellProps {
  cell: Cell;
  size?: number;
}

const GameCell = ({ cell, size = 40 }: GameCellProps) => {
  const { selectedCell, setSelectedCell, updateCell } = useGameContext();
  
  const isSelected = selectedCell?.id === cell.id;
  
  const handleClick = () => {
    setSelectedCell(isSelected ? null : cell);
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Cycle through cell types on right-click
    const types = ["grass", "water", "wall", "path"];
    const currentIndex = types.indexOf(cell.type);
    const nextType = types[(currentIndex + 1) % types.length] as Cell["type"];
    
    updateCell(cell.x, cell.y, nextType);
  };
  
  return (
    <div
      className={cn(
        "game-cell",
        cell.type,
        isSelected && "selected"
      )}
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      title={`Cell (${cell.x},${cell.y}) - ${cell.type}`}
    />
  );
};

export default GameCell;