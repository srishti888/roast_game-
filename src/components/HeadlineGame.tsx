import { useState, useEffect } from 'react';
import { headlines } from '../data/headlines';

export default function HeadlineGame() {
  const [headline, setHeadline] = useState(() => getRandomHeadline());
  const [result, setResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(9);

  function getRandomHeadline() {
    return headlines[Math.floor(Math.random() * headlines.length)];
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      setResult("🧠 r u a little whatsapp university graduate? try agn");
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (answer: boolean) => {
    if (result) return; // prevent answering twice
    if (answer === headline.isFake) {
      if (headline.isFake) {
        setResult("💥 You exposed the cap! Anchor sent to host 'Shaka Laka Boom Boom'");
      } else {
        setResult("🏆 boys played well!");
      }
    } else {
      setResult("🧠 r u a little whatsapp university graduate? try agn");
    }
  };

  const handleNext = () => {
    setHeadline(getRandomHeadline());
    setResult('');
    setTimeLeft(9);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">⏱️ Time left: {timeLeft}s</h2>
      <p className="text-xl font-semibold mb-6">{headline.text}</p>
      {!result ? (
        <div className="flex gap-4">
          <button onClick={() => handleAnswer(true)} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">FAKE</button>
          <button onClick={() => handleAnswer(false)} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">REAL</button>
        </div>
      ) : (
        <>
          <p className="text-lg mt-4">{result}</p>
          <button onClick={handleNext} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Next Headline</button>
        </>
      )}
    </div>
  );
}
