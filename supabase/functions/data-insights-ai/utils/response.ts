
// Response processing utilities
export async function callOpenAIAPI(prompt: string, openAIApiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an automotive segment analysis expert. Return ONLY a JSON array of exactly 3 strings. Each insight must focus on comparative analysis between OEMs and vehicle segments, highlighting competitive positioning, feature leadership, and market differentiation. Make insights specific and actionable for vehicle segment strategy.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const aiData = await response.json();
  return aiData.choices[0].message.content.trim();
}

export function parseAIResponse(analysis: string): string[] {
  // Clean up the response
  let cleanedAnalysis = analysis.replace(/```json/g, '').replace(/```/g, '').trim();
  
  if (!cleanedAnalysis.startsWith('[')) {
    const jsonMatch = cleanedAnalysis.match(/\[.*\]/s);
    if (jsonMatch) {
      cleanedAnalysis = jsonMatch[0];
    }
  }

  try {
    const insights = JSON.parse(cleanedAnalysis);
    if (!Array.isArray(insights)) {
      throw new Error('Response is not an array');
    }
    return insights.filter((insight: any) => 
      typeof insight === 'string' && insight.trim().length > 0
    );
  } catch (parseError) {
    console.log('JSON parse failed:', parseError);
    throw parseError;
  }
}

export function ensureThreeInsights(insights: string[], fallbackInsights: string[]): string[] {
  const result = [...insights];
  
  while (result.length < 3) {
    const fallbackIndex = result.length;
    result.push(
      fallbackInsights[fallbackIndex] || 
      `Strategic vehicle segment opportunity identified for target automotive market`
    );
  }

  return result.slice(0, 3);
}

export function createSuccessResponse(insights: string[], dataPoints: number, cached: boolean = false) {
  return {
    success: true,
    insights,
    dataPoints,
    cached
  };
}

export function createErrorResponse(error: any) {
  return {
    success: false,
    insights: [
      'Vehicle segment insights temporarily unavailable due to technical issues',
      'OEM comparison analysis service currently offline, please retry shortly',
      'Segment competitive analysis unavailable, system maintenance in progress'
    ],
    error: error.message,
    dataPoints: 0
  };
}
