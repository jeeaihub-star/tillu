import React from 'react';
import { ArrowRight, HeartCrack, Lightbulb, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface DramaticRevealScreenProps {
  answer: string | null;
  dodges: number;
  onProceed: () => void;
}

export const DramaticRevealScreen: React.FC<DramaticRevealScreenProps> = ({
  answer,
  dodges,
  onProceed,
}) => {
  const isChaser = dodges >= 4;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 text-center">
      {/* Dramatic Alert Header */}
      <span className="inline-block px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-2 animate-bounce">
        🚨 Forensic Friendship Evaluation
      </span>
      <h2 className="font-outfit text-2xl font-black text-slate-100 tracking-tight mb-4">
        The Verdict Is In, Tejaswi! 🕵️‍♀️
      </h2>

      {/* Dramatic Card (Dark Mode) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl mb-6 text-left space-y-4">
        {/* Quote display */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-center">
          <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold block mb-0.5">
            Registered Tejaswi Response:
          </span>
          <p className="font-outfit text-base font-bold text-rose-200">
            "{answer || 'I desperately tapped the No button!'}"
          </p>
        </div>

        {/* Dramatic Analysis */}
        <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2">
            <HeartCrack className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-200">Dramatic Reaction:</strong> Gasp! 💔 The emotional distress! The cold-blooded audacity!
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-200">Psychology Breakdown:</strong>{' '}
              {isChaser
                ? `You chased that evasive 'No' button ${dodges} times. In behavioral science, that is classified as undeniable caring!`
                : 'Psychological science confirms: Playful teasing, sarcasm, and claiming you hate someone is the most authentic sign of a strong, comfortable friendship.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-850 border border-slate-700/80 text-emerald-300 text-[11px]">
            <span className="font-bold flex items-center gap-1.5 mb-0.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Final Forensic Translation:
            </span>
            "You actually appreciate having me in your corner, and we are friends through thick and thin."
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={() => {
          sound.playHeartChime();
          onProceed();
        }}
        className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-outfit font-bold text-sm shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
      >
        <span>View Official Support Plan</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
