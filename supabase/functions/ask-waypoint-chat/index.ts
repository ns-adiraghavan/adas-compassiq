import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  contextData: {
    currentSection: string;
    selectedCountry: string;
    selectedOEMs: string[];
    sectionData?: any;
    globalData?: any;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    let parsedData: ChatRequest;
    try {
      parsedData = JSON.parse(requestBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON in request body');
    }

    const { message, conversationHistory, contextData } = parsedData;

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create context-aware system prompt
    const systemPrompt = createSystemPrompt(contextData);
    
    // Build conversation messages - safely handle conversation history
    const historyMessages = Array.isArray(conversationHistory) 
      ? conversationHistory.slice(-5).map(msg => ({
          role: msg.role,
          content: String(msg.content || '').substring(0, 1000) // Limit content length
        }))
      : [];

    const messages = [
      { role: 'system', content: systemPrompt },
      ...historyMessages,
      { role: 'user', content: String(message).substring(0, 2000) } // Limit user message length
    ];

    console.log('Processing chat request:', { 
      section: contextData?.currentSection, 
      country: contextData?.selectedCountry,
      messageLength: message.length
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I encountered an issue processing your request.';

    return new Response(JSON.stringify({ 
      response: aiResponse,
      contextUsed: contextData?.currentSection || 'unknown',
      confidence: 0.9
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ask-waypoint-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      response: "I'm having trouble processing your request right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createSystemPrompt(contextData: any): string {
  const currentSection = contextData?.currentSection || 'unknown';
  const selectedCountry = contextData?.selectedCountry || 'Global';

  let contextDescription = '';
  
  switch (currentSection) {
    case 'landscape':
      contextDescription = `You are viewing the Landscape section showing OEM feature distribution and competitive positioning.`;
      break;
    case 'analytics':
      contextDescription = `You are viewing the Category Analysis section showing connected car features by categories.`;
      break;
    case 'intelligence':
      contextDescription = `You are viewing the Vehicle Segment Analysis section showing features by vehicle segments.`;
      break;
    case 'modeling':
      contextDescription = `You are viewing the Business Model Analysis section showing OEM monetization strategies.`;
      break;
    case 'insights':
      contextDescription = `You are viewing the Insights section with AI-generated strategic insights.`;
      break;
    default:
      contextDescription = `You are viewing connected car features data.`;
  }

  return `You are WayPoint AI, an expert assistant for automotive connected features analysis.

Current Context:
- ${contextDescription}
- Selected Country: ${selectedCountry}

You help users understand:
- Connected car features across automotive OEMs
- Feature availability by country and region
- Business models and monetization strategies
- Vehicle segments and feature distribution
- Market trends and competitive intelligence

Guidelines:
1. Provide concise, data-driven insights
2. Handle unclear questions gracefully
3. Focus on automotive industry context
4. Be helpful and informative
5. If you lack specific data, acknowledge limitations clearly

Keep responses focused and under 200 words when possible.`;
}