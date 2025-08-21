import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider, exa } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { query, imageUrl, searchType = 'visual', filters = {} } = await req.json();
    
    if (!query && !imageUrl) {
      return new Response('Query or image URL is required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    let searchResults = null;

    // If we have EXA API, use it for enhanced search
    if (exa.key && query) {
      try {
        const exaResponse = await fetch(`${exa.baseUrl}/search`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${exa.key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `visual archive ${query}`,
            type: 'neural',
            useAutoprompt: true,
            numResults: 10,
            contents: {
              text: true,
              highlights: true,
              summary: true
            }
          }),
        });

        if (exaResponse.ok) {
          searchResults = await exaResponse.json();
        }
      } catch (exaError) {
        console.warn('EXA search failed, falling back to LLM analysis');
      }
    }

    // Prepare the analysis prompt
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are a visual archive specialist. Help users find and analyze visual content from archives, databases, and collections. Provide detailed insights about visual elements, historical context, and search strategies.'
      }
    ];

    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this image for archive search purposes. Query: "${query}". Search type: ${searchType}. 

Please provide:
1. Visual elements description
2. Historical/contextual analysis
3. Similar archive search terms
4. Metadata suggestions
5. Related collections to explore
6. Technical details (style, period, technique)

${searchResults ? `Additional context from web search: ${JSON.stringify(searchResults.results?.slice(0, 3))}` : ''}`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: `Help me search visual archives for: "${query}"

Search type: ${searchType}
Filters: ${JSON.stringify(filters)}

Please provide:
1. Optimized search strategies
2. Relevant archive databases
3. Alternative search terms
4. Visual characteristics to look for
5. Historical context
6. Collection recommendations

${searchResults ? `Web search context: ${JSON.stringify(searchResults.results?.slice(0, 3))}` : ''}`
      });
    }

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.chatModel,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      analysis: data.choices[0].message.content,
      webResults: searchResults?.results || null,
      metadata: {
        searchType,
        filters,
        hasImage: !!imageUrl,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Archive search error:', error);
    return new Response(error.message, { status: 500 });
  }
}
