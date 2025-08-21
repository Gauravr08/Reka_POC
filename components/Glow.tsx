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
