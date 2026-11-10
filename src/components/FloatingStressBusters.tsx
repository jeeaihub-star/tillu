import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { sound } from '../utils/audio';

interface Bubble {
  id: number;
  text: string;
  emoji: string;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  color: string;
}

const BUBBLE_LABELS = [
  { text: 'Overthinking', emoji: '🧠', color: 'from-pink-600/80 to-rose-600/80 border-pink-400/50' },
  { text: 'Unread Texts', emoji: '📱', color: 'from-amber-600/80 to-orange-600/80 border-amber-400/50' },
  { text: 'Annoying People', emoji: '🙄', color: 'from-purple-600/80 to-indigo-600/80 border-purple-400/50' },
  { text: 'Daily Drama', emoji: '🚫', color: 'from-emerald-600/80 to-teal-600/80 border-emerald-400/50' },
  { text: 'Self Doubt', emoji: '💨', color: 'from-rose-600/80 to-red-600/80 border-rose-400/50' },
  { text: 'Need Boba ASAP', emoji: '🧋', color: 'from-amber-600/80 to-yellow-600/80 border-yellow-400/50' },
  { text: 'Need Sleep', emoji: '🧸', color: 'from-sky-600/80 to-blue-600/80 border-sky-400/50' },
];

interface FloatingStressBustersProps {
  onPopCountChange?: (count: number) => void;
}

export const FloatingStressBusters: React.FC<FloatingStressBustersProps> = ({
  onPopCountChange,
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Initialize bubbles
  useEffect(() => {
    const initial: Bubble[] = BUBBLE_LABELS.slice(0, 5).map((item, i) => ({
      id: Date.now() + i,
      text: item.text,
      emoji: item.emoji,
      x: 10 + (i * 18) % 75,
      y: 15 + (i * 15) % 65,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      color: item.color,
    }));
    setBubbles(initial);
  }, []);

  // Float animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          let nextX = b.x + b.speedX;
          let nextY = b.y + b.speedY;
          let sX = b.speedX;
          let sY = b.speedY;

          if (nextX <= 4 || nextX >= 80) sX = -sX;
          if (nextY <= 8 || nextY >= 75) sY = -sY;

          return {
            ...b,
            x: Math.max(4, Math.min(80, nextX)),
            y: Math.max(8, Math.min(75, nextY)),
            speedX: sX,
            speedY: sY,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handlePop = (id: number, text: string) => {
    sound.playBubblePop();
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    const nextCount = poppedCount + 1;
    setPoppedCount(nextCount);
    if (onPopCountChange) onPopCountChange(nextCount);

    const cheers = [
      `Popped "${text}"! 💥 Out of your mind!`,
      `Bye bye stress! 💨 You are safe!`,
      `Stress erased! ✨ You're doing amazing!`,
      `Crushed it! Calm restored 🛡️`,
    ];
    setToastMessage(cheers[nextCount % cheers.length]);
    setTimeout(() => setToastMessage(null), 1800);
  };

  const spawnMore = () => {
    sound.playSparkle();
    const item = BUBBLE_LABELS[Math.floor(Math.random() * BUBBLE_LABELS.length)];
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      text: item.text,
      emoji: item.emoji,
      x: 10 + Math.random() * 65,
      y: 15 + Math.random() * 55,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: (Math.random() - 0.5) * 1.2,
      color: item.color,
    };
    setBubbles((prev) => [...prev, newBubble]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-30 p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-950 flex items-center gap-1.5 text-xs font-bold active:scale-90 transition-transform"
      >
        <span>🫧</span>
        <span>Stress Poppers ({poppedCount})</span>
      </button>
    );
  }

  return (
    <>
      {/* Toast feedback when popping */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-full shadow-2xl pointer-events-none animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Floating interactive bubbles on phone screen */}
      <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={b.id}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transition: 'left 0.15s ease-out, top 0.15s ease-out',
            }}
            className="absolute pointer-events-auto"
          >
            <button
              onClick={() => handlePop(b.id, b.text)}
              onTouchStart={() => handlePop(b.id, b.text)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${b.color} backdrop-blur-md text-white text-xs font-bold shadow-xl border active:scale-75 transition-transform cursor-pointer select-none`}
            >
              <span className="text-sm">{b.emoji}</span>
              <span className="whitespace-nowrap">{b.text}</span>
              <span className="text-[10px] opacity-75">✕</span>
            </button>
          </div>
        ))}
      </div>

      {/* Mini Controller pill pinned neatly at bottom-left */}
      <div className="fixed bottom-3 left-3 z-30 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 shadow-xl text-xs text-slate-300">
        <span className="font-semibold text-rose-400 flex items-center gap-1">
          <span>🫧</span>
          <span>Popped: {poppedCount}</span>
        </span>
        <span className="text-slate-700">|</span>
        <button
          onClick={spawnMore}
          className="text-slate-300 hover:text-white active:scale-95 font-medium cursor-pointer"
        >
          + More
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
          title="Minimize"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
};
