'use client';
import { useState, useEffect, useRef } from 'react';

const PRESETS = [
  { label: '20 min', secs: 1200, desc: 'LeetCode Medium' },
  { label: '35 min', secs: 2100, desc: 'LeetCode Hard' },
  { label: '45 min', secs: 2700, desc: 'Phone Screen' },
  { label: '90 min', secs: 5400, desc: 'Phase 1 Mock' },
];

const PHASES_MOCK = [
  { label: 'Clarify', pct: 0.1, color: 'var(--blue)', tip: 'Ask: input types, edge cases, expected output, constraints. Never skip this.' },
  { label: 'Brute Force', pct: 0.2, color: 'var(--amber)', tip: 'State the naive solution first, give its complexity. Show you understand the problem.' },
  { label: 'Optimize', pct: 0.25, color: 'var(--accent)', tip: 'Think aloud: what is the bottleneck? What data structure eliminates it?' },
  { label: 'Code', pct: 0.35, color: 'var(--green)', tip: 'Write clean, working code. Talk while you type. Name variables clearly.' },
  { label: 'Test', pct: 0.1, color: 'var(--red)', tip: 'Trace through 2 examples. Check edge cases: empty, single, duplicates.' },
];

export default function MockTimer() {
  const [totalSecs, setTotalSecs] = useState(2700);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [problem, setProblem] = useState('');
  const [approach, setApproach] = useState('');
  const [debrief, setDebrief] = useState({ clarity: 0, approach: 0, code: 0, comms: 0 });
  const [showDebrief, setShowDebrief] = useState(false);
  const [sessions, setSessions] = useState<{ problem: string; duration: number; scores: typeof debrief; date: string }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mock_sessions');
      if (saved) setSessions(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= totalSecs) {
            setRunning(false);
            setFinished(true);
            clearInterval(intervalRef.current!);
            return totalSecs;
          }
          return e + 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, totalSecs]);

  function reset() {
    setElapsed(0); setRunning(false); setFinished(false); setShowDebrief(false);
    setDebrief({ clarity: 0, approach: 0, code: 0, comms: 0 });
  }

  function saveSession() {
    const s = { problem, duration: elapsed, scores: debrief, date: new Date().toLocaleDateString() };
    const updated = [s, ...sessions].slice(0, 20);
    setSessions(updated);
    localStorage.setItem('mock_sessions', JSON.stringify(updated));
    setShowDebrief(false);
    reset();
  }

  const pct = elapsed / totalSecs;
  const rem = totalSecs - elapsed;
  const mins = Math.floor(rem / 60);
  const secs = rem % 60;

  // Determine current phase
  let cumPct = 0;
  let currentPhase = PHASES_MOCK[0];
  let phaseElapsed = 0;
  for (const ph of PHASES_MOCK) {
    const phaseDur = totalSecs * ph.pct;
    if (elapsed < (cumPct + ph.pct) * totalSecs) { currentPhase = ph; phaseElapsed = elapsed - cumPct * totalSecs; break; }
    cumPct += ph.pct;
  }

  const circumference = 2 * Math.PI * 100;
  const dashOffset = circumference * (1 - pct);

  const avgScore = Object.values(debrief).reduce((a, b) => a + b, 0) / 4;

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Mock Interview Timer</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Simulate real interview conditions. Track your performance over time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Main timer */}
        <div>
          {/* Presets */}
          {!running && !finished && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => { setTotalSecs(p.secs); reset(); }}
                  style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${totalSecs === p.secs ? 'var(--accent)' : 'var(--border)'}`, background: totalSecs === p.secs ? 'var(--accent-dim)' : 'var(--bg2)', color: totalSecs === p.secs ? 'var(--accent2)' : 'var(--text2)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                  <span style={{ fontWeight: 700 }}>{p.label}</span>
                  <span style={{ color: 'var(--text3)', marginLeft: 6 }}>· {p.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Problem input */}
          {!running && !finished && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Problem (optional)</div>
              <input type="text" value={problem} onChange={e => setProblem(e.target.value)} placeholder="e.g. 15. 3Sum, Sliding Window variant..." />
            </div>
          )}

          {/* Big clock */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 20 }}>
              <svg width={240} height={240} viewBox="0 0 240 240">
                <circle cx={120} cy={120} r={100} fill="none" stroke="var(--bg4)" strokeWidth={8} />
                <circle cx={120} cy={120} r={100} fill="none"
                  stroke={finished ? 'var(--red)' : pct > 0.8 ? 'var(--amber)' : currentPhase.color}
                  strokeWidth={8} strokeDasharray={circumference}
                  strokeDashoffset={dashOffset} strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s, stroke 0.3s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', color: finished ? 'var(--red)' : pct > 0.8 ? 'var(--amber)' : 'var(--text)', lineHeight: 1 }}>
                  {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                  {finished ? 'Time\'s up!' : running ? currentPhase.label : 'ready'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12 }}>
              {!finished && (
                <button onClick={() => setRunning(r => !r)} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: running ? 'var(--amber)' : 'var(--accent)', color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {running ? '⏸ Pause' : elapsed === 0 ? '▶ Start' : '▶ Resume'}
                </button>
              )}
              {(elapsed > 0 || finished) && (
                <button onClick={() => { reset(); }} style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text2)', fontSize: 14, fontFamily: 'var(--font-mono)' }}>
                  ↺ Reset
                </button>
              )}
              {(finished || elapsed > 60) && !showDebrief && (
                <button onClick={() => { setRunning(false); setShowDebrief(true); }} style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid var(--green)', background: 'var(--green-dim)', color: 'var(--green)', fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  ✓ Debrief
                </button>
              )}
            </div>
          </div>

          {/* Phase guide */}
          {running && (
            <div style={{ background: 'var(--bg2)', border: `1px solid ${currentPhase.color}`, borderRadius: 12, padding: '14px 18px', marginBottom: 20 }} className="animate-fadeIn">
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current phase: {currentPhase.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>{currentPhase.tip}</div>
            </div>
          )}

          {/* Phase timeline */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Interview phase breakdown</div>
            <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              {PHASES_MOCK.map(ph => (
                <div key={ph.label} style={{ flex: ph.pct, background: ph.color, opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PHASES_MOCK.map(ph => (
                <div key={ph.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ph.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: ph.label === currentPhase.label && running ? ph.color : 'var(--text2)', fontWeight: ph.label === currentPhase.label && running ? 700 : 400 }}>{ph.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{Math.round(totalSecs * ph.pct / 60)} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debrief modal */}
          {showDebrief && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 480, maxHeight: '90vh', overflowY: 'auto' }} className="animate-fadeIn">
                <h2 style={{ fontSize: 20, marginBottom: 6 }}>Session Debrief</h2>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>
                  {problem || 'Unnamed problem'} · {Math.floor(elapsed / 60)} min used
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Rate yourself (1–5)</div>
                  {[
                    { key: 'clarity', label: 'Problem clarity & clarifying questions' },
                    { key: 'approach', label: 'Approach & algorithm choice' },
                    { key: 'code', label: 'Code correctness & style' },
                    { key: 'comms', label: 'Communication & thinking aloud' },
                  ].map(({ key, label }) => (
                    <div key={key} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent2)' }}>{debrief[key as keyof typeof debrief]}/5</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setDebrief(d => ({...d, [key]: n}))}
                            style={{ flex: 1, height: 32, borderRadius: 6, border: `1px solid ${debrief[key as keyof typeof debrief] >= n ? 'var(--accent)' : 'var(--border)'}`, background: debrief[key as keyof typeof debrief] >= n ? 'var(--accent-dim)' : 'var(--bg3)', color: debrief[key as keyof typeof debrief] >= n ? 'var(--accent2)' : 'var(--text3)', fontSize: 13, transition: 'all 0.1s' }}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Approach / key insight</div>
                  <textarea value={approach} onChange={e => setApproach(e.target.value)} rows={3} placeholder="What was the key pattern? What did you miss initially? What would you do faster next time?" />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={saveSession} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    Save Session
                  </button>
                  <button onClick={() => setShowDebrief(false)} style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Session history */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Session History</div>
          {sessions.length === 0 ? (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, fontSize: 13, color: 'var(--text3)', textAlign: 'center' }}>
              No sessions yet. Complete your first mock!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessions.map((s, i) => {
                const avg = (Object.values(s.scores).reduce((a,b) => a+b,0) / 4).toFixed(1);
                const avgNum = parseFloat(avg);
                return (
                  <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.problem || 'Unnamed'}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: avgNum >= 4 ? 'var(--green)' : avgNum >= 3 ? 'var(--amber)' : 'var(--red)' }}>{avg}/5</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>{s.date}</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>·</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>{Math.floor(s.duration / 60)}m used</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      {['clarity','approach','code','comms'].map(k => (
                        <div key={k} style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--bg4)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(s.scores[k as keyof typeof s.scores]/5)*100}%`, background: 'var(--accent)', borderRadius: 2 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interview tips */}
          <div style={{ marginTop: 20, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Interview tips</div>
            {[
              'Always repeat the problem back to the interviewer.',
              'State the brute force first, always.',
              'Say "I\'m thinking about..." when silent.',
              'Write function signature before body.',
              'Test with empty input and single element.',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: 'var(--text2)' }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0, fontWeight: 700 }}>{i+1}.</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
