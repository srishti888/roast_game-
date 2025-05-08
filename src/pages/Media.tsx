import React from "react";
import { Link } from "react-router-dom";
import { Film, ChevronLeft, Flag, Swords } from "lucide-react";

const Media = () => {
  const mediaItems = [
    { 
      id: 1, 
      title: "Operation Thunderstrike", 
      type: "Battle Footage",
      description: "Aerial view of the successful airstrike on enemy supply lines." 
    },
    { 
      id: 2, 
      title: "Tactical Analysis: Iron Fortress", 
      type: "Intelligence Report",
      description: "Breach points and defensive positions of the primary objective." 
    },
    { 
      id: 3, 
      title: "Commander's Briefing", 
      type: "Strategic Update",
      description: "Weekly status update from Command HQ on ongoing operations." 
    },
    { 
      id: 4, 
      title: "Field Training: Urban Combat", 
      type: "Training Material",
      description: "Essential tactics for squad-based operations in urban environments." 
    }
  ];

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Command</span>
        </Link>
      </div>

      <h1 className="title-text flex items-center gap-3">
        <Film className="w-10 h-10" />
        BATTLEFIELD MEDIA
      </h1>

      <div className="border-pattern w-full p-4 mb-8">
        <p className="text-muted-foreground">
          Access classified media files, battle reports, and tactical analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {mediaItems.map((item) => (
          <div 
            key={item.id} 
            className="border-pattern p-5 cursor-pointer transition-all duration-300 hover:border-war-red hover:bg-war-black/50"
          >
            <div className="flex items-center gap-4 mb-4">
              {item.type.includes("Battle") ? (
                <Swords className="w-8 h-8 text-war-red" />
              ) : item.type.includes("Strategic") ? (
                <Flag className="w-8 h-8 text-war-red" />
              ) : (
                <Film className="w-8 h-8 text-war-red" />
              )}
              <div>
                <h3 className="text-xl font-bold uppercase">{item.title}</h3>
                <span className="text-xs text-muted-foreground uppercase">{item.type}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="mt-4 flex justify-end">
              <button className="text-sm text-war-red hover:text-white transition-colors uppercase flex items-center gap-1">
                View File
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          CLASSIFIED CONTENT // AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  );
};

export default Media;
