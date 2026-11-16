export type SprintPhase =
  | 'Phase 1: Foundations, Resilient Locators & Auto-waiting'
  | 'Phase 2: Network Mocking, Interception & Auth State'
  | 'Phase 3: Advanced POM, Custom Fixtures & DI'
  | 'Phase 4: CI/CD Sharding, Debugging Traces & AI Tooling';

export interface ChecklistTopic {
  title: string;
  details: string;
  codeSnippet?: string;
  interviewTip?: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  subtitle: string;
  phase: SprintPhase;
  estimatedHours: number;
  isDemoLocked?: boolean;
  objectives: ChecklistTopic[];
  deepDiveContent: {
    summary: string;
    keyConcepts: {
      title: string;
      explanation: string;
      codeSnippet?: string;
    }[];
    seniorPitfalls: string[];
    practiceTasks: string[];
    interviewQuestionsHighlighted: string[];
    suggestedChallengeId?: string;
    suggestedChallengeIds?: string[];
    sourceMaterials?: { title: string; url?: string; description: string }[];
  };
  suggestedChallengeId?: string;
  suggestedChallengeIds?: string[];
  suggestedQuestionCategory?: QuestionCategory;
}

export type QuestionCategory =
  | 'architecture'
  | 'locators'
  | 'network'
  | 'fixtures'
  | 'auth'
  | 'cicd'
  | 'debugging'
  | 'typescript'
  | 'a11y'
  | 'ai';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  level: 'Senior' | 'Principal';
  sprintDay: number;
  sprintDayTitle: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  codeExample?: string;
  recruiterTraps: string[];
  seniorPerspective: string;
  tags: string[];
}

export interface ChallengeValidationRule {
  id: string;
  label: string;
  check: (code: string) => { passed: boolean; feedback: string };
}

export interface CodingChallenge {
  id: string;
  title: string;
  category: string;
  level: 'Senior' | 'Principal';
  sprintDay: number;
  sprintDayTitle: string;
  estimatedTimeMinutes: number;
  description: string;
  interviewContext: string;
  requirements: string[];
  starterCode: string;
  solutionCode: string;
  solutionExplanation: string;
  validationRules: ChallengeValidationRule[];
}

export interface MockInterviewState {
  isActive: boolean;
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  selectedQuestions: InterviewQuestion[];
  selectedChallenge: CodingChallenge | null;
  currentStepIndex: number;
  notes: Record<string, string>;
  selfRatings: Record<string, number>; // 1 to 5
  isFinished: boolean;
}

export interface UserProgress {
  completedDays: number[];
  checklistItems: Record<string, boolean>; // e.g. "day-1-item-0": true
  masteredQuestions: string[];
  bookmarkedQuestions: string[];
  solvedChallenges: string[];
  userCodeSnippets: Record<string, string>;
  lastActiveTab: 'roadmap' | 'questions' | 'coding' | 'mock' | 'cheatsheet';
}
