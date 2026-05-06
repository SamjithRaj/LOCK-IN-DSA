'use client';
import { useMemo, useState } from 'react';
import { DOUBT_TOPICS } from '@/lib/learning';

interface Reply { question: string; title: string; answer: string; next: string }

function answerQuestion(question: string): Reply {
  const q = question.toLowerCase();
  const match = DOUBT_TOPICS.find(topic => topic.keys.some(key => q.includes(key)));
  if (match) return { question, title: match.title, answer: match.answer, next: match.next };
  return {
    question,
    title: 'General debugging plan',
    answer: 'Break the doubt into four parts: input shape, brute force idea, repeated work, and the invariant a better pattern would maintain. Most DSA doubts become easier once you can name the invariant.',
    next: 'Ask again with a pattern name like sliding window, binary search, graph, or two pointers for a sharper answer.',
  };
}

export default function Mentor() {
  const [question, setQuestion] = useState('When should I use sliding window?');
  const [replies, setReplies] = useState<Reply[]>([]);
  const suggestions = useMemo(() => ['Explain two pointers with proof', 'Binary search on answer feels confusing', 'How do I detect cycles in graphs?'], []);

  function submit(text = question) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setReplies(prev => [answerQuestion(trimmed), ...prev].slice(0, 6));
    setQuestion('');
  }

  return (
    <div style={{ padding: 32, maxWidth: 980, margin: '0 auto' }} className="animate-fadeIn">
      <section style={{ background: 'linear-gradient(135deg, var(--accent-dim), var(--bg2))', border: '1px solid var(--accent)', borderRadius: 20, padding: 30, marginBottom: 24 }}>
        <div style={{ color: 'var(--accent2)', fontSize: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Doubt solver</div>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Ask small DSA doubts instantly.</h1>
        <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>This built-in mentor gives pattern-level answers for common beginner doubts. It is intentionally simple, fast, and focused on helping you decide what to try next.</p>
      </section>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: 20, marginBottom: 20 }}>
        <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask: Why does two pointer work for sorted arrays?" style={{ width: '100%', minHeight: 110, resize: 'vertical', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 14, padding: 14, fontSize: 14, lineHeight: 1.6, outline: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{suggestions.map(s => <button key={s} onClick={() => submit(s)} style={{ padding: '7px 10px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', fontSize: 12 }}>{s}</button>)}</div>
          <button onClick={() => submit()} style={{ padding: '10px 18px', borderRadius: 12, border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 800 }}>Ask mentor →</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {replies.length === 0 && <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 28 }}>Ask your first doubt to start a local mentor thread.</div>}
        {replies.map((reply, idx) => <article key={`${reply.question}-${idx}`} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>You asked: {reply.question}</div>
          <h2 style={{ fontSize: 20, marginBottom: 10 }}>{reply.title}</h2>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 12 }}>{reply.answer}</p>
          <div style={{ padding: 12, background: 'var(--green-dim)', color: 'var(--green)', borderRadius: 12, fontSize: 13 }}><strong>Next step:</strong> {reply.next}</div>
        </article>)}
      </div>
    </div>
  );
}
