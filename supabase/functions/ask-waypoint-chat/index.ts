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

interface FeedbackPattern {
  common_issues: string[];
  improvement_suggestions: string[];
}

// Function to get recent feedback patterns
async function getFeedbackPatterns(): Promise<FeedbackPattern> {
  try {
    // This is a placeholder for actual Supabase client usage
    // In a real implementation, you would query the feedback table
    const feedbackData = {
      common_issues: [
        'Response not specific enough to user question',
        'Missing concrete data and numbers',
        'Too generic without OEM-specific insights',
        'Poor formatting of data presentation'
      ],
      improvement_suggestions: [
        'Always include specific numbers and counts in responses',
        'Directly address the user\'s specific question first',
        'Use clear formatting with headers and bullet points',
        'Provide OEM-specific insights when possible'
      ]
    };
    
    return feedbackData;
  } catch (error) {
    console.error('Error fetching feedback patterns:', error);
    return {
      common_issues: [],
      improvement_suggestions: []
    };
  }
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

    // Get feedback patterns to improve responses
    const feedbackPatterns = await getFeedbackPatterns();
    
    // Create context-aware system prompt
    const systemPrompt = createSystemPrompt(contextData, feedbackPatterns);
    
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

function createSystemPrompt(contextData: any, feedbackPatterns: FeedbackPattern): string {
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

  // Include comprehensive data context
  let contextInfo = '';
  if (contextData?.sectionData) {
    const data = contextData.sectionData;
    contextInfo = `

**WayPoint Dataset Overview:**
- Total OEMs: ${data.totalOEMs || 'N/A'}
- Total Countries: ${data.totalCountries || 'N/A'} 
- Total Features: ${data.totalFeatures || 'N/A'}
- Total Categories: ${data.totalCategories || 'N/A'}
- Total Records: ${data.totalRecords || 'N/A'}

**Available OEMs:** ${data.oemList?.slice(0, 10).join(', ') || 'N/A'}${data.oemList?.length > 10 ? ` (and ${data.oemList.length - 10} more)` : ''}

**Available Countries:** ${data.countryList?.slice(0, 8).join(', ') || 'N/A'}${data.countryList?.length > 8 ? ` (and ${data.countryList.length - 8} more)` : ''}`;
  }

  // Add feedback improvement guidelines
  let feedbackGuidelines = '';
  if (feedbackPatterns.common_issues.length > 0 || feedbackPatterns.improvement_suggestions.length > 0) {
    feedbackGuidelines = `

**CRITICAL IMPROVEMENT GUIDELINES (Based on User Feedback):**

**Common Issues to AVOID:**
${feedbackPatterns.common_issues.map(issue => `- ${issue}`).join('\n')}

**Required Improvements:**
${feedbackPatterns.improvement_suggestions.map(suggestion => `- ${suggestion}`).join('\n')}`;
  }

  return `You are WayPoint AI, an expert assistant with access to our complete WayPoint automotive connected features database.

**Current Context:**
- ${contextDescription}
- User's Selected Country: ${selectedCountry}${contextInfo}${feedbackGuidelines}

**IMPORTANT FORMATTING GUIDELINES:**
1. **Use proper markdown formatting** with headers, bullet points, and spacing
2. **Add blank lines** between different sections of information
3. **Use bold text** for important terms and numbers
4. **Structure responses** with clear sections and bullet points
5. **Include specific data and counts** from our comprehensive dataset
6. **Be specific and direct** - address the user's exact question first

**Key Capabilities:**
- Compare any OEMs across all countries and features
- Analyze feature availability patterns globally  
- Provide competitive intelligence across the entire automotive landscape
- Break down data by categories, business models, and vehicle segments

**Response Format Example:**
## Analysis Results

**Key Findings:**
- Finding 1 with specific number
- Finding 2 with data point

**Detailed Breakdown:**
1. Category 1: X features available
2. Category 2: Y features available

**Recommendations:**
- Specific actionable insight

When users ask about specific OEMs (like BYD, Tesla, etc.) or countries (like China, USA, etc.), search through our complete dataset to provide accurate information. You have access to data for ${contextData?.sectionData?.totalOEMs || 'multiple'} OEMs across ${contextData?.sectionData?.totalCountries || 'multiple'} countries.

Always use proper markdown formatting with headers, bullet points, and clear spacing between sections.`;
}