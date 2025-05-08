import React from "react";
import { Link } from "react-router-dom";
import { Film, Map } from "lucide-react";

const Index = () => {
  return (
    <div className="page-container relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="title-text mb-12">
          WARPATH <br />
          <span className="text-war-red animate-pulse inline-block">BATTLEGROUNDS</span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-xl mx-auto">
          <Link 
            to="/media" 
            className="war-button flex-1 group"
          >
            <div className="absolute -inset-0.5 bg-war-red/20 rounded-sm blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Film className="w-6 h-6" />
              <span>MEDIA</span>
            </div>
          </Link>
          
          <Link 
            to="/maps" 
            className="war-button flex-1 group"
          >
            <div className="absolute -inset-0.5 bg-war-red/20 rounded-sm blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center justify-center gap-3">
              <Map className="w-6 h-6" />
              <span>MAPS</span>
            </div>
          </Link>
        </div>
        
        <div className="border-pattern mt-16 p-6 max-w-2xl w-full">
          <h2 className="text-xl uppercase font-bold mb-2 text-war-red">MISSION BRIEFING</h2>
          <p className="text-muted-foreground">
            Welcome to Warpath Battlegrounds, commander. Select your operation below.
            Access tactical intelligence through our Media center or navigate strategic territories
            in the Maps section.
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
        CLASSIFIED // LEVEL 5 CLEARANCE REQUIRED
      </div>
    </div>
  );
};

export default Index;
