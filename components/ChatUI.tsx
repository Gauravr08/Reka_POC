'use client';
import { useEffect, useRef, useState } from 'react';
import { streamToText } from '@/lib/streaming';

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export default function ChatUI() {
  const [model, setModel] = useState('gpt-4o-mini');
  const [provider, setProvider] = useState<'openai' | 'openrouter'>('openai');
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'system', content: 'You are a helpful, cyberpunk-themed assistant.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight }); }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user', content: input } as ChatMessage];
    setMessages(next);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next, model, provider })
    });

    let assistant = '';
    await streamToText(res, (chunk) => {
      assistant += chunk;
      setMessages(prev => [...prev.slice(0, -0), { role: 'assistant', content: assistant }]);
    });

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex gap-3">
        <select value={provider} onChange={e=>setProvider(e.target.value as any)}>
          <option value="openai">OpenAI</option>
          <option value="openrouter">OpenRouter</option>
        </select>
        <input value={model} onChange={e=>setModel(e.target.value)} placeholder="model id" />
      </div>
      <div ref={scroller} className="flex-1 overflow-auto space-y-3 p-2 bg-grid rounded-xl border border-zinc-800">
        {messages.filter(m=>m.role!=='system').map((m, i) => (
          <div key={i} className={`p-3 rounded-xl ${m.role==='user' ? 'bg-zinc-900' : 'bg-surface/70'} border border-zinc-800`}>{m.content}</div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask anything…" className="flex-1"/>
        <button className="btn-primary" onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
