'use client';
import { useState } from 'react';
import { CHALLENGES } from '@/lib/learning';

export default function PracticeArena() {
  const [challengeId, setChallengeId] = useState(CHALLENGES[0].id);
  const challenge = CHALLENGES.find(c => c.id === challengeId) ?? CHALLENGES[0];
  const [code, setCode] = useState(challenge.starter);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function selectChallenge(id: string) {
    const next = CHALLENGES.find(c => c.id === id) ?? CHALLENGES[0];
    setChallengeId(id);
    setCode(next.starter);
    setShowHint(false);
    setShowSolution(false);
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 24 }}>
        <div>
          <div style={{ color: 'var(--accent2)', fontSize: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Practice arena</div>
          <h1 style={{ fontSize: 34, marginTop: 6 }}>CodeChef-style problem workspace</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>Read the statement, build the approach, write code, then reveal hints or the editorial only when stuck.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {CHALLENGES.map(c => <button key={c.id} onClick={() => selectChallenge(c.id)} style={{ padding: '8px 12px', borderRadius: 999, border: `1px solid ${c.id === challengeId ? 'var(--accent)' : 'var(--border)'}`, background: c.id === challengeId ? 'var(--accent-dim)' : 'var(--bg2)', color: c.id === challengeId ? 'var(--accent2)' : 'var(--text2)', fontSize: 12 }}>{c.title}</button>)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 22 }}>
        <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 24 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <span style={{ background: 'var(--green-dim)', color: 'var(--green)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 800 }}>{challenge.difficulty}</span>
            <span style={{ background: 'var(--accent-dim)', color: 'var(--accent2)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 800 }}>{challenge.pattern}</span>
          </div>
          <h2 style={{ fontSize: 28, marginBottom: 12 }}>{challenge.title}</h2>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 18 }}>{challenge.prompt}</p>
          <h3 style={{ fontSize: 14, marginBottom: 10 }}>Examples</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {challenge.examples.map(ex => <code key={ex} style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, color: 'var(--text2)', fontSize: 13 }}>{ex}</code>)}
          </div>
          <button onClick={() => setShowHint(v => !v)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text)' }}>{showHint ? 'Hide approach' : 'Need a hint?'}</button>
          {showHint && <ol style={{ color: 'var(--text2)', lineHeight: 1.7, paddingLeft: 22, marginTop: 16, fontSize: 14 }}>{challenge.approach.map(step => <li key={step}>{step}</li>)}</ol>}
        </section>

        <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>JavaScript editor</span>
            <button onClick={() => setShowSolution(v => !v)} style={{ padding: '7px 10px', borderRadius: 9, border: '1px solid var(--accent)', background: 'var(--accent-dim)', color: 'var(--accent2)', fontSize: 12 }}>{showSolution ? 'Hide editorial' : 'Reveal editorial'}</button>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} style={{ width: '100%', minHeight: 300, background: 'var(--bg)', color: 'var(--text)', border: 'none', padding: 18, fontSize: 13, lineHeight: 1.6, fontFamily: 'var(--font-mono)', resize: 'vertical', outline: 'none' }} />
          {showSolution && <div style={{ borderTop: '1px solid var(--border)', padding: 18, background: 'var(--bg3)' }}>
            <div style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Editorial solution</div>
            <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text2)', fontSize: 13, lineHeight: 1.6 }}>{challenge.solution}</pre>
          </div>}
        </section>
      </div>
    </div>
  );
}
