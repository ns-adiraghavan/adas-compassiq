
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

const createInsightsPrompt = (oem: string, country: string, dashboardMetrics: any, isMarketOverview: boolean) => {
  if (isMarketOverview || oem === "Market Overview") {
    return `Generate market strategic insights for ${country || 'global market'}.

MARKET DATA SUMMARY:
• Total Available Features: ${dashboardMetrics.totalFeatures}
• Active OEMs: ${dashboardMetrics.totalOEMs}
• Countries Covered: ${dashboardMetrics.totalCountries}
• Lighthouse Features: ${dashboardMetrics.lighthouseFeatures} (${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}%)
• Subscription Features: ${dashboardMetrics.subscriptionFeatures} (${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}%)
• Market Leaders: ${dashboardMetrics.marketLeaders?.slice(0, 3).map(leader => `${leader.oem} (${leader.totalFeatures} features)`).join(', ') || 'N/A'}
• Top Category: ${dashboardMetrics.topCategories?.[0]?.name || 'N/A'}

REQUIREMENTS:
- Generate exactly 4 bullet points about the OVERALL MARKET (not any specific OEM)
- Each bullet point: Maximum 25 words
- Focus on market trends, opportunities, and competitive landscape
- Actionable market-level insights for the automotive industry
- Data-driven observations about market dynamics

Respond with ONLY a JSON array of exactly 4 strings. No other text or formatting.

Example: ["${country || 'Global'} market shows strong innovation with ${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% lighthouse features across ${dashboardMetrics.totalOEMs} OEMs", "Subscription model adoption creates new revenue opportunities in automotive tech", "Market leaders concentrate in ${dashboardMetrics.topCategories?.[0]?.name || 'key'} category with competitive advantages", "Feature availability gaps present expansion opportunities for new entrants"]`;
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
- Generate exactly 4 bullet points about ${oem} specifically
- Each bullet point: Maximum 25 words
- Focus on competitive positioning and performance gaps
- Actionable business insights for this specific OEM
- Data-driven observations comparing against market

Respond with ONLY a JSON array of exactly 4 strings. No other text or formatting.

Example: ["${oem} ranks #${dashboardMetrics.competitiveAnalysis?.marketPosition || 'X'} with ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.features || 'Y'} features, ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.features > dashboardMetrics.competitiveAnalysis?.marketAverage?.features ? 'above' : 'below'} market average", "Innovation ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.lighthouseRate > dashboardMetrics.competitiveAnalysis?.marketAverage?.lighthouseRate ? 'leadership' : 'gap'}: ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.lighthouseRate || 0}% lighthouse vs ${dashboardMetrics.competitiveAnalysis?.marketAverage?.lighthouseRate || 0}% market rate", "Revenue model opportunity in subscription features for increased monetization", "Category ${dashboardMetrics.competitiveAnalysis?.selectedOEM?.features > 10 ? 'leadership' : 'expansion'} potential in ${dashboardMetrics.topCategories?.[0]?.name || 'core'} segments"]`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country, dashboardMetrics, isMarketOverview } = await req.json();
    
    const analysisType = isMarketOverview ? 'market-overview' : oem;
    const requestCacheKey = `insights-${analysisType}-${country || 'global'}-${JSON.stringify(dashboardMetrics).slice(0, 50)}`;
    
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

    const prompt = createInsightsPrompt(oem, country, dashboardMetrics, isMarketOverview);

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
      if (isMarketOverview) {
        insights = [
          `${country || 'Global'} market demonstrates ${dashboardMetrics.totalFeatures} available features across ${dashboardMetrics.totalOEMs} active OEMs`,
          `${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% lighthouse features indicate strong market innovation momentum`,
          `Subscription adoption at ${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}% signals revenue model transformation opportunity`,
          `${dashboardMetrics.topCategories?.[0]?.name || 'Key'} category dominance creates competitive differentiation opportunities`
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
    const fallbackInsights = isMarketOverview ? [
      `${country || 'Global'} market demonstrates ${dashboardMetrics.totalFeatures} available features with strong competition`,
      `Innovation leadership with ${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% lighthouse feature adoption rate`,
      `Revenue transformation through ${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}% subscription model penetration`,
      `Category concentration in ${dashboardMetrics.topCategories?.[0]?.name || 'core'} segment creates market focus opportunities`
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
