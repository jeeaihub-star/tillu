import React, { useState } from 'react';
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { MindSituation, SupportStyle } from '../types';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

const MIND_SITUATIONS: MindSituation[] = [
  {
    id: 'exam_backlog_stress',
    emoji: '📚',
    title: 'Exams, Results & Backlogs',
    description: 'Syllabus pressure, upcoming papers, or backlog anxiety. Feeling scared of falling behind.',
    validation: 'Listen to me, Tejaswi: An exam, result, or backlog is just a paper test under time pressure. It does NOT define your intelligence, your capability, or your future. You will get through this, one topic at a time, and I am right here cheering for you.',
  },
  {
    id: 'family_pressure',
    emoji: '🏡',
    title: 'Family Expectations & Heaviness',
    description: 'Feeling the weight of family comparisons, relatives, or tension at home.',
    validation: 'Family pressure can make you feel like you owe everyone perfection. You are allowed to protect your mental sanctuary first.',
  },
  {
    id: 'diet_fitness_rut',
    emoji: '🥗',
    title: 'Diet & Routine Slump',
    description: 'Eating erratically, zero energy for workouts, feeling disconnected from my body.',
    validation: 'You do not need a punishing fitness regime to be worthy. Eating one nourishing meal and resting your body today is a victory.',
  },
  {
    id: 'strong_one',
    emoji: '💭',
    title: 'Tired of Being the Strong One',
    description: 'Handling work, studies, and life alone is exhausting. Sometimes I just want to be taken care of.',
    validation: 'You don’t have to carry the entire universe on your shoulders, Tejaswi. You are allowed to rest and let someone else care for you.',
  },
  {
    id: 'overwhelmed',
    emoji: '🧩',
    title: 'Too Much All at Once',
    description: 'My to-do list, expectations, and future thoughts feel like a 5-car pileup in my brain.',
    validation: 'Take a deep breath. You don’t have to solve your entire life today. One step, one hour at a time.',
  },
  {
    id: 'quiet_low',
    emoji: '🌧️',
    title: 'Low Energy for No Reason',
    description: 'No massive drama, just feeling emotionally tender, quiet, or running on empty.',
    validation: 'You never need a logical justification to feel low. Your feelings are 100% valid and seen.',
  },
  {
    id: 'vent_needed',
    emoji: '🌪️',
    title: 'Need an Unfiltered Rant',
    description: 'People tested my patience and I need to complain without being told to calm down.',
    validation: 'Grab your chai. I will agree that they are 100% wrong and you are right.',
  },
];

const SUPPORT_STYLES: SupportStyle[] = [
  {
    id: 'listen_only',
    emoji: '🎧',
    title: 'Unfiltered Rant Line',
    subtitle: 'Zero advice. Guaranteed 100% agreement with you.',
    badge: 'Safe Vent',
  },
  {
    id: 'distract_memes',
    emoji: '📱',
    title: 'Distraction Therapy',
    subtitle: 'Funny memes, gossip, and silly voice notes.',
    badge: 'Distraction',
  },
  {
    id: 'food_drop',
    emoji: '🥟',
    title: 'Assam Treat Drop',
    subtitle: 'Steaming momos & hot CTC chai to reboot your soul.',
    badge: 'Snack Drop',
  },
  {
    id: 'no_pressure',
    emoji: '🧸',
    title: 'Zero-Pressure Check-in',
    subtitle: 'Loving message with 48h guilt-free reply window.',
    badge: 'No Pressure',
  },
];

interface MindScanScreenProps {
  onComplete: (data: {
    situation: MindSituation;
    support: SupportStyle;
  }) => void;
}

export const MindScanScreen: React.FC<MindScanScreenProps> = ({ onComplete }) => {
  const [selectedSituation, setSelectedSituation] = useState<MindSituation>(MIND_SITUATIONS[0]);
  const [selectedSupport, setSelectedSupport] = useState<SupportStyle>(SUPPORT_STYLES[0]);
  const [isValidationExpanded, setIsValidationExpanded] = useState<boolean>(false);

  const handleSubmit = () => {
    sound.playHeartChime();
    onComplete({
      situation: selectedSituation,
      support: selectedSupport,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-1">
          Stage 2 · Heart & Mind Diagnostic
        </span>
        <h2 className="font-outfit text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          What are you quietly carrying? 💭
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Tap what resonates to decrypt your headspace.
        </p>
      </div>

      {/* Horizontal Headspace Selector Deck (Completely different from Stage 1) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          1. Tap What Fits Your Headspace Today:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {MIND_SITUATIONS.map((sit) => {
            const isSelected = selectedSituation.id === sit.id;
            return (
              <button
                key={sit.id}
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  sound.playPop();
                  setSelectedSituation(sit);
                }}
                className={`px-3 py-2 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/80 shadow-md shadow-purple-950/80 ring-2 ring-purple-500/30'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <span className="text-base shrink-0">{sit.emoji}</span>
                <span className="text-xs font-outfit font-bold whitespace-nowrap">
                  {sit.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Emotional Decryption Parchment (Centerpiece) */}
      <div className="bg-gradient-to-b from-purple-950/70 via-slate-900 to-indigo-950/60 border border-purple-500/40 rounded-[28px] p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Selected Headspace summary */}
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xl shrink-0 shadow-sm">
            {selectedSituation.emoji}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 block tracking-wider">
              Diagnosed Headspace:
            </span>
            <h4 className="font-outfit font-black text-sm text-slate-100">
              {selectedSituation.title}
            </h4>
          </div>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed italic bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 mb-3 relative z-10">
          "{selectedSituation.description}"
        </p>

        {/* Forensic Friend's Unconditional Validation with Text Expand */}
        <div className="p-3.5 bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-slate-950/60 border border-rose-500/30 rounded-2xl relative z-10 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>Friend's Reality Check for You:</span>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                setIsValidationExpanded((p) => !p);
              }}
              className="text-[10px] font-bold text-rose-300 hover:text-white bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 rounded-lg cursor-pointer"
            >
              {isValidationExpanded ? 'Less ▴' : 'Expand ▾'}
            </button>
          </div>
          <p className={`text-xs text-rose-200/90 leading-relaxed font-medium ${!isValidationExpanded ? 'line-clamp-3' : ''}`}>
            {selectedSituation.validation}
          </p>
        </div>
      </div>

      {/* Support Prescription Section (Apple Health / Care Contract Style) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-[28px] p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Friend Duty Prescription:</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Pick One</span>
        </div>

        <div className="space-y-2">
          {SUPPORT_STYLES.map((sup) => {
            const isSelected = selectedSupport.id === sup.id;
            return (
              <button
                key={sup.id}
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  sound.playPop();
                  setSelectedSupport(sup);
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500/70 shadow-lg ring-2 ring-emerald-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-750'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0">{sup.emoji}</span>
                  <div className="min-w-0">
                    <span className="font-outfit font-bold text-xs text-slate-100 block">
                      {sup.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block leading-snug break-words">
                      {sup.subtitle}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {isSelected ? (
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-600/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                      <span>Prescribed</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-900">
                      {sup.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 active:scale-95 text-white font-outfit font-bold text-sm shadow-xl shadow-purple-950/60 transition-all cursor-pointer"
      >
        <span>Next: Confidential Journal & Vent</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
