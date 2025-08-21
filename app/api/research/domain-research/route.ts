import { NextRequest } from 'next/server';
import { exa, openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { domain, researchDepth = 'comprehensive', focusAreas = [], excludeAreas = [] } = await req.json();
    
    if (!domain) {
      return new Response('Domain is required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    let domainData = null;

    // If EXA is available, gather domain-specific information
    if (exa.key) {
      try {
        const searchQueries = [
          `${domain} industry overview trends`,
          `${domain} market analysis research`,
          `${domain} key players companies`,
          `${domain} challenges opportunities`
        ];

        const searchPromises = searchQueries.map(query =>
          fetch(`${exa.baseUrl}/search`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${exa.key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
              type: 'neural',
              useAutoprompt: true,
              numResults: 5,
              contents: {
                text: true,
                summary: true
              }
            }),
          }).then(res => res.ok ? res.json() : null)
        );

        const searchResults = await Promise.all(searchPromises);
        domainData = searchResults.filter(result => result !== null);
      } catch (exaError) {
        console.warn('EXA domain search failed, proceeding with LLM analysis');
      }
    }

    // Create comprehensive domain research prompt
    const researchPrompt = `Conduct a ${researchDepth} research analysis of the "${domain}" domain.

${focusAreas.length > 0 ? `Focus Areas: ${focusAreas.join(', ')}` : ''}
${excludeAreas.length > 0 ? `Exclude Areas: ${excludeAreas.join(', ')}` : ''}

${domainData ? `Recent Domain Information:
${domainData.map((data: any, index: number) => 
  data?.results?.slice(0, 2).map((result: any) => 
    `- ${result.title}: ${result.summary || 'No summary'}`
  ).join('\n')
).join('\n')}` : ''}

Please provide a comprehensive domain research report covering:

1. **Domain Overview**
   - Definition and scope
   - Historical context and evolution
   - Current state of the domain

2. **Market Landscape**
   - Market size and growth trends
   - Key segments and niches
   - Geographic distribution

3. **Key Players & Stakeholders**
   - Leading companies/organizations
   - Influential individuals
   - Academic institutions and researchers

4. **Technology & Innovation**
   - Current technologies and tools
   - Emerging technologies
   - Innovation drivers and barriers

5. **Trends & Patterns**
   - Current trends and movements
   - Disruptive forces
   - Future predictions

6. **Challenges & Opportunities**
   - Major challenges facing the domain
   - Emerging opportunities
   - Risk factors

7. **Regulatory & Economic Factors**
   - Regulatory environment
   - Economic indicators
   - Policy impacts

8. **Research Gaps & Future Directions**
   - Areas needing more research
   - Potential breakthrough areas
   - Recommended research priorities

Format the response with clear sections and bullet points. Include specific examples and data points where relevant.`;

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
            content: 'You are a domain research expert with deep knowledge across multiple fields. Provide comprehensive, well-structured domain analyses with specific insights and actionable information.'
          },
          {
            role: 'user',
            content: researchPrompt
          }
        ],
        temperature: 0.4,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      research: data.choices[0].message.content,
      webData: domainData,
      metadata: {
        domain,
        researchDepth,
        focusAreas,
        excludeAreas,
        hasWebData: !!domainData,
        timestamp: new Date().toISOString(),
        model: provider.textModel
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Domain research error:', error);
    return new Response(error.message, { status: 500 });
  }
}
