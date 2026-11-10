import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Ticket,
  Copy,
  Check,
  Share2,
  RotateCcw,
  MessageCircle,
  Heart,
  Send,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSessionData, AIPamperResult } from '../types';
import { saveLocalReport } from '../utils/reports';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { AIPamperSection } from './AIPamperSection';
import { GuidedBreathingCard } from './GuidedBreathingCard';
import { SmokeLessHealthCard } from './SmokeLessHealthCard';
import { HydrationTrackerCard } from './HydrationTrackerCard';

interface CarePlanScreenProps {
  sessionData: UserSessionData;
  onRestart: () => void;
  onUpdateSessionNote: (note: string) => void;
}

interface CareChecklistItem {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
}

const CARE_CHECKLIST: CareChecklistItem[] = [
  { id: 'chai_food', emoji: '🫖', title: 'Hot Assam Chai or Comfort Snack', subtitle: 'Warm CTC chai, momos, or sweet treat to soothe the mind' },
  { id: 'hydration', emoji: '💧', title: 'Tall Glass of Cool Water', subtitle: 'Reboot energy and clear away study/work headache' },
  { id: 'breathing', emoji: '🫁', title: '60s Deep Breathing Pause', subtitle: 'Slow steady breaths to calm the nervous system' },
  { id: 'blanket_dnd', emoji: '🌙', title: 'Dim Lights & Blanket Burrito Mode', subtitle: 'Phone on Do Not Disturb with zero guilt' },
  { id: 'vent_friend', emoji: '🧸', title: 'Safe Vent Privilege', subtitle: 'No keeping feelings locked in — friend is in your corner' },
];

const DEFAULT_COUPONS = [
  { id: 'chai_momos', title: '1x Hot Assam Chai & Steaming Momos Drop', desc: 'Strong ginger CTC chai & spicy Guwahati street momos on tough study days.', emoji: '🥟' },
  { id: 'exam_pep', title: '1x Exam / Backlog Anxiety Buster Pep Talk', desc: 'Zero-judgment reminder that marks do not define your intelligence or future.', emoji: '📚' },
  { id: 'smoke_swap', title: '1x Smoke Break Intercept & Chilled Drink', desc: 'Swap a cigarette for fresh air, deep breaths, and a listening ear.', emoji: '🚭' },
  { id: 'boba', title: '1x Emergency Boba / Treat Drop', desc: 'Boba or sweet Jolpan whenever you’re drained.', emoji: '🧋' },
  { id: 'rant', title: '1x Free 2AM Unfiltered Rant', desc: 'Vent about family, exams, or people. Guaranteed 100% agreement.', emoji: '🎧' },
  { id: 'ghost', title: '1x Zero-Guilt Ghosting Pass', desc: 'Take 48 hours to reply to texts without feeling bad.', emoji: '🧸' },
  { id: 'hang', title: '1x Cozy Low-Effort Hangout', desc: 'Comfort food, movies, sweatpants, zero stress.', emoji: '☕' },
];

export const CarePlanScreen: React.FC<CarePlanScreenProps> = ({
  sessionData,
  onRestart,
  onUpdateSessionNote,
}) => {
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [completedChecklist, setCompletedChecklist] = useState<string[]>([]);
  const [personalNote, setPersonalNote] = useState<string>(sessionData.specialNoteToFriend || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToBackend, setSavedToBackend] = useState<boolean>(false);
  const [isFinalized, setIsFinalized] = useState<boolean>(!!sessionData.planFinalized);

  // Multi-wave grand celebration confetti for finalizing pamper plan
  const triggerGrandCelebrationConfetti = () => {
    // Stage 1: Dual side cannons shooting upward across the screen
    confetti({
      particleCount: 75,
      angle: 60,
      spread: 65,
      origin: { x: 0.08, y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8', '#34d399'],
      zIndex: 9999,
    });
    confetti({
      particleCount: 75,
      angle: 120,
      spread: 65,
      origin: { x: 0.92, y: 0.8 },
      colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8', '#34d399'],
      zIndex: 9999,
    });

    // Stage 2: Starburst & circular burst from center
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 120,
        origin: { y: 0.55 },
        shapes: ['star', 'circle'],
        scalar: 1.25,
        colors: ['#fbbf24', '#f43f5e', '#c084fc', '#38bdf8', '#f472b6'],
        zIndex: 9999,
      });
    }, 220);

    // Stage 3: Lingering golden pastel shower
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.45 },
        ticks: 240,
        gravity: 0.75,
        colors: ['#fbbf24', '#f43f5e', '#a855f7', '#34d399', '#60a5fa'],
        zIndex: 9999,
      });
    }, 450);
  };

  // Auto-sync report to server backend
  const syncReportToBackend = async (
    noteText = personalNote,
    aiResult?: AIPamperResult,
    finalized = isFinalized
  ) => {
    try {
      saveLocalReport({
        herName: sessionData.herName,
        selectedMood: sessionData.selectedMood,
        selectedCraving: sessionData.selectedCraving,
        selectedSituation: sessionData.selectedSituation,
        selectedSupport: sessionData.selectedSupport,
        batteryLevel: sessionData.batteryLevel,
        overthinkingLevel: sessionData.overthinkingLevel,
        problemCategory: sessionData.problemCategory,
        customProblemText: sessionData.customProblemText,
        hateAnswer: sessionData.hateAnswer,
        noDodgeCount: sessionData.noDodgeCount,
        specialNoteToFriend: noteText,
        aiPamper: aiResult || sessionData.aiPamper,
        planFinalized: finalized,
        finalizedAt: finalized
          ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
      });
      setSavedToBackend(true);
    } catch (err) {
      console.error('Failed to save report in this browser:', err);
    }
  };

  useEffect(() => {
    syncReportToBackend();
  }, []);

  const handleFinalizePlan = () => {
    setIsFinalized(true);
    triggerHaptic(25);
    sound.playCheer();
    triggerGrandCelebrationConfetti();
    syncReportToBackend(personalNote, undefined, true);
  };

  const toggleChecklistItem = (id: string) => {
    const isNowChecked = !completedChecklist.includes(id);
    triggerHaptic(isNowChecked ? 14 : 8);
    sound.playPop();

    setCompletedChecklist((prev) => {
      const updated = isNowChecked ? [...prev, id] : prev.filter((item) => item !== id);
      if (isNowChecked && updated.length === CARE_CHECKLIST.length) {
        triggerHaptic(25);
        sound.playSparkle();
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#f43f5e', '#a855f7', '#34d399', '#38bdf8', '#fbbf24'],
        });
      }
      return updated;
    });
  };

  const toggleCoupon = (id: string) => {
    const isNowClaiming = !redeemed.includes(id);
    triggerHaptic(isNowClaiming ? 18 : 10);
    sound.playSparkle();
    if (isNowClaiming) {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#a855f7', '#fbbf24', '#38bdf8'],
      });
    }

    setRedeemed((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNoteBlur = () => {
    triggerHaptic(12);
    onUpdateSessionNote(personalNote);
    syncReportToBackend(personalNote);
  };

  const generateWhatsAppMessage = () => {
    const moodStr = `${sessionData.selectedMood?.emoji || '🌸'} ${sessionData.selectedMood?.title || 'Comfortable'}`;
    const sitStr = sessionData.selectedSituation?.title || 'Doing fine';
    const fuelStr = `${sessionData.selectedCraving?.emoji || '🧋'} ${sessionData.selectedCraving?.label || 'Boba'}`;
    const supportStr = sessionData.selectedSupport?.title || 'Just listening';

    return `🌸 TEJASWI'S MOOD & CHECK-IN REPORT 🌸\n\nHey! I completed your check-in 😂\n\n📋 How I'm feeling today:\n• Mood: ${moodStr}\n• Headspace: "${sitStr}"\n• Social Battery: ${sessionData.batteryLevel * 10}%\n• Comfort Craving: ${fuelStr}\n• Best way to support me: "${supportStr}"\n${sessionData.customProblemText ? `• What's on my mind: "${sessionData.customProblemText}" (${sessionData.problemCategory || 'Journal'})\n` : ''}• Did I say I hate you? Answer was: "${sessionData.hateAnswer || 'Chased the No button'}" (${sessionData.noDodgeCount} dodges!)\n${personalNote ? `\n💌 Note for you:\n"${personalNote}"\n` : ''}\nThanks for genuinely checking on me! 🌙✨`;
  };

  const handleCopy = () => {
    triggerHaptic(10);
    sound.playPop();
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    triggerHaptic(15);
    sound.playPop();
    if (!isFinalized) {
      setIsFinalized(true);
      triggerGrandCelebrationConfetti();
    }
    syncReportToBackend(personalNote, undefined, true);
    const text = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4">
      {/* Banner Card */}
      <div className="relative rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
        <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-slate-950">
          <img
            src="/src/assets/images/celebration_toast_1794334028314.jpg"
            alt="Toast with coffee and boba"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold block">
                Care Protocol Activated 🌙
              </span>
              <h2 className="font-outfit text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Tejaswi's Support Pass
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Official Diagnostic Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-[28px] p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-rose-400" />
            <span className="font-outfit font-bold text-sm text-slate-100">
              Diagnostic Summary
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Recorded</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
            <span className="text-slate-500 block text-[9px] uppercase">Registered Mood</span>
            <span className="font-bold text-slate-200 block text-[11px] leading-tight break-words mt-0.5">
              {sessionData.selectedMood?.emoji} {sessionData.selectedMood?.title}
            </span>
          </div>
          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
            <span className="text-slate-500 block text-[9px] uppercase">Social Battery</span>
            <span className="font-bold text-rose-400 block text-[11px] leading-tight mt-0.5">
              {sessionData.batteryLevel * 10}% · {sessionData.batteryLevel <= 3 ? 'Rest needed' : 'Doing good'}
            </span>
          </div>
          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
            <span className="text-slate-500 block text-[9px] uppercase">Comfort Fuel</span>
            <span className="font-bold text-amber-400 block text-[11px] leading-tight break-words mt-0.5">
              {sessionData.selectedCraving?.emoji} {sessionData.selectedCraving?.label}
            </span>
          </div>
          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col justify-between">
            <span className="text-slate-500 block text-[9px] uppercase">Hate Level</span>
            <span className="font-bold text-emerald-400 block text-[11px] leading-tight mt-0.5">
              0% Real Hate ❤️
            </span>
          </div>
        </div>

        {/* Selected Headspace */}
        <div className="p-2.5 bg-purple-950/40 border border-purple-800/40 rounded-2xl text-xs text-purple-200 mb-2">
          <span className="font-bold block text-[10px] uppercase text-purple-400">
            Headspace Right Now:
          </span>
          <p className="mt-0.5 font-medium leading-snug">
            "{sessionData.selectedSituation?.title || 'Doing fine'}"
          </p>
        </div>

        {/* Custom Problem Shared */}
        {sessionData.customProblemText && (
          <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-xs text-amber-200 mb-2">
            <span className="font-bold block text-[10px] uppercase text-amber-400">
              Journal Vent ({sessionData.problemCategory || 'Shared'}):
            </span>
            <p className="mt-0.5 font-medium leading-snug italic">
              "{sessionData.customProblemText}"
            </p>
          </div>
        )}

        {/* Support Duty */}
        <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-2xl text-xs text-rose-200">
          <span className="font-bold block text-[10px] uppercase text-rose-400">
            Selected Support Preference:
          </span>
          <p className="mt-0.5 font-medium leading-snug">
            {sessionData.selectedSupport?.title || 'Be a great listener'}
          </p>
        </div>
      </div>

      {/* 60-Second Guided Breathing (CSS Keyframe Animated) */}
      <GuidedBreathingCard herName={sessionData.herName} />

      {/* Hydration Tracker with Satisfying Water Droplet Animation */}
      <HydrationTrackerCard herName={sessionData.herName} />

      {/* Smoke Less & Health Buddy (Cool Animated Character) */}
      <SmokeLessHealthCard herName={sessionData.herName} />

      {/* AI Pampering Engine Section */}
      <AIPamperSection
        sessionData={sessionData}
        onAIGenerated={(res) => syncReportToBackend(personalNote, res)}
      />

      {/* Tonight's Interactive Care & Reset Checklist (iOS Checkbox style with tactile haptics) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-[28px] p-4 shadow-xl">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <h3 className="font-outfit font-bold text-sm text-slate-100">
              Tonight's Care & Reset Checklist
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800/60">
            {completedChecklist.length} / {CARE_CHECKLIST.length} Checked
          </span>
        </div>
        <p className="text-slate-400 text-[11px] mb-3">
          Tap each checkbox to complete sections and unwind tonight:
        </p>

        <div className="space-y-2">
          {CARE_CHECKLIST.map((item) => {
            const isChecked = completedChecklist.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-full min-h-[48px] p-2.5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between gap-2.5 ${
                  isChecked
                    ? 'border-rose-500/60 bg-rose-950/30 shadow-xs'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <span
                      className={`font-outfit font-bold text-xs block leading-tight break-words ${
                        isChecked ? 'line-through text-rose-300' : 'text-slate-100'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-snug break-words mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-rose-500 border-rose-400 text-white shadow-xs'
                      : 'border-slate-700 bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pamper Plan Finalization & Celebration Section */}
      {!isFinalized ? (
        <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-purple-950/70 border border-rose-500/40 rounded-[28px] p-4 shadow-xl text-center relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Ready to lock in tonight's pampering?</span>
            </div>
            <h3 className="font-outfit font-black text-slate-100 text-base sm:text-lg">
              Finalize Tejaswi's Pamper Plan 🌙
            </h3>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">
              Seal this official care routine, claim your comfort perks, and lock in unconditional friendship support.
            </p>
            <button
              onClick={handleFinalizePlan}
              className="w-full min-h-[50px] rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-outfit font-bold text-sm shadow-xl shadow-rose-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group-hover:shadow-rose-900/60"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Finalize & Seal Pampering Plan 🎊</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/50 rounded-[28px] p-4 shadow-xl relative overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block">
                  Official Support Pass
                </span>
                <h4 className="font-outfit font-bold text-sm text-slate-100">
                  Plan Officially Finalized & Sealed ✨
                </h4>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic(15);
                sound.playCheer();
                triggerGrandCelebrationConfetti();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1 active:scale-95 cursor-pointer shadow-xs"
            >
              <span>Celebrate 🎊</span>
            </button>
          </div>
          <p className="text-slate-300 text-xs mt-2 leading-relaxed">
            Tejaswi's care ritual is sealed. Free treats, listening ear, and zero-pressure comfort are officially active!
          </p>
        </div>
      )}

      {/* Redeemable Friendship Coupons */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-[28px] p-4 shadow-xl">
        <h3 className="font-outfit font-bold text-sm text-slate-100 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Lifetime Support Coupons (Tap to redeem):</span>
        </h3>
        <p className="text-slate-500 text-[11px] mb-3">
          Never expire. Redeemable anytime with your friend.
        </p>

        <div className="space-y-2">
          {DEFAULT_COUPONS.map((coupon) => {
            const isClaimed = redeemed.includes(coupon.id);
            return (
              <button
                key={coupon.id}
                onClick={() => toggleCoupon(coupon.id)}
                className={`w-full min-h-[48px] p-2.5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between gap-2 ${
                  isClaimed
                    ? 'border-emerald-500/60 bg-emerald-950/40 shadow-xs'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0">{coupon.emoji}</span>
                  <div className="min-w-0">
                    <span className="font-outfit font-bold text-xs text-slate-100 block leading-tight break-words">
                      {coupon.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-snug break-words mt-0.5">
                      {coupon.desc}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                    isClaimed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isClaimed ? 'Claimed! ✨' : 'Redeem'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secret Note for Friend */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-[28px] p-4 shadow-xl">
        <label className="font-outfit font-bold text-xs text-slate-200 mb-1 flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Leave a personal note or tell me what you need:</span>
        </label>
        <textarea
          rows={2}
          value={personalNote}
          onChange={(e) => setPersonalNote(e.target.value)}
          onBlur={handleNoteBlur}
          placeholder="e.g. 'Get me boba tomorrow' or 'Thanks for checking in on me'..."
          className="w-full p-2.5 rounded-2xl border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-950/90 resize-none placeholder:text-slate-600"
        />
        <div className="flex justify-end mt-1.5">
          <button
            onClick={() => {
              triggerHaptic(14);
              handleNoteBlur();
            }}
            className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold px-2 py-0.5 rounded-lg bg-purple-950/50 border border-purple-800/40 cursor-pointer active:scale-95"
          >
            Save Note to Vault
          </button>
        </div>
      </div>

      {/* Action Buttons for Mobile */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleWhatsApp}
          className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-outfit font-bold text-sm shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>Send Mood Report on WhatsApp 📲</span>
        </button>

        <button
          onClick={handleCopy}
          className="w-full min-h-[46px] rounded-2xl bg-slate-850 border border-slate-700 hover:bg-slate-800 text-slate-200 font-outfit font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied to Clipboard! 🎉</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Summary 📋</span>
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              triggerHaptic(10);
              onRestart();
            }}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Play Vibe Check Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
