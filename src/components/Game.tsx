import React, { useState } from "react";
import { GameProvider } from "@/contexts/GameContext";
import GameMap from "./GameMap";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ItemInventory from "./Inventory";
import { defaultItems } from "@/data/items";
import { User } from "@/types/type";
import { Map, Crosshair, Target, Shield } from "lucide-react";

// Default user data
const defaultUser = {
  id: "user-1",
  name: "Player 1",
  level: 1,
  experience: 0,
  target: 100,
  items: defaultItems
};

interface GameProps {
  User: User | null;
}

const Game = ({User}: GameProps) => {
  const [mapSize, setMapSize] = useState({ width: 15, height: 10 });
  const [cellSize, setCellSize] = useState(40);
  const [user] = useState(User || defaultUser);
  
  const handleSizeChange = (value: string) => {
    switch (value) {
      case "small":
        setMapSize({ width: 10, height: 8 });
        setCellSize(50);
        break;
      case "medium":
        setMapSize({ width: 15, height: 10 });
        setCellSize(40);
        break;
      case "large":
        setMapSize({ width: 20, height: 15 });
        setCellSize(30);
        break;
      case "xlarge":
        setMapSize({ width: 30, height: 20 });
        setCellSize(24);
        break;
    }
  };
  
  return (
    <GameProvider initialUser={user}>
      <div className="h-full flex flex-col md:flex-row overflow-hidden bg-gray-950">
        {/* Left sidebar - Command Panel */}
        <div className="w-full md:w-72 lg:w-80 flex flex-col bg-gray-900/50 border-r border-gray-800 overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-100">Command Center</h2>
            </div>
            <p className="text-xs text-gray-400">Strategic operations & intelligence</p>
          </div>
          
          {/* <div className="p-3 border-b border-gray-800/50">
            <UserProfile />
          </div> */}
          
          <div className="p-3 flex flex-col gap-2 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Battlefield Size:</span>
              <Select onValueChange={handleSizeChange} defaultValue="medium">
                <SelectTrigger className="w-28 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">X-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-1 mt-1 bg-gray-800/70 p-1.5 rounded-md">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-[hsl(var(--cell-grass))]"></div>
                <span className="text-[10px]">Grass</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-[hsl(var(--cell-water))]"></div>
                <span className="text-[10px]">Water</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-[hsl(var(--cell-wall))]"></div>
                <span className="text-[10px]">Wall</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-[hsl(var(--cell-path))]"></div>
                <span className="text-[10px]">Path</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-gradient-to-br from-red-800 to-red-900"></div>
                <span className="text-[10px]">Enemy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-gray-700"></div>
                <span className="text-[10px]">Destroyed</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden p-3">
            <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Weapons Arsenal
            </h3>
            <ItemInventory className="h-full overflow-hidden" />
          </div>
        </div>
        
        {/* Main map area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 bg-gradient-to-r from-red-950/30 to-gray-900 border-b border-gray-800 flex items-center">
            <div className="flex items-center gap-2 text-red-400">
              <Crosshair className="w-4 h-4" />
              <span className="text-sm font-medium">TACTICAL VIEW</span>
            </div>
            <div className="ml-auto text-xs text-gray-400">
              <span className="animate-pulse">● </span>LIVE FEED
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-gray-900/20 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center p-4">
              <GameMap 
                width={mapSize.width}
                height={mapSize.height}
                cellSize={cellSize}
              />
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default Game;