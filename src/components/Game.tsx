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

import { User } from "@/types/type";

interface GameProps {
  user: User | null;
}

const Game = ({user}: GameProps) => {
  const [mapSize, setMapSize] = useState({ width: 15, height: 10 });
  const [cellSize, setCellSize] = useState(40);
  
  const handleRegenerate = () => {
    // Force re-rendering of the map with the same dimensions
    setMapSize({ ...mapSize });
  };
  
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
    <GameProvider>
      <Card className="w-full shadow-xl border-gray-800 bg-gray-950">
        <CardHeader>
          <CardTitle>2D Game Map</CardTitle>
          <CardDescription>
            Click on a cell to select it. Right-click to change cell type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Map Size:</span>
              <Select onValueChange={handleSizeChange} defaultValue="medium">
                <SelectTrigger className="w-24 bg-gray-900">
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
            
            <Button onClick={handleRegenerate} variant="outline" className="border-gray-700 hover:bg-gray-800">
              Regenerate Map
            </Button>
            
            <div className="ml-auto flex gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[hsl(var(--cell-grass))]"></div>
                <span className="text-xs">Grass</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[hsl(var(--cell-water))]"></div>
                <span className="text-xs">Water</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[hsl(var(--cell-wall))]"></div>
                <span className="text-xs">Wall</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[hsl(var(--cell-path))]"></div>
                <span className="text-xs">Path</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-auto">
            <GameMap 
              width={mapSize.width}
              height={mapSize.height}
              cellSize={cellSize}
            />
          </div>
        </CardContent>
      </Card>
    </GameProvider>
  );
};

export default Game;