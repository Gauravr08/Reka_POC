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
          {/* <a className="btn-ghost" href="https://github.com/" target="_blank" rel="noreferrer"><Github size={18} /></a> */}
          {/* <a className="btn-primary flex items-center gap-2" href="#" onClick={(e)=>e.preventDefault()}><Rocket size={18}/> Deploy</a> */}
          <span className="text-xs text-zinc-500 flex items-center gap-1"><Shield size={14}/> POC Build</span>
        </div>
      </div>
    </motion.header>
  );
}
