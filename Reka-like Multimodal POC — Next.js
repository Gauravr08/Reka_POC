# Reka-like Multimodal POC — Next.js (App Router)

Below is a complete, deployable POC built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **lucide-react**, and **Recharts**. It implements the requested modules: **Dashboard**, **Vision**, **Research (EXA AI)**, **Chat (OpenAI/OpenRouter)**, **Speech**, and **Spaces** (lightweight workspace manager). The POC is API-key driven using server routes under `/app/api/*`.

> **How to use this file:** Copy the structure and contents into a fresh project folder. Run `pnpm install` or `npm install`, set environment variables from `.env.example` into `.env.local`, then `pnpm dev` or `npm run dev`.

---

## File Tree

```
reka-poc/
├─ app/
│  ├─ api/
│  │  ├─ chat/route.ts
│  │  ├─ vision/route.ts
│  │  ├─ research/route.ts
│  │  └─ speech/
│  │     ├─ tts/route.ts
│  │     └─ stt/route.ts
│  ├─ (ui)/
│  │  ├─ dashboard/page.tsx
│  │  ├─ vision/page.tsx
│  │  ├─ research/page.tsx
│  │  ├─ chat/page.tsx
│  │  ├─ speech/page.tsx
│  │  └─ spaces/page.tsx
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ Sidebar.tsx
│  ├─ Topbar.tsx
│  ├─ Card.tsx
│  ├─ ChatUI.tsx
│  ├─ FileDrop.tsx
│  ├─ Glow.tsx
│  ├─ SpaceStore.ts
│  └─ charts/
│     └─ KpiChart.tsx
├─ lib/
│  ├─ providers.ts
│  ├─ streaming.ts
│  └─ theme.ts
├─ public/
│  └─ logo.svg
├─ styles/
│  └─ globals.css
├─ .env.example
├─ next.config.mjs
├─ package.json
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
└─ README.md
```

---

## `package.json`

```json
{
  "name": "reka-poc",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "framer-motion": "^11.2.6",
    "lucide-react": "^0.441.0",
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "recharts": "^2.12.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.9",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4"
  }
}
```

---

## `.env.example`

```
# Choose which provider to default to in /lib/providers.ts
OPENAI_API_KEY=sk-...
# For OpenRouter (optional if using OpenAI only)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_API_BASE=https://openrouter.ai/api/v1

# EXA AI
EXA_API_KEY=exask-...

# (Optional) OpenAI Realtime / TTS/STT models
OPENAI_TTS_MODEL=tts-1
OPENAI_STT_MODEL=whisper-1
```

> Copy this as `.env.local` in project root and fill in your keys.

---

## `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;
```

---

## `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.{css}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#0a0b0f',
        surface: '#0f1117',
        accent: '#00FFC6',
        magenta: '#FF00E5',
        cyber: '#7DF9FF',
        neon: '#39FF14'
      },
      boxShadow: {
        glow: '0 0 25px rgba(0, 255, 198, 0.35)',
        neon: '0 0 30px rgba(255, 0, 229, 0.35)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(125,249,255,0.12) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px'
      }
    }
  },
  plugins: []
};

export default config;
```

---

## `postcss.config.mjs`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["node"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## `styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }

html, body, #__next { height: 100%; }
body { @apply bg-base text-zinc-200; }

/* cyberpunk glow */
.cyber-border { box-shadow: 0 0 0 1px rgba(0,255,198,0.25), inset 0 0 20px rgba(255,0,229,0.15); }
.neon-text { text-shadow: 0 0 10px rgba(0,255,198,0.6), 0 0 20px rgba(255,0,229,0.35); }

.bg-grid { background-image: radial-gradient(circle at 1px 1px, rgba(125,249,255,0.08) 1px, transparent 1px); background-size: 40px 40px; }

input, textarea, select { @apply bg-surface/70 border border-zinc-800 rounded-xl px-3 py-2 outline-none focus:border-accent/60 focus:shadow-glow transition; }
button { @apply rounded-xl px-4 py-2 font-medium; }
.btn-primary { @apply bg-accent text-black hover:brightness-110 shadow-glow; }
.btn-ghost { @apply bg-surface/70 border border-zinc-800 hover:border-accent/50; }
.card { @apply bg-surface/80 border border-zinc-800 rounded-2xl p-4 cyber-border; }

/* Scroll */
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #FF00E5, #00FFC6); border-radius: 12px; }
```

---

## `lib/theme.ts`

```ts
export const appTitle = 'REKA•POC';
export const brand = {
  name: 'REKA•POC',
  tagline: 'Multimodal Intelligence — Cyberpunk Edition',
};
```

---

## `lib/providers.ts`

```ts
export type Provider = 'openai' | 'openrouter';

export const defaultProvider: Provider = process.env.OPENROUTER_API_KEY ? 'openrouter' : 'openai';

export const openAI = {
  baseUrl: 'https://api.openai.com/v1',
  key: process.env.OPENAI_API_KEY,
  chatModel: 'gpt-4o-mini', // text + vision capable
  textModel: 'gpt-4o-mini',
  ttsModel: process.env.OPENAI_TTS_MODEL || 'tts-1',
  sttModel: process.env.OPENAI_STT_MODEL || 'whisper-1',
};

export const openRouter = {
  baseUrl: process.env.OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1',
  key: process.env.OPENROUTER_API_KEY,
  // Change to your preferred OpenRouter models
  chatModel: 'openai/gpt-4o-mini',
  textModel: 'openai/gpt-4o-mini',
};

export const exa = {
  baseUrl: 'https://api.exa.ai',
  key: process.env.EXA_API_KEY,
};

export function assertServerKeys() {
  if (!openAI.key && !openRouter.key) {
    throw new Error('Provide OPENAI_API_KEY or OPENROUTER_API_KEY');
  }
}
```

---

## `lib/streaming.ts`

```ts
export async function* readStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) yield decoder.decode(value, { stream: true });
  }
}

export async function streamToText(res: Response, onChunk: (t: string) => void) {
  const reader = res.body?.getReader();
  if (!reader) return;
  for await (const chunk of readStream(reader)) {
    onChunk(chunk);
  }
}
```

---

## `components/Glow.tsx`

```tsx
'use client';
import { motion } from 'framer-motion';

export default function Glow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 1.2 }}
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,0,229,0.18), transparent 60%)' }} />
      <div className="absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(0,255,198,0.18), transparent 60%)' }} />
    </motion.div>
  );
}
```

---

## `components/Card.tsx`

```tsx
import { ReactNode } from 'react';

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}
```

---

## `components/Topbar.tsx`

```tsx
'use client';
import { appTitle } from '@/lib/theme';
import { motion } from 'framer-motion';
import { Cpu, Shield, Github, Rocket } from 'lucide-react';

export default function Topbar() {
  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-30 bg-base/80 backdrop-blur border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <Cpu className="text-accent" />
        <h1 className="text-xl font-bold tracking-widest neon-text">{appTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <a className="btn-ghost" href="https://github.com/" target="_blank" rel="noreferrer"><Github size={18} /></a>
          <a className="btn-primary flex items-center gap-2" href="#" onClick={(e)=>e.preventDefault()}><Rocket size={18}/> Deploy</a>
          <span className="text-xs text-zinc-500 flex items-center gap-1"><Shield size={14}/> POC Build</span>
        </div>
      </div>
    </motion.header>
  );
}
```

---

## `components/Sidebar.tsx`

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Camera, MessagesSquare, MicVocal, Newspaper, LayoutDashboard, FolderKanban } from 'lucide-react';

const links = [
  { href: '/(ui)/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/(ui)/vision', label: 'Vision', icon: Camera },
  { href: '/(ui)/research', label: 'Research', icon: Newspaper },
  { href: '/(ui)/chat', label: 'Chat', icon: MessagesSquare },
  { href: '/(ui)/speech', label: 'Speech', icon: MicVocal },
  { href: '/(ui)/spaces', label: 'Spaces', icon: FolderKanban },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-full w-64 shrink-0 border-r border-zinc-800 bg-surface/60 backdrop-blur">
      <div className="p-4">
        <div className="text-sm text-zinc-400 mb-2">Modules</div>
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${active ? 'border-accent/60 bg-surface/80 shadow-glow' : 'border-zinc-800 hover:border-accent/40'}`}>
                <Icon size={18} className={active ? 'text-accent' : 'text-zinc-400'} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 text-sm text-zinc-500">Functionality presets inside each module (top of page).</div>
      </div>
    </aside>
  );
}
```

---

## `components/FileDrop.tsx`

```tsx
'use client';
import { useCallback } from 'react';

export default function FileDrop({ onFile }: { onFile: (file: File) => void }) {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }, [onFile]);

  return (
    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer border-zinc-700 hover:border-accent/60">
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <p className="mb-2 text-sm text-zinc-400">Click to upload or drag and drop</p>
        <p className="text-xs text-zinc-500">PNG, JPG up to ~5MB</p>
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  );
}
```

---

## `components/ChatUI.tsx`

```tsx
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
```

---

## `components/charts/KpiChart.tsx`

```tsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 12 }).map((_, i) => ({ month: `M${i+1}`, value: Math.round(40 + Math.random()*60) }));

export default function KpiChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00FFC6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## `components/SpaceStore.ts`

```ts
export type SpaceItem = {
  id: string;
  type: 'chat' | 'vision' | 'research';
  title: string;
  payload: any;
  createdAt: number;
};

export type Space = {
  id: string;
  name: string;
  items: SpaceItem[];
};

const KEY = 'reka_poc_spaces_v1';

export function loadSpaces(): Space[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Space[] : [];
}

export function saveSpaces(spaces: Space[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(spaces));
}
```

---

## `app/layout.tsx`

```tsx
import './globals.css';
import { ReactNode } from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Glow from '@/components/Glow';

export const metadata = {
  title: 'REKA•POC',
  description: 'Multimodal POC with Cyberpunk vibes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Glow />
        <Topbar />
        <div className="mx-auto max-w-7xl px-4 py-6 flex gap-6 min-h-[calc(100vh-64px)]">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

---

## `app/page.tsx`

```tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-bold neon-text">Welcome to REKA•POC</h1>
      <p className="text-zinc-400">Choose a module from the sidebar. Start with the Dashboard to see KPIs and status.</p>
      <Link href="/(ui)/dashboard" className="btn-primary w-max">Open Dashboard</Link>
    </div>
  );
}
```

---

## `app/(ui)/dashboard/page.tsx`

```tsx
import Card from '@/components/Card';
import KpiChart from '@/components/charts/KpiChart';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Card>
        <div className="text-sm text-zinc-400 mb-1">System Load</div>
        <div className="text-3xl font-bold">72%</div>
        <div className="text-xs text-zinc-500">Avg over last hour</div>
        <div className="mt-4"><KpiChart /></div>
      </Card>
      <Card>
        <div className="text-sm text-zinc-400 mb-1">Requests Today</div>
        <div className="text-3xl font-bold">12,408</div>
        <div className="text-xs text-zinc-500">+14% vs yesterday</div>
      </Card>
      <Card>
        <div className="text-sm text-zinc-400 mb-1">Research Queue</div>
        <div className="text-3xl font-bold">38</div>
        <div className="text-xs text-zinc-500">EXA AI tasks pending</div>
      </Card>
      <Card className="xl:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-400">Latency (p95)</div>
            <div className="text-2xl font-bold">412 ms</div>
          </div>
          <div className="text-xs text-zinc-500">Live preview</div>
        </div>
        <div className="mt-4"><KpiChart /></div>
      </Card>
      <Card>
        <div className="text-sm text-zinc-400">Module Status</div>
        <ul className="mt-2 text-sm">
          <li>Vision: <span className="text-accent">OK</span></li>
          <li>Research: <span className="text-accent">OK</span></li>
          <li>Chat: <span className="text-accent">OK</span></li>
          <li>Speech: <span className="text-accent">OK</span></li>
          <li>Spaces: <span className="text-accent">OK</span></li>
        </ul>
      </Card>
    </div>
  );
}
```

---

## `app/(ui)/vision/page.tsx`

```tsx
'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import FileDrop from '@/components/FileDrop';

export default function VisionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [result, setResult] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [provider, setProvider] = useState<'openai' | 'openrouter'>('openai');

  async function analyze() {
    if (!image) return;
    const res = await fetch('/api/vision', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, prompt, model, provider })
    });
    const data = await res.json();
    setResult(data.text || data.error || 'No response');
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex gap-3 items-center">
          <select value={provider} onChange={e=>setProvider(e.target.value as any)}>
            <option value="openai">OpenAI</option>
            <option value="openrouter">OpenRouter</option>
          </select>
          <input value={model} onChange={e=>setModel(e.target.value)} placeholder="vision-capable model" />
          <input value={prompt} onChange={e=>setPrompt(e.target.value)} className="flex-1" />
          <button onClick={analyze} className="btn-primary">Analyze</button>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          {!image ? (
            <FileDrop onFile={(file) => {
              const reader = new FileReader();
              reader.onload = () => setImage(reader.result as string);
              reader.readAsDataURL(file);
            }} />
          ) : (
            <img src={image} alt="uploaded" className="rounded-xl border border-zinc-800" />
          )}
        </Card>
        <Card>
          <div className="text-sm text-zinc-400 mb-2">Vision Output</div>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </Card>
      </div>
    </div>
  );
}
```

---

## `app/(ui)/research/page.tsx`

```tsx
'use client';
import { useState } from 'react';
import Card from '@/components/Card';

export default function ResearchPage() {
  const [query, setQuery] = useState('State of multimodal video agents in 2025');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const res = await fetch('/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) });
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex gap-2">
          <input className="flex-1" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask EXA AI…" />
          <button className="btn-primary" onClick={run} disabled={loading}>{loading? 'Researching…' : 'Research'}</button>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {results.map((r, i) => (
          <Card key={i}>
            <a href={r.url} target="_blank" className="text-accent font-semibold hover:underline">{r.title || r.url}</a>
            <div className="text-xs text-zinc-500 mt-1">{r.source || r.domain}</div>
            <p className="text-sm mt-2">{r.snippet}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## `app/(ui)/chat/page.tsx`

```tsx
import ChatUI from '@/components/ChatUI';
import Card from '@/components/Card';

export default function ChatPage() {
  return (
    <Card>
      <ChatUI />
    </Card>
  );
}
```

---

## `app/(ui)/speech/page.tsx`

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Card from '@/components/Card';

export default function SpeechPage() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [text, setText] = useState('Welcome to the cyberpunk voice console.');
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // TTS
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function speak() {
    if (!synthRef.current) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => /en|US/i.test(v.lang)) || voices[0];
    if (voice) utter.voice = voice;
    synthRef.current.speak(utter);
  }

  // STT (Web Speech API)
  let recognition: any = null as any;
  function initRec() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e: any) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        t += e.results[i][0].transcript;
      }
      setTranscript(t);
    };
    rec.onend = () => setRecording(false);
    return rec;
  }

  function toggleRecord() {
    if (recording) {
      recognition && recognition.stop();
      setRecording(false);
      return;
    }
    recognition = initRec();
    if (!recognition) { alert('SpeechRecognition not supported in this browser.'); return; }
    recognition.start();
    setRecording(true);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-sm text-zinc-400">Text-to-Speech</div>
        <div className="flex gap-2 mt-2">
          <textarea className="flex-1" rows={3} value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn-primary h-max" onClick={speak}>Speak</button>
        </div>
      </Card>
      <Card>
        <div className="text-sm text-zinc-400">Speech-to-Text</div>
        <div className="mt-2 flex items-center gap-2">
          <button className={`btn-primary ${recording ? 'opacity-70' : ''}`} onClick={toggleRecord}>{recording? 'Stop' : 'Record'}</button>
          <div className="text-xs text-zinc-500">Uses Web Speech API (client-side). For server Whisper, wire /api/speech/stt.</div>
        </div>
        <pre className="mt-3 whitespace-pre-wrap text-sm">{transcript}</pre>
      </Card>
    </div>
  );
}
```

---

## `app/(ui)/spaces/page.tsx`

```tsx
'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import { loadSpaces, saveSpaces, Space } from '@/components/SpaceStore';

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [name, setName] = useState('New Space');

  useEffect(()=>{ setSpaces(loadSpaces()); }, []);

  function create() {
    const s: Space = { id: crypto.randomUUID(), name, items: [] };
    const next = [...spaces, s];
    setSpaces(next); saveSpaces(next);
  }
  function remove(id: string) {
    const next = spaces.filter(s=>s.id!==id); setSpaces(next); saveSpaces(next);
  }
  function exportAll() {
    const blob = new Blob([JSON.stringify(spaces, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='spaces.json'; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} className="flex-1" />
          <button className="btn-primary" onClick={create}>Create Space</button>
          <button className="btn-ghost" onClick={exportAll}>Export</button>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {spaces.map(s => (
          <Card key={s.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">Space</div>
                <div className="text-xl font-semibold">{s.name}</div>
              </div>
              <button className="btn-ghost" onClick={()=>remove(s.id)}>Delete</button>
            </div>
            <div className="text-xs text-zinc-500 mt-2">Items: {s.items.length}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## API ROUTES

### `app/api/chat/route.ts`

```ts
import { NextRequest } from 'next/server';
import { openAI, openRouter, assertServerKeys } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    assertServerKeys();
    const { messages, model, provider } = await req.json();

    if ((provider === 'openrouter' && !openRouter.key) || (provider === 'openai' && !openAI.key)) {
      return new Response('Missing API key for selected provider', { status: 400 });
    }

    const useOpenRouter = provider === 'openrouter';
    const url = useOpenRouter ? `${openRouter.baseUrl}/chat/completions` : `${openAI.baseUrl}/chat/completions`;
    const key = useOpenRouter ? openRouter.key! : openAI.key!;

    const body = JSON.stringify({
      model: model || (useOpenRouter ? openRouter.chatModel : openAI.chatModel),
      stream: true,
      messages
    });

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(useOpenRouter ? { 'HTTP-Referer': 'https://localhost', 'X-Title': 'REKA-POC' } : {})
      },
      body
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return new Response(text || 'Upstream error', { status: upstream.status });
    }

    // Stream text chunks (OpenAI & OpenRouter both support SSE/Chunked JSON; for simplicity parse text-only deltas)
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // Naive text extraction — works for text-stream style responses; adapt as needed
          const parts = buffer.split('\n');
          for (const p of parts) {
            if (p.startsWith('data: ')) {
              const payload = p.replace('data: ', '').trim();
              if (payload === '[DONE]') continue;
              try {
                const json = JSON.parse(payload);
                const delta = json.choices?.[0]?.delta?.content || json.choices?.[0]?.message?.content || '';
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch {}
            }
          }
          buffer = parts[parts.length - 1];
        }
        controller.close();
      }
    });

    return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
```

---

### `app/api/vision/route.ts`

```ts
import { NextRequest } from 'next/server';
import { openAI, openRouter } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, model, provider } = await req.json();
    const useOpenRouter = provider === 'openrouter';

    const url = useOpenRouter ? `${openRouter.baseUrl}/chat/completions` : `${openAI.baseUrl}/chat/completions`;
    const key = useOpenRouter ? openRouter.key : openAI.key;
    if (!key) return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 400 });

    const body = {
      model: model || (useOpenRouter ? openRouter.chatModel : openAI.chatModel),
      messages: [
        { role: 'user', content: [
          { type: 'text', text: prompt || 'Describe this image.' },
          { type: 'image_url', image_url: { url: image } }
        ]}
      ]
    } as any;

    const r = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || j.choices?.[0]?.delta?.content || '';
    return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
```

---

### `app/api/research/route.ts`

```ts
import { NextRequest } from 'next/server';
import { exa } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    if (!exa.key) return new Response(JSON.stringify({ error: 'Missing EXA_API_KEY' }), { status: 400 });
    const { query } = await req.json();

    const r = await fetch(`${exa.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${exa.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, numResults: 12 })
    });

    const j = await r.json();
    const results = (j.results || j.data || []).map((x: any) => ({
      title: x.title || x.scoreTitle || x.url,
      url: x.url,
      snippet: x.snippet || x.text || '',
      source: x.source || x.siteName || x.host || '',
      domain: x.domain || ''
    }));

    return new Response(JSON.stringify({ results }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
```

---

### `app/api/speech/tts/route.ts`

```ts
import { NextRequest } from 'next/server';
import { openAI } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'alloy' } = await req.json();
    if (!openAI.key) return new Response('Missing OPENAI_API_KEY', { status: 400 });

    const r = await fetch(`${openAI.baseUrl}/audio/speech`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openAI.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: openAI.ttsModel, voice, input: text })
    });

    if (!r.ok) return new Response(await r.text(), { status: r.status });

    // Proxy back audio
    return new Response(r.body, { headers: { 'Content-Type': 'audio/mpeg' } });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}
```

---

### `app/api/speech/stt/route.ts`

```ts
import { NextRequest } from 'next/server';
import { openAI } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    if (!openAI.key) return new Response('Missing OPENAI_API_KEY', { status: 400 });
    const form = await req.formData();
    const audio = form.get('file') as File | null;
    if (!audio) return new Response('No file', { status: 400 });

    const upstream = await fetch(`${openAI.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openAI.key}` },
      body: (() => {
        const f = new FormData();
        f.append('model', openAI.sttModel);
        f.append('file', audio);
        return f;
      })()
    });

    const json = await upstream.json();
    return new Response(JSON.stringify(json), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}
```

---

## `public/logo.svg`

```xml
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0%" stop-color="#FF00E5"/>
      <stop offset="100%" stop-color="#00FFC6"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0f1117" stroke="url(#g)"/>
  <path d="M12 32h40M32 12v40" stroke="url(#g)" stroke-width="4"/>
</svg>
```

---

## `README.md`

```md
# REKA•POC — Next.js App Router (Cyberpunk)

A POC replicating key flows from a multimodal AI platform: **Vision**, **Research**, **Chat**, **Speech**, and **Spaces**, plus a **Dashboard**. Dark cyberpunk UI.

## Quickstart

```bash
pnpm create next-app reka-poc --ts --eslint --tailwind --app --src-dir=false --import-alias "@/*"
# Replace generated files with repo content
pnpm i
cp .env.example .env.local # fill keys
pnpm dev
```

### Environment
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY` (either works; both supported)
- `EXA_API_KEY` for research

### Modules
- **Dashboard**: fake KPIs & charts via Recharts.
- **Vision**: image upload → OpenAI/OpenRouter vision chat completions.
- **Research**: EXA AI `/search` endpoint → list of results.
- **Chat**: streaming chat via server route proxy with OpenAI/OpenRouter.
- **Speech**: Web Speech API (client-side) + server endpoints for TTS/STT (optional).
- **Spaces**: localStorage-based workspace manager with export.

### Notes
- This is POC-level; please harden auth, rate-limits, error handling for production.
- You can theme further via `tailwind.config.ts` and `styles/globals.css`.
- Swap models by editing `lib/providers.ts` or per-module UI controls.
