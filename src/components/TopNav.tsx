import React from 'react';
import { Volume2, VolumeX, RotateCcw, Lock } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface TopNavProps {
  currentPhase: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onOpenVault: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentPhase,
  isMuted,
  onToggleMute,
  onRestart,
  onOpenVault,
}) => {
  return (
    <header className="w-full border-b border-slate-800/90 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="max-w-md md:max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center text-rose-400 shadow-sm">
            <span className="text-sm">✨</span>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-bold text-sm sm:text-base text-slate-100 tracking-tight leading-tight whitespace-nowrap">
              Tejaswi's Vibe Radar
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Daily Check-In & Pamper
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Secret Friend's Insights Vault button */}
          <button
            onClick={() => {
              triggerHaptic(10);
              onOpenVault();
            }}
            className="p-2 min-h-[38px] rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium active:scale-95 shadow-xs"
            title="View Real-Time Submissions"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] hidden sm:inline">Vault</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(10);
              onToggleMute();
            }}
            className="p-2 min-h-[38px] rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="text-[11px]">{isMuted ? 'Muted' : 'Sound'}</span>
          </button>

          {currentPhase !== 'INTRO' && (
            <button
              onClick={() => {
                triggerHaptic(10);
                sound.playPop();
                onRestart();
              }}
              className="p-2 min-h-[38px] rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium active:scale-95"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
