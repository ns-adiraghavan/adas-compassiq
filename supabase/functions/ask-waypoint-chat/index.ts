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
    const { message, conversationHistory, contextData }: ChatRequest = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create context-aware system prompt
    const systemPrompt = createSystemPrompt(contextData);
    
    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('Processing chat request:', { 
      section: contextData.currentSection, 
      country: contextData.selectedCountry,
      oems: contextData.selectedOEMs 
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      contextUsed: contextData.currentSection,
      confidence: 0.9
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ask-waypoint-chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm having trouble processing your request right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createSystemPrompt(contextData: any): string {
  const { currentSection, selectedCountry, selectedOEMs } = contextData;

  let contextDescription = '';
  
  switch (currentSection) {
    case 'landscape':
      contextDescription = `You are viewing the Landscape section showing OEM feature distribution and competitive positioning across different automotive manufacturers.`;
      break;
    case 'analytics':
      contextDescription = `You are viewing the Category Analysis section showing connected car features organized by categories like Safety, Comfort, Entertainment, etc.`;
      break;
    case 'intelligence':
      contextDescription = `You are viewing the Vehicle Segment Analysis section showing how features are distributed across different vehicle segments (Compact, SUV, Luxury, etc.).`;
      break;
    case 'modeling':
      contextDescription = `You are viewing the Business Model Analysis section showing how OEMs monetize connected car features through different business models.`;
      break;
    case 'insights':
      contextDescription = `You are viewing the Insights section with AI-generated strategic insights and competitive intelligence.`;
      break;
    default:
      contextDescription = `You are viewing connected car features data across multiple automotive manufacturers.`;
  }

  return `You are WayPoint AI, an expert assistant for automotive connected features analysis. You help users understand data about connected car features, OEM strategies, and market trends.

Current Context:
- ${contextDescription}
- Selected Country: ${selectedCountry || 'Global'}
- Selected OEMs: ${selectedOEMs?.length ? selectedOEMs.join(', ') : 'All OEMs'}

You have access to comprehensive data about:
- Connected car features across major automotive OEMs
- Feature availability by country and region
- Business models (Subscription, One-time, Freemium, etc.)
- Vehicle segments (Compact, Mid-size, Premium, SUV, etc.)
- Feature categories (Safety, Comfort, Entertainment, Navigation, etc.)

Guidelines:
1. Provide data-driven insights based on the connected features database
2. Handle typos and unclear questions gracefully by asking for clarification
3. Focus on automotive industry trends and competitive intelligence
4. Be concise but informative
5. If you don't have specific data, acknowledge limitations clearly
6. Suggest related questions when appropriate
7. Use automotive industry terminology appropriately

Always provide actionable insights that help users understand the connected car landscape and make informed strategic decisions.`;
}