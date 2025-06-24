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
  const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'Unknown';
  const secondCategory = dashboardMetrics.topCategories?.[1]?.name || 'Unknown';
  const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
  const subscriptionRate = Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100);
  const freeRate = Math.round((dashboardMetrics.freeFeatures / dashboardMetrics.totalFeatures) * 100);
  
  // Determine most common business model with proper logic
  let dominantBusinessModel = 'Free';
  let dominantRate = freeRate;
  let customerPaymentWillingness = 'low';
  
  if (subscriptionRate > freeRate) {
    dominantBusinessModel = 'Subscription';
    dominantRate = subscriptionRate;
    customerPaymentWillingness = 'moderate to high';
  }

  if (isMarketOverview || oem === "Market Overview") {
    return `Generate exactly 3 strategic market insights for ${country || 'global market'} based on automotive feature data.

MARKET DATA CONTEXT:
• Country: ${country || 'Global'}
• Total Features: ${dashboardMetrics.totalFeatures}
• Active OEMs: ${dashboardMetrics.totalOEMs}
• Top Categories: ${topCategory} (${dashboardMetrics.topCategories?.[0]?.value || 0}), ${secondCategory} (${dashboardMetrics.topCategories?.[1]?.value || 0})
• Lighthouse Features: ${dashboardMetrics.lighthouseFeatures} (${lighthouseRate}%)
• Business Models: Subscription ${subscriptionRate}%, Free ${freeRate}%
• Dominant Model: ${dominantBusinessModel} (${dominantRate}%)

GENERATE EXACTLY 3 INSIGHTS following these patterns:

1. Category Dynamics - Most OEMs in ${country || 'the market'} are betting big on ${topCategory} category (top by count) owing to emphasis on [specific reason like utility, comfort, safety, technology advancement based on category type]

2. Lighthouse Features - Lighthouse features can be considered as an indication of what features customers love in ${country || 'the market'} and with ${lighthouseRate}% adoption rate, [provide specific insight about customer preferences and market maturity]

3. Monetization Dynamics - In ${country || 'the market'} most OEMs seem to follow ${dominantBusinessModel} business model (${dominantRate}%) indicating ${customerPaymentWillingness} customer openness to pay for automotive services

Each insight should be a complete sentence without "Box-1:", "Box-2:" prefixes. Focus on logical conclusions that make business sense.

Respond with ONLY a JSON array of exactly 3 strings. No other text.`;
  }

  const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
  const marketAverage = dashboardMetrics.competitiveAnalysis?.marketAverage;
  
  // OEM-specific business model analysis
  const oemSubscriptionRate = selectedOEMData?.subscriptionRate || 0;
  const oemDominantModel = oemSubscriptionRate > 50 ? 'Subscription' : 'Free';
  const oemVsMarketComparison = oemSubscriptionRate > (marketAverage?.subscriptionRate || 0) ? 'above' : 'below';

  return `Generate exactly 3 strategic insights for ${oem} in ${country || 'global market'} based on competitive positioning.

OEM DATA CONTEXT:
• OEM: ${oem}
• Country: ${country || 'Global'}
• OEM Features: ${selectedOEMData?.features || 0}
• Market Position: #${dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A'}
• OEM Lighthouse Rate: ${selectedOEMData?.lighthouseRate || 0}% vs Market ${marketAverage?.lighthouseRate || 0}%
• OEM Subscription Rate: ${oemSubscriptionRate}% vs Market ${marketAverage?.subscriptionRate || 0}%
• Top Market Category: ${topCategory}

GENERATE EXACTLY 3 INSIGHTS following these patterns:

1. Category Dynamics - ${oem} in ${country || 'the market'} focuses on ${topCategory} category with [competitive positioning insight - whether leading, following, or differentiating]

2. Lighthouse Features - ${oem}'s lighthouse rate of ${selectedOEMData?.lighthouseRate || 0}% vs market ${marketAverage?.lighthouseRate || 0}% shows [specific competitive advantage or gap in customer satisfaction]

3. Monetization Dynamics - ${oem} primarily uses ${oemDominantModel} model (${oemSubscriptionRate}%) positioning them ${oemVsMarketComparison} market trend, indicating [strategic revenue positioning insight]

Each insight should be a complete sentence without "Box-1:", "Box-2:" prefixes. Make logical business conclusions.

Respond with ONLY a JSON array of exactly 3 strings. No other text.`;
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
          `No category data available for analysis in ${country || 'selected region'}`,
          `Insufficient lighthouse feature data found for meaningful insights in ${country || 'selected region'}`,
          `No business model data available for monetization analysis in ${country || 'selected region'}`
        ] : [
          `${oem} category positioning data unavailable for ${country || 'selected market'}`,
          `${oem} lighthouse feature performance data insufficient for analysis in ${country || 'selected market'}`,
          `${oem} business model data unavailable for competitive analysis in ${country || 'selected market'}`
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
            content: 'You are an automotive market analyst. Return ONLY a JSON array of exactly 3 strings. Each string should be a complete business insight without Box- prefixes. Focus on logical conclusions that make business sense based on the data provided.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
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
      // Fallback to structured insights based on data
      const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'connectivity';
      const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
      const subscriptionRate = Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100);
      const freeRate = Math.round((dashboardMetrics.freeFeatures / dashboardMetrics.totalFeatures) * 100);
      const dominantModel = subscriptionRate > freeRate ? 'Subscription' : 'Free';
      const dominantRate = subscriptionRate > freeRate ? subscriptionRate : freeRate;
      const paymentWillingness = subscriptionRate > freeRate ? 'moderate to high' : 'low';

      if (isMarketOverview) {
        insights = [
          `Most OEMs in ${country || 'the market'} are betting big on ${topCategory} category owing to emphasis on enhanced user experience and technological advancement`,
          `Lighthouse features indicate strong customer preferences in ${country || 'the market'} with ${lighthouseRate}% adoption showing mature market expectations for premium automotive experiences`,
          `In ${country || 'the market'} most OEMs follow ${dominantModel} business model (${dominantRate}%) indicating ${paymentWillingness} customer openness to pay for automotive services`
        ];
      } else {
        const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
        const marketAverage = dashboardMetrics.competitiveAnalysis?.marketAverage;
        const oemVsMarket = (selectedOEMData?.lighthouseRate || 0) > (marketAverage?.lighthouseRate || 0) ? 'leading' : 'trailing';
        insights = [
          `${oem} in ${country || 'the market'} focuses on ${topCategory} category with competitive positioning that aligns with market leadership trends`,
          `${oem}'s lighthouse rate of ${selectedOEMData?.lighthouseRate || 0}% vs market ${marketAverage?.lighthouseRate || 0}% shows ${oemVsMarket} customer satisfaction strategy`,
          `${oem} uses ${selectedOEMData?.subscriptionRate > 50 ? 'Subscription' : 'Free'} model positioning them strategically for revenue optimization in the evolving automotive market`
        ];
      }
    }

    // Ensure exactly 3 insights
    const fallbackInsights = isMarketOverview ? [
      `Market demonstrates strategic focus on innovation with diverse category investments across ${dashboardMetrics.totalOEMs} active OEMs`,
      `Customer engagement patterns show evolving preferences for premium automotive experiences and connected services`,
      `Business model diversity indicates market experimentation with revenue strategies to match customer payment behaviors`
    ] : [
      `${oem} demonstrates strategic market positioning through focused category investments and competitive differentiation`,
      `Feature development strategy shows customer-centric approach to automotive innovation and user experience`,
      `Revenue model positioning aligns with long-term market trends and customer value proposition strategy`
    ];

    while (insights.length < 3) {
      insights.push(fallbackInsights[insights.length] || `Strategic opportunity identified in ${country || 'target'} automotive market`);
    }

    insights = insights.slice(0, 3);

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
          'Market insights temporarily unavailable due to technical issues',
          'Feature analysis service currently offline, please retry shortly',
          'Business model insights unavailable, system maintenance in progress'
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
