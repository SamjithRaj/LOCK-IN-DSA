'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { getAllDays } from '@/lib/data';
import { getCompletedCount, getTotalProblemsCompleted } from '@/lib/storage';

type View = 'dashboard' | 'schedule' | 'problems' | 'patterns' | 'timer' | 'notes' | 'stats';

interface Props { view: View; setView: (v: View) => void; }

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'schedule', label: 'Schedule', icon: '▦' },
  { id: 'problems', label: 'Problems', icon: '⟨⟩' },
  { id: 'patterns', label: 'Patterns', icon: '◎' },
  { id: 'timer', label: 'Mock Timer', icon: '◷' },
  { id: 'notes', label: 'Notes', icon: '≡' },
  { id: 'stats', label: 'Stats', icon: '▲' },
] as const;

function XPBar({ xp }: { xp: number }) {
  const level = Math.floor(xp / 500) + 1;
  const progress = (xp % 500) / 500;
  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>LVL {level}</span>
        <span style={{ fontSize: 11, color: 'var(--accent2)' }}>{xp} XP</span>
      </div>
      <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: 2, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{Math.round((1 - progress) * 500)} XP to next level</div>
    </div>
  );
}

export default function Sidebar({ view, setView }: Props) {
  const { state, dispatch } = useStore();
  const allDays = getAllDays();
  const totalDays = allDays.filter(d => !d.isRest).length;
  const completedDays = getCompletedCount(state);

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: 'var(--bg2)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh', flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>
          <span style={{ color: 'var(--accent)' }}>{'{'}</span>
          FAANG
          <span style={{ color: 'var(--accent)' }}>{'}'}</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Samjith · 6mo Plan</div>
      </div>

      {/* Streak */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: state.streak > 0 ? 'var(--amber)' : 'var(--text3)' }}>
            {state.streak}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>day streak</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent2)' }}>
            {completedDays}<span style={{ fontSize: 13, color: 'var(--text3)' }}>/{totalDays}</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>days done</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(item => {
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => setView(item.id as View)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
              borderRadius: 8, border: 'none', width: '100%', textAlign: 'left',
              background: active ? 'var(--accent-dim)' : 'transparent',
              color: active ? 'var(--accent2)' : 'var(--text2)',
              fontSize: 13, fontFamily: 'var(--font-mono)',
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg3)'; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />}
            </button>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>Theme</span>
        <button onClick={() => dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' })}
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: 'var(--text2)' }}>
          {state.theme === 'dark' ? '☀ Light' : '◑ Dark'}
        </button>
      </div>

      <XPBar xp={state.totalXP} />
    </aside>
  );
}
