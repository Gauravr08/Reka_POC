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
