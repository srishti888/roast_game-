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
