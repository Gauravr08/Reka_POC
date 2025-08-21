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
