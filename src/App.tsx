import React, { useState } from 'react';
import { GamePhase, UserSessionData, MoodItem, CravingItem, MindSituation, SupportStyle } from './types';
import { sound } from './utils/audio';
import { triggerHaptic } from './utils/haptics';
import { TopNav } from './components/TopNav';
import { IPhoneDynamicIsland } from './components/IPhoneDynamicIsland';
import { IntroScreen } from './components/IntroScreen';
import { MoodCheckScreen } from './components/MoodCheckScreen';
import { MindScanScreen } from './components/MindScanScreen';
import { VentJournalScreen } from './components/VentJournalScreen';
import { HateQuestionScreen } from './components/HateQuestionScreen';
import { DramaticRevealScreen } from './components/DramaticRevealScreen';
import { SupportVowScreen } from './components/SupportVowScreen';
import { CarePlanScreen } from './components/CarePlanScreen';
import { FloatingStressBusters } from './components/FloatingStressBusters';
import { FriendsVaultModal } from './components/FriendsVaultModal';
import { MicroVibeBar, MicroVibeItem } from './components/MicroVibeBar';
import { lofiMusic } from './utils/lofiAudio';
import { saveLocalReport } from './utils/reports';

const initialSessionData: UserSessionData = {
  herName: 'Tejaswi',
  selectedMood: null,
  selectedCraving: null,
  selectedSituation: null,
  selectedSupport: null,
  batteryLevel: 5,
  overthinkingLevel: 5,
  problemCategory: 'Work / Academics',
  customProblemText: '',
  aiSootheAdvice: null,
  hateAnswer: null,
  noDodgeCount: 0,
  unlockedAchievement: false,
  poppedStressCount: 0,
  specialNoteToFriend: '',
  redeemedCoupons: [],
  aiPamper: null,
};

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('INTRO');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [session, setSession] = useState<UserSessionData>(initialSessionData);
  const [vaultOpen, setVaultOpen] = useState<boolean>(false);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (muted) {
      lofiMusic.pause();
    } else {
      lofiMusic.play();
    }
  };

  const handleRestart = () => {
    triggerHaptic(10);
    setPhase('INTRO');
    setSession(initialSessionData);
  };

  // Stage 1 Complete: Mood & Battery
  const handleMoodComplete = (data: {
    mood: MoodItem;
    craving: CravingItem;
    batteryLevel: number;
    overthinkingLevel: number;
  }) => {
    triggerHaptic(15);
    setSession((prev) => ({
      ...prev,
      selectedMood: data.mood,
      selectedCraving: data.craving,
      batteryLevel: data.batteryLevel,
      overthinkingLevel: data.overthinkingLevel,
    }));
    setPhase('MIND_SCAN');
  };

  // Stage 2 Complete: Mind Situation & Support Style -> Move to Stage 3: Journal Vent
  const handleMindScanComplete = (data: {
    situation: MindSituation;
    support: SupportStyle;
  }) => {
    triggerHaptic(15);
    setSession((prev) => ({
      ...prev,
      selectedSituation: data.situation,
      selectedSupport: data.support,
    }));
    setPhase('VENT_JOURNAL');
  };

  // Stage 3 Complete: Custom Problem Journal -> Move to Stage 4: Truth Test
  const handleVentJournalComplete = (data: {
    category: string;
    text: string;
    aiAdvice: string | null;
  }) => {
    triggerHaptic(15);
    setSession((prev) => ({
      ...prev,
      problemCategory: data.category,
      customProblemText: data.text,
      aiSootheAdvice: data.aiAdvice,
    }));
    setPhase('HATE_QUESTION');
  };

  // Stage 4 Complete: Hate Question with "Yes / Probably Yes / Definitely"
  const handleHateAnswer = (answer: string, dodges: number) => {
    triggerHaptic(20);
    setSession((prev) => ({
      ...prev,
      hateAnswer: answer,
      noDodgeCount: dodges,
    }));
    setPhase('DRAMATIC_REVEAL');
  };

  // Stage 4 Complete: Chased No 4+ times on phone
  const handleCatchNoAchievement = (dodges: number) => {
    triggerHaptic(25);
    setSession((prev) => ({
      ...prev,
      hateAnswer: 'I desperately tapped the NO button!',
      noDodgeCount: dodges,
      unlockedAchievement: true,
    }));
    setPhase('DRAMATIC_REVEAL');
  };

  // Stage 4 -> 5: Proceed from dramatic reveal
  const handleDramaticProceed = () => {
    triggerHaptic(15);
    setPhase('SUPPORT_CHECK');
  };

  // Stage 5 Complete: Support protocol chosen -> Move to Final Pamper Pass
  const handleSupportCommit = (protocolTitle: string) => {
    triggerHaptic(20);
    setSession((prev) => ({
      ...prev,
      specialNoteToFriend: protocolTitle,
    }));
    setPhase('CARE_PLAN_READY');
  };

  const handleUpdateNote = (note: string) => {
    setSession((prev) => ({
      ...prev,
      specialNoteToFriend: note,
    }));
  };

  const handleMicroVibeSelected = async (vibe: MicroVibeItem) => {
    const updatedMood: MoodItem = {
      id: vibe.id,
      emoji: vibe.emoji,
      title: vibe.label,
      vibe: vibe.note,
      honestThought: vibe.note,
      friendAdvice: `Micro-vibe expressed: ${vibe.emoji} "${vibe.label}". Keep this in mind when supporting Tejaswi.`,
      color: vibe.color,
    };

    setSession((prev) => ({
      ...prev,
      selectedMood: updatedMood,
    }));

    // Save micro-vibe locally on this device; no shared server endpoint.
    saveLocalReport({
      herName: session.herName,
      selectedMood: updatedMood,
      batteryLevel: session.batteryLevel,
      overthinkingLevel: session.overthinkingLevel,
      problemCategory: session.problemCategory,
      customProblemText: session.customProblemText,
      hateAnswer: session.hateAnswer,
      noDodgeCount: session.noDodgeCount,
      specialNoteToFriend: session.specialNoteToFriend,
      aiPamper: session.aiPamper,
    });
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col relative selection:bg-rose-500/30 selection:text-rose-200 pb-28 sm:pb-32 pb-[calc(env(safe-area-inset-bottom,20px)+4.5rem)] overflow-x-hidden antialiased">
      {/* iPhone Dynamic Island at top */}
      <IPhoneDynamicIsland
        currentMoodEmoji={session.selectedMood?.emoji || '✨'}
        currentMoodTitle={session.selectedMood?.title || 'Daily Check-in'}
        batteryLevel={session.batteryLevel}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Floating stress-busters ONLY on intro screen so they never annoy her during questions */}
      {phase === 'INTRO' && (
        <FloatingStressBusters
          onPopCountChange={(count) => {
            setSession((prev) => ({ ...prev, poppedStressCount: count }));
          }}
        />
      )}

      {/* Subtle ambient lighting for iPhone luxury dark mode */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <div className="absolute top-10 left-[5%] w-80 h-80 rounded-full bg-rose-600/30 blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl" />
      </div>

      {/* Top Bar navigation */}
      <TopNav
        currentPhase={phase}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRestart={handleRestart}
        onOpenVault={() => setVaultOpen(true)}
      />

      {/* Main Content Area (iPhone ergonomic layout) */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 py-3 sm:py-6 w-full">
        {phase === 'INTRO' && (
          <IntroScreen
            onStart={() => {
              setPhase('MOOD_CHECK');
              if (!isMuted) {
                lofiMusic.play();
              }
            }}
          />
        )}

        {phase === 'MOOD_CHECK' && (
          <MoodCheckScreen onComplete={handleMoodComplete} />
        )}

        {phase === 'MIND_SCAN' && (
          <MindScanScreen onComplete={handleMindScanComplete} />
        )}

        {phase === 'VENT_JOURNAL' && (
          <VentJournalScreen
            onComplete={handleVentJournalComplete}
            initialCategory={session.problemCategory}
            initialText={session.customProblemText}
          />
        )}

        {phase === 'HATE_QUESTION' && (
          <HateQuestionScreen
            onAnswerSelected={handleHateAnswer}
            onCatchNoAchievement={handleCatchNoAchievement}
          />
        )}

        {phase === 'DRAMATIC_REVEAL' && (
          <DramaticRevealScreen
            answer={session.hateAnswer}
            dodges={session.noDodgeCount}
            onProceed={handleDramaticProceed}
          />
        )}

        {phase === 'SUPPORT_CHECK' && (
          <SupportVowScreen onCommit={handleSupportCommit} />
        )}

        {phase === 'CARE_PLAN_READY' && (
          <CarePlanScreen
            sessionData={session}
            onRestart={handleRestart}
            onUpdateSessionNote={handleUpdateNote}
          />
        )}
      </main>

      {/* Mobile Footer above reaction bar */}
      <footer className="w-full border-t border-slate-800/80 py-3 text-center text-[10px] text-slate-500 relative z-10 mb-2">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">
          <span>Made for Tejaswi 🌙</span>
          <button
            onClick={() => setVaultOpen(true)}
            className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
          >
            Insights Vault 🔒
          </button>
        </div>
      </footer>

      {/* Persistent Horizontal Micro-Vibe Reaction Bar docked at bottom */}
      <MicroVibeBar
        herName={session.herName}
        onVibeSelected={handleMicroVibeSelected}
        activeVibeId={session.selectedMood?.id}
      />

      {/* Friend's Secret Live Vault Modal */}
      <FriendsVaultModal
        isOpen={vaultOpen}
        onClose={() => setVaultOpen(false)}
      />
    </div>
  );
}
