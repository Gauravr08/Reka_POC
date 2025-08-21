import { NextRequest } from 'next/server';
import { exa } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    if (!exa.key) return new Response(JSON.stringify({ error: 'Missing EXA_API_KEY' }), { status: 400 });
    const { query } = await req.json();

    const r = await fetch(`${exa.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${exa.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, numResults: 12 })
    });

    const j = await r.json();
    const results = (j.results || j.data || []).map((x: any) => ({
      title: x.title || x.scoreTitle || x.url,
      url: x.url,
      snippet: x.snippet || x.text || '',
      source: x.source || x.siteName || x.host || '',
      domain: x.domain || ''
    }));

    return new Response(JSON.stringify({ results }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
