type Item = {
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

type User = {
  id: string;
  name: string;
  level: number;
  experience: number;
  target: number;
  items: Item[];
}

export type { Item, User };