import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { sound } from '../utils/audio';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center text-center">
      {/* Care Package Graphic */}
      <div
        className="relative mb-5 group cursor-pointer active:scale-95 transition-transform"
        onClick={() => {
          sound.playSparkle();
          onStart();
        }}
      >
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/50 border-2 border-slate-700/80 bg-slate-900">
          <img
            src="/src/assets/images/friendship_care_1794340362566.jpg"
            alt="Care package with plushie and warm tea"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-900/95 px-3.5 py-1 rounded-full border border-rose-500/50 shadow-lg text-xs font-bold text-rose-300 flex items-center gap-1.5 whitespace-nowrap animate-bounce">
          <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
          <span>Tap to Open Check-In</span>
        </div>
      </div>

      {/* Title & Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-rose-400 text-xs font-semibold mb-2 shadow-xs">
        <HeartHandshake className="w-3.5 h-3.5" />
        <span>For Tejaswi · Personal Check-In</span>
      </div>

      <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-snug mb-2">
        Tejaswi's <span className="text-rose-400">Mind & Mood Radar</span> 🌙
      </h1>

      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5">
        A thoughtful check-in to see how you're feeling, understand your headspace, pop away daily stress, and make sure you're well taken care of.
      </p>

      {/* Dark Safe Space Rules Box */}
      <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 mb-6 text-left shadow-lg">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>The Safe Space Ground Rules:</span>
        </div>
        <ul className="text-xs text-slate-400 space-y-1.5 pl-6 list-disc">
          <li>100% honesty encouraged — zero judgment here.</li>
          <li>Tap the floating bubbles on your screen to pop away stress! 🫧</li>
          <li>Look out for agile buttons with supernatural reflexes.</li>
          <li>Ends with a personalized Support Card tailored to your mood.</li>
        </ul>
      </div>

      {/* Start Button */}
      <button
        onClick={() => {
          sound.playPop();
          onStart();
        }}
        className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-outfit font-bold text-sm sm:text-base shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
      >
        <span>Begin Mood Check-In</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <span className="text-slate-500 text-[11px] mt-2.5">
        Takes 1 minute · Made with genuine care
      </span>
    </div>
  );
};
