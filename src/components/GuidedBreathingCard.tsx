import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind, Heart, Sparkles, Check, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface GuidedBreathingCardProps {
  herName?: string;
}

type BreathPhase = 'INHALE' | 'HOLD' | 'EXHALE' | 'REST';

const TOTAL_SESSION_SECONDS = 60;
const CYCLE_DURATION = 12; // 4s inhale, 2s hold, 4s exhale, 2s rest = 5 complete cycles

export const GuidedBreathingCard: React.FC<GuidedBreathingCardProps> = ({
  herName = 'Tejaswi',
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_SESSION_SECONDS);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  const prevPhaseRef = useRef<BreathPhase>('INHALE');

  // Elapsed seconds in current session
  const elapsed = TOTAL_SESSION_SECONDS - secondsRemaining;
  const cycleSeconds = elapsed % CYCLE_DURATION;
  const currentCycleNumber = Math.min(5, Math.floor(elapsed / CYCLE_DURATION) + 1);

  // Determine current phase based on cycleSeconds
  let currentPhase: BreathPhase = 'INHALE';
  let phaseInstruction = 'Breathe in slowly through your nose';
  let phaseSubtext = 'Expand your chest and fill your lungs...';
  let phaseBadgeColor = 'text-rose-400 bg-rose-950/80 border-rose-800/60';

  if (cycleSeconds < 4) {
    currentPhase = 'INHALE';
    phaseInstruction = 'Inhale slowly...';
    phaseSubtext = 'Feel the air filling your chest calmly';
    phaseBadgeColor = 'text-rose-400 bg-rose-950/80 border-rose-800/60';
  } else if (cycleSeconds < 6) {
    currentPhase = 'HOLD';
    phaseInstruction = 'Hold gently...';
    phaseSubtext = 'Stay still, embrace the quiet';
    phaseBadgeColor = 'text-purple-300 bg-purple-950/80 border-purple-800/60';
  } else if (cycleSeconds < 10) {
    currentPhase = 'EXHALE';
    phaseInstruction = 'Exhale softly...';
    phaseSubtext = 'Release every bit of stress and tension';
    phaseBadgeColor = 'text-indigo-300 bg-indigo-950/80 border-indigo-800/60';
  } else {
    currentPhase = 'REST';
    phaseInstruction = 'Pause & relax...';
    phaseSubtext = 'Drop your shoulders, soften your jaw';
    phaseBadgeColor = 'text-teal-300 bg-teal-950/80 border-teal-800/60';
  }

  // Trigger gentle audio and haptic feedback on phase change
  useEffect(() => {
    if (!isActive) return;

    if (currentPhase !== prevPhaseRef.current) {
      prevPhaseRef.current = currentPhase;
      triggerHaptic(10);
      if (isAudioEnabled) {
        if (currentPhase === 'INHALE' || currentPhase === 'EXHALE') {
          sound.playHeartChime();
        }
      }
    }
  }, [currentPhase, isActive, isAudioEnabled]);

  // Timer countdown interval
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          setIsCompleted(true);
          triggerHaptic(25);
          sound.playSparkle();
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#a855f7', '#38bdf8', '#34d399'],
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleTogglePlay = () => {
    triggerHaptic(15);
    if (isCompleted) {
      setSecondsRemaining(TOTAL_SESSION_SECONDS);
      setIsCompleted(false);
    }
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    triggerHaptic(10);
    setIsActive(false);
    setSecondsRemaining(TOTAL_SESSION_SECONDS);
    setIsCompleted(false);
    prevPhaseRef.current = 'INHALE';
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = ((TOTAL_SESSION_SECONDS - secondsRemaining) / TOTAL_SESSION_SECONDS) * 100;

  return (
    <div className="bg-slate-900/95 border border-purple-500/30 rounded-[28px] p-4 sm:p-5 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>60-Second Guided Breath</span>
              <span className="text-[10px] text-purple-400 font-normal">Nervous System Reset</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Synchronized calming rhythm for {herName}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic(8);
            setIsAudioEnabled((prev) => !prev);
          }}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer active:scale-90"
          title={isAudioEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
        >
          {isAudioEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      </div>

      {/* Progress Bar & Counter */}
      <div className="relative z-10 space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">
            {isCompleted ? 'Session Complete' : `Cycle ${currentCycleNumber} of 5`}
          </span>
          <span className="font-mono font-bold text-xs text-rose-400">
            {formatTime(secondsRemaining)} remaining
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual Animation Circle Area */}
      <div className="relative z-10 py-6 flex flex-col items-center justify-center min-h-[220px]">
        {isCompleted ? (
          <div className="text-center space-y-2 animate-fade-in p-4 bg-purple-950/30 border border-purple-500/40 rounded-3xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="font-outfit font-bold text-base text-slate-100">
              60 Seconds of Peace Completed 🌸
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              Your heart rate is softer, your cortisol is lower, and you gave yourself a genuine moment of care.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-outfit font-bold text-xs shadow-lg shadow-purple-950/60 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Breathe Again (60s)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-48 h-48">
            {/* Outer Expanding Wave Ripple (CSS Keyframe Driven) */}
            <div
              className={`absolute inset-0 rounded-full border border-purple-500/30 pointer-events-none ${
                isActive ? 'animate-breathe-ripple' : ''
              }`}
              style={{
                animationPlayState: isActive ? 'running' : 'paused',
              }}
            />

            {/* Rotating Star Halo */}
            <div
              className={`absolute inset-3 rounded-full border border-dashed border-rose-500/20 pointer-events-none ${
                isActive ? 'animate-breathe-halo' : ''
              }`}
              style={{
                animationPlayState: isActive ? 'running' : 'paused',
              }}
            />

            {/* Main Breathing Orb (CSS Keyframe Driven) */}
            <div
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-center p-3 transition-transform duration-700 select-none shadow-2xl ${
                isActive ? 'animate-breathe' : 'scale-90 opacity-60'
              }`}
              style={{
                animationPlayState: isActive ? 'running' : 'paused',
                background:
                  'radial-gradient(circle, rgba(244,63,94,0.7) 0%, rgba(168,85,247,0.6) 50%, rgba(99,102,241,0.5) 100%)',
              }}
            >
              <Heart className="w-4 h-4 text-white/90 mb-1" />
              <span className="font-outfit font-black text-xs text-white tracking-wide uppercase drop-shadow-md">
                {isActive ? currentPhase : 'READY'}
              </span>
              <span className="text-[10px] text-white/80 font-mono mt-0.5">
                {isActive ? `${Math.ceil(12 - (elapsed % 12))}s` : 'Tap Start'}
              </span>
            </div>
          </div>
        )}

        {/* Phase Guidance Caption */}
        {!isCompleted && (
          <div className="mt-4 text-center space-y-1">
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${phaseBadgeColor}`}
            >
              {isActive ? phaseInstruction : '60-Second Reset'}
            </span>
            <p className="text-xs text-slate-400 font-medium h-4">
              {isActive ? phaseSubtext : 'Press start to synchronize your breath'}
            </p>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {!isCompleted && (
        <div className="relative z-10 pt-2 flex items-center justify-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`min-h-[46px] px-6 rounded-2xl font-outfit font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
              isActive
                ? 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-rose-950/80'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 text-slate-300" />
                <span>Pause Breath</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-white" />
                <span>Start 60s Breathing</span>
              </>
            )}
          </button>

          {(isActive || secondsRemaining < TOTAL_SESSION_SECONDS) && (
            <button
              onClick={handleReset}
              className="min-h-[46px] px-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
