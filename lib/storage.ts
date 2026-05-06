import { getAllDays } from './data';

export interface DayProgress {
  completed: boolean;
  problemsDone: string[];
  notes: string;
  mood: 'great' | 'okay' | 'tough' | null;
  timeSpent: number; // minutes
  completedAt?: string;
}

export interface AppState {
  dayProgress: Record<number, DayProgress>;
  currentDay: number;
  totalXP: number;
  streak: number;
  lastActiveDate: string | null;
  theme: 'dark' | 'light';
  notes: Record<string, string>;
  bookmarks: string[];
  startDate: string | null;
}

const DEFAULT_STATE: AppState = {
  dayProgress: {},
  currentDay: 1,
  totalXP: 0,
  streak: 0,
  lastActiveDate: null,
  theme: 'dark',
  notes: {},
  bookmarks: [],
  startDate: null,
};

const KEY = 'faang_tracker_v2';

export function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function computeStreak(state: AppState): number {
  const today = new Date().toDateString();
  const days = getAllDays().filter(d => !d.isRest);
  let streak = 0;
  const sorted = days.sort((a, b) => b.dayNum - a.dayNum);
  for (const day of sorted) {
    const prog = state.dayProgress[day.dayNum];
    if (prog?.completed) streak++;
    else break;
  }
  return streak;
}

export function getCompletedCount(state: AppState): number {
  return Object.values(state.dayProgress).filter(d => d.completed).length;
}

export function getTotalProblemsCompleted(state: AppState): number {
  return Object.values(state.dayProgress).reduce(
    (acc, d) => acc + (d.problemsDone?.length ?? 0), 0
  );
}

export function getDayProgress(state: AppState, dayNum: number): DayProgress {
  return state.dayProgress[dayNum] ?? {
    completed: false,
    problemsDone: [],
    notes: '',
    mood: null,
    timeSpent: 0,
  };
}
