import React, { useState } from 'react';
import { Sparkles, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

export interface MicroVibeItem {
  id: string;
  emoji: string;
  label: string;
  note: string;
  color: string;
}

const MICRO_VIBES: MicroVibeItem[] = [
  { id: 'tender', emoji: '🌸', label: 'Tender & Fragile', note: 'Feeling soft today · Needs gentle warmth 🧸', color: 'ring-pink-400 bg-pink-950/40 text-pink-300' },
  { id: 'exams', emoji: '📚', label: 'Exam / Study Fried', note: 'Brain is boiling from syllabus & backlogs 📖', color: 'ring-amber-400 bg-amber-950/40 text-amber-300' },
  { id: 'chai_food', emoji: '🧋', label: 'Need Treats / Chai', note: 'Needs hot Assam chai or steaming momos right now 🥟', color: 'ring-orange-400 bg-orange-950/40 text-orange-300' },
  { id: 'low_bat', emoji: '🪫', label: '0% Battery', note: 'Socially & physically drained · Quiet mode active 🌙', color: 'ring-rose-400 bg-rose-950/40 text-rose-300' },
  { id: 'overthinking', emoji: '🌪️', label: 'Overthinking Loop', note: 'Brain tabs are spiraling · Remind me to breathe 🌀', color: 'ring-purple-400 bg-purple-950/40 text-purple-300' },
  { id: 'slaying', emoji: '👑', label: 'Slaying & Thriving', note: 'Immense queen energy · Looking cute and handling business ✨', color: 'ring-emerald-400 bg-emerald-950/40 text-emerald-300' },
  { id: 'sleepy', emoji: '😴', label: 'Sleepy & Done', note: 'Done with human interaction today · Blanket burrito mode 🛌', color: 'ring-sky-400 bg-sky-950/40 text-sky-300' },
];

interface MicroVibeBarProps {
  herName?: string;
  onVibeSelected: (vibe: MicroVibeItem) => void;
  activeVibeId?: string | null;
}

export const MicroVibeBar: React.FC<MicroVibeBarProps> = ({
  herName = 'Tejaswi',
  onVibeSelected,
  activeVibeId,
}) => {
  const [selectedVibe, setSelectedVibe] = useState<MicroVibeItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const handleSelectVibe = (vibe: MicroVibeItem) => {
    triggerHaptic(12);
    sound.playPop();
    setSelectedVibe(vibe);
    onVibeSelected(vibe);

    setToastMessage(`Micro-vibe logged: ${vibe.emoji} "${vibe.label}" — ${vibe.note}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 select-none pointer-events-none">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="max-w-md mx-auto px-4 mb-2 pointer-events-auto">
          <div className="bg-slate-900/95 border border-purple-500/50 text-slate-100 text-xs py-2 px-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2 animate-fade-in ring-1 ring-purple-500/20">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate text-[11px] font-medium text-slate-200">
                {toastMessage}
              </span>
            </div>
            <span className="text-[10px] text-purple-400 font-bold shrink-0">Synced ⚡</span>
          </div>
        </div>
      )}

      {/* Persistent Dock Bar */}
      <div className="w-full bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pointer-events-auto transition-all duration-300 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-between gap-2">
          {/* Label / Expand toggle */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(8);
              setIsMinimized((prev) => !prev);
            }}
            className="flex items-center gap-1 text-[11px] font-outfit font-bold text-slate-400 hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
            title={isMinimized ? 'Expand quick reaction bar' : 'Minimize bar'}
          >
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span className="hidden xs:inline">Micro-Vibe:</span>
            {isMinimized ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Micro-Vibe Buttons Carousel / Row */}
          {!isMinimized ? (
            <div className="flex-1 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
              {MICRO_VIBES.map((vibe) => {
                const isActive = (selectedVibe?.id || activeVibeId) === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => handleSelectVibe(vibe)}
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-lg sm:text-xl transition-all cursor-pointer shrink-0 active:scale-125 ${
                      isActive
                        ? `ring-2 ${vibe.color} shadow-lg scale-105`
                        : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                    title={vibe.label}
                  >
                    <span className="drop-shadow-xs">{vibe.emoji}</span>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-end gap-1.5 py-0.5">
              <span className="text-[11px] text-slate-400 italic truncate">
                {selectedVibe ? `${selectedVibe.emoji} ${selectedVibe.label}` : 'Tap to react anytime'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
