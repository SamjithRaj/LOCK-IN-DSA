'use client';
import { useMemo, useState } from 'react';
import { LESSONS, LessonModule } from '@/lib/learning';
import { PHASES } from '@/lib/data';

function AnimationLab({ lesson }: { lesson: LessonModule }) {
  const chips = {
    pointers: ['L', '1', '2', '4', '7', 'R'],
    window: ['0', '1', '3', '6', '10', '15'],
    binary: ['F', 'F', 'F', 'T', 'T', 'T'],
    stack: ['73', '74', '75', '71', '69', '72'],
    tree: ['root', 'L', 'R', 'LL', 'LR', 'RL'],
    heap: ['9', '5', '7', '1', '2', '3'],
    graph: ['A', 'B', 'C', 'D', 'E', 'F'],
    backtrack: ['choose', 'go', 'save', 'undo', 'try next'],
  }[lesson.animation];

  return (
    <div className={`lesson-animation lesson-animation-${lesson.animation}`}>
      <div className="animation-stage">
        {chips.map((chip, idx) => <span key={`${chip}-${idx}`} className="animation-chip" style={{ animationDelay: `${idx * 0.16}s` }}>{chip}</span>)}
      </div>
      <div className="animation-caption">Animated intuition: {lesson.mentalModel}</div>
    </div>
  );
}

export default function Learn() {
  const [selected, setSelected] = useState(LESSONS[0].id);
  const lesson = LESSONS.find(l => l.id === selected) ?? LESSONS[0];
  const roadmapTopics = useMemo(() => PHASES[0].weeks.map(w => `${w.num}. ${w.topic}`), []);

  return (
    <div style={{ padding: 32, maxWidth: 1240, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 24, marginBottom: 28 }}>
        <section style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.28), var(--bg2) 58%, rgba(34,199,142,0.12))', border: '1px solid var(--accent)', borderRadius: 22, padding: 30, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -50, width: 180, height: 180, borderRadius: '50%', background: 'var(--accent-dim)', filter: 'blur(2px)' }} />
          <div style={{ color: 'var(--accent2)', fontSize: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Samjith&apos;s private DSA academy</div>
          <h1 style={{ fontSize: 42, marginBottom: 14 }}>Not a roadmap — your personal interview operating system.</h1>
          <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: 15, maxWidth: 720 }}>Every topic now has a deep explanation, decision rules, animated intuition, dry-run trace, interview script, traps, and a drill. It is built around your FAANG → MBA → investment banking lock-in path, not a generic course.</p>
        </section>
        <aside style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 22, padding: 22 }}>
          <h2 style={{ fontSize: 16, marginBottom: 14 }}>8-week syllabus map</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roadmapTopics.map(topic => <div key={topic} style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 10, color: 'var(--text2)', fontSize: 13 }}>{topic}</div>)}
          </div>
        </aside>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '310px 1fr', gap: 22 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LESSONS.map(item => {
            const active = item.id === selected;
            return <button key={item.id} onClick={() => setSelected(item.id)} style={{ textAlign: 'left', padding: 16, borderRadius: 16, border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent-dim)' : 'var(--bg2)', color: active ? 'var(--accent2)' : 'var(--text)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: active ? 'var(--accent2)' : 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Week {item.week}</span>
                <span style={{ fontSize: 10, color: active ? 'var(--green)' : 'var(--text3)' }}>{item.level}</span>
              </div>
              <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6, lineHeight: 1.45 }}>{item.summary}</div>
            </button>;
          })}
        </nav>

        <article style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 22, padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Week {lesson.week} · {lesson.level}</div>
                <h2 style={{ fontSize: 34, marginTop: 6 }}>{lesson.title}</h2>
              </div>
              <div style={{ padding: '10px 14px', height: 'fit-content', background: 'var(--green-dim)', color: 'var(--green)', borderRadius: 999, fontSize: 12, fontWeight: 800 }}>Tailored for Samjith</div>
            </div>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 14 }}>{lesson.samjithWhy}</p>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: 15 }}>{lesson.mentalModel}</p>
          </section>

          <AnimationLab lesson={lesson} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>When to use it</h3>
              <ul style={{ color: 'var(--text2)', lineHeight: 1.8, paddingLeft: 18 }}>{lesson.whenToUse.map(item => <li key={item}>{item}</li>)}</ul>
            </section>
            <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Common traps</h3>
              <ul style={{ color: 'var(--text2)', lineHeight: 1.8, paddingLeft: 18 }}>{lesson.pitfalls.map(item => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 22 }}>
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>Detailed explanation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{lesson.deepDive.map(item => <p key={item} style={{ color: 'var(--text2)', lineHeight: 1.8 }}>{item}</p>)}</div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <section style={{ background: 'var(--bg3)', borderRadius: 18, padding: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Reusable template</h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>{lesson.template.join('\n')}</pre>
            </section>
            <section style={{ background: 'var(--bg3)', borderRadius: 18, padding: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Dry-run trace</h3>
              <ol style={{ color: 'var(--text2)', lineHeight: 1.8, paddingLeft: 18 }}>{lesson.trace.map(step => <li key={step}>{step}</li>)}</ol>
            </section>
          </div>

          <section style={{ padding: 20, border: '1px solid var(--accent)', borderRadius: 18, background: 'var(--accent-dim)' }}>
            <div style={{ color: 'var(--accent2)', fontWeight: 800, marginBottom: 8 }}>Say this in the interview</div>
            <p style={{ color: 'var(--text)', lineHeight: 1.8 }}>{lesson.interviewScript}</p>
            <div style={{ marginTop: 14, color: 'var(--green)' }}><strong>Today&apos;s drill:</strong> {lesson.drill}</div>
          </section>
        </article>
      </div>
    </div>
  );
}
