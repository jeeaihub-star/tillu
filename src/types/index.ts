export type GamePhase =
  | 'INTRO'
  | 'MOOD_CHECK'
  | 'MIND_SCAN'
  | 'VENT_JOURNAL'
  | 'HATE_QUESTION'
  | 'DRAMATIC_REVEAL'
  | 'SUPPORT_CHECK'
  | 'CARE_PLAN_READY';

export interface MoodItem {
  id: string;
  emoji: string;
  title: string;
  vibe: string;
  honestThought: string;
  friendAdvice: string;
  color: string;
}

export interface CravingItem {
  id: string;
  label: string;
  emoji: string;
}

export interface MindSituation {
  id: string;
  emoji: string;
  title: string;
  description: string;
  validation: string;
}

export interface SupportStyle {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  badge: string;
}

export interface AIPamperResult {
  validation: string;
  pamperRitual: string[];
  friendPlaybook: string[];
  affirmation: string;
}

export interface UserSessionData {
  herName: string;
  selectedMood: MoodItem | null;
  selectedCraving: CravingItem | null;
  selectedSituation: MindSituation | null;
  selectedSupport: SupportStyle | null;
  batteryLevel: number; // 1 to 10
  overthinkingLevel: number; // 1 to 10
  problemCategory: string;
  customProblemText: string;
  aiSootheAdvice?: string | null;
  hateAnswer: string | null;
  noDodgeCount: number;
  unlockedAchievement: boolean;
  poppedStressCount: number;
  specialNoteToFriend: string;
  redeemedCoupons: string[];
  aiPamper?: AIPamperResult | null;
  planFinalized?: boolean;
  finalizedAt?: string;
}

export interface StoredReport {
  id: string;
  timestamp: string;
  herName?: string;
  selectedMood?: MoodItem | null;
  selectedCraving?: CravingItem | null;
  selectedSituation?: MindSituation | null;
  selectedSupport?: SupportStyle | null;
  batteryLevel?: number;
  overthinkingLevel?: number;
  problemCategory?: string;
  customProblemText?: string;
  aiSootheAdvice?: string | null;
  hateAnswer?: string | null;
  noDodgeCount?: number;
  specialNoteToFriend?: string;
  aiPamper?: AIPamperResult | null;
  planFinalized?: boolean;
  finalizedAt?: string;
}
