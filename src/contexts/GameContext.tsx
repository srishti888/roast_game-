
import React, { createContext, useContext, useState, ReactNode } from "react";

export type CellType = "grass" | "water" | "wall" | "path";

export interface Cell {
  id: string;
  type: CellType;
  x: number;
  y: number;
}

interface GameContextType {
  map: Cell[][];
  selectedCell: Cell | null;
  setSelectedCell: (cell: Cell | null) => void;
  updateCell: (x: number, y: number, type: CellType) => void;
  generateMap: (width: number, height: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [map, setMap] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const generateMap = (width: number, height: number) => {
    const types: CellType[] = ["grass", "water", "wall", "path"];
    const newMap: Cell[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < width; x++) {
        // Default most cells to grass, with occasional other types
        let type: CellType = "grass";
        
        // Simple map generation logic - can be improved later
        const random = Math.random();
        if (random > 0.8) {
          type = random > 0.93 ? "water" : random > 0.87 ? "wall" : "path";
        }
        
        row.push({
          id: `cell-${x}-${y}`,
          type,
          x,
          y,
        });
      }
      newMap.push(row);
    }
    
    setMap(newMap);
  };

  const updateCell = (x: number, y: number, type: CellType) => {
    setMap(prevMap => {
      const newMap = [...prevMap];
      if (newMap[y] && newMap[y][x]) {
        newMap[y] = [...newMap[y]];
        newMap[y][x] = { ...newMap[y][x], type };
      }
      return newMap;
    });
  };

  return (
    <GameContext.Provider value={{ map, selectedCell, setSelectedCell, updateCell, generateMap }}>
      {children}
    </GameContext.Provider>
  );
};