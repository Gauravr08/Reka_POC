import { NextRequest } from 'next/server';
import { openAI, openRouter } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, model, provider } = await req.json();
    const useOpenRouter = provider === 'openrouter';

    const url = useOpenRouter ? `${openRouter.baseUrl}/chat/completions` : `${openAI.baseUrl}/chat/completions`;
    const key = useOpenRouter ? openRouter.key : openAI.key;
    if (!key) return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 400 });

    const body = {
      model: model || (useOpenRouter ? openRouter.chatModel : openAI.chatModel),
      messages: [
        { role: 'user', content: [
          { type: 'text', text: prompt || 'Describe this image.' },
          { type: 'image_url', image_url: { url: image } }
        ]}
      ]
    } as any;

    const r = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || j.choices?.[0]?.delta?.content || '';
    return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
