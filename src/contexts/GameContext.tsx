import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, Item } from "@/types/type";
import { defaultItems } from "@/data/items";

export type CellType = "grass" | "water" | "wall" | "path" | "base" | "destroyed";

export interface Cell {
  id: string;
  type: CellType;
  x: number;
  y: number;
  health?: number;
  isTarget?: boolean;
}

export interface Effect {
  name: string;
  description: string;
  power: number;
}

interface GameContextType {
  map: Cell[][];
  selectedCell: Cell | null;
  activeItem: Item | null;
  setActiveItem: (item: Item | null) => void;
  user: User | null;
  setUser: (user: User) => void;
  setSelectedCell: (cell: Cell | null) => void;
  updateCell: (x: number, y: number, type: CellType) => void;
  generateMap: (width: number, height: number) => void;
  deployItemOnCell: (item: Item, cell: Cell) => void;
  applyItemToCell: (item: Item, cell: Cell) => void;
  remainingTargets: number;
  isGameComplete: boolean;
  resetGame: () => void;
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
  initialUser?: User;
}

const defaultUser: User = {
  id: "user-1",
  name: "Player",
  level: 1,
  experience: 0,
  target: 10,
  items: defaultItems.map(item => ({ ...item, quantity: item.quantity || 1 })) // Ensure default items have quantity
};

export const GameProvider = ({ children, initialUser }: GameProviderProps) => {
  const [map, setMap] = useState<Cell[][]>(() => {
    const storedMap = localStorage.getItem('gameMap');
    if (storedMap) {
      try {
        const parsedMap = JSON.parse(storedMap);
        // Update remaining targets for the loaded map
        const targetCount = parsedMap.flat().filter((cell: Cell) => 
          cell.type === "base" && cell.health > 0
        ).length;
        setTimeout(() => {
          setRemainingTargets(targetCount);
          setIsGameComplete(targetCount === 0);
        }, 0);
        return parsedMap;
      } catch (error) {
        console.error("Failed to parse map from localStorage", error);
        return [];
      }
    }
    return [];
  });
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [user, setUserState] = useState<User>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const sanitizedItems = parsedUser.items?.map((item: Item) => ({
          ...item,
          quantity: typeof item.quantity === 'number' ? item.quantity : 1, // Ensure quantity is a number
        })) || [];
        return { ...parsedUser, items: sanitizedItems };
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        return initialUser || defaultUser;
      }
    }
    return initialUser || defaultUser;
  });
  const [remainingTargets, setRemainingTargets] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const { toast } = useToast();

  const setUser = useCallback((updatedUser: User | ((prevUser: User) => User)) => {
    setUserState(prevUser => {
      const newUser = typeof updatedUser === 'function' ? updatedUser(prevUser) : updatedUser;
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const getMapSize = useCallback((level: number) => {
    const baseWidth = 10;
    const baseHeight = 8;
    const widthIncrease = Math.floor(level / 3) * 2;
    const heightIncrease = Math.floor(level / 3) * 2;
    return {
      width: baseWidth + widthIncrease,
      height: baseHeight + heightIncrease
    };
  }, []);

  const generateMap = useCallback((width: number, height: number) => {
    // Check if we should really generate a new map
    if (map.length > 0 && !isGameComplete) {
      // If we have an existing map and it's not complete, don't generate a new one
      return;
    }

    const newMap: Cell[][] = [];
    let targetCount = 0;
    const numBases = Math.max(5, Math.min(user.level * 2, 15));

    for (let y = 0; y < height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < width; x++) {
        // Simplified cell generation for brevity, retain original logic here
        row.push({ id: `${x}-${y}`, type: "grass", x, y, health: 100 });
      }
      newMap.push(row);
    }

    let basesPlaced = 0;
    while (basesPlaced < numBases) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (newMap[y][x].type !== "water" && newMap[y][x].type !== "base") {
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
        // Base health from distance and level
        const baseHealth = 1 + Math.floor((distanceFromCenter / maxDistance) * 10) + user.level * 3;
        // Add randomness: ±20% variation
        const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
        const health = Math.max(1, Math.floor(baseHealth * randomFactor));
        newMap[y][x] = { ...newMap[y][x], type: "base", health, isTarget: true };
        targetCount++;
        basesPlaced++;
      }
    }
    setMap(newMap);
    setRemainingTargets(targetCount);
    setIsGameComplete(false);
    localStorage.setItem('gameMap', JSON.stringify(newMap));
  }, [user.level, map.length, isGameComplete]); // user.level, map.length, and isGameComplete are dependencies

  useEffect(() => {
    // Only generate a new map if there isn't one stored
    if (map.length === 0) {
      const { width, height } = getMapSize(user.level);
      generateMap(width, height);
    } else {
      // If we have a stored map, make sure the remaining targets count is correct
      const targetCount = map.flat().filter(cell => cell.type === "base" && cell.health > 0).length;
      setRemainingTargets(targetCount);
      setIsGameComplete(targetCount === 0);
    }
  }, []); // Empty dependency array means this only runs once on mount

  // Save map to localStorage whenever it changes
  useEffect(() => {
    if (map.length > 0) {
      localStorage.setItem('gameMap', JSON.stringify(map));
      // Update remaining targets whenever map changes
      const targetCount = map.flat().filter(cell => cell.type === "base" && cell.health > 0).length;
      setRemainingTargets(targetCount);
    }
  }, [map]);

  // Add new effect for level progression
  useEffect(() => {
    if (isGameComplete) {
      const { width, height } = getMapSize(user.level);
      // Wait a bit before generating the new map
      const timer = setTimeout(() => {
        generateMap(width, height);
      }, 1500); // 1.5 seconds delay
      return () => clearTimeout(timer);
    }
  }, [isGameComplete, user.level, getMapSize, generateMap]);

  const updateCell = (x: number, y: number, type: CellType) => {
    setMap(prevMap =>
      prevMap.map((row, rowIndex) =>
        rowIndex === y
          ? row.map((cell, colIndex) =>
              colIndex === x ? { ...cell, type } : cell
            )
          : row
      )
    );
  };

  const applyItemToCell = useCallback((item: Item, cell: Cell) => {
    // Placeholder for actual item application logic
    console.log(`Applying ${item.name} to cell ${cell.id}`);
    // This function should contain the logic from the old useItemOnCell related to effects, damage, etc.
    // For now, it just logs and shows a toast.
    toast({
      title: "Item Applied (Placeholder)",
      description: `${item.name} was applied to ${cell.type} at (${cell.x}, ${cell.y}).`,
    });
  }, [toast]);

  // Modified deployItemOnCell callback
  const deployItemOnCell = useCallback((item: Item, cell: Cell) => {
    if (item.quantity <= 0) {
      toast({
        title: "Out of Stock!",
        description: `You have no ${item.name} left.`,
        variant: "destructive",
      });
      setActiveItem(null);
      return;
    }    let effectRadius = 0;
    let damage = 0;
    let targetsDestroyedThisTurn = 0;
    let anyBaseDamaged = false;

    // Calculate damage based on item type and value
    if (item.type === 'weapon' || item.id === 'cracker') {
      damage = item.value;
      // Special case for crackers - they're explosives, so they affect neighboring cells
      if (item.id === 'cracker') {
        effectRadius = 1;
      }
    }
    
    // Epic items have an area effect
    if (item.rarity === 'epic') {
      effectRadius = Math.max(effectRadius, 1);
    }

    const newMap = map.map(row => row.map(c => ({ ...c })));

    // Apply damage to target and surrounding cells if in radius
    for (let y = Math.max(0, cell.y - effectRadius); y <= Math.min(map.length - 1, cell.y + effectRadius); y++) {
      for (let x = Math.max(0, cell.x - effectRadius); x <= Math.min(map[0].length - 1, cell.x + effectRadius); x++) {
        const currentCell = newMap[y][x];        if (currentCell.type === "base" && currentCell.health && currentCell.health > 0) {
          // For crackers and weapons, apply full damage, scaled by distance from center
          const distanceFromCenter = Math.abs(x - cell.x) + Math.abs(y - cell.y);
          const distanceMultiplier = distanceFromCenter === 0 ? 1 : 0.5; // Half damage for adjacent cells
          const calculatedDamage = Math.floor(damage * distanceMultiplier);
          
          // Apply the damage, but don't exceed current health
          const actualDamage = Math.min(calculatedDamage, currentCell.health);
          currentCell.health -= actualDamage;
          anyBaseDamaged = true;
          
          if (currentCell.health <= 0) {
            currentCell.health = 0;
            currentCell.type = "destroyed";
            currentCell.isTarget = false;
            targetsDestroyedThisTurn++;
          }
        }
      }
    }

    setMap(newMap);
    localStorage.setItem('gameMap', JSON.stringify(newMap));
    setRemainingTargets(prev => Math.max(0, prev - targetsDestroyedThisTurn));

    if (anyBaseDamaged) {
      setUser(prevUser => {
        const updatedItems = prevUser.items
          .map(i => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter(i => i.quantity > 0);
        return { ...prevUser, items: updatedItems };
      });
      toast({
        title: `${item.name} Used!`,
        description: `Successfully used ${item.name}. Target health reduced!`,
      });
    } else {
      toast({
        title: "No Effect!",
        description: `${item.name} had no effect on this cell.`,
      });
    }
    setActiveItem(null);    if (remainingTargets - targetsDestroyedThisTurn <= 0 && newMap.flat().every(c => c.type !== 'base' || c.health === 0)) {
      setIsGameComplete(true);
      
      setUser(prevUser => ({
        ...prevUser,
        level: prevUser.level + 1,
        experience: prevUser.experience + 100
      }));

      toast({ 
        title: "Level Up!", 
        description: "Mission accomplished! Advancing to the next level..." 
      });
    }
  }, [map, toast, setUser, remainingTargets]);

  const resetGame = useCallback(() => {
    const { width, height } = getMapSize(user.level);
    generateMap(width, height);
    setSelectedCell(null);
    setActiveItem(null);
    setIsGameComplete(false);
    // Optionally reset user items/level here if needed for a full game reset
  }, [user.level, getMapSize, generateMap]);

  return (
    <GameContext.Provider 
      value={{
        map, 
        selectedCell, 
        setSelectedCell, 
        updateCell, 
        generateMap, 
        activeItem, 
        setActiveItem,
        user,
        setUser,
        deployItemOnCell,
        applyItemToCell, // Added applyItemToCell
        remainingTargets,
        isGameComplete,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};