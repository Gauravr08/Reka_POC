'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, Search, MessageCircle, Mic, FileSearch, LayoutDashboard, FolderKanban, Video, Archive, HelpCircle, Globe, FileText, Lightbulb, Image, Code, Languages, FileAudio, RotateCcw, MicIcon } from 'lucide-react';

const mainLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vision', label: 'Vision', icon: Eye },
  { href: '/research', label: 'Research', icon: FileSearch },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/speech', label: 'Speech', icon: Mic },
  { href: '/spaces', label: 'Space', icon: FolderKanban },
];

const visionSubLinks = [
  { href: '/vision/reel-generation', label: 'REEL GENERATION', icon: Video, description: 'Effortlessly turn videos into intelligent, meaningful content.' },
  { href: '/vision/archive-search', label: 'ARCHIVE SEARCH', icon: Search, description: 'Find scenes by describing emotions, dialogue, or actions.' },
  { href: '/vision/question-answering', label: 'QUESTION ANSWERING', icon: HelpCircle, description: 'Ask questions and get summaries from news, shows, or podcasts.' },
];

const researchSubLinks = [
  { href: '/research/web-search', label: 'MULTI-STEP WEB SEARCH', icon: Globe, description: 'Synthesizes and verifies information across multiple web sources.' },
  { href: '/research/document-research', label: 'PRIVATE DOCUMENT BASED RESEARCH', icon: FileText, description: 'Searches and cites your internal documents to deliver context-aware insights.' },
  { href: '/research/domain-research', label: 'DOMAIN SPECIALIZED RESEARCH', icon: Lightbulb, description: 'Builds custom research agents tailored to specific industries or knowledge domains.' },
];

const chatSubLinks = [
  { href: '/chat/image-analysis', label: 'IMAGE ANALYSIS', icon: Image, description: 'Analyze and describe image content and context.' },
  { href: '/chat/code-analysis', label: 'CODE ANALYSIS', icon: Code, description: 'Analyze, debug, and explain code snippets.' },
  { href: '/chat/multilingual-chat', label: 'MULTILINGUAL CHAT', icon: Languages, description: 'Converse in 50+ languages with accurate translation.' },
];

const speechSubLinks = [
  { href: '/speech/transcription', label: 'TRANSCRIPTION', icon: FileAudio, description: 'Try your own audio or a sample voicemail with mumbling.' },
  { href: '/speech/translation', label: 'TRANSLATION', icon: RotateCcw, description: 'Try your own clip or a fast-paced English news segment.' },
  { href: '/speech/speech-to-speech', label: 'SPEECH-TO-SPEECH', icon: MicIcon, description: 'Try your own recording or a sample tour guide audio in Japanese.' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isVisionActive = pathname.startsWith('/vision');
  const isResearchActive = pathname.startsWith('/research');
  const isChatActive = pathname.startsWith('/chat');
  const isSpeechActive = pathname.startsWith('/speech');
  
  return (
    <aside className="h-full w-80 shrink-0 border-r border-zinc-800 bg-surface/60 backdrop-blur">
      <div className="p-6">
        {/* Dynamic Header */}
        <div className="mb-6">
          {isVisionActive ? (
            <>
              <h2 className="text-lg font-semibold text-white mb-2">Vision</h2>
              <p className="text-sm text-zinc-400">
                Accurate, fast, agentic video AI for searching and question answering over millions of videos and images.
              </p>
            </>
          ) : isResearchActive ? (
            <>
              <h2 className="text-lg font-semibold text-white mb-2">Research</h2>
              <p className="text-sm text-zinc-400">
                Supports complex, multi-step research across files and the web. Try the example use cases below, or test your own.
              </p>
            </>
          ) : isChatActive ? (
            <>
              <h2 className="text-lg font-semibold text-white mb-2">Chat</h2>
              <p className="text-sm text-zinc-400">
                Fast, fluent, multimodal AI chat for answering questions and analyzing content, across docs, images, code, and the web.
              </p>
            </>
          ) : isSpeechActive ? (
            <>
              <h2 className="text-lg font-semibold text-white mb-2">Speech</h2>
              <p className="text-sm text-zinc-400">
                AI-powered speech tools that transcribe, translate, and speak across languages — even in real-world, noisy conditions.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-white mb-2">REKA•POC</h2>
              <p className="text-sm text-zinc-400">
                Multimodal AI platform for vision, research, chat, and speech capabilities.
              </p>
            </>
          )}
        </div>

        {/* Main Navigation */}
        <div className="mb-6">
          <nav className="flex flex-col gap-1">
            {mainLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href === '/vision' && isVisionActive) || (href === '/research' && isResearchActive) || (href === '/chat' && isChatActive) || (href === '/speech' && isSpeechActive);
              return (
                <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? 'text-accent bg-accent/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Vision Interactions */}
        {isVisionActive && (
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Interactions</h3>
            <div className="space-y-3">
              {visionSubLinks.map(({ href, label, icon: Icon, description }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} className={`block rounded-lg p-3 border transition-colors ${active ? 'border-accent/60 bg-accent/5' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={16} className="text-accent" />
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Research Interactions */}
        {isResearchActive && (
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Interactions</h3>
            <div className="space-y-3">
              {researchSubLinks.map(({ href, label, icon: Icon, description }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} className={`block rounded-lg p-3 border transition-colors ${active ? 'border-accent/60 bg-accent/5' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={16} className="text-accent" />
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Interactions */}
        {isChatActive && (
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Interactions</h3>
            <div className="space-y-3">
              {chatSubLinks.map(({ href, label, icon: Icon, description }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} className={`block rounded-lg p-3 border transition-colors ${active ? 'border-accent/60 bg-accent/5' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={16} className="text-accent" />
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Speech Interactions */}
        {isSpeechActive && (
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Interactions</h3>
            <div className="space-y-3">
              {speechSubLinks.map(({ href, label, icon: Icon, description }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} className={`block rounded-lg p-3 border transition-colors ${active ? 'border-accent/60 bg-accent/5' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={16} className="text-accent" />
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Links */}
        {/* <div className="mt-8 pt-6 border-t border-zinc-800"> */}
          {/* <div className="space-y-2 text-sm"> */}
            {/* <Link href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white"> */}
              {/* <span>API Documentation</span> */}
              {/* <span className="text-xs">↗</span> */}
            {/* </Link> */}
            {/* <Link href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white"> */}
              {/* <span>API Platform</span> */}
              {/* <span className="text-xs">↗</span> */}
            {/* </Link> */}
            {/* <Link href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white"> */}
              {/* <span>Talk to Sales</span> */}
              {/* <span className="text-xs">↗</span> */}
            {/* </Link> */}
            {/* <Link href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white"> */}
              {/* <span>Feedback</span> */}
            {/* </Link> */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </aside>
  );
}
