'use client';
import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { PHASES } from '@/lib/data';
import { getDayProgress } from '@/lib/storage';

const MOODS = [
  { val: 'great', label: '🔥 Great', color: 'var(--green)' },
  { val: 'okay', label: '👍 Okay', color: 'var(--amber)' },
  { val: 'tough', label: '😤 Tough', color: 'var(--red)' },
] as const;

function DayCard({ day, expanded, onToggle }: {
  day: import('@/lib/data').Day;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { state, dispatch } = useStore();
  const prog = getDayProgress(state, day.dayNum);
  const [mood, setMood] = useState<typeof MOODS[number]['val'] | null>(prog.mood ?? null);
  const [timeSpent, setTimeSpent] = useState(prog.timeSpent ?? 0);
  const [notes, setNotes] = useState(prog.notes ?? '');
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allProblems = day.problems.filter(p => p.leetcodeId > 0);
  const donePct = allProblems.length > 0 ? prog.problemsDone.length / allProblems.length : 0;

  function handleNotesChange(val: string) {
    setNotes(val);
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => dispatch({ type: 'SET_NOTES', dayNum: day.dayNum, notes: val }), 600);
  }

  function toggleProblem(id: string, xpVal: number) {
    dispatch({ type: 'TOGGLE_PROBLEM', dayNum: day.dayNum, problemId: id, xp: xpVal });
  }

  function markComplete() {
    dispatch({ type: 'MARK_DAY', dayNum: day.dayNum, mood: mood ?? 'okay', timeSpent });
    if (day.dayNum === state.currentDay) {
      dispatch({ type: 'SET_CURRENT_DAY', day: day.dayNum + 1 });
    }
  }

  const probXP = Math.round((day.xp * 0.6) / Math.max(1, allProblems.length));

  if (day.isRest) {
    return (
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, opacity: 0.6 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>◌</div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Day {day.dayNum} · {day.dayName}</div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Rest Day</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', background: 'var(--bg3)', padding: '4px 10px', borderRadius: 20 }}>No problems</div>
      </div>
    );
  }

  const isActive = state.currentDay === day.dayNum;
  const isCompleted = prog.completed;

  return (
    <div style={{
      background: 'var(--bg2)', borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${isCompleted ? 'rgba(34,199,142,0.3)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
      boxShadow: isActive && !isCompleted ? '0 0 0 1px var(--accent-dim)' : 'none',
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
        background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer',
      }}>
        {/* Completion ring */}
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
          <svg width={40} height={40} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={20} cy={20} r={16} fill="none" stroke="var(--bg4)" strokeWidth={3} />
            <circle cx={20} cy={20} r={16} fill="none"
              stroke={isCompleted ? 'var(--green)' : 'var(--accent)'}
              strokeWidth={3}
              strokeDasharray={`${2 * Math.PI * 16 * donePct} ${2 * Math.PI * 16}`}
              strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.4s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: isCompleted ? 'var(--green)' : 'var(--text3)' }}>
            {isCompleted ? '✓' : `D${day.dayNum}`}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{day.dayName} · Week {day.weekNum}</span>
            {isActive && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 10, background: 'var(--accent-dim)', color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today</span>}
            {isCompleted && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 10, background: 'var(--green-dim)', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ Complete</span>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{day.focus}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{prog.problemsDone.length}/{allProblems.length} solved</div>
            <div style={{ fontSize: 11, color: 'var(--accent2)' }}>+{day.xp} XP</div>
          </div>
          <span style={{ fontSize: 16, color: 'var(--text3)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '20px' }} className="animate-fadeIn">
          {/* Detail */}
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20, lineHeight: 1.6, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, borderLeft: '3px solid var(--accent)' }}>
            {day.detail}
          </p>

          {/* Problems */}
          {allProblems.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Problems</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allProblems.map(p => {
                  const done = prog.problemsDone.includes(p.id);
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: done ? 'var(--green-dim)' : 'var(--bg3)', borderRadius: 8, border: `1px solid ${done ? 'rgba(34,199,142,0.2)' : 'var(--border)'}`, transition: 'all 0.15s' }}>
                      <button onClick={() => toggleProblem(p.id, probXP)} style={{
                        width: 20, height: 20, borderRadius: 5, border: `2px solid ${done ? 'var(--green)' : 'var(--border2)'}`,
                        background: done ? 'var(--green)' : 'transparent', color: 'white', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s',
                      }}>
                        {done && '✓'}
                      </button>
                      <span style={{ flex: 1, fontSize: 13, color: done ? 'var(--green)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.8 : 1 }}>
                        {p.name}
                      </span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: p.difficulty === 'E' ? 'var(--green-dim)' : p.difficulty === 'M' ? 'var(--amber-dim)' : 'var(--red-dim)', color: p.difficulty === 'E' ? 'var(--easy)' : p.difficulty === 'M' ? 'var(--medium)' : 'var(--hard)', fontWeight: 700, letterSpacing: '0.06em' }}>
                          {p.difficulty === 'E' ? 'EASY' : p.difficulty === 'M' ? 'MED' : 'HARD'}
                        </span>
                        <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: 'var(--accent-dim)', color: 'var(--accent2)' }}>{p.pattern}</span>
                        {p.leetcodeId > 0 && (
                          <a href={`https://leetcode.com/problems/${p.name.toLowerCase().replace(/\d+\.\s*/,'').replace(/[^a-z0-9]+/g,'-').replace(/-+$/,'')}/`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 10, color: 'var(--text3)', padding: '2px 6px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg4)' }}>
                            LC ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Notes & observations</div>
            <textarea value={notes} onChange={e => handleNotesChange(e.target.value)}
              placeholder="What clicked? What was confusing? Patterns you noticed..."
              rows={3} style={{ fontSize: 13 }} />
          </div>

          {/* Mark complete controls */}
          {!isCompleted && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>How was this session?</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {MOODS.map(m => (
                    <button key={m.val} onClick={() => setMood(m.val as typeof mood)}
                      style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${mood === m.val ? m.color : 'var(--border)'}`, background: mood === m.val ? 'rgba(0,0,0,0.2)' : 'var(--bg3)', color: mood === m.val ? m.color : 'var(--text2)', fontSize: 12, transition: 'all 0.15s' }}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Time spent: {timeSpent} min</div>
                <input type="range" min={0} max={360} step={15} value={timeSpent} onChange={e => setTimeSpent(Number(e.target.value))} />
              </div>
              <button onClick={markComplete} style={{ padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                ✓ Mark Day Complete (+{day.xp} XP)
              </button>
            </div>
          )}

          {isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ color: 'var(--green)', fontSize: 13 }}>
                ✓ Completed · {prog.mood} · {prog.timeSpent}min spent
              </div>
              <button onClick={() => dispatch({ type: 'UNMARK_DAY', dayNum: day.dayNum })}
                style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text3)', fontSize: 11 }}>
                Undo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Schedule() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { state } = useStore();
  const phase = PHASES[0];

  const week = phase.weeks.find(w => w.num === activeWeek)!;
  const weekDays = week.days.filter(d => !d.isRest);
  const weekDone = weekDays.filter(d => state.dayProgress[d.dayNum]?.completed).length;

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Phase 1 Schedule</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>56 days · 8 weeks · ~150 problems. Click any day to expand.</p>
      </div>

      {/* Week tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {phase.weeks.map(w => {
          const wDone = w.days.filter(d => !d.isRest && state.dayProgress[d.dayNum]?.completed).length;
          const wTotal = w.days.filter(d => !d.isRest).length;
          const active = activeWeek === w.num;
          return (
            <button key={w.num} onClick={() => setActiveWeek(w.num)} style={{
              padding: '7px 14px', borderRadius: 20, border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              background: active ? 'var(--accent-dim)' : 'var(--bg2)', color: active ? 'var(--accent2)' : 'var(--text2)',
              fontSize: 12, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 6
            }}>
              W{w.num}
              {wDone === wTotal ? <span style={{ color: 'var(--green)' }}>✓</span> : <span style={{ color: 'var(--text3)' }}>{wDone}/{wTotal}</span>}
            </button>
          );
        })}
      </div>

      {/* Week header */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Week {week.num}</div>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>{week.topic}</h2>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>{week.sub}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: weekDone === weekDays.length ? 'var(--green)' : 'var(--accent2)' }}>
              {weekDone}/{weekDays.length}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>days done</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, borderLeft: '3px solid var(--amber)' }}>
          <span style={{ fontSize: 11, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Tip: </span>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{week.tip}</span>
        </div>
      </div>

      {/* Days */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {week.days.map(day => (
          <DayCard key={day.dayNum} day={day}
            expanded={expandedDay === day.dayNum}
            onToggle={() => setExpandedDay(expandedDay === day.dayNum ? null : day.dayNum)} />
        ))}
      </div>
    </div>
  );
}
