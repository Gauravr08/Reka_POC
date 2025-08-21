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
