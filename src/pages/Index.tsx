
import React from 'react';
import WarButton from '@/components/WarButton';
import WarBackground from '@/components/WarBackground';

const Index = () => {
  return (
    <WarBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="war-header">WARBORN</h1>
          <p className="text-war-gray text-xl mt-2">BATTLEGROUNDS PORTAL</p>
        </div>
        
        <div className="w-full max-w-md grid grid-cols-1 gap-8 mt-6">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <WarButton 
              to="/media"
              variant="media"
              className="w-full animate-pulse-glow"
            >
              Media Archives
            </WarButton>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <WarButton 
              to="/maps" 
              variant="maps"
              className="w-full"
            >
              Battleground Maps
            </WarButton>
          </div>
        </div>
      </div>
    </WarBackground>
  );
};

export default Index;
