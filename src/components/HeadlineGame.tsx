import { useState, useEffect } from 'react';
import { headlines } from '../data/headlines';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import WarBackground from '@/components/WarBackground';

const TOTAL_QUESTIONS = 20;
const TARGET_SCORE = 170;

export default function HeadlineGame() {
  const [headline, setHeadline] = useState(getRandomHeadline());
  const [result, setResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(9);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [allowUpload, setAllowUpload] = useState(false);

  function getRandomHeadline() {
    return headlines[Math.floor(Math.random() * headlines.length)];
  }

  useEffect(() => {
    if (timeLeft <= 0 && !result) {
      setResult("🧠 Timeout! Are you a WhatsApp University graduate?");
      setScore(prev => prev - 10);
      setScreenshotPreview(null);
    }
    const timer = setTimeout(() => setTimeLeft(t => Math.max(t - 1, 0)), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, result]);

  const handleAnswer = (answer: boolean) => {
    if (result) return;
    const isCorrect = answer === headline.isFake;

    if (isCorrect) {
      setResult(headline.isFake
        ? "💥 You exposed the cap! Anchor sent to host 'Shaka Laka Boom Boom'"
        : "🏆 boys played well!");
      setScore(prev => prev + 10);
    } else {
      setResult("🧠 Wrong! Upload screenshot to skip penalty or lose 10 pts.");
      setAllowUpload(true);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `screenshots/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File uploaded:", downloadURL);

      // Play shutter sound
      const audio = new Audio('/sounds/shutter.mp3');
      audio.volume = 1.0;
      try {
        await audio.play();
      } catch (err) {
        console.warn("Shutter sound error:", err);
      }

      setScreenshotPreview(URL.createObjectURL(file));
      setResult("🛡️ Screenshot uploaded & saved! No penalty this time.");
      setAllowUpload(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setResult("❌ Upload failed. Try again or accept penalty.");
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

            try {
              const storageRef = ref(storage, `screenshots/${Date.now()}-pasted.png`);
              await uploadBytes(storageRef, file);
              await getDownloadURL(storageRef);

              // Play shutter sound
              const audio = new Audio('/sounds/shutter.mp3');
              audio.volume = 1.0;
              try {
                await audio.play();
              } catch (err) {
                console.warn("Shutter sound error:", err);
              }

              setResult("🛡️ Screenshot pasted & saved! No penalty this time.");
              setAllowUpload(false);
            } catch (error) {
              console.error("Paste upload error:", error);
              setResult("❌ Paste upload failed.");
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const acceptPenalty = () => {
    setScore(prev => prev - 10);
    setAllowUpload(false);
    setResult(" -10 points! You better understand the assignment here");
  };

  const handleNext = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setGameOver(true);
      return;
    }
    setHeadline(getRandomHeadline());
    setResult('');
    setTimeLeft(9);
    setQuestionCount(prev => prev + 1);
    setScreenshotPreview(null);
    setAllowUpload(false);
  };

  const restartGame = () => {
    setScore(0);
    setQuestionCount(1);
    setGameOver(false);
    setHeadline(getRandomHeadline());
    setResult('');
    setTimeLeft(9);
    setScreenshotPreview(null);
    setAllowUpload(false);
  };

  return (
    <WarBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="war-card p-6 md:p-8 w-full max-w-2xl bg-black/30 rounded border border-war-gray/30">
          <h2 className="text-war-gray text-lg md:text-xl font-bold mb-2 text-center uppercase tracking-wide">
            ⏱️ Time left: {timeLeft}s | Score: {score} | 📰 {questionCount}/{TOTAL_QUESTIONS}
          </h2>

          {gameOver ? (
            <div className="text-center text-white space-y-4">
              <p className="text-xl font-semibold">
                {score >= TARGET_SCORE
                  ? "🇮🇳 Victory! Boys played well! Bharat Mata ki Jai!"
                  : "🤡 You lost! WhatsApp degree revoked. Try again?"}
              </p>
              <button onClick={restartGame} className="bg-war-gray text-white px-6 py-2 rounded hover:bg-war-red transition-colors">
                Restart
              </button>
            </div>
          ) : (
            <>
              <p className="text-white text-lg md:text-xl font-semibold mb-6 text-center">
                {headline.text}
              </p>

              {!result ? (
                <div className="flex justify-center gap-4">
                  <button onClick={() => handleAnswer(true)} className="bg-war-red text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">
                    FAKE
                  </button>
                  <button onClick={() => handleAnswer(false)} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                    REAL
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center mt-4">
                  <p className="text-war-gray text-center">{result}</p>

                  {allowUpload ? (
                    <>
                      {!screenshotPreview ? (
                        <>
                          <div onPaste={handlePaste} className="mt-4 p-4 bg-yellow-800 text-white border border-dashed border-yellow-400 rounded text-center cursor-pointer animate-pulse">
                            📋 Paste a screenshot here (Ctrl+V)
                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="mt-3 text-white"
                          />

                          <button onClick={acceptPenalty} className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                            ❌ Accept -10 Penalty
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="mt-6 text-center space-y-2">
                            <p className="text-green-400 font-semibold text-xl">✅ Screenshot added!</p>
                            <img src={screenshotPreview} alt="Uploaded screenshot" className="max-w-sm rounded border-4 border-green-500 shadow" />
                          </div>
                          <button onClick={handleNext} className="mt-6 bg-war-gray text-white px-4 py-2 rounded hover:bg-war-red transition-colors">
                            Next Headline
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <button onClick={handleNext} className="mt-6 bg-war-gray text-white px-4 py-2 rounded hover:bg-war-red transition-colors">
                      Next Headline
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </WarBackground>
  );
}
