
import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-war-dark bg-opacity-90">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-t-war-red border-r-war-green border-b-war-gold border-l-gray-600 rounded-full animate-spin mb-4"></div>
        <p className="text-war-gold text-xl uppercase tracking-wider font-bold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
