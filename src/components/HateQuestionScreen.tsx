import React, { useState, useRef, useEffect } from 'react';
import { Trophy, AlertTriangle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface HateQuestionScreenProps {
  onAnswerSelected: (answer: string, dodges: number) => void;
  onCatchNoAchievement: (dodges: number) => void;
}

const QUIPS = [
  'Too fast for iPhone touch screen! 🏃‍♀️💨',
  'Whoosh! Finger too slow! ⚡',
  'Error 404: Cannot hate a good friend! 🤖',
  'Wait... you’re tapping REALLY hard to say No?! 🥹',
  'Physics strictly forbids this touch! 🙅‍♀️',
  'Look at that thumb cardio! 💅',
  'Admit it, you secretly enjoy my presence! 🌟',
  'Button has supersonic evasion! 🛸',
];

export const HateQuestionScreen: React.FC<HateQuestionScreenProps> = ({
  onAnswerSelected,
  onCatchNoAchievement,
}) => {
  const [dodges, setDodges] = useState<number>(0);
  const [quipIndex, setQuipIndex] = useState<number>(0);
  const [isDodgeActive, setIsDodgeActive] = useState<boolean>(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const arenaRef = useRef<HTMLDivElement>(null);

  // Exact requested options
  const staticOptions = [
    { text: 'Yes 😤', hint: 'Cold-blooded honesty' },
    { text: 'Probably yes 👀', hint: 'Suspicious side-eye' },
    { text: 'Probably? Definitely. 💀', hint: 'Zero hesitation' },
    { text: '1000% Yes, without a doubt 🙃', hint: 'Maximum playful banter' },
    { text: 'It is my full-time hobby 💅', hint: 'Professional level' },
  ];

  const triggerEvasion = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    triggerHaptic(20);
    sound.playDodge();
    const newDodges = dodges + 1;
    setDodges(newDodges);
    setQuipIndex(newDodges % QUIPS.length);
    setIsDodgeActive(true);

    if (arenaRef.current) {
      const arenaRect = arenaRef.current.getBoundingClientRect();
      const btnW = 160;
      const btnH = 54;
      const pad = 12;

      const maxX = Math.max(10, arenaRect.width - btnW - pad);
      const maxY = Math.max(10, arenaRect.height - btnH - pad);

      // Pick a position comfortably far from current position
      const newX = Math.floor(Math.random() * maxX) + pad / 2;
      const newY = Math.floor(Math.random() * maxY) + pad / 2;

      setNoPos({ x: newX, y: newY });
    }
  };

  const handleSelectAnswer = (optionText: string) => {
    triggerHaptic(15);
    sound.playDramaticSting();
    onAnswerSelected(optionText, dodges);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3">
      {/* Header */}
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-1">
          Stage 4 of 5 · The Moment of Truth
        </span>
        <h2 className="font-outfit text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          Be honest, Tejaswi... <br />
          <span className="text-rose-400">Do you hate me? 🥺</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Select your answer below (if your thumb can catch it).
        </p>

        {dodges > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 border border-slate-700/80 rounded-full text-[11px] text-slate-300 font-medium">
            <span>iPhone Evasions:</span>
            <span className="font-bold text-rose-400 font-mono tabular-nums">{dodges}</span>
            <span>· Evasive Mode Active 🏃‍♀️💨</span>
          </div>
        )}
      </div>

      {/* Interactive Mobile Arena */}
      <div
        ref={arenaRef}
        className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl min-h-[400px] overflow-hidden flex flex-col justify-between"
      >
        {/* Regular Options Stack */}
        <div className="space-y-2 z-10">
          {staticOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectAnswer(opt.text)}
              className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-slate-800 hover:border-rose-500/60 hover:bg-slate-850 text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between group shadow-xs bg-slate-900/70"
            >
              <span className="font-outfit font-bold text-xs sm:text-sm text-slate-200 group-hover:text-rose-300">
                {opt.text}
              </span>
              <span className="text-[10px] text-slate-500 font-medium group-hover:text-rose-400">
                {opt.hint}
              </span>
            </button>
          ))}
        </div>

        {/* Easter Egg / Secret confession after chasing No 4+ times on phone */}
        {dodges >= 4 && (
          <div className="mt-3 p-3 bg-slate-850 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-2 z-10 animate-fade-in shadow-lg">
            <div className="flex items-center gap-2 min-w-0">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-[11px] text-slate-300 min-w-0">
                <span className="font-bold text-amber-300 block leading-tight">Caught In 4K! 🌟</span>
                <span className="text-slate-400 text-[10px] block leading-tight mt-0.5">
                  You tried tapping 'No' {dodges} times. You don't hate me at all!
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic(20);
                sound.playCheer();
                onCatchNoAchievement(dodges);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[11px] font-bold shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              Admit It →
            </button>
          </div>
        )}

        {/* The Infamous RUNAWAY "No" Button (Engineered specifically for touchscreens) */}
        <div
          className={`${
            isDodgeActive
              ? 'absolute transition-all duration-150 ease-out z-30'
              : 'relative mt-3 flex justify-center z-10'
          }`}
          style={
            isDodgeActive
              ? {
                  left: `${noPos.x}px`,
                  top: `${noPos.y}px`,
                }
              : undefined
          }
        >
          <div className="relative">
            {/* Pop-up comic speech bubble */}
            {isDodgeActive && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg animate-bounce pointer-events-none">
                {QUIPS[quipIndex]}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
              </div>
            )}

            {/* Generous touch-detection zone around the button for iPhone fingers */}
            <div
              onTouchStart={triggerEvasion}
              onPointerDown={triggerEvasion}
              onMouseEnter={triggerEvasion}
              className="p-2 cursor-pointer"
            >
              <button
                type="button"
                onClick={triggerEvasion}
                className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-outfit font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 select-none active:scale-90 pointer-events-auto"
              >
                <span>No ❤️</span>
                <span className="text-[11px] opacity-90">(I don't hate you)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Touch advice subtext */}
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 z-10">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Try tapping "No" on your phone
          </span>
          <span>Pick any option to continue</span>
        </div>
      </div>
    </div>
  );
};
