import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface SupportVowScreenProps {
  onCommit: (selectedSupport: string) => void;
}

const SUPPORT_PROMISES = [
  {
    id: 'listen_rant',
    emoji: '🎧',
    title: 'The "Unfiltered Rant" Pass',
    desc: 'You can vent about literally anything at 2 AM. Zero unsolicited advice, just pure support.',
  },
  {
    id: 'snack_boba',
    emoji: '🧋',
    title: 'Emergency Snack & Boba Protocol',
    desc: 'Whenever you feel drained, you can request your favorite comfort treat with zero guilt.',
  },
  {
    id: 'no_guilt_replies',
    emoji: '🧸',
    title: 'Zero-Guilt Ghosting Privilege',
    desc: 'If your battery is at 0%, take 48 hours to reply. Good friendships never need apologies.',
  },
  {
    id: 'hype_woman',
    emoji: '👑',
    title: 'Personal Hype & Encouragement',
    desc: 'Whenever self-doubt whispers, I am here with receipts reminding you of who you are.',
  },
];

export const SupportVowScreen: React.FC<SupportVowScreenProps> = ({ onCommit }) => {
  const [batmanText, setBatmanText] = useState("I don't need anything, I'm Batman 🦇");

  const handleSelect = (title: string) => {
    sound.playCheer();

    // Warm confetti burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#a855f7', '#fb7185', '#38bdf8', '#fbbf24'],
    });

    onCommit(title);
  };

  const handleBatmanTap = () => {
    sound.playDodge();
    setBatmanText('Okay fine, support accepted 🌙');
    setTimeout(() => {
      handleSelect('All-Inclusive Support Protocol 💖');
    }, 400);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 text-center">
      <span className="inline-block px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-2">
        Stage 4 of 4 · Friendship Support
      </span>

      <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight mb-2">
        Tejaswi, I've got your <br />
        <span className="text-rose-400">back 100%</span> 🌙
      </h1>

      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
        Because caring about someone means paying attention when you're overwhelmed, respecting your space, and making life easier.
      </p>

      {/* Promises Stack (Dark Mode) */}
      <div className="space-y-2 mb-4 text-left">
        <span className="text-xs font-bold text-slate-300 block">
          Choose which support protocol you want permanently active:
        </span>
        {SUPPORT_PROMISES.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.title)}
            className="w-full min-h-[56px] p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-850 shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-start gap-2.5 group"
          >
            <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="font-outfit font-bold text-xs sm:text-sm text-slate-100 group-hover:text-rose-300 block">
                {item.title}
              </span>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                {item.desc}
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-rose-400 opacity-0 group-hover:opacity-100 shrink-0 self-center transition-opacity" />
          </button>
        ))}
      </div>

      {/* Cheeky Batman button */}
      <div className="pt-1">
        <button
          onClick={handleBatmanTap}
          onTouchStart={handleBatmanTap}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-xl cursor-pointer active:scale-95 border border-transparent hover:border-slate-800"
        >
          {batmanText}
        </button>
      </div>
    </div>
  );
};
