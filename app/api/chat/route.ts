import { NextRequest } from 'next/server';
import { openAI, openRouter, assertServerKeys } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    assertServerKeys();
    const { messages, model, provider } = await req.json();

    if ((provider === 'openrouter' && !openRouter.key) || (provider === 'openai' && !openAI.key)) {
      return new Response('Missing API key for selected provider', { status: 400 });
    }

    const useOpenRouter = provider === 'openrouter';
    const url = useOpenRouter ? `${openRouter.baseUrl}/chat/completions` : `${openAI.baseUrl}/chat/completions`;
    const key = useOpenRouter ? openRouter.key! : openAI.key!;

    const body = JSON.stringify({
      model: model || (useOpenRouter ? openRouter.chatModel : openAI.chatModel),
      stream: true,
      messages
    });

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(useOpenRouter ? { 'HTTP-Referer': 'https://localhost', 'X-Title': 'REKA-POC' } : {})
      },
      body
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return new Response(text || 'Upstream error', { status: upstream.status });
    }

    // Stream text chunks (OpenAI & OpenRouter both support SSE/Chunked JSON; for simplicity parse text-only deltas)
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // Naive text extraction — works for text-stream style responses; adapt as needed
          const parts = buffer.split('\n');
          for (const p of parts) {
            if (p.startsWith('data: ')) {
              const payload = p.replace('data: ', '').trim();
              if (payload === '[DONE]') continue;
              try {
                const json = JSON.parse(payload);
                const delta = json.choices?.[0]?.delta?.content || json.choices?.[0]?.message?.content || '';
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch {}
            }
          }
          buffer = parts[parts.length - 1];
        }
        controller.close();
      }
    });

    return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
