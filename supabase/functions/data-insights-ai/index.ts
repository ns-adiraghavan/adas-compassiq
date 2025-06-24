
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
  
  // Determine most common business model
  let dominantBusinessModel = 'Subscription';
  if (freeRate > subscriptionRate) {
    dominantBusinessModel = 'Free';
  }

  if (isMarketOverview || oem === "Market Overview") {
    return `Generate exactly 3 strategic market insight boxes for ${country || 'global market'}.

MARKET DATA CONTEXT:
• Country: ${country || 'Global'}
• Total Features: ${dashboardMetrics.totalFeatures}
• Active OEMs: ${dashboardMetrics.totalOEMs}
• Top Categories: ${topCategory} (${dashboardMetrics.topCategories?.[0]?.value || 0}), ${secondCategory} (${dashboardMetrics.topCategories?.[1]?.value || 0})
• Lighthouse Features: ${dashboardMetrics.lighthouseFeatures} (${lighthouseRate}%)
• Business Models: Subscription ${subscriptionRate}%, Free ${freeRate}%

GENERATE EXACTLY 3 INSIGHTS in this specific format:

Box-1: Category Dynamics - Most OEMs in ${country || 'the market'} are betting big on ${topCategory} category (top by count) owing to emphasis on [reason based on category type]

Box-2: Lighthouse Features - Lighthouse features indicate what customers love in ${country || 'the market'} with ${lighthouseRate}% of features being lighthouse, showing [customer preference insight]

Box-3: Monetization Dynamics - In ${country || 'the market'} most OEMs follow ${dominantBusinessModel} business model (${dominantBusinessModel === 'Subscription' ? subscriptionRate : freeRate}%) indicating [customer payment willingness insight]

Respond with ONLY a JSON array of exactly 3 strings following the above format. No other text.`;
  }

  const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
  const marketAverage = dashboardMetrics.competitiveAnalysis?.marketAverage;

  return `Generate exactly 3 strategic insights for ${oem} in ${country || 'global market'}.

OEM DATA CONTEXT:
• OEM: ${oem}
• Country: ${country || 'Global'}
• OEM Features: ${selectedOEMData?.features || 0}
• Market Position: #${dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A'}
• OEM Lighthouse Rate: ${selectedOEMData?.lighthouseRate || 0}% vs Market ${marketAverage?.lighthouseRate || 0}%
• OEM Subscription Rate: ${selectedOEMData?.subscriptionRate || 0}% vs Market ${marketAverage?.subscriptionRate || 0}%
• Top Market Category: ${topCategory}

GENERATE EXACTLY 3 INSIGHTS in this specific format:

Box-1: Category Dynamics - ${oem} in ${country || 'the market'} focuses on ${topCategory} category [competitive positioning vs market]

Box-2: Lighthouse Features - ${oem}'s lighthouse rate of ${selectedOEMData?.lighthouseRate || 0}% vs market ${marketAverage?.lighthouseRate || 0}% shows [competitive advantage/gap]

Box-3: Monetization Dynamics - ${oem} uses ${selectedOEMData?.subscriptionRate > 50 ? 'Subscription' : 'Free'} model primarily (${selectedOEMData?.subscriptionRate || 0}%) vs market trend [competitive insight]

Respond with ONLY a JSON array of exactly 3 strings following the above format. No other text.`;
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
          `Box-1: Category Dynamics - No category data available for ${country || 'selected region'}`,
          `Box-2: Lighthouse Features - No lighthouse feature data found for ${country || 'selected region'}`,
          `Box-3: Monetization Dynamics - No business model data available for ${country || 'selected region'}`
        ] : [
          `Box-1: Category Dynamics - No category data available for ${oem} in ${country || 'selected market'}`,
          `Box-2: Lighthouse Features - No lighthouse data found for ${oem} in ${country || 'selected market'}`,
          `Box-3: Monetization Dynamics - No business model data available for ${oem} in ${country || 'selected market'}`
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
            content: 'You are an automotive market analyst. Return ONLY a JSON array of exactly 3 strings in the specified Box format. Each string must follow the exact format provided. No other text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
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
      const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'Unknown';
      const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
      const subscriptionRate = Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100);
      const freeRate = Math.round((dashboardMetrics.freeFeatures / dashboardMetrics.totalFeatures) * 100);
      const dominantModel = subscriptionRate > freeRate ? 'Subscription' : 'Free';
      const dominantRate = subscriptionRate > freeRate ? subscriptionRate : freeRate;

      if (isMarketOverview) {
        insights = [
          `Box-1: Category Dynamics - Most OEMs in ${country || 'the market'} are betting big on ${topCategory} category (top by count) owing to emphasis on innovation and customer utility`,
          `Box-2: Lighthouse Features - Lighthouse features indicate what customers love in ${country || 'the market'} with ${lighthouseRate}% of features being lighthouse, showing strong customer preference for premium experiences`,
          `Box-3: Monetization Dynamics - In ${country || 'the market'} most OEMs follow ${dominantModel} business model (${dominantRate}%) indicating ${dominantModel === 'Free' ? 'low' : 'moderate'} customer openness to pay`
        ];
      } else {
        const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
        insights = [
          `Box-1: Category Dynamics - ${oem} in ${country || 'the market'} focuses on ${topCategory} category with competitive positioning in the market`,
          `Box-2: Lighthouse Features - ${oem}'s lighthouse rate of ${selectedOEMData?.lighthouseRate || 0}% shows ${selectedOEMData?.lighthouseRate > 20 ? 'strong customer focus' : 'opportunity for premium features'}`,
          `Box-3: Monetization Dynamics - ${oem} primarily uses ${selectedOEMData?.subscriptionRate > 50 ? 'Subscription' : 'Free'} model indicating strategic revenue approach`
        ];
      }
    }

    // Ensure exactly 3 insights
    const fallbackInsights = isMarketOverview ? [
      `Box-1: Category Dynamics - Market shows diverse category focus with ${dashboardMetrics.topCategories?.[0]?.name || 'various'} leading the innovation`,
      `Box-2: Lighthouse Features - Customer preferences indicated by lighthouse adoption across ${dashboardMetrics.totalOEMs} OEMs`,
      `Box-3: Monetization Dynamics - Business model trends show mixed approach to customer monetization strategies`
    ] : [
      `Box-1: Category Dynamics - ${oem} demonstrates strategic category positioning in competitive market`,
      `Box-2: Lighthouse Features - Feature strategy shows customer-focused development approach`,
      `Box-3: Monetization Dynamics - Revenue model aligns with market positioning and customer base`
    ];

    while (insights.length < 3) {
      insights.push(fallbackInsights[insights.length] || `Box-${insights.length + 1}: Strategic opportunity in ${country || 'target'} market`);
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
          'Box-1: Category Dynamics - Insights temporarily unavailable due to technical issues',
          'Box-2: Lighthouse Features - Feature analysis service currently offline',
          'Box-3: Monetization Dynamics - Business model insights unavailable, please retry'
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
