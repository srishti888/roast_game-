
import { motion } from 'motion/react';

const MapButton = ({ isMapOpen, setMapOpen, setMapLoading }) => {
  return (
    <button
      className="absolute bottom-5 left-10 text-xl py-2 px-3 z-10 backdrop-blur-sm"
      onClick={() => {
        setMapOpen(!isMapOpen);
        setMapLoading(true);
        setTimeout(() => {
          setMapLoading(false);
        }, 1000);
      }}
      aria-label="Toggle map"
    >
      <motion.img
        src="/maps/location.svg"
        alt="map"
        className="w-12 h-12 md:w-16 md:h-16 object-contain cursor-pointer transition-all hover:brightness-125 active:brightness-150"
        initial={{ scale: 0, opacity: 0 }} // Show effect
        animate={{
          scale: 1,
          opacity: 1,
          y: [0, -10, 0], // Bouncing animation
          transition: {
            scale: { duration: 0.5, ease: 'easeOut' }, // Show effect
            opacity: { duration: 0.5, ease: 'easeOut' }, // Show effect
            y: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }, // Bounce
          },
        }}
        whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }} // Attractive hover
        whileTap={{ scale: 0.9, filter: 'brightness(1.5)' }} // Attractive click
      />
    </button>
  );
};

export default MapButton; 