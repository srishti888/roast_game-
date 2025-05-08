
import React from 'react';
import { Link } from 'react-router-dom';
import WarBackground from '@/components/WarBackground';
import { Map, ChevronLeft } from 'lucide-react';

const Maps = () => {
  return (
    <WarBackground>
      <div className="min-h-screen flex flex-col p-6">
        <Link 
          to="/" 
          className="flex items-center text-war-gray hover:text-white transition-colors mb-8 self-start"
        >
          <ChevronLeft className="mr-1" /> Return to Base
        </Link>
        
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="war-card p-8 w-full max-w-2xl animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Map className="w-10 h-10 text-war-green mr-3" />
              <h1 className="text-3xl font-bold uppercase tracking-wider text-white">Battleground Maps</h1>
            </div>
            
            <p className="text-war-gray text-center mb-8">
              Strategic theater maps, territory control status, and battle locations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Urban Warfare', 'Desert Operations', 'Forest Incursion', 'Arctic Command'].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-black/30 p-4 rounded border border-war-gray/30 hover:border-war-green/50 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-center">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WarBackground>
  );
};

export default Maps;
