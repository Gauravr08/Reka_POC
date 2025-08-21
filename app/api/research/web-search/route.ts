import { NextRequest } from 'next/server';
import { exa, openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { query, searchType = 'neural', numResults = 10, includeContent = true } = await req.json();
    
    if (!query) {
      return new Response('Query is required', { status: 400 });
    }

    if (!exa.key) {
      return new Response('Missing EXA_API_KEY', { status: 400 });
    }

    // Perform EXA search
    const searchResponse = await fetch(`${exa.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${exa.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        type: searchType,
        useAutoprompt: true,
        numResults,
        contents: {
          text: includeContent,
          highlights: true,
          summary: true
        }
      }),
    });

    if (!searchResponse.ok) {
      const error = await searchResponse.text();
      return new Response(error, { status: searchResponse.status });
    }

    const searchData = await searchResponse.json();

    // Enhance results with AI analysis if we have LLM access
    let analysis = null;
    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (provider.key && searchData.results?.length > 0) {
      try {
        const analysisPrompt = `Analyze these web search results for the query: "${query}"

Results summary:
${searchData.results.slice(0, 5).map((result: any, index: number) => 
  `${index + 1}. ${result.title}\n   URL: ${result.url}\n   Summary: ${result.summary || 'No summary'}\n`
).join('\n')}

Please provide:
1. Key insights and patterns
2. Quality assessment of sources
3. Main themes and topics
4. Recommendations for further research
5. Potential gaps or biases in the results`;

        const analysisResponse = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: provider.textModel,
            messages: [
              {
                role: 'system',
                content: 'You are a research analyst. Analyze web search results and provide insights about the information quality, patterns, and research value.'
              },
              {
                role: 'user',
                content: analysisPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          analysis = analysisData.choices[0].message.content;
        }
      } catch (analysisError) {
        console.warn('Analysis failed, returning raw results');
      }
    }
    
    return new Response(JSON.stringify({
      results: searchData.results,
      analysis,
      metadata: {
        query,
        searchType,
        numResults: searchData.results?.length || 0,
        autopromptString: searchData.autopromptString,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Web search error:', error);
    return new Response(error.message, { status: 500 });
  }
}
