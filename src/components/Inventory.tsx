
import React from "react";
import { useGameContext } from "@/contexts/GameContext";
import { Item } from "@/types/type";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bomb, Rocket, Award } from "lucide-react";

interface ItemInventoryProps {
  className?: string;
}

const ItemInventory: React.FC<ItemInventoryProps> = ({ className }) => {
  const { user, activeItem, setActiveItem } = useGameContext();
  
  if (!user || user.items.length === 0) {
    return (
      <div className={cn("p-2 bg-gray-900 rounded-lg", className)}>
        <p className="text-gray-400">No items in inventory</p>
      </div>
    );
  }
  
  // Get icon for an item
  const getItemIcon = (item: Item) => {
    switch(item.id) {
      case 'bomb':
        return <Bomb className="h-5 w-5" />;
      case 'missile':
        return <Rocket className="h-5 w-5" />;
      case 'cracker':
        return <Award className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // Get color class based on item rarity
  const getRarityColorClass = (rarity: string) => {
    switch(rarity) {
      case 'common':
        return 'bg-gray-700 hover:bg-gray-600';
      case 'uncommon':
        return 'bg-green-900 hover:bg-green-800';
      case 'rare':
        return 'bg-blue-900 hover:bg-blue-800';
      case 'epic':
        return 'bg-purple-900 hover:bg-purple-800';
      case 'legendary':
        return 'bg-orange-900 hover:bg-orange-800';
      default:
        return 'bg-gray-700 hover:bg-gray-600';
    }
  };
  
  const handleItemClick = (item: Item) => {
    // Don't select items with zero quantity
    if (item.quantity <= 0) {
      return;
    }
    
    // Toggle item selection
    setActiveItem(activeItem?.id === item.id ? null : item);
  };
  
  return (
    <div className={cn("p-2 bg-gray-900 rounded-lg", className)}>
      <h3 className="text-sm font-medium mb-2 text-gray-300">Inventory</h3>
      
      <div className="flex flex-wrap gap-2">
        {user.items.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            size="sm"
            className={cn(
              "border-gray-700 hover:bg-gray-800 relative",
              activeItem?.id === item.id && "ring-2 ring-yellow-500",
              item.quantity <= 0 && "opacity-50 cursor-not-allowed"
            )}
            disabled={item.quantity <= 0}
            onClick={() => handleItemClick(item)}
            title={`${item.name}: ${item.description} (Power: ${item.effects[0]?.power || 0})`}
          >
            <div className="flex items-center gap-1">
              <span className={cn(
                "p-1 rounded-md flex items-center justify-center",
                getRarityColorClass(item.rarity)
              )}>
                {getItemIcon(item)}
              </span>
              <span>{item.name}</span>
              <span className={cn(
                "text-xs px-1 rounded",
                item.quantity <= 0 ? "bg-red-800" : "bg-gray-800"
              )}>
                {item.quantity}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ItemInventory;