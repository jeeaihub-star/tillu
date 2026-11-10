import React, { useState } from 'react';
import { ArrowRight, BatteryCharging, Brain, Utensils, Zap, Sparkles } from 'lucide-react';
import { MoodItem, CravingItem } from '../types';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

const MOOD_OPTIONS: MoodItem[] = [
  {
    id: 'exam_backlog',
    emoji: '📚',
    title: 'Exams & Backlogs',
    vibe: 'Syllabus pileup, upcoming exams, or backlog anxiety.',
    honestThought: 'I am stressed about grades/backlogs and feel like my future is on the line right now.',
    friendAdvice: 'How to Support: Remind you that exams or backlogs NEVER define your intelligence or worth. One paper at a time.',
    color: 'from-amber-500/20 to-orange-600/10 border-amber-500/40 text-amber-300',
  },
  {
    id: 'family_pressure',
    emoji: '🏡',
    title: 'Family & Home',
    vibe: 'Expectations, relatives comparison, or tension at home.',
    honestThought: 'I love my family, but right now the environment feels heavy and draining.',
    friendAdvice: 'How to Support: A safe outside sanctuary where you do not have to defend your choices.',
    color: 'from-indigo-500/20 to-blue-600/10 border-indigo-500/40 text-indigo-300',
  },
  {
    id: 'diet_routine',
    emoji: '🥗',
    title: 'Diet & Routine',
    vibe: 'Living on erratic snacks, forgetting lunch, or feeling off.',
    honestThought: 'My eating schedule is completely messed up and my energy is crashing.',
    friendAdvice: 'How to Support: Gently remind you to eat a warm comforting meal, no diet-shaming.',
    color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/40 text-emerald-300',
  },
  {
    id: 'fitness_slump',
    emoji: '🏃‍♀️',
    title: 'Fitness Slump',
    vibe: 'Stiff neck, sitting too long studying, physically sluggish.',
    honestThought: 'I want to be active and feel strong, but getting off the bed takes immense effort.',
    friendAdvice: 'How to Support: No pressure workouts. Just a gentle walk or stretching while gossiping.',
    color: 'from-teal-500/20 to-cyan-600/10 border-teal-500/40 text-teal-300',
  },
  {
    id: 'people_fatigue',
    emoji: '🌸',
    title: '0% Social Battery',
    vibe: 'Spent all day being nice and functional; need quiet blankets.',
    honestThought: 'Please do not make me make decisions or talk to humans right now.',
    friendAdvice: 'How to Support: Zero-pressure presence, send quiet memes, ask nothing of you.',
    color: 'from-purple-500/20 to-pink-600/10 border-purple-500/40 text-purple-300',
  },
  {
    id: 'overthinking',
    emoji: '🧠',
    title: '47 Tabs Open',
    vibe: 'Brain won’t stop analyzing everything from today, yesterday, and 3 years ago.',
    honestThought: 'I am quietly spiraling and need someone to bring me back to reality.',
    friendAdvice: 'How to Support: Let you vent everything without offering annoying solutions.',
    color: 'from-rose-500/20 to-red-600/10 border-rose-500/40 text-rose-300',
  },
  {
    id: 'soft_tender',
    emoji: '🧸',
    title: 'Soft & Tender',
    vibe: 'Feeling a little emotional, fragile, or overwhelmed.',
    honestThought: 'I just want to feel heard, cared for, and reminded I’m doing my best.',
    friendAdvice: 'How to Support: Gentle compliments, reassuring words, and reminding you you’re appreciated.',
    color: 'from-pink-500/20 to-rose-600/10 border-pink-500/40 text-pink-300',
  },
  {
    id: 'hangry_chaos',
    emoji: '🦖',
    title: 'Hangry & Snacks',
    vibe: 'Every problem right now could be solved with hot comfort food.',
    honestThought: 'If someone offers me food right now, I will protect them forever.',
    friendAdvice: 'How to Support: Emergency snack dispatch. Do not question the food cravings.',
    color: 'from-yellow-500/20 to-amber-600/10 border-yellow-500/40 text-yellow-300',
  },
  {
    id: 'radiant_slay',
    emoji: '💅',
    title: 'Thriving & Slay',
    vibe: 'Looking cute, feeling confident, and handling my business.',
    honestThought: 'I feel great today and my energy is immaculate.',
    friendAdvice: 'How to Support: Match your energy and celebrate your wins.',
    color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/40 text-emerald-300',
  },
  {
    id: 'playful_menace',
    emoji: '😈',
    title: 'Playfully Chaotic',
    vibe: 'In the mood to roast you, cause harmless drama, and laugh.',
    honestThought: 'You are my designated target for teasing today.',
    friendAdvice: 'How to Support: Take the teasing like a champ and laugh with you.',
    color: 'from-sky-500/20 to-blue-600/10 border-sky-500/40 text-sky-300',
  },
];

// Curated with authentic Assam, India comfort foods
const CRAVINGS: CravingItem[] = [
  { id: 'assam_chai', label: 'Hot Assam CTC Chai & Biscuits', emoji: '☕' },
  { id: 'momos', label: 'Steaming Hot Street Momos & Chutney', emoji: '🥟' },
  { id: 'luchi_ghugni', label: 'Crisp Luchi & Aloor Dum / Ghugni', emoji: '🫓' },
  { id: 'aloo_pitika', label: 'Warm Rice & Aloo Pitika (Mustard Oil)', emoji: '🍲' },
  { id: 'sweet_jolpan', label: 'Doi-Chira with Gur & Pitha (Jolpan)', emoji: '🍯' },
  { id: 'chowmein', label: 'Spicy Street Chowmein / Thukpa', emoji: '🍜' },
  { id: 'kaji_nemu', label: 'Chilled Kaji Nemu Sharbat (Assam Lemon)', emoji: '🍋' },
  { id: 'boba', label: 'Iced Boba / Cold Frappe', emoji: '🧋' },
  { id: 'pizza', label: 'Cheesy Hot Pizza', emoji: '🍕' },
  { id: 'chocolate', label: 'Dark Chocolate & Warm Hug', emoji: '🍫' },
];

interface MoodCheckScreenProps {
  onComplete: (data: {
    mood: MoodItem;
    craving: CravingItem;
    batteryLevel: number;
    overthinkingLevel: number;
  }) => void;
}

export const MoodCheckScreen: React.FC<MoodCheckScreenProps> = ({ onComplete }) => {
  const [selectedMood, setSelectedMood] = useState<MoodItem>(MOOD_OPTIONS[0]);
  const [selectedCraving, setSelectedCraving] = useState<CravingItem>(CRAVINGS[0]);
  const [batteryLevel, setBatteryLevel] = useState<number>(4);
  const [overthinkingLevel, setOverthinkingLevel] = useState<number>(6);
  const [isThoughtExpanded, setIsThoughtExpanded] = useState<boolean>(false);

  const handleSubmit = () => {
    sound.playHeartChime();
    onComplete({
      mood: selectedMood,
      craving: selectedCraving,
      batteryLevel,
      overthinkingLevel,
    });
  };

  // Battery visual configuration
  const batteryPct = batteryLevel * 10;
  const isBatteryLow = batteryLevel <= 3;
  const isBatteryMid = batteryLevel > 3 && batteryLevel <= 7;
  const batteryColor = isBatteryLow
    ? 'bg-rose-500 shadow-rose-500/50'
    : isBatteryMid
    ? 'bg-amber-400 shadow-amber-400/50'
    : 'bg-emerald-400 shadow-emerald-400/50';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4">
      {/* Step Header */}
      <div className="text-center">
        <span className="inline-block px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-1">
          Stage 1 · Energy & Vibe Calibration
        </span>
        <h2 className="font-outfit text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          How is your energy right now? 🌸
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Tap your mood pod and calibrate your battery.
        </p>
      </div>

      {/* 2-Column Bento Vibe Matrix */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          1. Select Your Current Vibe Pod:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MOOD_OPTIONS.map((item) => {
            const isSelected = selectedMood.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  sound.playPop();
                  setSelectedMood(item);
                }}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.97] cursor-pointer flex flex-col justify-between relative overflow-hidden group min-h-[96px] ${
                  isSelected
                    ? `bg-gradient-to-br ${item.color} ring-2 ring-white/30 shadow-lg scale-[1.01]`
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-2xl drop-shadow-md">{item.emoji}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 ring-4 ring-rose-950"></span>
                  )}
                </div>
                <div>
                  <span className="font-outfit font-bold text-xs text-slate-100 block leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block line-clamp-2 leading-snug mt-1">
                    {item.vibe}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Selected Thought Box with Expand / Page Extend Feature */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 shadow-md animate-fade-in space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
            {selectedMood.emoji} Honest Thought Right Now:
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(8);
              setIsThoughtExpanded((p) => !p);
            }}
            className="text-[10px] font-bold text-slate-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-750"
          >
            {isThoughtExpanded ? 'Show Less ▴' : 'Expand Details ▾'}
          </button>
        </div>
        <p className="text-xs text-slate-200 italic leading-relaxed">
          "{selectedMood.honestThought}"
        </p>

        {isThoughtExpanded && (
          <div className="pt-2 border-t border-slate-850 animate-fade-in space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Safe Friend Prescription:
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-850">
              {selectedMood.friendAdvice}
            </p>
          </div>
        )}
      </div>

      {/* Hardware-styled iPhone Battery Cell & Overthinking Gauge */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-[28px] p-4 shadow-xl space-y-4">
        {/* Apple Battery Cell */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-rose-400" />
              <span>Social & Physical Battery</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
              {batteryPct}% {isBatteryLow ? '🪫 Low' : isBatteryMid ? '🔋 OK' : '⚡ High'}
            </span>
          </div>

          {/* Realistic iPhone Battery Graphic */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-9 bg-slate-950 rounded-xl p-1 border border-slate-700/80 flex items-center gap-1 shadow-inner relative">
              {Array.from({ length: 10 }).map((_, i) => {
                const isBarActive = i < batteryLevel;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      triggerHaptic(10);
                      sound.playPop();
                      setBatteryLevel(i + 1);
                    }}
                    className={`flex-1 h-full rounded-md transition-all cursor-pointer ${
                      isBarActive
                        ? `${batteryColor} shadow-xs`
                        : 'bg-slate-850 hover:bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
            {/* Battery Terminal Nub */}
            <div className="w-1.5 h-4 bg-slate-700 rounded-r-md" />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            {[
              { val: 2, label: '20% Drain' },
              { val: 5, label: '50% Balance' },
              { val: 8, label: '80% Good' },
              { val: 10, label: '100% Slay' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  sound.playPop();
                  setBatteryLevel(p.val);
                }}
                className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  batteryLevel === p.val
                    ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 font-bold'
                    : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overthinking Mind Noise Dial */}
        <div className="pt-3 border-t border-slate-850">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
            <span className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Overthinking / Brain Noise</span>
            </span>
            <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/60">
              {overthinkingLevel} / 10 · {overthinkingLevel <= 3 ? 'Peaceful 🧘‍♀️' : overthinkingLevel <= 7 ? 'Active Tabs 🌀' : 'Full Storm 🌪️'}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={overthinkingLevel}
            onChange={(e) => {
              setOverthinkingLevel(Number(e.target.value));
            }}
            className="w-full accent-purple-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Quiet Zen</span>
            <span>Busy Thoughts</span>
            <span>Galaxy Storm</span>
          </div>
        </div>
      </div>

      {/* Assam Comfort Food Bento Quick-Pick */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-[28px] p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Assam Comfort Fix (What would feel best?):</span>
          </div>
          <span className="text-[10px] text-amber-400 font-medium">Local Treats</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CRAVINGS.map((craving) => {
            const isSelected = selectedCraving.id === craving.id;
            return (
              <button
                key={craving.id}
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  sound.playPop();
                  setSelectedCraving(craving);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-200 ring-2 ring-amber-500/20 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-750'
                }`}
              >
                <span className="text-xl shrink-0">{craving.emoji}</span>
                <span className="text-[11px] font-medium leading-snug break-words line-clamp-2">
                  {craving.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Step Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 active:scale-95 text-white font-outfit font-bold text-sm shadow-xl shadow-rose-950/60 transition-all cursor-pointer"
      >
        <span>Lock In Energy & Open Mind Scan</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
