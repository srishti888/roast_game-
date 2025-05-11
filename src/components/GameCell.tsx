import React from "react";
import { Cell, useGameContext } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

interface GameCellProps {
  cell: Cell;
  size?: number;
  onClick?: () => void;
}

const GameCell = ({ cell, size = 40, onClick }: GameCellProps) => {
  const { selectedCell, setSelectedCell, updateCell, activeItem } = useGameContext();
  
  const isSelected = selectedCell?.id === cell.id;
  
  const handleClick = () => {
    // If an active item is selected, don't change selection
    if (!activeItem) {
      setSelectedCell(isSelected ? null : cell);
    }
    // Call parent's onClick handler if provided
    if (onClick) {
      onClick();
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Don't change cell type if it's a base or destroyed
    if (cell.type === "base" || cell.type === "destroyed") {
      return;
    }
    
    // Cycle through normal cell types on right-click
    const types = ["grass", "water", "wall", "path"];
    const currentIndex = types.indexOf(cell.type);
    const nextType = types[(currentIndex + 1) % types.length] as Cell["type"];
    
    updateCell(cell.x, cell.y, nextType);
  };
  
  // Determine cell content based on type and health
  const renderCellContent = () => {
    if (cell.type === "base") {
      // Show health indicator for bases
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-bold text-red-300">{cell.health}</div>
        </div>
      );
    }
    
    if (cell.type === "destroyed") {
      // Show ruins for destroyed bases
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs text-gray-500">×</div>
        </div>
      );
    }
    
    return null;
  };
  
  // Determine if cell is usable with active item
  const isUsableTarget = activeItem && (
    cell.type === "base" || // Always allow using items on bases
    (cell.type !== "water") // Don't allow using items on water
  );
  
  return (
    <div
      id={cell.id} // Add ID for scrolling to specific cells
      className={cn(
        "game-cell relative",
        cell.type,
        isSelected && "selected",
        activeItem && "cursor-crosshair",
        isUsableTarget && "ring-1 ring-yellow-500/50 hover:ring-yellow-400"
      )}
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      title={`Cell (${cell.x},${cell.y}) - ${cell.type}${cell.isTarget ? ' - Target' : ''}${cell.health ? ` - Health: ${cell.health}` : ''}`}
    >
      {renderCellContent()}
    </div>
  );
};

export default GameCell;