import React, { useRef } from 'react';
import 'react-h5-audio-player/lib/styles.css';

interface GameSoundsProps {
  onLoad?: () => void;
}

const GameSounds: React.FC<GameSoundsProps> = ({ onLoad }) => {
  const tacticalNukeRef = useRef<HTMLAudioElement>(null);
  const alarmDangerRef = useRef<HTMLAudioElement>(null);
  const warioWonRef = useRef<HTMLAudioElement>(null);
  const introRef = useRef<HTMLAudioElement>(null);
  const superExplosionRef = useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <div className="hidden">
      <audio
        ref={tacticalNukeRef}
        src="/sounds/tactical-nuke.mp3"
        preload="auto"
      />
      <audio
        ref={alarmDangerRef}
        src="/sounds/alarm-danger.mp3"
        preload="auto"
      />
      <audio
        ref={warioWonRef}
        src="/sounds/wario-won.mp3"
        preload="auto"
      />
      <audio
        ref={introRef}
        src="/sounds/intro.mp3"
        preload="auto"
      />
      <audio
        ref={superExplosionRef}
        src="/sounds/super-explosion.mp3"
        preload="auto"
      />
    </div>
  );
};

// Export both the component and a hook to use the sounds
export const useGameSounds = () => {
  const playTacticalNuke = () => {
    const audio = document.querySelector('audio[src="/sounds/tactical-nuke.mp3"]') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const playAlarmDanger = () => {
    const audio = document.querySelector('audio[src="/sounds/alarm-danger.mp3"]') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const playWarioWon = () => {
    const audio = document.querySelector('audio[src="/sounds/wario-won.mp3"]') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const playIntro = () => {
    const audio = document.querySelector('audio[src="/sounds/intro.mp3"]') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const superExplosion = () => {
    const audio = document.querySelector('audio[src="/sounds/super-explosion.mp3"]') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  return {
    playTacticalNuke,
    playAlarmDanger,
    playWarioWon,
    playIntro,
    superExplosion
  };
};

export default GameSounds;
