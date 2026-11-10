import React, { useState } from 'react';
import { ArrowRight, Sparkles, BookOpen, ShieldCheck, Send, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface VentJournalScreenProps {
  onComplete: (data: { category: string; text: string; aiAdvice: string | null }) => void;
  initialCategory?: string;
  initialText?: string;
}

const CATEGORIES = [
  { id: 'exams', label: 'Exams, Results & Backlogs', emoji: '📚' },
  { id: 'family', label: 'Family Dynamics & Home Pressure', emoji: '🏡' },
  { id: 'diet_fitness', label: 'Diet, Fitness & Routine Rut', emoji: '🥗' },
  { id: 'work', label: 'Work / Academics / Deadlines', emoji: '💼' },
  { id: 'overthinking', label: 'Overthinking & Future Anxiety', emoji: '🌪️' },
  { id: 'social', label: 'People Drama & Social Fatigue', emoji: '👥' },
  { id: 'burnout', label: 'Physical Burnout / 0% Energy', emoji: '🔋' },
  { id: 'tender', label: 'Emotionally Tender / Need Comfort', emoji: '🧸' },
  { id: 'random', label: 'Just an Unexplainable Heavy Mood', emoji: '🌧️' },
];

export const VentJournalScreen: React.FC<VentJournalScreenProps> = ({
  onComplete,
  initialCategory = 'work',
  initialText = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [journalText, setJournalText] = useState<string>(initialText);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<{ insight: string; soothingTip: string } | null>(null);

  const handleGetAIAdvice = () => {
    if (!journalText.trim() || aiLoading) return;
    triggerHaptic(15);
    sound.playSparkle();
    setAiLoading(true);
    setAiAdvice({
      insight: 'Carrying all of this by yourself would exhaust anyone. Your feelings make sense, and you deserve support without judgement or pressure.',
      soothingTip: 'Put on warm socks, drink a glass of water, and give yourself permission to pause for a few minutes.',
    });
    setAiLoading(false);
  };

  const handleProceed = () => {
    triggerHaptic(15);
    sound.playPop();
    const activeCatLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'General';
    onComplete({
      category: activeCatLabel,
      text: journalText.trim(),
      aiAdvice: aiAdvice?.insight || null,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3">
      {/* Header */}
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
          Stage 3 of 5 · Safe Journal & Problem Share
        </span>
        <h2 className="font-outfit text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          What's weighing on you, Tejaswi? 📓
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          A confidential space to vent. No filters, no pressure.
        </p>
      </div>

      {/* Category Pills (iOS Segmented style) */}
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-300 block mb-2">
          Select what category this falls into:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic(10);
                  sound.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`p-2 rounded-xl text-left border text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 text-amber-200 ring-1 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-base shrink-0">{cat.emoji}</span>
                <span className="text-[11px] font-medium leading-tight break-words line-clamp-2">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* iOS Notes-Style Text Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Private Notes Journal</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {journalText.length} characters
          </span>
        </div>

        <textarea
          rows={5}
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Feel free to write whatever has been on your mind or bothering you lately... college, work, family, feeling tired, or anything that feels heavy. You don't have to keep it in."
          className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
        />

        {/* Offline comfort perspective */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Saved securely for your friend's eyes
          </span>

          <button
            onClick={handleGetAIAdvice}
            disabled={aiLoading || !journalText.trim()}
            className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/60 hover:bg-purple-900 text-purple-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer active:scale-95 shrink-0"
          >
            {aiLoading ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Instant Comfort</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Advice Card if generated */}
      {aiAdvice && (
        <div className="bg-purple-950/40 border border-purple-500/40 rounded-2xl p-3.5 mb-4 shadow-xl space-y-2 animate-fade-in text-xs">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Gentle Psychological Perspective:</span>
          </div>
          <p className="text-purple-200 italic leading-relaxed text-[11px]">
            "{aiAdvice.insight}"
          </p>
          <div className="p-2 bg-slate-950/80 rounded-xl text-slate-300 text-[11px] border border-purple-800/30">
            <strong className="text-purple-400">Micro-Action:</strong> {aiAdvice.soothingTip}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleProceed}
        className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-outfit font-bold text-sm shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
      >
        <span>
          {journalText.trim() ? 'Save Journal & Continue' : 'Skip & Continue to Truth Test'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
