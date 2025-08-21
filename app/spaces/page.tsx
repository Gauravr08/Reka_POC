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
