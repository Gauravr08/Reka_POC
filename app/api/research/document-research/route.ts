import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { documents, query, researchType = 'analysis' } = await req.json();
    
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return new Response('Documents array is required', { status: 400 });
    }

    if (!query) {
      return new Response('Research query is required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    // Process each document and create a comprehensive research prompt
    const documentSummaries = documents.map((doc: any, index: number) => {
      return `Document ${index + 1}: ${doc.title || `Document ${index + 1}`}
Content: ${doc.content || doc.text || 'No content provided'}
${doc.url ? `Source: ${doc.url}` : ''}
${doc.metadata ? `Metadata: ${JSON.stringify(doc.metadata)}` : ''}`;
    }).join('\n\n---\n\n');

    const researchPrompt = `Research Query: "${query}"
Research Type: ${researchType}

Documents to analyze:
${documentSummaries}

Please provide a comprehensive research analysis including:

1. **Executive Summary**: Key findings related to the research query
2. **Document Analysis**: 
   - Relevance of each document to the query
   - Key insights from each source
   - Quality and credibility assessment
3. **Synthesis**: 
   - Common themes across documents
   - Contradictions or conflicting information
   - Gaps in the available information
4. **Conclusions**: 
   - Direct answers to the research query
   - Evidence-based recommendations
   - Areas requiring further research
5. **Source Citations**: 
   - Reference specific documents for each claim
   - Note any limitations or biases

Format your response clearly with headers and bullet points for easy reading.`;

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
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
            content: 'You are an expert research analyst. Analyze documents thoroughly and provide comprehensive, evidence-based research insights. Always cite sources and acknowledge limitations.'
          },
          {
            role: 'user',
            content: researchPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      analysis: data.choices[0].message.content,
      metadata: {
        query,
        researchType,
        documentsAnalyzed: documents.length,
        documentTitles: documents.map((doc: any) => doc.title || 'Untitled'),
        timestamp: new Date().toISOString(),
        model: provider.textModel
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Document research error:', error);
    return new Response(error.message, { status: 500 });
  }
}
