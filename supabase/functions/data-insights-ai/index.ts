
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache for processed insights
const insightsCache = new Map<string, any>();

const createInsightsPrompt = (oem: string, country: string, dashboardMetrics: any) => {
  return `Generate strategic insights for ${oem} in ${country || 'global market'}.

DATA SUMMARY:
• Total Available Features: ${dashboardMetrics.totalFeatures}
• Lighthouse Features: ${dashboardMetrics.lighthouseFeatures} (${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}%)
• Subscription Features: ${dashboardMetrics.subscriptionFeatures} (${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}%)
• Market Coverage: ${dashboardMetrics.totalCountries} countries
• Top Category: ${dashboardMetrics.topCategories?.[0]?.name || 'N/A'}

REQUIREMENTS:
- Generate exactly 4 bullet points
- Each bullet point: Maximum 25 words
- Focus on available features only
- Actionable business insights
- Data-driven observations

Respond with ONLY a JSON array of exactly 4 strings. No other text or formatting.

Example: ["Short market insight about features", "Brief strategy note on innovation", "Concise business model observation", "Quick competitive advantage point"]`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country, dashboardMetrics } = await req.json();
    
    const requestCacheKey = `insights-${oem}-${country || 'global'}-${JSON.stringify(dashboardMetrics).slice(0, 50)}`;
    
    if (insightsCache.has(requestCacheKey)) {
      console.log('Returning cached insights for:', requestCacheKey);
      return new Response(
        JSON.stringify(insightsCache.get(requestCacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!dashboardMetrics || dashboardMetrics.totalFeatures === 0) {
      const emptyResult = {
        success: true,
        insights: [
          `No available features found for ${oem} in ${country || 'selected market'}`,
          "Expand data collection or adjust market filters",
          "Feature tracking required for strategic analysis",
          "Data availability crucial for competitive insights"
        ],
        dataPoints: 0
      };
      
      insightsCache.set(requestCacheKey, emptyResult);
      return new Response(
        JSON.stringify(emptyResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = createInsightsPrompt(oem, country, dashboardMetrics);

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
            content: 'You are an automotive analyst. Return ONLY a JSON array of exactly 4 strings. Each string must be under 25 words and contain actionable insights. No other text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    let analysis = aiData.choices[0].message.content.trim();

    // Clean up the response - remove any markdown formatting or extra text
    analysis = analysis.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // If the response doesn't start with [, try to extract JSON array
    if (!analysis.startsWith('[')) {
      const jsonMatch = analysis.match(/\[.*\]/s);
      if (jsonMatch) {
        analysis = jsonMatch[0];
      }
    }

    let insights: string[] = [];
    try {
      insights = JSON.parse(analysis);
      if (!Array.isArray(insights)) {
        throw new Error('Response is not an array');
      }
      // Filter out any empty or invalid insights
      insights = insights.filter((insight: any) => 
        typeof insight === 'string' && insight.trim().length > 0
      );
    } catch (parseError) {
      console.log('JSON parse failed, using fallback insights:', parseError);
      // Fallback to generated insights based on data
      insights = [
        `${oem} offers ${dashboardMetrics.totalFeatures} available features across ${dashboardMetrics.totalCountries} markets`,
        `${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% lighthouse features indicate strong innovation focus`,
        `${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}% subscription model shows revenue diversification`,
        `Leading in ${dashboardMetrics.topCategories?.[0]?.name || 'key'} category with competitive feature set`
      ];
    }

    // Ensure exactly 4 insights
    const fallbackInsights = [
      `${oem} demonstrates strong feature availability across ${dashboardMetrics.totalCountries} key markets`,
      `Innovation leadership with ${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% lighthouse features`,
      `Revenue model diversity through ${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}% subscription offerings`,
      `Market advantage in ${dashboardMetrics.topCategories?.[0]?.name || 'core'} category positioning`
    ];

    while (insights.length < 4) {
      insights.push(fallbackInsights[insights.length] || `Strategic opportunity in ${country || 'global'} market`);
    }

    insights = insights.slice(0, 4);

    const result = {
      success: true,
      insights,
      dataPoints: dashboardMetrics.totalFeatures,
      cached: false
    };

    insightsCache.set(requestCacheKey, { ...result, cached: true });
    
    if (insightsCache.size > 50) {
      const firstKey = insightsCache.keys().next().value;
      insightsCache.delete(firstKey);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in data-insights-ai function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        insights: [
          'Insights temporarily unavailable',
          'Check data connectivity and retry',
          'Technical analysis service offline',
          'Contact support if issue persists'
        ],
        error: error.message,
        dataPoints: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
