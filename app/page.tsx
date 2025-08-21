import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-bold neon-text">Welcome to REKA•POC</h1>
      <p className="text-zinc-400">Choose a module from the sidebar. Start with the Dashboard to see KPIs and status.</p>
      <Link href="/dashboard" className="btn-primary w-max">Open Dashboard</Link>
    </div>
  );
}