"use client";
import { Eye, FileSearch, MessageSquare, Mic, Layout } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    name: "Reka Vision",
    description:
      "Understand every frame. Agentic video AI for instant insight, search, and deep visual reasoning.",
    icon: Eye,
    path: "/vision"
  },
  {
    name: "Reka Research", 
    description:
      "AI built for breakthroughs. Navigate vast knowledge, extract insight.",
    icon: FileSearch,
    path: "/research"
  },
  {
    name: "Reka Chat",
    description:
      "Conversational intelligence that works. Fast, grounded, multimodal answers—at enterprise scale.",
    icon: MessageSquare,
    path: "/chat"
  },
  {
    name: "Reka Speech",
    description:
      "Hear it. Understand it. Respond. Real-time speech AI for fluid, accurate, multilingual interaction.",
    icon: Mic,
    path: "/speech"
  },
  {
    name: "Reka Space",
    description:
      "Organize and operate with precision. Your secure AI workspace for structured intelligence.",
    icon: Layout,
    path: "/spaces"
  },
];

export default function Dashboard() {
  const router = useRouter();

  const handleFeatureClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-accent mb-2">
        Multimodal AI you can deploy anywhere
      </h1>
      <p className="text-gray-400 max-w-2xl mb-12">
        Next-generation models to empower AI agents that can see, hear, and
        speak.
      </p>

      {/* Explore section */}
      <h2 className="text-2xl font-semibold text-accent mb-6">
        Explore
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {features.map((feature) => (
          <div
            key={feature.name}
            onClick={() => handleFeatureClick(feature.path)}
            className="bg-surface rounded-2xl border border-gray-700 p-6 hover:border-accent hover:shadow-glow transition-all duration-300 group cursor-pointer"
          >
            <feature.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-bold text-white mb-2">
              {feature.name}
            </h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}