import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
  useItemOnCell: (item: Item, cell: Cell) => void;
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
  target: 100,
  items: defaultItems
};

export const GameProvider = ({ children, initialUser }: GameProviderProps) => {
  const [map, setMap] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [user, setUser] = useState<User>(initialUser || defaultUser);
  const [remainingTargets, setRemainingTargets] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const { toast } = useToast();

  // Calculate map size based on user level
  const getMapSize = (level: number) => {
    const baseWidth = 10;
    const baseHeight = 8;
    
    // Every 3 levels, increase map size
    const widthIncrease = Math.floor(level / 3) * 2;
    const heightIncrease = Math.floor(level / 3) * 2;
    
    return {
      width: baseWidth + widthIncrease,
      height: baseHeight + heightIncrease
    };
  };

  const generateMap = (width: number, height: number) => {
    const newMap: Cell[][] = [];
    let targetCount = 0;
    
    // Number of bases to place (scales with level)
    // Increase the minimum number of bases to add more challenge
    const numBases = Math.max(5, Math.min(user.level * 2, 15));
    
    // Create the grid
    for (let y = 0; y < height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < width; x++) {
        // Default most cells to grass, with occasional other types
        let type: CellType = "grass";
        const health = 0;
        const isTarget = false;
        
        // Simple map generation logic
        const random = Math.random();
        if (random > 0.8) {
          type = random > 0.93 ? "water" : random > 0.87 ? "wall" : "path";
        }
        
        // Cell properties
        row.push({
          id: `cell-${x}-${y}`,
          type,
          x,
          y,
          health,
          isTarget
        });
      }
      newMap.push(row);
    }
    
    // Add bases (randomly)
    let basesPlaced = 0;
    while (basesPlaced < numBases) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      
      // Don't place bases on water or existing bases
      if (newMap[y][x].type !== "water" && newMap[y][x].type !== "base") {
        // Make bases have varying health based on their position and level
        // Bases further from the center are stronger
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const baseHealth = 10 + Math.floor(distanceFromCenter) + Math.floor(user.level / 2);
        
        newMap[y][x] = {
          ...newMap[y][x],
          type: "base",
          health: baseHealth,
          isTarget: true
        };
        basesPlaced++;
        targetCount++;
      }
    }
    
    setMap(newMap);
    setRemainingTargets(targetCount);
    setIsGameComplete(false);
  };

  const updateCell = (x: number, y: number, type: CellType) => {
    setMap(prevMap => {
      const newMap = [...prevMap];
      if (newMap[y] && newMap[y][x]) {
        newMap[y] = [...newMap[y]];
        
        const oldCell = newMap[y][x];
        const wasTarget = oldCell.isTarget;
        
        newMap[y][x] = { 
          ...oldCell, 
          type, 
          isTarget: type === "base" ? true : false 
        };
        
        // Update target count if needed
        if (wasTarget && type !== "base") {
          setRemainingTargets(prev => prev - 1);
        } else if (!wasTarget && type === "base") {
          setRemainingTargets(prev => prev + 1);
        }
      }
      return newMap;
    });
  };

  // Find the next available enemy base
  const findNextEnemyBase = (): Cell | null => {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const cell = map[y][x];
        if (cell.type === "base" && cell.isTarget) {
          return cell;
        }
      }
    }
    return null;
  };

  // Move to next enemy base
  const moveToNextBase = () => {
    const nextBase = findNextEnemyBase();
    if (nextBase) {
      setSelectedCell(nextBase);
      
      // Scroll to the next base if it's in a large map
      setTimeout(() => {
        const baseElement = document.getElementById(`cell-${nextBase.x}-${nextBase.y}`);
        if (baseElement) {
          baseElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 300);
      
      toast({
        title: "Next Target",
        description: `Move to next enemy base at (${nextBase.x}, ${nextBase.y})`,
        variant: "default"
      });
    }
  };
  
  // Use item on a cell
  const useItemOnCell = (item: Item, cell: Cell) => {
    // Check if item quantity is valid
    if (item.quantity <= 0) {
      toast({
        title: "Item Unavailable",
        description: `You don't have any ${item.name}s left.`,
        variant: "destructive"
      });
      return;
    }

    // Apply item effects based on type
    let effectRadius = 0;
    let damage = 0;
    
    switch(item.id) {
      case 'bomb':
        effectRadius = 1;  // Affects all 8 surrounding cells
        damage = item.effects[0].power;
        break;
      case 'missile':
        effectRadius = 0;  // Only affects target cell
        damage = item.effects[0].power;
        break;
      case 'cracker':
        effectRadius = 2;  // Larger area but less damage
        damage = item.effects[0].power;
        break;
      default:
        effectRadius = 0;
        damage = 1;
    }

    // Apply damage to target cell and surrounding cells if applicable
    const newMap = [...map];
    let targetsDestroyed = 0;
    let anyBaseDamaged = false;
    
    for (let y = Math.max(0, cell.y - effectRadius); y <= Math.min(map.length - 1, cell.y + effectRadius); y++) {
      for (let x = Math.max(0, cell.x - effectRadius); x <= Math.min(map[0].length - 1, cell.x + effectRadius); x++) {
        const targetCell = newMap[y][x];
        
        // Skip water cells (can't be damaged)
        if (targetCell.type === "water") continue;
        
        // Calculate damage (full damage on direct hit, reduced for area effects)
        let cellDamage = damage;
        if (x !== cell.x || y !== cell.y) {
          // Reduce damage for surrounding cells
          const distance = Math.sqrt(Math.pow(x - cell.x, 2) + Math.pow(y - cell.y, 2));
          cellDamage = Math.max(1, Math.floor(damage / distance));
        }
        
        // Apply damage ONLY to base cells
        if (targetCell.type === "base") {
          const newHealth = (targetCell.health || 0) - cellDamage;
          anyBaseDamaged = true;
          
          if (newHealth <= 0) {
            // Base destroyed
            newMap[y][x] = {
              ...targetCell,
              type: "destroyed",
              health: 0,
              isTarget: false
            };
            targetsDestroyed++;
          } else {
            // Base damaged
            newMap[y][x] = {
              ...targetCell,
              health: newHealth
            };
          }
        }
        // Do NOT modify non-base cells - remove visual effect application
        // This means we're keeping regular terrain unchanged
      }
    }
    
    // Update the map
    setMap(newMap);
    
    // Only decrease item quantity if we actually damaged or destroyed bases
    if (anyBaseDamaged) {
      // Decrease item quantity
      const updatedUser = {
        ...user,
        items: user.items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity - 1 } 
            : i
        )
      };
      setUser(updatedUser);
      
      // Update remaining targets
      if (targetsDestroyed > 0) {
        const newRemainingTargets = remainingTargets - targetsDestroyed;
        setRemainingTargets(newRemainingTargets);
        
        // Check if all targets are destroyed
        if (newRemainingTargets <= 0) {
          setIsGameComplete(true);
          
          // Award experience
          const expGained = 50 * user.level;
          const updatedUserWithExp = {
            ...updatedUser,
            experience: updatedUser.experience + expGained
          };
          
          // Level up if reached target
          if (updatedUserWithExp.experience >= updatedUserWithExp.target) {
            updatedUserWithExp.level += 1;
            updatedUserWithExp.experience -= updatedUserWithExp.target;
            updatedUserWithExp.target = Math.floor(updatedUserWithExp.target * 1.5);
            
            toast({
              title: "Level Up!",
              description: `You've reached level ${updatedUserWithExp.level}!`,
              variant: "default"
            });
          }
          
          setUser(updatedUserWithExp);
          
          // Show completion message
          toast({
            title: "Victory!",
            description: `All enemy bases destroyed! +${expGained} XP`,
            variant: "default"
          });
        } else {
          // Show base destroyed message
          toast({
            title: "Base Destroyed!",
            description: `${targetsDestroyed} base(s) destroyed. ${newRemainingTargets} remaining.`,
            variant: "default"
          });
          
          // Move to next enemy base after short delay
          setTimeout(() => {
            moveToNextBase();
            
            // Remove enemy repositioning - comment out or remove this line
            // rearrangeEnemies();
          }, 1000);
        }
      }
    } else {
      toast({
        title: "Miss!",
        description: `No enemy bases were damaged.`,
        variant: "default"
      });
    }
  };

  // Rearrange enemy bases to new positions
  const rearrangeEnemies = () => {
    setMap(prevMap => {
      const newMap = JSON.parse(JSON.stringify(prevMap));
      const width = newMap[0].length;
      const height = newMap.length;
      
      // Collect all enemy bases
      const enemyBases: Cell[] = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (newMap[y][x].type === "base" && newMap[y][x].isTarget) {
            enemyBases.push({...newMap[y][x]});
            // Clear the original base position
            newMap[y][x] = {
              ...newMap[y][x],
              type: "path",
              health: 0,
              isTarget: false
            };
          }
        }
      }
      
      // Randomly place bases in new positions
      for (const base of enemyBases) {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 50) {
          const x = Math.floor(Math.random() * width);
          const y = Math.floor(Math.random() * height);
          
          // Don't place on water, walls, or existing bases
          if (newMap[y][x].type !== "water" && 
              newMap[y][x].type !== "wall" &&
              newMap[y][x].type !== "base" &&
              newMap[y][x].type !== "destroyed") {
            // Place the base at the new position
            newMap[y][x] = {
              ...newMap[y][x],
              type: "base",
              health: base.health,
              isTarget: true
            };
            placed = true;
          }
          attempts++;
        }
      }
      
      // Toast notification about the rearrangement
      toast({
        title: "Enemy Movement!",
        description: "Enemy bases have changed positions!",
        variant: "default"
      });
      
      return newMap;
    });
  };

  // Reset the game
  const resetGame = () => {
    const { width, height } = getMapSize(user.level);
    generateMap(width, height);
    setSelectedCell(null);
    setActiveItem(null);
    setIsGameComplete(false);
  };

  // Initialize map when user level changes
  useEffect(() => {
    const { width, height } = getMapSize(user.level);
    generateMap(width, height);
  }, [user.level]);

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
        useItemOnCell,
        remainingTargets,
        isGameComplete,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};