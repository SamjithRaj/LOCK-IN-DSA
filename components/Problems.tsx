'use client';
import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { getAllDays } from '@/lib/data';
import type { Problem } from '@/lib/data';

type Filter = 'all' | 'todo' | 'done' | 'E' | 'M' | 'H';

export default function Problems() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [patFilter, setPatFilter] = useState('');

  const allDays = getAllDays();

  const allProblems = useMemo(() => {
    return allDays.flatMap(d =>
      d.problems.filter(p => p.leetcodeId > 0).map(p => ({
        ...p,
        dayNum: d.dayNum,
        weekNum: d.weekNum,
        dayFocus: d.focus,
        done: state.dayProgress[d.dayNum]?.problemsDone.includes(p.id) ?? false,
        dayXP: Math.round((d.xp * 0.6) / Math.max(1, d.problems.filter(pp => pp.leetcodeId > 0).length)),
      }))
    );
  }, [state.dayProgress, allDays]);

  const patterns = useMemo(() => {
    const s = new Set(allProblems.map(p => p.pattern));
    return Array.from(s).sort();
  }, [allProblems]);

  const filtered = useMemo(() => {
    return allProblems.filter(p => {
      if (filter === 'done' && !p.done) return false;
      if (filter === 'todo' && p.done) return false;
      if (filter === 'E' && p.difficulty !== 'E') return false;
      if (filter === 'M' && p.difficulty !== 'M') return false;
      if (filter === 'H' && p.difficulty !== 'H') return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (patFilter && p.pattern !== patFilter) return false;
      return true;
    });
  }, [allProblems, filter, search, patFilter]);

  const stats = useMemo(() => ({
    total: allProblems.length,
    done: allProblems.filter(p => p.done).length,
    easy: allProblems.filter(p => p.difficulty === 'E').length,
    easyDone: allProblems.filter(p => p.difficulty === 'E' && p.done).length,
    med: allProblems.filter(p => p.difficulty === 'M').length,
    medDone: allProblems.filter(p => p.difficulty === 'M' && p.done).length,
    hard: allProblems.filter(p => p.difficulty === 'H').length,
    hardDone: allProblems.filter(p => p.difficulty === 'H' && p.done).length,
  }), [allProblems]);

  function toggleProblem(p: typeof allProblems[0]) {
    dispatch({ type: 'TOGGLE_PROBLEM', dayNum: p.dayNum, problemId: p.id, xp: p.dayXP });
  }

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: `All (${stats.total})` },
    { id: 'todo', label: `Todo (${stats.total - stats.done})` },
    { id: 'done', label: `Done (${stats.done})` },
    { id: 'E', label: `Easy (${stats.easyDone}/${stats.easy})` },
    { id: 'M', label: `Medium (${stats.medDone}/${stats.med})` },
    { id: 'H', label: `Hard (${stats.hardDone}/${stats.hard})` },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Problems</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>All {stats.total} problems from Phase 1. Track every solve.</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Solved', value: `${stats.done}/${stats.total}`, color: 'var(--accent2)', pct: stats.done/stats.total },
          { label: 'Easy', value: `${stats.easyDone}/${stats.easy}`, color: 'var(--easy)', pct: stats.easyDone/stats.easy },
          { label: 'Medium', value: `${stats.medDone}/${stats.med}`, color: 'var(--medium)', pct: stats.medDone/stats.med },
          { label: 'Hard', value: `${stats.hardDone}/${stats.hard}`, color: 'var(--hard)', pct: stats.hardDone/stats.hard },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'var(--font-display)' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color, marginBottom: 8 }}>{s.value}</div>
            <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(s.pct||0)*100}%`, background: s.color, borderRadius: 2, transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '6px 12px', borderRadius: 20, border: `1px solid ${filter === f.id ? 'var(--accent)' : 'var(--border)'}`,
            background: filter === f.id ? 'var(--accent-dim)' : 'var(--bg2)', color: filter === f.id ? 'var(--accent2)' : 'var(--text2)',
            fontSize: 12, fontFamily: 'var(--font-mono)',
          }}>{f.label}</button>
        ))}
        <select value={patFilter} onChange={e => setPatFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text2)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          <option value="">All patterns</option>
          {patterns.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search..." style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 12, width: 150, resize: 'none' }} />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 140px 60px 80px', gap: 0, padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-display)' }}>
          <span></span><span>Problem</span><span>Diff</span><span>Pattern</span><span>Day</span><span style={{ textAlign: 'right' }}>LC</span>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>No problems match your filters.</div>
        )}
        {filtered.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '40px 1fr 80px 140px 60px 80px',
            gap: 0, padding: '12px 16px',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            background: p.done ? 'rgba(34,199,142,0.03)' : 'transparent',
            alignItems: 'center', transition: 'background 0.1s',
          }}>
            <button onClick={() => toggleProblem(p)} style={{
              width: 20, height: 20, borderRadius: 5, border: `2px solid ${p.done ? 'var(--green)' : 'var(--border2)'}`,
              background: p.done ? 'var(--green)' : 'transparent', color: 'white', fontSize: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
            }}>{p.done && '✓'}</button>
            <span style={{ fontSize: 13, color: p.done ? 'var(--text3)' : 'var(--text)', textDecoration: p.done ? 'line-through' : 'none' }}>{p.name}</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, width: 'fit-content',
              background: p.difficulty === 'E' ? 'var(--green-dim)' : p.difficulty === 'M' ? 'var(--amber-dim)' : 'var(--red-dim)',
              color: p.difficulty === 'E' ? 'var(--easy)' : p.difficulty === 'M' ? 'var(--medium)' : 'var(--hard)',
              fontWeight: 700 }}>
              {p.difficulty === 'E' ? 'Easy' : p.difficulty === 'M' ? 'Med' : 'Hard'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent2)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 10, width: 'fit-content', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.pattern}</span>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>D{p.dayNum}</span>
            <div style={{ textAlign: 'right' }}>
              {p.leetcodeId > 0 && (
                <a href={`https://leetcode.com/problems/${p.name.toLowerCase().replace(/\d+\.\s*/,'').replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}/`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text2)', background: 'var(--bg3)' }}>
                  Open ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 12, textAlign: 'right' }}>
        Showing {filtered.length} of {stats.total} problems
      </div>
    </div>
  );
}
