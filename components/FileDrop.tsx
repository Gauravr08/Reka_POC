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
