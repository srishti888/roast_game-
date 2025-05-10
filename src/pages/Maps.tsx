import React from 'react';
import { useState, useEffect } from 'react';
import WarBackground from '@/components/WarBackground';
import { Item, User } from '@/types/type';
import { availableItems } from '@/data/items';
import { motion, useAnimationControls } from "motion/react"

import MapPlot from '@/components/MapPlot';

const Maps = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bom, setBom] = useState<number[]>();
  const [points, setPoints] = useState<number>(0);
  const [target, setTarget] = useState<number>(10);
  const [items, setItems] = useState<Item[]>([]);
  const [currentItem, setCurrentItem] = useState<Item | null>(
    availableItems[Math.floor(Math.random() * availableItems.length)]
  );
  const [userLevel, setUserLevel] = useState<number>(1);
  const [winState, setWinState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  
  const controls = useAnimationControls();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [isMapOpen, setMapOpen] = useState(false);
  const [isMapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    console.log('getting user');
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUserLevel(user.level);
      setTarget(user.target);
      setItems(user.items);
      setCurrentItem(availableItems[Math.floor(Math.random() * availableItems.length)]);
    } else {
      setUserLevel(1);
      setCurrentItem(availableItems[Math.floor(Math.random() * availableItems.length)]);
    }
  }, [user]);
  
  const upDateBom = async () => {
    const getRandomNumber = () => Math.floor(Math.random() * 9) + 1;
    const count = Math.random() > 0.5 ? 3 : 4;
    const bomArray = [];
    while (bomArray.length < count) {
      const num = getRandomNumber();
      if (!bomArray.includes(num)) {
        bomArray.push(num);
      }
    }
    setBom(bomArray);
  }

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  React.useEffect(() => {
    intervalRef.current = setInterval(upDateBom, 2000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // const stopBomUpdates = () => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // };

  
  const handleClick = (isBom: boolean) => {
    if(isBom) {
      setPoints(0);
      handleTrigger();
      return;
    }

    setPoints(points + 1);
    if (points >= target) {
      setWinState(true);
      setItems([...items, currentItem as Item]);
      
      setPoints(0);
      setTarget(target + 10);
      setUserLevel(userLevel + 1);
      console.log('user', { ...user, target: target+10 ,level: userLevel+1, items: [...items, currentItem as Item] } );
      setUser({ ...user, target: target+10 ,level: userLevel+1, items: [...items, currentItem as Item] });
      localStorage.setItem('user', JSON.stringify({ ...user, target: target+10 ,level: userLevel+1, items: [...items, currentItem as Item] }));
      // setWinState(true);
      
      setBom(undefined);
      setTimeout(() => {
        setCurrentItem(availableItems[Math.floor(Math.random() * availableItems.length)]);
      }, 1000);
      setTimeout(() => {
        upDateBom();
        setWinState(false);
      }, 2000);
    }
  }


  const ResetPlay = () => {
    setPoints(0);
    setTarget(10);
    setUserLevel(1);
    setItems([]);
    setCurrentItem(availableItems[Math.floor(Math.random() * availableItems.length)]);
    setBom(undefined);
    setWinState(false);

    localStorage.removeItem('user');
    setUser(null);
  }


  const handleTrigger = async () => {
    if (isAnimating) return; // Prevent multiple triggers during animation
    setIsAnimating(true);

    await controls.start({
      scale: 1.2,
      opacity: 1,
      transition: { duration: 0.2 },
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));

    await controls.start({
      scale: 1, // Return to original size
      opacity: 0, // Hide the image
      transition: { duration: 0.1 }, // Quick fade out
    });

    setIsAnimating(false);
  };

  return (
    <WarBackground>


      {isMapOpen &&
        <MapPlot
          user={user}
        />
      }



      <div className="h-screen flex flex-col md:flex-row items-center justify-center align-center">
        <button className='absolute top-5 right-10 text-xl py-2 px-3 z-10 bg-slate-600 rounded-sm hover:bg-slate-500 active:bg-slate-400' onClick={ResetPlay}>
          Restart
        </button>

        <div className='hidden md:flex flex-col justify-items-start items-center h-screen w-[100%] pt-12'>
          <div className='text-4xl font-bold text-gray-700 w-full text-center p-2 pb-5'>
            INVENTORY
          </div>
          
          <div className='justify-center md:h-[40rem] items-center gap-4 overflow-x-scroll scrollbar-hide'>
              {items.length > 0 ? (
                items.map((item, index) => (
                <div key={index} className="flex-none aspect-square p-5 bg-gray-800 border-b-2 justify-center items-center hover:bg-gray-700 cursor-pointer">
                  {item.imageUrl && (
                    <img
                      src={`/maps/${item.imageUrl}`}
                      alt={item.name}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      srcSet={`/maps/${item.imageUrl} 1x, /maps/${item.imageUrl} 2x`}
                      loading="lazy"
                      className="w-16 h-16 md:w-44 md:h-44 object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  )}
                </div>
                ))
              ) : (
                <div className="flex-none aspect-square p-5 bg-gray-800 justify-center items-center ">
                  <p className="text-white/20 font-bold">No items found</p>
                </div>
              )}
            
          </div>
        </div>

        <div className="h-full p-4 md:px-10 flex flex-col justify-items-start items-center w-screen md:w-[calc(100vh+80em)] max-w-[100vh] rounded-lg">
          <div className="text-4xl font-bold text-yellow-600 w-full text-center p-2 pb-10">
            LEVEL: {userLevel}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 aspect-square w-full">
            {Array(9)
              .fill({})
              .map((_, index) => {
                if (bom && bom.includes(index + 1)) {
                  return (
                    <div
                        key={index}
                        className='flex justify-center items-center aspect-square bg-red-500 rounded-sm cursor-pointer hover:bg-red-400'
                        onMouseDown={() => handleClick(true)}
                    >
                      <img src={`/maps/bomb.svg`} alt="" width={150} className='object-contain opacity-80' />
                    </div>
                  );
                }
                return (
                  <div 
                      key={index}
                      className='aspect-square bg-gray-500 rounded-sm cursor-pointer hover:bg-gray-400'
                      onMouseDown={() => handleClick(false)}
                  ></div>
                );
              })}
          </div>
        </div>

        <div className='relative flex flex-col md:justify-center justify-start items-center h-full w-full'>
          <span className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
            <motion.img
              src="/maps/blast.svg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="blast"
              className="w-12 h-12 md:w-96 md:h-96 object-contain"
              initial={{ scale: 1, opacity: 0 }}
              animate={controls}
            />
          </span>

          <span>
            {currentItem && (
              <div className="flex flex-col items-center mb-4">
                <h2 className={`text-3xl font-bold ${winState?'text-white/90 text-shadow-white':'text-white/10'} mb-2`}>{points < target ? `Current Item` : `Claim`}</h2>
                <div className="py-3 px-6 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <img 
                      src={`/maps/${currentItem.imageUrl}`} 
                      alt={currentItem.name} 
                      className="w-12 h-12 md:w-24 md:h-24 object-contain"
                    />
                    <span className="text-xl md:text-2xl text-white/70 font-medium">{currentItem.name}</span>
                  </div>
                </div>
              </div>
            )}
          </span>
          <p className='w-full text-center text-[4rem] md:text-[5rem] font-bold text-yellow-600'>
            {points}<span className='text-white/5'>/{target}</span>
          </p>
        </div>
      </div>

      <div className='flex justify-center items-center w-full max-w-[90vh]'>
      </div>
    </WarBackground>
  );
};

export default Maps;