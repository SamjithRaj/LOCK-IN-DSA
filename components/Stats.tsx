'use client';
import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { getAllDays, PHASES } from '@/lib/data';


function Bar({ pct, color = 'var(--accent)', height = 8 }: { pct: number; color?: string; height?: number }) {
  return (
    <div style={{ height, background: 'var(--bg4)', borderRadius: height / 2, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 1) * 100}%`, background: color, borderRadius: height / 2, transition: 'width 0.6s ease' }} />
    </div>
  );
}

export default function Stats() {
  const { state } = useStore();
  const allDays = getAllDays();

  const stats = useMemo(() => {
    const activeDays = allDays.filter(d => !d.isRest);
    const completedDays = activeDays.filter(d => state.dayProgress[d.dayNum]?.completed);
    const allProblems = allDays.flatMap(d => d.problems.filter(p => p.leetcodeId > 0));
    const solvedProblems = allDays.flatMap(d =>
      d.problems.filter(p => p.leetcodeId > 0 && state.dayProgress[d.dayNum]?.problemsDone.includes(p.id))
    );
    const easy = allProblems.filter(p => p.difficulty === 'E');
    const med = allProblems.filter(p => p.difficulty === 'M');
    const hard = allProblems.filter(p => p.difficulty === 'H');
    const easySolved = solvedProblems.filter(p => p.difficulty === 'E');
    const medSolved = solvedProblems.filter(p => p.difficulty === 'M');
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'H');

    // Per-week breakdown
    const weekStats = PHASES[0].weeks.map(w => {
      const wDays = w.days.filter(d => !d.isRest);
      const wDone = wDays.filter(d => state.dayProgress[d.dayNum]?.completed);
      const wProblems = w.days.flatMap(d => d.problems.filter(p => p.leetcodeId > 0));
      const wSolved = w.days.flatMap(d =>
        d.problems.filter(p => p.leetcodeId > 0 && state.dayProgress[d.dayNum]?.problemsDone.includes(p.id))
      );
      const totalTime = wDays.reduce((a, d) => a + (state.dayProgress[d.dayNum]?.timeSpent ?? 0), 0);
      return { num: w.num, topic: w.topic, done: wDone.length, total: wDays.length, solved: wSolved.length, totalProblems: wProblems.length, time: totalTime };
    });

    // Mood distribution
    const moods = { great: 0, okay: 0, tough: 0 };
    completedDays.forEach(d => {
      const m = state.dayProgress[d.dayNum]?.mood;
      if (m) moods[m]++;
    });

    // Pattern coverage
    const patternMap: Record<string, { total: number; solved: number }> = {};
    allDays.forEach(d => {
      d.problems.filter(p => p.leetcodeId > 0).forEach(p => {
        if (!patternMap[p.pattern]) patternMap[p.pattern] = { total: 0, solved: 0 };
        patternMap[p.pattern].total++;
        if (state.dayProgress[d.dayNum]?.problemsDone.includes(p.id)) patternMap[p.pattern].solved++;
      });
    });

    const totalTime = activeDays.reduce((a, d) => a + (state.dayProgress[d.dayNum]?.timeSpent ?? 0), 0);
    const avgTime = completedDays.length > 0 ? Math.round(totalTime / completedDays.length) : 0;

    return { activeDays, completedDays, allProblems, solvedProblems, easy, med, hard, easySolved, medSolved, hardSolved, weekStats, moods, patternMap, totalTime, avgTime };
  }, [state.dayProgress, allDays]);

  const level = Math.floor(state.totalXP / 500) + 1;
  const xpToNext = 500 - (state.totalXP % 500);


  const maxWeekSolved = Math.max(...stats.weekStats.map(w => w.solved), 1);

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Stats & Analytics</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Your full performance breakdown.</p>
      </div>

      {/* XP / Level hero */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--accent)', borderRadius: 16, padding: '24px 28px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'var(--accent-dim)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Current Level</div>
            <div style={{ fontSize: 56, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent2)', lineHeight: 1 }}>{level}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{state.totalXP} XP earned</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{xpToNext} to Level {level + 1}</span>
            </div>
            <Bar pct={(state.totalXP % 500) / 500} color="var(--accent)" height={10} />
            <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
              <div><span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--amber)' }}>{state.streak}</span><span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 4 }}>day streak</span></div>
              <div><span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>{stats.completedDays.length}</span><span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 4 }}>days done</span></div>
              <div><span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--blue)' }}>{stats.totalTime}</span><span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 4 }}>min logged</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem difficulty breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Easy', solved: stats.easySolved.length, total: stats.easy.length, color: 'var(--easy)', dim: 'var(--green-dim)' },
          { label: 'Medium', solved: stats.medSolved.length, total: stats.med.length, color: 'var(--medium)', dim: 'var(--amber-dim)' },
          { label: 'Hard', solved: stats.hardSolved.length, total: stats.hard.length, color: 'var(--hard)', dim: 'var(--red-dim)' },
        ].map(d => (
          <div key={d.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>{d.label}</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: d.dim, color: d.color, fontWeight: 700 }}>{d.total} total</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', color: d.color, lineHeight: 1, marginBottom: 10 }}>{d.solved}</div>
            <Bar pct={d.solved / Math.max(d.total, 1)} color={d.color} height={6} />
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>{d.total - d.solved} remaining</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Week-by-week chart */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text2)' }}>Problems Solved by Week</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
            {stats.weekStats.map(w => {
              const barH = w.solved === 0 ? 4 : Math.max(16, (w.solved / maxWeekSolved) * 100);
              const done = w.done === w.total;
              return (
                <div key={w.num} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: 'var(--accent2)', fontWeight: 700 }}>{w.solved > 0 ? w.solved : ''}</div>
                  <div style={{ width: '100%', position: 'relative' }}>
                    <div style={{ width: '100%', height: barH, background: done ? 'var(--green)' : w.solved > 0 ? 'var(--accent)' : 'var(--bg4)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', opacity: w.solved === 0 ? 0.4 : 1 }} />
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase' }}>W{w.num}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood chart */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text2)' }}>Session Mood Distribution</h3>
          {stats.completedDays.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', paddingTop: 30 }}>Complete some days to see mood data.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'great', label: '🔥 Great sessions', color: 'var(--green)' },
                { key: 'okay', label: '👍 Okay sessions', color: 'var(--amber)' },
                { key: 'tough', label: '😤 Tough sessions', color: 'var(--red)' },
              ].map(m => {
                const count = stats.moods[m.key as keyof typeof stats.moods];
                const pct = count / Math.max(stats.completedDays.length, 1);
                return (
                  <div key={m.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{m.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{count}</span>
                    </div>
                    <Bar pct={pct} color={m.color} height={8} />
                  </div>
                );
              })}
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)' }}>
                Avg session: <span style={{ color: 'var(--text2)' }}>{stats.avgTime} min</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pattern coverage */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text2)' }}>Pattern Coverage</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {Object.entries(stats.patternMap)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([pattern, { solved, total }]) => {
              const pct = solved / Math.max(total, 1);
              return (
                <div key={pattern}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{pattern}</span>
                    <span style={{ fontSize: 11, color: pct === 1 ? 'var(--green)' : 'var(--text3)', flexShrink: 0 }}>{solved}/{total}</span>
                  </div>
                  <Bar pct={pct} color={pct === 1 ? 'var(--green)' : 'var(--accent)'} height={5} />
                </div>
              );
            })}
        </div>
      </div>

      {/* Week detail table */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text2)' }}>Weekly Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 80px 80px', padding: '8px 20px', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)' }}>
          <span>Week</span><span>Topic</span><span>Days Done</span><span>Problems</span><span>Time</span><span>Status</span>
        </div>
        {stats.weekStats.map((w, i) => {
          const complete = w.done === w.total;
          const started = w.done > 0;
          return (
            <div key={w.num} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 80px 80px', padding: '12px 20px', borderBottom: i < stats.weekStats.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)' }}>W{w.num}</span>
              <span style={{ fontSize: 13, color: complete ? 'var(--text)' : started ? 'var(--text)' : 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: complete ? 600 : 400 }}>{w.topic}</span>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{w.done}/{w.total}</span>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{w.solved}/{w.totalProblems}</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{w.time > 0 ? `${w.time}m` : '—'}</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, width: 'fit-content',
                background: complete ? 'var(--green-dim)' : started ? 'var(--accent-dim)' : 'var(--bg3)',
                color: complete ? 'var(--green)' : started ? 'var(--accent2)' : 'var(--text3)' }}>
                {complete ? '✓ Done' : started ? 'Active' : 'Locked'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
