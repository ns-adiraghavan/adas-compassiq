// OpenAI API interaction utilities
export async function callOpenAI(prompt: string, openAIApiKey: string): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are a senior automotive technology analyst with deep expertise in connected vehicle markets, OEM competitive positioning, and feature deployment strategies. Generate precise, actionable strategic insights using exact data points provided. Always respond with valid JSON containing exactly 3 insight strings, each 15-20 words maximum, focusing on competitive intelligence and market dynamics.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text()
    console.error('OpenAI API Error:', response.status, errorData)
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  return await response.json();
}

export function parseOpenAIResponse(data: any): string[] {
  const content = data.choices[0]?.message?.content || '';
  console.log('=== AI Response Content ===')
  console.log('Raw Content:', content)
  console.log('Content Length:', content.length)
  
  let parsed: any
  
  // Try direct JSON parse first
  try {
    parsed = JSON.parse(content)
  } catch (directParseError) {
    console.log('Direct JSON parse failed, trying to extract JSON from content...')
    
    // Try to extract JSON array from content
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON array found in response')
    }
  }
  
  console.log('Parsed Content:', JSON.stringify(parsed, null, 2))
  
  let insights: string[] = []
  
  if (Array.isArray(parsed)) {
    insights = parsed.filter((insight: any) => typeof insight === 'string' && insight.trim().length > 0)
  } else if (parsed.insights && Array.isArray(parsed.insights)) {
    insights = parsed.insights.filter((insight: any) => typeof insight === 'string' && insight.trim().length > 0)
  } else if (parsed.data && Array.isArray(parsed.data)) {
    insights = parsed.data.filter((insight: any) => typeof insight === 'string' && insight.trim().length > 0)
  } else {
    throw new Error(`Response format not recognized: ${typeof parsed}`)
  }
  
  console.log('Extracted Insights:', insights)
  
  // Validate insights length and content
  if (insights.length !== 3) {
    console.warn(`Expected 3 insights, got ${insights.length}`)
  }
  
  return insights;
}