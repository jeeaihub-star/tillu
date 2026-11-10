import React, { useState } from 'react';
import { Droplet, Heart, Wind, ShieldCheck, Sparkles, Check, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface SmokeLessHealthCardProps {
  herName?: string;
  onNavigateToBreathing?: () => void;
}

export const SmokeLessHealthCard: React.FC<SmokeLessHealthCardProps> = ({
  herName = 'Tejaswi',
  onNavigateToBreathing,
}) => {
  const [isLit, setIsLit] = useState<boolean>(true);
  const [skippedCount, setSkippedCount] = useState<number>(0);
  const [waterGlasses, setWaterGlasses] = useState<number>(1);
  const [reactionText, setReactionText] = useState<string | null>(null);

  const handleSwapForWater = () => {
    triggerHaptic(20);
    sound.playSparkle();
    const newCount = skippedCount + 1;
    const newWater = waterGlasses + 1;
    setSkippedCount(newCount);
    setWaterGlasses(newWater);
    setReactionText(`YES! Traded 1 smoke for pure hydration. Your lungs and skin are celebrating! 💧🫁`);

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#f43f5e', '#fbbf24'],
    });

    setTimeout(() => setReactionText(null), 5000);
  };

  const handleExtinguish = () => {
    triggerHaptic(25);
    sound.playBubblePop();
    setIsLit(!isLit);
    if (isLit) {
      setReactionText(`Cigarette extinguished! Pure fresh air mode activated for ${herName}. 🚭✨`);
    } else {
      setReactionText(`Relit for demo — but let's put it out for real! 🕶️`);
    }
    setTimeout(() => setReactionText(null), 4000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 rounded-[28px] p-4 sm:p-5 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Ambient background accents */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Health & Lung Check</span>
              <span className="text-[10px] text-cyan-400 font-normal">Friend Care Protocol</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              For {herName} · Keeping your energy & health protected
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800/60 flex items-center gap-1">
          <span>🚭 Smoke Less</span>
        </span>
      </div>

      {/* Cool Animated Character & Dialogue Section */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 bg-slate-950/80 border border-slate-850 rounded-2xl p-3.5 mb-4 shadow-inner">
        {/* Animated Cool Character Artwork (Inline SVG with CSS Animations) */}
        <div className="relative shrink-0 flex flex-col items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center">
            {/* Cool Character SVG */}
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full drop-shadow-lg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soft circular aura */}
              <circle cx="60" cy="60" r="54" fill="#0f172a" stroke="#334155" strokeWidth="2" />

              {/* Character Hoodie / Jacket */}
              <path
                d="M32 98C32 84 44 76 60 76C76 76 88 84 88 98V106H32V98Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              {/* Hoodie strings / zipper */}
              <line x1="60" y1="78" x2="60" y2="102" stroke="#64748b" strokeWidth="2" />

              {/* Head / Face */}
              <circle cx="60" cy="52" r="22" fill="#fed7aa" />

              {/* Cool Dark Sunglasses */}
              <rect x="42" y="46" width="16" height="10" rx="3" fill="#090d16" stroke="#00f2fe" strokeWidth="1" />
              <rect x="62" y="46" width="16" height="10" rx="3" fill="#090d16" stroke="#00f2fe" strokeWidth="1" />
              <line x1="58" y1="50" x2="62" y2="50" stroke="#090d16" strokeWidth="2" />
              {/* Sunglass lens glare reflection */}
              <line x1="44" y1="48" x2="54" y2="52" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="64" y1="48" x2="74" y2="52" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

              {/* Cool Hair / Beanie */}
              <path
                d="M38 50C38 34 46 28 60 28C74 28 82 34 82 50C80 43 72 38 60 38C48 38 40 43 38 50Z"
                fill="#334155"
              />

              {/* Subtle gentle smirk mouth */}
              <path
                d="M54 62C57 64 63 64 66 62"
                stroke="#b45309"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Cigarette in Hand / Mouth */}
              {isLit ? (
                <g>
                  {/* Cigarette Body */}
                  <rect x="65" y="61" width="22" height="3" rx="1" fill="#f8fafc" />
                  <rect x="65" y="61" width="6" height="3" fill="#d97706" />

                  {/* Glowing Burning Ember */}
                  <circle
                    cx="88"
                    cy="62.5"
                    r="2.5"
                    fill="#ef4444"
                    className="animate-ember"
                  />

                  {/* Rising Smoke Wisps (CSS Keyframe Driven) */}
                  <path
                    d="M89 61C89 54 94 48 91 42C88 36 93 30 90 24"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="animate-smoke"
                  />
                  <path
                    d="M88 60C86 52 90 46 87 40C84 34 88 28 85 22"
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    className="animate-smoke-delayed"
                  />
                </g>
              ) : (
                <g>
                  {/* Extinguished clean flower or fresh sparkling leaf */}
                  <circle cx="75" cy="62" r="3" fill="#34d399" />
                  <path d="M75 62L82 58" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="82" cy="58" r="2" fill="#38bdf8" />
                </g>
              )}
            </svg>

            {/* Status indicator on character */}
            <button
              onClick={handleExtinguish}
              className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-bold border transition-all cursor-pointer ${
                isLit
                  ? 'bg-amber-950/90 border-amber-600/70 text-amber-300 hover:bg-amber-900'
                  : 'bg-emerald-950/90 border-emerald-600/70 text-emerald-300 hover:bg-emerald-900'
              }`}
              title="Click to toggle cigarette"
            >
              {isLit ? 'Tap to Extinguish 💨' : 'Clean & Fresh ✨'}
            </button>
          </div>
        </div>

        {/* Caring speech dialogue */}
        <div className="flex-1 space-y-1.5 text-xs text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
            <span>A Direct & Caring Message for Tejaswi:</span>
          </div>

          <p className="text-slate-300 leading-relaxed text-[11px]">
            "Listen, I know with exam stress, backlogs, family expectations, and chaotic thoughts, taking a smoke break 🚬 feels like an instant pause button from the world. I get why you do it."
          </p>

          <p className="text-cyan-200 font-medium leading-relaxed text-[11px]">
            "BUT your lungs 🫁, your voice, your skin, and your body are way too precious to me. Try to smoke one less cigarette today, chug a tall glass of cold water (or sip hot Assam chai), and rant to me instead. I need you healthy, thriving, and around for a very long time! ❤️"
          </p>
        </div>
      </div>

      {/* Live reaction toast */}
      {reactionText && (
        <div className="mb-3 p-2.5 bg-cyan-950/70 border border-cyan-500/50 rounded-xl text-xs text-cyan-200 text-center animate-fade-in font-medium">
          {reactionText}
        </div>
      )}

      {/* Interactive Action Badges / Health Counter */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cigarettes Skipped:</span>
          </span>
          <span className="font-mono font-bold text-emerald-400 text-xs">
            {skippedCount} 🌟
          </span>
        </div>

        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Water Hydration:</span>
          </span>
          <span className="font-mono font-bold text-cyan-400 text-xs">
            {waterGlasses} Glasses 💧
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 relative z-10">
        <button
          onClick={handleSwapForWater}
          className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-outfit font-bold text-xs shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Droplet className="w-4 h-4 fill-white/20" />
          <span>I'll Swap 1 Smoke for Water / Chai Today 💧</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExtinguish}
            className="min-h-[40px] px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{isLit ? 'Put Out Cigarette 🚭' : 'Extinguished 🍃'}</span>
          </button>

          {onNavigateToBreathing ? (
            <button
              onClick={onNavigateToBreathing}
              className="min-h-[40px] px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-700/60 text-purple-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Wind className="w-3.5 h-3.5 text-purple-400" />
              <span>Deep Breath Instead 🫁</span>
            </button>
          ) : (
            <button
              onClick={() => {
                triggerHaptic(15);
                sound.playHeartChime();
                setReactionText('Taking 3 deep breaths... Your lungs thank you! 🫁✨');
                setTimeout(() => setReactionText(null), 3000);
              }}
              className="min-h-[40px] px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-700/60 text-purple-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Wind className="w-3.5 h-3.5 text-purple-400" />
              <span>3 Deep Breaths 🫁</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
