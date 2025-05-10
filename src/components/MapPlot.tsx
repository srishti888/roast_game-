import React from 'react';
import { User } from '@/types/type';


interface MapPlotProps {
  user: User | null;
  // Define any props you need here
}

export default function MapPlot({user}: MapPlotProps) {

  
  return (
    <div className="relative w-full h-full">
      <img
        src="/images/map.png"
        alt="Map"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Map Plot</h1>
      </div>
    </div>
  );
}