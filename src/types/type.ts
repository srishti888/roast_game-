export type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'collectible';
  value: number;
  imageUrl?: string;
  effects?: {
    name: string;
    description: string;
    power: number;
  }[];
};

export type User = {
  id: string;
  name: string;
  level: number;      // This is now the command/user level
  mapLevel: number;   // Added mapLevel property
  experience: number;
  target: number;
  items: Item[];
}