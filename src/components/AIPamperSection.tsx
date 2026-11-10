import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Wand2, Send, CheckCircle2, Moon, Coffee } from 'lucide-react';
import { UserSessionData, AIPamperResult } from '../types';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface AIPamperSectionProps {
  sessionData: UserSessionData;
  onAIGenerated?: (result: AIPamperResult) => void;
}

export const AIPamperSection: React.FC<AIPamperSectionProps> = ({
  sessionData,
  onAIGenerated,
}) => {
  const [aiData, setAiData] = useState<AIPamperResult | null>(sessionData.aiPamper || null);
  const [loading, setLoading] = useState<boolean>(!sessionData.aiPamper);
  const [ventText, setVentText] = useState<string>('');
  const [ventLoading, setVentLoading] = useState<boolean>(false);
  const [ventResponse, setVentResponse] = useState<{ insight: string; soothingTip: string } | null>(null);
  const [completedRituals, setCompletedRituals] = useState<number[]>([]);

  const toggleRitualStep = (idx: number) => {
    const isNowChecked = !completedRituals.includes(idx);
    triggerHaptic(isNowChecked ? 14 : 8);
    sound.playPop();

    setCompletedRituals((prev) => {
      const updated = isNowChecked ? [...prev, idx] : prev.filter((i) => i !== idx);
      if (isNowChecked && aiData?.pamperRitual && updated.length === aiData.pamperRitual.length) {
        triggerHaptic(25);
        sound.playCheer();
      }
      return updated;
    });
  };

  // Prepare a personalized comfort plan on Mount if not already loaded
  useEffect(() => {
    if (aiData) return;

    let isMounted = true;
    async function fetchPamperPlan() {
      setLoading(true);
      try {
        const res = await fetch('/api/gemini/pamper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moodTitle: sessionData.selectedMood?.title,
            batteryLevel: sessionData.batteryLevel,
            overthinkingLevel: sessionData.overthinkingLevel,
            craving: sessionData.selectedCraving?.label,
            situationTitle: sessionData.selectedSituation?.title,
            supportPreference: sessionData.selectedSupport?.title,
            personalNote: sessionData.specialNoteToFriend,
            problemCategory: sessionData.problemCategory,
            customProblemText: sessionData.customProblemText,
          }),
        });
        const data = await res.json();
        if (isMounted) {
          setAiData(data);
          if (onAIGenerated) onAIGenerated(data);
        }
      } catch (err) {
        console.error('Error fetching pamper plan:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPamperPlan();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInstantSoothe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventText.trim() || ventLoading) return;

    triggerHaptic(15);
    sound.playSparkle();
    setVentLoading(true);

    try {
      const res = await fetch('/api/gemini/vent-soothe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vent: ventText }),
      });
      const data = await res.json();
      setVentResponse(data);
      setVentText('');
    } catch {
      setVentResponse({
        insight: 'Whatever is on your mind, you do not have to solve it all tonight.',
        soothingTip: 'Take three slow deep breaths and let yourself rest.',
      });
    } finally {
      setVentLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Pamper Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-rose-950/60 border border-purple-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Wand2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-outfit font-bold text-sm text-slate-100 flex items-center gap-1.5">
                Personalized Pampering Plan
                <span className="text-[10px] text-purple-400 font-normal">Offline comfort guide</span>
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-purple-300 bg-purple-900/60 px-2.5 py-0.5 rounded-full border border-purple-700/60">
            Tailored for Tejaswi
          </span>
        </div>

        {loading ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
            <span>Formulating your customized pampering recipe...</span>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs">
            {/* Mind Validation */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Emotional Validation & Mind Scan:
              </span>
              <p className="text-slate-300 leading-relaxed italic">
                "{aiData?.validation}"
              </p>
            </div>

            {/* Tonight's Pamper Ritual with Interactive iOS Checkboxes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <Moon className="w-3 h-3" />
                  <span>Tonight's Cozy Pamper Ritual:</span>
                </span>
                <span className="text-[10px] text-rose-300 font-mono">
                  {completedRituals.length} / {aiData?.pamperRitual?.length || 0} done
                </span>
              </div>
              <div className="space-y-1.5">
                {aiData?.pamperRitual?.map((step, idx) => {
                  const isChecked = completedRituals.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleRitualStep(idx)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer active:scale-[0.98] ${
                        isChecked
                          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                          : 'bg-slate-950/80 border-slate-850 text-slate-300 hover:border-slate-750 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-rose-500 border-rose-400 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-[11px] leading-tight flex-1 break-words ${isChecked ? 'line-through text-rose-300/80' : ''}`}>
                        {step}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Friend's Action Plan */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                <span>Friend's Pampering Playbook:</span>
              </span>
              <div className="space-y-1.5">
                {aiData?.friendPlaybook?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-950/70 border border-slate-850 rounded-xl text-slate-300 text-[11px] leading-tight"
                  >
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Warm Affirmation */}
            <div className="p-3 bg-gradient-to-r from-amber-950/40 to-yellow-950/30 border border-amber-500/30 rounded-2xl text-amber-200 text-center font-medium">
              <span className="block text-[10px] uppercase font-bold text-amber-400 mb-0.5">
                Daily Affirmation:
              </span>
              "{aiData?.affirmation}"
            </div>
          </div>
        )}
      </div>

      {/* Interactive Instant Soothe / Vent Widget */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center gap-1.5 mb-2">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-outfit font-bold text-xs text-slate-100">
            Instant Vent & Soothe (Private Vent & Soothe)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Type whatever thought or stress is bugging you right now to receive instant comfort.
        </p>

        <form onSubmit={handleInstantSoothe} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              placeholder="e.g. 'I have so much work and my brain is melted'..."
              className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
            <button
              type="submit"
              disabled={ventLoading || !ventText.trim()}
              className="min-h-[42px] px-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              {ventLoading ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Soothe</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Soothe Response Card */}
        {ventResponse && (
          <div className="mt-3 p-3 bg-purple-950/40 border border-purple-500/40 rounded-2xl space-y-1.5 animate-fade-in text-xs">
            <p className="text-purple-200 italic leading-snug">
              "{ventResponse.insight}"
            </p>
            <div className="p-2 bg-slate-950/80 rounded-xl text-slate-300 text-[11px] border border-purple-800/30">
              <strong className="text-purple-400">Micro-Action:</strong> {ventResponse.soothingTip}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
