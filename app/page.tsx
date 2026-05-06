'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Schedule from '@/components/Schedule';
import Problems from '@/components/Problems';
import Patterns from '@/components/Patterns';
import MockTimer from '@/components/MockTimer';
import Notes from '@/components/Notes';
import Stats from '@/components/Stats';
import Learn from '@/components/Learn';
import PracticeArena from '@/components/PracticeArena';
import Mentor from '@/components/Mentor';
import { useStore } from '@/lib/store';

type View = 'dashboard' | 'learn' | 'arena' | 'mentor' | 'schedule' | 'problems' | 'patterns' | 'timer' | 'notes' | 'stats';

function SetupModal({ onDone }: { onDone: (date: string) => void }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--accent)', borderRadius: 20, padding: '40px', width: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Welcome, Samjith.</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
          Your FAANG learning app is ready: lessons, practice, mentor answers, and progress tracking all save locally.<br /><br />
          When did you start (or plan to start) Phase 1?
        </p>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ marginBottom: 20, textAlign: 'center', fontSize: 16, padding: '12px', fontFamily: 'var(--font-mono)', borderRadius: 10 }} />
        <br />
        <button onClick={() => onDone(date)}
          style={{ padding: '14px 40px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Let&apos;s Go →
        </button>
        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 16 }}>FAANG → MBA → Investment Banking. One day at a time.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const { state, dispatch } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Loading...</div>
      </div>
    );
  }

  if (!state.startDate) {
    return <SetupModal onDone={date => dispatch({ type: 'SET_START_DATE', date })} />;
  }

  const VIEWS: Record<View, React.ReactNode> = {
    dashboard: <Dashboard setView={v => setView(v as View)} />,
    learn: <Learn />,
    arena: <PracticeArena />,
    mentor: <Mentor />,
    schedule: <Schedule />,
    problems: <Problems />,
    patterns: <Patterns />,
    timer: <MockTimer />,
    notes: <Notes />,
    stats: <Stats />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar view={view} setView={v => setView(v as View)} />
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', maxHeight: '100vh' }}>
        {VIEWS[view]}
      </main>
    </div>
  );
}
