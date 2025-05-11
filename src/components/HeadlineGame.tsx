'use client';
import { useState, useEffect, useRef } from 'react';
import { headlines } from '../data/headlines';
import WarBackground from '@/components/WarBackground';
import WarCard from '@/components/WarCard';
import StatusBar from '@/components/StatusBar';
import HeadlineDisplay from '@/components/HeadlineDisplay';
import ActionButton from '@/components/ActionButton';
import ResultDisplay from '@/components/ResultDisplay';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const TOTAL_QUESTIONS = 20;
const TARGET_SCORE = 170;

export default function HeadlineGame() {
  const [headline, setHeadline] = useState(getRandomHeadline());
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState<boolean | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(9);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [allowUpload, setAllowUpload] = useState(false);

  const victoryAudioRef = useRef<any>(null);
  const lossAudioRef = useRef<any>(null);
  const tenSecLeftAudioRef = useRef<any>(null); // 👈 New audio ref

  function getRandomHeadline() {
    return headlines[Math.floor(Math.random() * headlines.length)];
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      victoryAudioRef.current?.audio?.current?.play();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !result) {
      setResult("TIMEOUT! JALDI KAR KAL SUBAH POK LENE NIKALNA HAI!");
      setResultType(false);
      setScore(prev => prev - 10);
      setScreenshotPreview(null);
      playLossSound();
    }
    const timer = setTimeout(() => setTimeLeft(t => Math.max(t - 1, 0)), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, result]);

  const playVictorySound = () => {
    victoryAudioRef.current?.audio?.current?.play();
  };

  const playLossSound = () => {
    lossAudioRef.current?.audio?.current?.play();
  };

  const playTenSecLeftSound = () => {
    tenSecLeftAudioRef.current?.audio?.current?.play(); // 👈 Trigger sound
  };

  const handleAnswer = (answer: boolean) => {
    if (result) return;
    const isCorrect = answer === headline.isFake;

    if (isCorrect) {
      setResult(headline.isFake
        ? "PROPAGANDA IDENTIFIED! Anchor sent to host 'Shaka Laka Boom Boom'"
        : "VERIFIED TRANSMISSION! 🏆 boys played well!");
      setResultType(true);
      setScore(prev => prev + 10);
      playVictorySound();
    } else {
      setResult("ANALYSIS ERROR! PROVIDE SS OF ACTUAL FAKE NEWS FLOATING TO AVOID PENALTY");
      setResultType(false);
      setAllowUpload(true);
      playLossSound();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            setScreenshotPreview(e.target?.result as string);
            setResult("INTEL ACCEPTED. Penalty override granted.");
            setAllowUpload(false);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const acceptPenalty = () => {
    setScore(prev => prev - 10);
    setAllowUpload(false);
    setResult("PENALTY APPLIED: -10 POINTS! You better understand the assignment here");
  };

  const handleNext = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setGameOver(true);
      return;
    }
    setHeadline(getRandomHeadline());
    setResult('');
    setResultType(undefined);
    setTimeLeft(9);
    setQuestionCount(prev => prev + 1);
    setScreenshotPreview(null);
    setAllowUpload(false);
    playTenSecLeftSound(); // 👈 Play sound
  };

  const restartGame = () => {
    setScore(0);
    setQuestionCount(1);
    setGameOver(false);
    setHeadline(getRandomHeadline());
    setResult('');
    setResultType(undefined);
    setTimeLeft(9);
    setScreenshotPreview(null);
    setAllowUpload(false);
    playTenSecLeftSound(); // 👈 Play sound
  };

  return (
    <WarBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="mb-4 text-center">
            <div className="text-white/70 text-sm font-mono mb-2">
              [ ------------------DETECT IF THE FOLLOWING HEADLINES ARE TRUE OR NOT ------------------ ]
            </div>
            <h1 className="text-orange-500 font-mono text-2xl md:text-3xl font-bold tracking-tighter">
              PROPAGANDA DETECTION UNIT
            </h1>
            <div className="text-white/70 text-xs font-mono mt-1">
              [ TALKING PEACE, PLANTING BOMBS — PICK ONE, HYPOCRITE. ]
            </div>
          </div>

          {/* 🎵 VICTORY SOUND */}
          <AudioPlayer
            ref={victoryAudioRef}
            src="/sounds/Voicy_Jai hind dosto .mp3"
            autoPlay={false}
            className="hidden"
            showJumpControls={false}
            customAdditionalControls={[]}
            customVolumeControls={[]}
            layout="horizontal"
          />

          {/* 🎵 LOSS SOUND */}
          <AudioPlayer
            ref={lossAudioRef}
            src="/sounds/sed.mp3"
            autoPlay={false}
            className="hidden"
            showJumpControls={false}
            customAdditionalControls={[]}
            customVolumeControls={[]}
            layout="horizontal"
          />

          {/* 🎵 10-SECONDS-LEFT SOUND */}
          <AudioPlayer
            ref={tenSecLeftAudioRef}
            src="/sounds/10-seconds-left.mp3"
            autoPlay={false}
            className="hidden"
            showJumpControls={false}
            customAdditionalControls={[]}
            customVolumeControls={[]}
            layout="horizontal"
          />

          <WarCard>
            <StatusBar
              timeLeft={timeLeft}
              score={score}
              questionCount={questionCount}
              totalQuestions={TOTAL_QUESTIONS}
            />

            {gameOver ? (
              <div className="py-12 text-center space-y-8">
                <div className="inline-block p-5 border border-war-gray/30 mb-4">
                  <h2 className="text-3xl font-mono font-bold mb-4">
                    {score >= TARGET_SCORE ? (
                      <span className="text-green-400">MISSION SUCCESSFUL</span>
                    ) : (
                      <span className="text-war-red">MISSION FAILED</span>
                    )}
                  </h2>
                  <div className="text-xl font-mono mb-2 text-war-gray">
                    FINAL SCORE: <span className="text-orange-500">{score}</span>
                  </div>
                  <div className="text-war-gray font-mono mt-4">
                    {score >= TARGET_SCORE ? (
                      <span>Your intelligence analysis skills have secured our nation's safety.</span>
                    ) : (
                      <span>Your performance was inadequate. Retraining is mandatory.</span>
                    )}
                  </div>
                </div>

                <ActionButton onClick={restartGame} color="blue">
                  RESTART MISSION
                </ActionButton>
              </div>
            ) : (
              <>
                <HeadlineDisplay text={headline.text} />

                {!result ? (
                  <div className="flex justify-center gap-6 mb-4">
                    <ActionButton onClick={() => handleAnswer(true)} color="red">
                      NAAAH...
                    </ActionButton>
                    <ActionButton onClick={() => handleAnswer(false)} color="green">
                      CAN_BE
                    </ActionButton>
                  </div>
                ) : (
                  <div>
                    <ResultDisplay result={result} isCorrect={resultType} />

                    {allowUpload ? (
                      <>
                        {!screenshotPreview ? (
                          <>
                            <div
                              onPaste={handlePaste}
                              className="mt-4 p-4 bg-yellow-800 text-white border border-dashed border-yellow-400 rounded text-center cursor-pointer animate-pulse"
                            >
                              📋 Paste a screenshot here (Ctrl+V)
                            </div>
                            <button
                              onClick={acceptPenalty}
                              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                              ❌ Accept -10 Penalty
                            </button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-2 bg-war-dark/80 border border-green-500/30">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <div className="text-green-400 font-mono text-xs">INTEL RECEIVED</div>
                              </div>
                              <div className="flex justify-center">
                                <img
                                  src={screenshotPreview}
                                  alt="Intel"
                                  className="max-w-full max-h-48 object-contain border border-war-gray/30"
                                />
                              </div>
                            </div>

                            <div className="flex justify-center">
                              <ActionButton onClick={handleNext} color="gray">
                                NEXT TRANSMISSION
                              </ActionButton>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center">
                        <ActionButton onClick={handleNext} color="gray">
                          NEXT TRANSMISSION
                        </ActionButton>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </WarCard>

          <div className="mt-4 text-center text-war-gray text-s font-mono">
            PROPAGANDAS v1.0 • MADE IN PAKISTAN's FINEST WHATSAPP FORWARD LABS
          </div>
        </div>
      </div>
    </WarBackground>
  );
}
