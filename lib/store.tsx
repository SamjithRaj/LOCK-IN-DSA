'use client';
import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { AppState, DayProgress, loadState, saveState, computeStreak } from '@/lib/storage';
import { getAllDays } from '@/lib/data';

type Action =
  | { type: 'TOGGLE_PROBLEM'; dayNum: number; problemId: string; xp: number }
  | { type: 'MARK_DAY'; dayNum: number; mood: DayProgress['mood']; timeSpent: number }
  | { type: 'UNMARK_DAY'; dayNum: number }
  | { type: 'SET_NOTES'; dayNum: number; notes: string }
  | { type: 'SET_THEME'; theme: 'dark' | 'light' }
  | { type: 'SET_CURRENT_DAY'; day: number }
  | { type: 'TOGGLE_BOOKMARK'; problemId: string }
  | { type: 'SET_START_DATE'; date: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_PROBLEM': {
      const prev = state.dayProgress[action.dayNum] ?? { completed: false, problemsDone: [], notes: '', mood: null, timeSpent: 0 };
      const done = prev.problemsDone.includes(action.problemId)
        ? prev.problemsDone.filter(p => p !== action.problemId)
        : [...prev.problemsDone, action.problemId];
      const xpDelta = prev.problemsDone.includes(action.problemId) ? -action.xp : action.xp;
      return { ...state, totalXP: Math.max(0, state.totalXP + xpDelta), dayProgress: { ...state.dayProgress, [action.dayNum]: { ...prev, problemsDone: done } } };
    }
    case 'MARK_DAY': {
      const prev = state.dayProgress[action.dayNum] ?? { completed: false, problemsDone: [], notes: '', mood: null, timeSpent: 0 };
      const allDays = getAllDays();
      const day = allDays.find(d => d.dayNum === action.dayNum);
      const xpGain = prev.completed ? 0 : (day?.xp ?? 0);
      const newStreak = computeStreak({ ...state, dayProgress: { ...state.dayProgress, [action.dayNum]: { ...prev, completed: true } } });
      return {
        ...state, totalXP: state.totalXP + xpGain, streak: newStreak,
        lastActiveDate: new Date().toDateString(),
        dayProgress: { ...state.dayProgress, [action.dayNum]: { ...prev, completed: true, mood: action.mood, timeSpent: action.timeSpent, completedAt: new Date().toISOString() } }
      };
    }
    case 'UNMARK_DAY': {
      const prev = state.dayProgress[action.dayNum] ?? { completed: false, problemsDone: [], notes: '', mood: null, timeSpent: 0 };
      const day = getAllDays().find(d => d.dayNum === action.dayNum);
      return { ...state, totalXP: Math.max(0, state.totalXP - (day?.xp ?? 0)), dayProgress: { ...state.dayProgress, [action.dayNum]: { ...prev, completed: false, completedAt: undefined } } };
    }
    case 'SET_NOTES': {
      const prev = state.dayProgress[action.dayNum] ?? { completed: false, problemsDone: [], notes: '', mood: null, timeSpent: 0 };
      return { ...state, dayProgress: { ...state.dayProgress, [action.dayNum]: { ...prev, notes: action.notes } } };
    }
    case 'SET_THEME': return { ...state, theme: action.theme };
    case 'SET_CURRENT_DAY': return { ...state, currentDay: action.day };
    case 'TOGGLE_BOOKMARK': {
      const bm = state.bookmarks.includes(action.problemId)
        ? state.bookmarks.filter(b => b !== action.problemId)
        : [...state.bookmarks, action.problemId];
      return { ...state, bookmarks: bm };
    }
    case 'SET_START_DATE': return { ...state, startDate: action.date };
    default: return state;
  }
}

interface StoreCtx { state: AppState; dispatch: React.Dispatch<Action> }
const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  useEffect(() => { saveState(state); }, [state]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
