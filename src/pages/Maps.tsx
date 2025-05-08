import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronLeft, Skull } from "lucide-react";

const Maps = () => {
  const battleLocations = [
    { id: 1, name: "Crimson Valley", status: "Active", threat: "High" },
    { id: 2, name: "Shadow Ridge", status: "Secured", threat: "Medium" },
    { id: 3, name: "Iron Fortress", status: "Contested", threat: "Critical" },
    { id: 4, name: "Deadzone Alpha", status: "Lost", threat: "Extreme" },
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
        <MapPin className="w-10 h-10" />
        TACTICAL MAPS
      </h1>

      <div className="border-pattern w-full p-4 mb-8">
        <p className="text-muted-foreground">
          Secure battlefield intelligence. All map data is classified and updated in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {battleLocations.map((location) => (
          <div 
            key={location.id} 
            className={`border-pattern p-5 cursor-pointer transition-all duration-300 hover:border-war-red hover:bg-war-black/50 ${
              location.threat === "Critical" || location.threat === "Extreme" ? "border-war-red/70" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold uppercase">{location.name}</h3>
              {(location.threat === "Critical" || location.threat === "Extreme") && (
                <Skull className="w-5 h-5 text-war-red animate-pulse" />
              )}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Status: <span className={`font-medium ${location.status === "Lost" ? "text-war-red" : "text-white"}`}>{location.status}</span></span>
              <span>Threat Level: <span className={`font-medium ${
                location.threat === "High" ? "text-yellow-500" : 
                location.threat === "Medium" ? "text-blue-400" : 
                "text-war-red"
              }`}>{location.threat}</span></span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-pattern p-5 bg-war-black/70 relative">
        <div className="absolute -top-3 left-4 bg-war-red text-white text-xs px-2 py-0.5">
          ALERT
        </div>
        <p className="text-war-red font-medium">
          Enemy activity detected near Iron Fortress. Deploy reconnaissance teams immediately.
        </p>
      </div>
    </div>
  );
};

export default Maps;
