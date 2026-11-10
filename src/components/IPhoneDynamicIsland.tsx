import React, { useState, useEffect } from 'react';
import { Sparkles, BatteryCharging, Volume2, VolumeX, ShieldCheck, Music, Pause, Play } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { lofiMusic } from '../utils/lofiAudio';

interface IPhoneDynamicIslandProps {
  currentMoodEmoji?: string;
  currentMoodTitle?: string;
  batteryLevel?: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const IPhoneDynamicIsland: React.FC<IPhoneDynamicIslandProps> = ({
  currentMoodEmoji = '✨',
  currentMoodTitle = 'Checking in',
  batteryLevel = 5,
  isMuted,
  onToggleMute,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLofiPlaying, setIsLofiPlaying] = useState(lofiMusic.getIsPlaying());

  useEffect(() => {
    return lofiMusic.subscribe((playing) => {
      setIsLofiPlaying(playing);
    });
  }, []);

  const handleToggle = () => {
    triggerHaptic(15);
    setIsExpanded((prev) => !prev);
  };

  const handleToggleLofi = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(15);
    const active = lofiMusic.toggle();
    setIsLofiPlaying(active);
  };

  return (
    <div className="w-full flex justify-center pt-1.5 px-4 sticky top-0 z-50 pointer-events-none select-none">
      <div
        onClick={handleToggle}
        className={`pointer-events-auto bg-black text-white border border-white/10 shadow-2xl rounded-full transition-all duration-300 ease-out cursor-pointer flex items-center justify-between overflow-hidden ${
          isExpanded
            ? 'w-[92%] max-w-[370px] min-h-[70px] rounded-[28px] px-4 py-2.5 bg-black/95 backdrop-blur-2xl ring-1 ring-white/15'
            : 'w-48 h-8 px-3.5 hover:scale-105 active:scale-95'
        }`}
      >
        {!isExpanded ? (
          // Compact Dynamic Island Pill
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs animate-pulse">{currentMoodEmoji}</span>
              <span className="text-[11px] font-semibold text-slate-300 tracking-tight truncate max-w-[90px]">
                {currentMoodTitle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-mono">
              {isLofiPlaying && (
                <div className="flex items-end gap-0.5 h-2.5 mr-0.5">
                  <span className="w-0.5 h-2.5 bg-rose-400 animate-pulse rounded-full" />
                  <span className="w-0.5 h-1.5 bg-purple-400 animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-2 bg-indigo-400 animate-pulse delay-150 rounded-full" />
                </div>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{batteryLevel * 10}%</span>
            </div>
          </>
        ) : (
          // Expanded Dynamic Island
          <div className="w-full flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg">
                {currentMoodEmoji}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-outfit font-bold text-xs text-white">
                    Tejaswi's Status
                  </span>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                  {currentMoodTitle} · Battery {batteryLevel * 10}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleToggleLofi}
                className={`p-1.5 px-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
                  isLofiPlaying
                    ? 'bg-purple-950/80 border-purple-500/60 text-purple-300'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={isLofiPlaying ? 'Pause Lo-Fi Music' : 'Play Lo-Fi Music'}
              >
                {isLofiPlaying ? (
                  <Pause className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                )}
                <span className="text-[10px] font-bold font-outfit">Lo-Fi</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic(10);
                  onToggleMute();
                }}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                className="text-[10px] font-bold text-slate-400 px-2 py-1 rounded-lg bg-slate-900/60 border border-white/5"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
