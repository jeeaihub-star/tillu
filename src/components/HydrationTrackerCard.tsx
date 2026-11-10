import React, { useState } from 'react';
import { Droplet, Sparkles, Check, RotateCcw, Plus, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface HydrationTrackerCardProps {
  herName?: string;
}

const TOTAL_GOAL_GLASSES = 8;
const ML_PER_GLASS = 250;

export const HydrationTrackerCard: React.FC<HydrationTrackerCardProps> = ({
  herName = 'Tejaswi',
}) => {
  const [glasses, setGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tejaswi_water_glasses');
      return saved !== null ? Math.min(TOTAL_GOAL_GLASSES, Math.max(0, parseInt(saved, 10))) : 3;
    } catch {
      return 3;
    }
  });

  const [rippleKey, setRippleKey] = useState<number>(0);
  const [showPlop, setShowPlop] = useState<boolean>(false);
  const [lastLoggedToast, setLastLoggedToast] = useState<string | null>(null);

  const saveGlasses = (count: number) => {
    setGlasses(count);
    try {
      localStorage.setItem('tejaswi_water_glasses', count.toString());
    } catch {
      // Ignore
    }
  };

  const handleAddGlass = (amount = 1) => {
    triggerHaptic(15);
    sound.playWaterDrop();
    setRippleKey((prev) => prev + 1);
    setShowPlop(true);
    setTimeout(() => setShowPlop(false), 500);

    const newCount = Math.min(TOTAL_GOAL_GLASSES, glasses + amount);
    saveGlasses(newCount);

    if (newCount >= TOTAL_GOAL_GLASSES) {
      sound.playCheer();
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#38bdf8', '#0ea5e9', '#0284c7', '#34d399', '#f43f5e'],
      });
      setLastLoggedToast(`Goal reached! 2,000ml logged. You're a hydration queen today, ${herName}! 🌊👑`);
    } else {
      setLastLoggedToast(`+${amount * ML_PER_GLASS}ml logged! Fresh cool water for your brain & lungs 💧`);
    }

    setTimeout(() => setLastLoggedToast(null), 3500);
  };

  const handleToggleGlassIndex = (index: number) => {
    // If tapping on or below current level, adjust to that level
    triggerHaptic(12);
    sound.playWaterDrop();
    setRippleKey((prev) => prev + 1);

    const targetCount = index + 1 === glasses ? index : index + 1;
    saveGlasses(targetCount);

    if (targetCount === TOTAL_GOAL_GLASSES) {
      sound.playCheer();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#38bdf8', '#34d399', '#f43f5e'],
      });
    }
  };

  const handleReset = () => {
    triggerHaptic(10);
    saveGlasses(0);
    setLastLoggedToast('Reset daily tracker for a fresh start 🔄');
    setTimeout(() => setLastLoggedToast(null), 2500);
  };

  const currentMl = glasses * ML_PER_GLASS;
  const goalMl = TOTAL_GOAL_GLASSES * ML_PER_GLASS;
  const percentFilled = Math.min(100, Math.round((glasses / TOTAL_GOAL_GLASSES) * 100));

  let motivationalQuote = 'Hydrate to flush out exam fatigue & boost your memory 📚';
  if (percentFilled >= 100) {
    motivationalQuote = 'Goal Achieved! Brain 100% recharged, headache prevented, skin glowing ✨';
  } else if (percentFilled >= 75) {
    motivationalQuote = 'Almost at 2 Liters! Your energy and focus are peaking 🌊';
  } else if (percentFilled >= 50) {
    motivationalQuote = 'Halfway there! Keep going, your body loves the clean hydration 💧';
  } else if (percentFilled >= 25) {
    motivationalQuote = 'Great start! A cool glass of water does wonders for overthinking 🍃';
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-cyan-500/30 rounded-[28px] p-4 sm:p-5 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Background cyan/ocean glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Droplet className="w-4 h-4 fill-cyan-400/20" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Hydration Tracker</span>
              <span className="text-[10px] text-cyan-400 font-normal">2.0L Daily Goal</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              For {herName} · Keeping headaches away and energy high
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
          {glasses} / {TOTAL_GOAL_GLASSES} Glasses
        </span>
      </div>

      {/* Water Fill Visual Progress Card */}
      <div className="relative z-10 bg-slate-950/80 border border-slate-850 rounded-2xl p-4 mb-4 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-outfit font-black text-2xl text-cyan-300 font-mono">
              {currentMl}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {goalMl} ml</span>
          </div>

          <span className="text-xs font-bold text-cyan-400 font-mono">
            {percentFilled}%
          </span>
        </div>

        {/* Liquid Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-3 relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${percentFilled}%` }}
          >
            {/* Liquid shimmer reflection */}
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Motivational subtext */}
        <div className="text-[11px] text-cyan-200/90 font-medium leading-snug flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{motivationalQuote}</span>
        </div>
      </div>

      {/* Hero Interactive Water Droplet Tap Zone */}
      <div className="relative z-10 flex flex-col items-center justify-center py-3 mb-4">
        <div className="relative flex items-center justify-center">
          {/* Animated Expanding Ripple on Tap */}
          {rippleKey > 0 && (
            <div
              key={rippleKey}
              className="absolute w-24 h-24 rounded-full border-2 border-cyan-400 pointer-events-none animate-water-ripple"
            />
          )}

          {/* Droplet Button */}
          <button
            type="button"
            onClick={() => handleAddGlass(1)}
            disabled={glasses >= TOTAL_GOAL_GLASSES}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all select-none shadow-xl cursor-pointer active:scale-90 group ${
              glasses >= TOTAL_GOAL_GLASSES
                ? 'bg-gradient-to-b from-teal-500 to-emerald-600 shadow-emerald-950/60 ring-4 ring-emerald-500/30'
                : 'bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 shadow-cyan-950/80 hover:shadow-cyan-900/60 ring-4 ring-cyan-500/20'
            }`}
          >
            <div className={`transition-transform ${showPlop ? 'animate-water-drop' : 'animate-droplet-float'}`}>
              {glasses >= TOTAL_GOAL_GLASSES ? (
                <Check className="w-8 h-8 text-white stroke-[2.5]" />
              ) : (
                <Droplet className="w-8 h-8 text-white fill-white/80 drop-shadow-md" />
              )}
            </div>
            <span className="text-[10px] font-outfit font-black text-white uppercase tracking-wider mt-0.5">
              {glasses >= TOTAL_GOAL_GLASSES ? 'Full' : 'Tap +1'}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 mt-2 font-medium">
          Tap the droplet to log a glass of water
        </span>
      </div>

      {/* 8 Interactive Glass Buttons Grid */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span>Daily 8 Cups Progress:</span>
          <span>Tap any cup to quick-log</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: TOTAL_GOAL_GLASSES }).map((_, idx) => {
            const isFilled = idx < glasses;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleGlassIndex(idx)}
                className={`h-11 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  isFilled
                    ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                }`}
                title={`Glass ${idx + 1} (${(idx + 1) * ML_PER_GLASS}ml)`}
              >
                <Droplet
                  className={`w-3.5 h-3.5 ${
                    isFilled ? 'text-cyan-400 fill-cyan-400/80' : 'text-slate-600'
                  }`}
                />
                <span className="font-mono text-xs font-bold">
                  #{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Feedback Message */}
      {lastLoggedToast && (
        <div className="mb-3 p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 text-center animate-fade-in font-medium">
          {lastLoggedToast}
        </div>
      )}

      {/* Action Footer Buttons */}
      <div className="relative z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleAddGlass(1)}
          disabled={glasses >= TOTAL_GOAL_GLASSES}
          className="flex-1 min-h-[44px] rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 disabled:opacity-50 text-white font-outfit font-bold text-xs shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log 1 Glass (250ml) 💧</span>
        </button>

        <button
          type="button"
          onClick={() => handleAddGlass(2)}
          disabled={glasses >= TOTAL_GOAL_GLASSES}
          className="min-h-[44px] px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95 disabled:opacity-40"
          title="Log 500ml Bottle"
        >
          <span>+500ml 🧋</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] px-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer active:scale-95"
          title="Reset Day"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
