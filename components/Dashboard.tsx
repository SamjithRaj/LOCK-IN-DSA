'use client';
import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { PHASES, getAllDays } from '@/lib/data';
import { getCompletedCount, getTotalProblemsCompleted } from '@/lib/storage';

function Ring({ pct, size = 80, stroke = 6, color = 'var(--accent)', bg = 'var(--bg4)', children }: {
  pct: number; size?: number; stroke?: number; color?: string; bg?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct, 1);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color = 'var(--accent2)' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ setView }: { setView: (v: string) => void }) {
  const { state } = useStore();
  const allDays = getAllDays();
  const activeDays = allDays.filter(d => !d.isRest);
  const completedDays = getCompletedCount(state);
  const totalProblems = allDays.reduce((a, d) => a + d.problems.filter(p => p.leetcodeId > 0).length, 0);
  const solvedProblems = getTotalProblemsCompleted(state);
  const currentDay = allDays.find(d => d.dayNum === state.currentDay);
  const level = Math.floor(state.totalXP / 500) + 1;

  const weekProgress = useMemo(() => {
    return PHASES[0].weeks.map(w => {
      const wDays = w.days.filter(d => !d.isRest);
      const done = wDays.filter(d => state.dayProgress[d.dayNum]?.completed).length;
      return { num: w.num, topic: w.topic, done, total: wDays.length, pct: done / wDays.length };
    });
  }, [state.dayProgress]);

  const daysUntilTarget = useMemo(() => {
    const start = state.startDate ? new Date(state.startDate) : new Date();
    const target = new Date(start);
    target.setDate(target.getDate() + 90);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [state.startDate]);

  // Recent activity
  const recentDays = [...activeDays]
    .filter(d => state.dayProgress[d.dayNum]?.completed)
    .sort((a, b) => {
      const aT = state.dayProgress[a.dayNum]?.completedAt ?? '';
      const bT = state.dayProgress[b.dayNum]?.completedAt ?? '';
      return bT.localeCompare(aT);
    })
    .slice(0, 5);

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 6 }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, Samjith.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            {completedDays === 0 ? 'Ready to start your FAANG journey?' : `Day ${state.currentDay} of 56 · Phase 1`}
          </p>
        </div>
        {daysUntilTarget > 0 && (
          <div style={{ textAlign: 'right', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--amber)' }}>{daysUntilTarget}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>days to 3mo target</div>
          </div>
        )}
      </div>

      {/* Today's card */}
      {currentDay && !currentDay.isRest && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--accent)', borderRadius: 16, padding: 24, marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'var(--accent-dim)', borderRadius: '50%', transform: 'translate(50%,-50%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <Ring pct={state.dayProgress[currentDay.dayNum]?.problemsDone.length / Math.max(1, currentDay.problems.length)} size={80} color="var(--accent)">
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent2)' }}>D{currentDay.dayNum}</span>
            </Ring>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Today · Week {currentDay.weekNum}</div>
              <h2 style={{ fontSize: 20, marginBottom: 6 }}>{currentDay.focus}</h2>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, maxWidth: 500 }}>{currentDay.detail}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {currentDay.problems.map(p => {
                  const done = state.dayProgress[currentDay.dayNum]?.problemsDone.includes(p.id);
                  return (
                    <div key={p.id} style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, border: '1px solid var(--border)',
                      background: done ? 'var(--green-dim)' : 'var(--bg3)',
                      color: done ? 'var(--green)' : 'var(--text2)',
                      display: 'flex', alignItems: 'center', gap: 5
                    }}>
                      {done && '✓ '}{p.name}
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 10, background: p.difficulty === 'E' ? 'var(--green-dim)' : p.difficulty === 'M' ? 'var(--amber-dim)' : 'var(--red-dim)', color: p.difficulty === 'E' ? 'var(--easy)' : p.difficulty === 'M' ? 'var(--medium)' : 'var(--hard)' }}>
                        {p.difficulty === 'E' ? 'Easy' : p.difficulty === 'M' ? 'Med' : 'Hard'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setView('schedule')} style={{ padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0 }}>
              Open Day →
            </button>
          </div>
        </div>
      )}

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Level" value={level} sub={`${state.totalXP} total XP`} color="var(--accent2)" />
        <StatCard label="Streak" value={`${state.streak}🔥`} sub="consecutive days" color="var(--amber)" />
        <StatCard label="Problems Solved" value={solvedProblems} sub={`of ${totalProblems} total`} color="var(--green)" />
        <StatCard label="Days Completed" value={completedDays} sub={`of ${activeDays.length} active days`} color="var(--blue)" />
      </div>

      {/* Week progress */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 16, color: 'var(--text2)' }}>Phase 1 — Week Progress</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {weekProgress.map(w => (
            <div key={w.num} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>WEEK {w.num}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-display)', color: w.pct === 1 ? 'var(--green)' : 'var(--text)' }}>{w.topic}</div>
              <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${w.pct * 100}%`, background: w.pct === 1 ? 'var(--green)' : 'var(--accent)', borderRadius: 2, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{w.done}/{w.total} days</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity heatmap placeholder */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text2)' }}>Recent Activity</h3>
          {recentDays.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>No activity yet. Start Day 1!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentDays.map(d => (
                <div key={d.dayNum} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>
                    D{d.dayNum}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.focus}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                      {state.dayProgress[d.dayNum]?.problemsDone.length ?? 0}/{d.problems.length} problems · {state.dayProgress[d.dayNum]?.mood ?? '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--green)', background: 'var(--green-dim)', padding: '2px 8px', borderRadius: 10 }}>✓ Done</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text2)' }}>Roadmap Overview</h3>
          {[
            { phase: 1, label: 'Phase 1 · Foundation', duration: 'Months 1–2', color: 'var(--accent)', active: true },
            { phase: 2, label: 'Phase 2 · Interview DSA', duration: 'Month 3', color: 'var(--green)', active: false },
            { phase: 3, label: 'Phase 3 · System Design', duration: 'Months 4–5', color: 'var(--amber)', active: false },
            { phase: 4, label: 'Phase 4 · Full Sim', duration: 'Month 6', color: 'var(--blue)', active: false },
          ].map(p => (
            <div key={p.phase} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.active ? p.color : 'var(--border2)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: p.active ? 'var(--text)' : 'var(--text3)' }}>{p.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{p.duration}</div>
              </div>
              {p.active && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--accent-dim)', color: 'var(--accent2)' }}>Active</span>}
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 12, background: 'var(--bg3)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>MBA → IB goal reminder</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>FAANG brand → Top MBA → Investment Banking. Every day here is a step toward that.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
