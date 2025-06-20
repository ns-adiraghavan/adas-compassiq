
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
  const isMarketOverview = oem === "Market Overview";
  
  if (isMarketOverview) {
    return `Generate market strategic insights for ${country || 'global market'}.

MARKET DATA SUMMARY:
• Total Available Features: ${dashboardMetrics.totalFeatures}
• Active OEMs: ${dashboardMetrics.totalOEMs}
• Lighthouse Features: ${dashboardMetrics.lighthouseFeatures} (${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}%)
• Subscription Features: ${dashboardMetrics.subscriptionFeatures} (${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}%)
• Market Leaders: ${dashboardMetrics.marketLeaders?.slice(0, 3).map(leader => `${leader.oem} (${leader.totalFeatures} features)`).join(', ') || 'N/A'}
• Top Category: ${dashboardMetrics.topCategories?.[0]?.name || 'N/A'}

REQUIREMENTS:
- Generate exactly 4 bullet points
- Each bullet point: Maximum 25 words
- Focus on market trends and competitive landscape
- Actionable market insights
- Data-driven observations about the overall market

Respond with ONLY a JSON array of exactly 4 strings. No other text or formatting.

Example: ["Market shows strong innovation with X% lighthouse features", "Subscription model adoption at Y% indicates revenue shift", "Leading OEMs concentrate in Z category", "Market fragmentation creates opportunity gaps"]`;
  }

  return `Generate strategic insights for ${oem} in ${country || 'global market'}.

OEM DATA SUMMARY:
• ${oem} Features: ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.features || 0}
• Market Position: #${dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A'} out of ${dashboardMetrics.totalOEMs}
• Lighthouse Rate: ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.lighthouseRate || 0}% vs Market Avg ${dashboardMetrics.competitiveAnalysis?.marketAverage?.lighthouseRate || 0}%
• Subscription Rate: ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.subscriptionRate || 0}% vs Market Avg ${dashboardMetrics.competitiveAnalysis?.marketAverage?.subscriptionRate || 0}%
• Market Context: ${dashboardMetrics.totalFeatures} total features, ${dashboardMetrics.totalOEMs} competitors
• Top Category: ${dashboardMetrics.topCategories?.[0]?.name || 'N/A'}

REQUIREMENTS:
- Generate exactly 4 bullet points
- Each bullet point: Maximum 25 words
- Focus on competitive positioning and performance gaps
- Actionable business insights for this specific OEM
- Data-driven observations comparing against market

Respond with ONLY a JSON array of exactly 4 strings. No other text or formatting.

Example: ["${oem} ranks #X with Y features, above/below market average", "Innovation gap: Z% lighthouse vs W% market rate", "Revenue model opportunity in subscription features", "Category leadership potential in top segments"]`;
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
      const isMarketOverview = oem === "Market Overview";
      const emptyResult = {
        success: true,
        insights: isMarketOverview ? [
          `No market data found for ${country || 'selected region'}`,
          "Expand data collection or adjust country filters",
          "Market analysis requires available feature data",
          "Consider broader geographic scope for insights"
        ] : [
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
            content: 'You are an automotive market analyst. Return ONLY a JSON array of exactly 4 strings. Each string must be under 25 words and contain actionable insights. No other text or formatting.'
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
      const isMarketOverview = oem === "Market Overview";
      
      if (isMarketOverview) {
        insights = [
          `Market shows ${dashboardMetrics.totalFeatures} available features across ${dashboardMetrics.totalOEMs} active OEMs`,
          `${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% lighthouse features indicate strong innovation momentum`,
          `Subscription adoption at ${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}% signals revenue model transformation`,
          `${dashboardMetrics.topCategories?.[0]?.name || 'Key'} category dominance creates competitive opportunities`
        ];
      } else {
        insights = [
          `${oem} offers ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.features || 0} features, ranking #${dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A'}`,
          `Innovation rate: ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.lighthouseRate || 0}% vs ${dashboardMetrics.competitiveAnalysis?.marketAverage?.lighthouseRate || 0}% market average`,
          `Subscription opportunity: ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.subscriptionRate || 0}% vs ${dashboardMetrics.competitiveAnalysis?.marketAverage?.subscriptionRate || 0}% market rate`,
          `Leading position potential in ${dashboardMetrics.topCategories?.[0]?.name || 'key'} category segment`
        ];
      }
    }

    // Ensure exactly 4 insights
    const fallbackInsights = oem === "Market Overview" ? [
      `Market demonstrates ${dashboardMetrics.totalFeatures} available features across ${dashboardMetrics.totalOEMs} competitors`,
      `Innovation leadership with ${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% lighthouse feature adoption`,
      `Revenue transformation through ${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}% subscription model penetration`,
      `Category concentration in ${dashboardMetrics.topCategories?.[0]?.name || 'core'} segment creates market focus`
    ] : [
      `${oem} demonstrates competitive positioning with available feature portfolio`,
      `Innovation opportunity exists in lighthouse feature development`,
      `Revenue diversification potential through subscription offerings`,
      `Market advantage achievable in ${dashboardMetrics.topCategories?.[0]?.name || 'core'} category positioning`
    ];

    while (insights.length < 4) {
      insights.push(fallbackInsights[insights.length] || `Strategic opportunity in ${country || 'target'} market`);
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
