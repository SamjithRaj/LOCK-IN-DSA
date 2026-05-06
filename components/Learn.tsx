'use client';
import { useMemo, useState } from 'react';
import { LESSONS } from '@/lib/learning';
import { PHASES } from '@/lib/data';

export default function Learn() {
  const [selected, setSelected] = useState(LESSONS[0].id);
  const lesson = LESSONS.find(l => l.id === selected) ?? LESSONS[0];
  const roadmapTopics = useMemo(() => PHASES[0].weeks.map(w => `${w.num}. ${w.topic}`), []);

  return (
    <div style={{ padding: 32, maxWidth: 1180, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 24, marginBottom: 28 }}>
        <section style={{ background: 'linear-gradient(135deg, var(--bg2), var(--bg3))', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
          <div style={{ color: 'var(--accent2)', fontSize: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Learn DSA inside the app</div>
          <h1 style={{ fontSize: 38, marginBottom: 14 }}>From tracker to coach-led curriculum.</h1>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: 15 }}>Each module teaches the mental model, gives you a reusable template, calls out traps, and links directly to practice. Treat it like a mini CodeChef Learn path for FAANG-style DSA.</p>
        </section>
        <aside style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 14 }}>Roadmap syllabus</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roadmapTopics.map(topic => <div key={topic} style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 10, color: 'var(--text2)', fontSize: 13 }}>{topic}</div>)}
          </div>
        </aside>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 22 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LESSONS.map(item => {
            const active = item.id === selected;
            return <button key={item.id} onClick={() => setSelected(item.id)} style={{ textAlign: 'left', padding: 16, borderRadius: 14, border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent-dim)' : 'var(--bg2)', color: active ? 'var(--accent2)' : 'var(--text)' }}>
              <div style={{ fontSize: 11, color: active ? 'var(--accent2)' : 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{item.level}</div>
              <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6, lineHeight: 1.45 }}>{item.summary}</div>
            </button>;
          })}
        </nav>

        <article style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lesson.level} module</div>
              <h2 style={{ fontSize: 30, marginTop: 6 }}>{lesson.title}</h2>
            </div>
            <div style={{ padding: '10px 14px', height: 'fit-content', background: 'var(--green-dim)', color: 'var(--green)', borderRadius: 999, fontSize: 12, fontWeight: 800 }}>Coach mode</div>
          </div>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 22 }}>{lesson.mentalModel}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <section style={{ background: 'var(--bg3)', borderRadius: 14, padding: 18 }}>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Reusable template</h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>{lesson.template.join('\n')}</pre>
            </section>
            <section style={{ background: 'var(--bg3)', borderRadius: 14, padding: 18 }}>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Common traps</h3>
              <ul style={{ color: 'var(--text2)', lineHeight: 1.7, paddingLeft: 18, fontSize: 13 }}>
                {lesson.pitfalls.map(p => <li key={p}>{p}</li>)}
              </ul>
            </section>
          </div>
          <div style={{ marginTop: 18, padding: 18, border: '1px solid var(--accent)', borderRadius: 14, background: 'var(--accent-dim)' }}>
            <strong style={{ color: 'var(--accent2)' }}>Today&apos;s drill:</strong> <span style={{ color: 'var(--text2)' }}>{lesson.drill}</span>
          </div>
        </article>
      </div>
    </div>
  );
}
