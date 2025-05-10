import { Item } from '@/types/type';

export const availableItems: Item[] = [
    {
      id: 'bomb',
      name: 'Bomb',
      description: 'A basic explosive',
      quantity: 5,
      rarity: 'common',
      type: 'weapon',
      value: 10,
      imageUrl: '/bomb.svg',
      effects: [{ name: 'Blast', description: 'Damages all nearby targets', power: 5 }]
    },
    {
      id: 'missile',
      name: 'Missile',
      description: 'Guided projectile',
      quantity: 3,
      rarity: 'uncommon',
      type: 'weapon',
      value: 20,
      imageUrl: '/missile.svg',
      effects: [{ name: 'Direct Hit', description: 'High damage to a single target', power: 8 }]
    },
    {
      id: 'cracker',
      name: 'Cracker',
      description: 'Small explosive with distracting effect',
      quantity: 10,
      rarity: 'common',
      type: 'consumable',
      value: 5,
      imageUrl: '/cracker.svg',
      effects: [{ name: 'Distraction', description: 'Temporarily confuses enemies', power: 3 }]
    }
  ];