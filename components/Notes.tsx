'use client';
import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { getAllDays } from '@/lib/data';

export default function Notes() {
  const { state, dispatch } = useStore();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allDays = getAllDays().filter(d => !d.isRest);

  const daysWithNotes = allDays.filter(d => {
    const notes = state.dayProgress[d.dayNum]?.notes ?? '';
    if (search) return notes.toLowerCase().includes(search.toLowerCase()) || d.focus.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const selectedDayData = selectedDay ? allDays.find(d => d.dayNum === selectedDay) : null;
  const selectedNotes = selectedDay ? (state.dayProgress[selectedDay]?.notes ?? '') : '';

  function handleNotes(dayNum: number, val: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'SET_NOTES', dayNum, notes: val });
    }, 400);
  }

  // Global note (freeform scratch pad)
  const [globalNote, setGlobalNote] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('global_scratch') ?? '';
  });

  function handleGlobal(val: string) {
    setGlobalNote(val);
    localStorage.setItem('global_scratch', val);
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Notes</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Per-day notes + a global scratch pad. All saved instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Sidebar list */}
        <div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..." style={{ marginBottom: 12, fontSize: 12 }} />

          {/* Global scratch pad */}
          <button onClick={() => setSelectedDay(null)} style={{
            width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10,
            border: `1px solid ${selectedDay === null ? 'var(--accent)' : 'var(--border)'}`,
            background: selectedDay === null ? 'var(--accent-dim)' : 'var(--bg2)',
            color: selectedDay === null ? 'var(--accent2)' : 'var(--text2)',
            fontSize: 12, marginBottom: 8, fontFamily: 'var(--font-mono)',
          }}>
            📋 Global Scratch Pad
          </button>

          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Per-day notes</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
            {daysWithNotes.map(d => {
              const notes = state.dayProgress[d.dayNum]?.notes ?? '';
              const hasNotes = notes.length > 0;
              const active = selectedDay === d.dayNum;
              return (
                <button key={d.dayNum} onClick={() => setSelectedDay(d.dayNum)} style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-dim)' : 'var(--bg2)',
                  color: active ? 'var(--accent2)' : hasNotes ? 'var(--text)' : 'var(--text3)',
                  fontSize: 12, fontFamily: 'var(--font-mono)', display: 'flex', gap: 8, alignItems: 'flex-start',
                }}>
                  <span style={{ flexShrink: 0, color: 'var(--text3)' }}>D{d.dayNum}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: hasNotes ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.focus}</div>
                    {hasNotes && <div style={{ fontSize: 10, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{notes.slice(0, 40)}…</div>}
                  </div>
                  {hasNotes && <span style={{ color: 'var(--accent)', fontSize: 8, flexShrink: 0, marginTop: 3 }}>●</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div>
          {selectedDay === null ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ fontSize: 18 }}>Global Scratch Pad</h2>
                <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Auto-saved</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>Free-form notes — patterns you&apos;re noticing, questions to ask your coach, anything.</p>
              <textarea
                defaultValue={globalNote}
                onChange={e => handleGlobal(e.target.value)}
                rows={22}
                placeholder="// Global scratch pad — write anything here&#10;// Patterns I keep forgetting:&#10;// Questions to ask:&#10;// Key insights:"
                style={{ fontSize: 13, lineHeight: 1.8, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          ) : selectedDayData ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Day {selectedDay} · Week {selectedDayData.weekNum} · {selectedDayData.dayName}</div>
                  <h2 style={{ fontSize: 20 }}>{selectedDayData.focus}</h2>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Auto-saved</span>
                  {state.dayProgress[selectedDay]?.completed && (
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--green-dim)', color: 'var(--green)' }}>✓ Complete</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, borderLeft: '3px solid var(--amber)' }}>
                <div style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 700, marginBottom: 4 }}>Session detail</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{selectedDayData.detail}</div>
              </div>

              {/* Problems quick list */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {selectedDayData.problems.filter(p => p.leetcodeId > 0).map(p => {
                  const done = state.dayProgress[selectedDay]?.problemsDone.includes(p.id);
                  return (
                    <a key={p.id}
                      href={`https://leetcode.com/problems/${p.name.toLowerCase().replace(/\d+\.\s*/,'').replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}/`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', background: done ? 'var(--green-dim)' : 'var(--bg3)', color: done ? 'var(--green)' : 'var(--text2)' }}>
                      {done && '✓ '}{p.name}
                    </a>
                  );
                })}
              </div>

              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Your notes</div>
              <textarea
                defaultValue={selectedNotes}
                onChange={e => handleNotes(selectedDay, e.target.value)}
                rows={14}
                placeholder="// What clicked today?&#10;// What was confusing?&#10;// Key pattern insight:&#10;// Edge cases to remember:&#10;// Time complexity reasoning:"
                style={{ fontSize: 13, lineHeight: 1.8, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
