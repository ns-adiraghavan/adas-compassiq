
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

const createVehicleSegmentInsightsPrompt = (oem: string, country: string, dashboardMetrics: any, isMarketOverview: boolean) => {
  const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'Unknown';
  const secondCategory = dashboardMetrics.topCategories?.[1]?.name || 'Unknown';
  const thirdCategory = dashboardMetrics.topCategories?.[2]?.name || 'Unknown';
  const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
  const subscriptionRate = Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100);
  const freeRate = Math.round((dashboardMetrics.freeFeatures / dashboardMetrics.totalFeatures) * 100);
  
  // Get market leaders for comparison
  const marketLeaders = dashboardMetrics.marketLeaders || [];
  const topOEM = marketLeaders[0]?.oem || 'Unknown';
  const secondOEM = marketLeaders[1]?.oem || 'Unknown';
  const topOEMFeatures = marketLeaders[0]?.totalFeatures || 0;
  const secondOEMFeatures = marketLeaders[1]?.totalFeatures || 0;

  if (isMarketOverview || oem === "Market Overview") {
    return `Generate exactly 3 strategic insights for Vehicle Segment Analysis in ${country || 'global market'} focusing on OEM and segment comparisons.

VEHICLE SEGMENT ANALYSIS CONTEXT:
• Market: ${country || 'Global'}
• Total Features Analyzed: ${dashboardMetrics.totalFeatures}
• Active OEMs: ${dashboardMetrics.totalOEMs}
• Leading Categories: ${topCategory} (${dashboardMetrics.topCategories?.[0]?.value || 0}), ${secondCategory} (${dashboardMetrics.topCategories?.[1]?.value || 0}), ${thirdCategory} (${dashboardMetrics.topCategories?.[2]?.value || 0})
• Market Leaders: ${topOEM} (${topOEMFeatures} features), ${secondOEM} (${secondOEMFeatures} features)
• Lighthouse Adoption: ${lighthouseRate}% across all segments
• Business Model Split: ${subscriptionRate}% Subscription, ${freeRate}% Free

GENERATE EXACTLY 3 COMPARATIVE INSIGHTS:

1. Segment Leadership Analysis - ${topOEM} dominates ${country || 'the market'} with ${topOEMFeatures} features across vehicle segments, outpacing ${secondOEM} by ${topOEMFeatures - secondOEMFeatures} features, particularly strong in ${topCategory} category

2. Category Distribution Comparison - ${topCategory} emerges as the most competitive category with ${dashboardMetrics.topCategories?.[0]?.value || 0} features, followed by ${secondCategory} (${dashboardMetrics.topCategories?.[1]?.value || 0}), indicating OEMs prioritize customer experience and technology differentiation

3. Lighthouse Feature Penetration - With ${lighthouseRate}% lighthouse feature adoption across segments in ${country || 'the market'}, leading OEMs are setting premium standards that define customer expectations for next-generation automotive experiences

Each insight should focus on comparative analysis between OEMs and segments. Respond with ONLY a JSON array of exactly 3 strings.`;
  }

  const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
  const marketAverage = dashboardMetrics.competitiveAnalysis?.marketAverage;
  const marketPosition = dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A';
  
  // Calculate competitive gaps
  const featureGap = (selectedOEMData?.features || 0) - (marketAverage?.features || 0);
  const lighthouseGap = (selectedOEMData?.lighthouseRate || 0) - (marketAverage?.lighthouseRate || 0);
  const subscriptionGap = (selectedOEMData?.subscriptionRate || 0) - (marketAverage?.subscriptionRate || 0);

  return `Generate exactly 3 strategic insights for ${oem} Vehicle Segment Analysis in ${country || 'global market'} with competitive comparisons.

OEM COMPETITIVE ANALYSIS CONTEXT:
• OEM: ${oem}
• Market: ${country || 'Global'}
• Market Position: #${marketPosition} of ${dashboardMetrics.totalOEMs} OEMs
• ${oem} Features: ${selectedOEMData?.features || 0} vs Market Average ${marketAverage?.features || 0} (${featureGap > 0 ? '+' : ''}${featureGap} difference)
• ${oem} Lighthouse Rate: ${selectedOEMData?.lighthouseRate || 0}% vs Market ${marketAverage?.lighthouseRate || 0}% (${lighthouseGap > 0 ? '+' : ''}${lighthouseGap}pp difference)
• ${oem} Subscription Rate: ${selectedOEMData?.subscriptionRate || 0}% vs Market ${marketAverage?.subscriptionRate || 0}% (${subscriptionGap > 0 ? '+' : ''}${subscriptionGap}pp difference)
• Leading Market Category: ${topCategory} (${dashboardMetrics.topCategories?.[0]?.value || 0} total features)

GENERATE EXACTLY 3 COMPETITIVE INSIGHTS:

1. Segment Positioning Analysis - ${oem} ranks #${marketPosition} in ${country || 'the market'} with ${selectedOEMData?.features || 0} features, ${featureGap > 0 ? 'leading market average by ' + featureGap + ' features' : 'trailing market average by ' + Math.abs(featureGap) + ' features'}, particularly ${featureGap > 0 ? 'strong' : 'developing'} in competitive segments

2. Lighthouse Feature Strategy - ${oem}'s ${selectedOEMData?.lighthouseRate || 0}% lighthouse adoption ${lighthouseGap > 0 ? 'exceeds' : 'lags'} market benchmark of ${marketAverage?.lighthouseRate || 0}%, ${lighthouseGap > 0 ? 'positioning them as innovation leaders' : 'indicating opportunity to enhance premium feature leadership'} across vehicle segments

3. Revenue Model Comparison - ${oem}'s ${selectedOEMData?.subscriptionRate || 0}% subscription strategy ${subscriptionGap > 0 ? 'outpaces' : 'trails'} market trend of ${marketAverage?.subscriptionRate || 0}%, ${subscriptionGap > 0 ? 'capitalizing on' : 'potentially missing'} monetization opportunities in ${country || 'target'} automotive segments

Each insight should provide specific competitive comparisons. Respond with ONLY a JSON array of exactly 3 strings.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country, dashboardMetrics, isMarketOverview } = await req.json();
    
    const analysisType = isMarketOverview ? 'market-overview' : oem;
    const requestCacheKey = `vehicle-segment-insights-${analysisType}-${country || 'global'}-${JSON.stringify(dashboardMetrics).slice(0, 50)}`;
    
    if (insightsCache.has(requestCacheKey)) {
      console.log('Returning cached vehicle segment insights for:', requestCacheKey);
      return new Response(
        JSON.stringify(insightsCache.get(requestCacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!dashboardMetrics || dashboardMetrics.totalFeatures === 0) {
      const emptyResult = {
        success: true,
        insights: isMarketOverview ? [
          `No segment comparison data available for analysis in ${country || 'selected region'}`,
          `Insufficient OEM competitive data found for meaningful segment insights in ${country || 'selected region'}`,
          `No lighthouse feature data available for segment leadership analysis in ${country || 'selected region'}`
        ] : [
          `${oem} segment positioning data unavailable for competitive analysis in ${country || 'selected market'}`,
          `${oem} lighthouse feature performance insufficient for segment comparison in ${country || 'selected market'}`,
          `${oem} lacks sufficient segment data for competitive benchmarking in ${country || 'selected market'}`
        ],
        dataPoints: 0
      };
      
      insightsCache.set(requestCacheKey, emptyResult);
      return new Response(
        JSON.stringify(emptyResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = createVehicleSegmentInsightsPrompt(oem, country, dashboardMetrics, isMarketOverview);

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
    let analysis = aiData.choices[0].message.content.trim();

    // Clean up the response
    analysis = analysis.replace(/```json/g, '').replace(/```/g, '').trim();
    
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
      insights = insights.filter((insight: any) => 
        typeof insight === 'string' && insight.trim().length > 0
      );
    } catch (parseError) {
      console.log('JSON parse failed, using vehicle segment fallback insights:', parseError);
      
      // Fallback insights specific to vehicle segment analysis
      const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'connectivity';
      const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
      const marketLeaders = dashboardMetrics.marketLeaders || [];
      const topOEM = marketLeaders[0]?.oem || 'Leading OEM';
      const secondOEM = marketLeaders[1]?.oem || 'Second OEM';

      if (isMarketOverview) {
        insights = [
          `${topOEM} leads vehicle segment competition in ${country || 'the market'} with strongest feature portfolio across ${topCategory} category, setting benchmark for segment excellence`,
          `Lighthouse feature adoption at ${lighthouseRate}% indicates premium segment maturity in ${country || 'the market'}, with leading OEMs defining next-generation automotive standards`,
          `${topCategory} emerges as most competitive category with OEMs like ${topOEM} and ${secondOEM} driving innovation through comprehensive segment coverage and feature differentiation`
        ];
      } else {
        const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
        const marketPosition = dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A';
        const featureCount = selectedOEMData?.features || 0;
        const lighthouseOEMRate = selectedOEMData?.lighthouseRate || 0;
        
        insights = [
          `${oem} holds #${marketPosition} position in ${country || 'the market'} vehicle segments with ${featureCount} features, demonstrating ${featureCount > 100 ? 'strong' : 'developing'} competitive presence across automotive categories`,
          `${oem}'s ${lighthouseOEMRate}% lighthouse feature rate ${lighthouseOEMRate > lighthouseRate ? 'exceeds' : 'trails'} market average, ${lighthouseOEMRate > lighthouseRate ? 'establishing premium leadership' : 'indicating growth opportunity'} in segment innovation`,
          `${oem} focuses on ${topCategory} category positioning with strategic emphasis on segment-specific feature development and competitive differentiation in ${country || 'target'} automotive market`
        ];
      }
    }

    // Ensure exactly 3 insights
    const vehicleSegmentFallbacks = isMarketOverview ? [
      `Vehicle segment analysis reveals competitive dynamics with leading OEMs establishing market benchmarks through comprehensive feature portfolios`,
      `Lighthouse feature distribution across segments indicates premium market evolution with customers demanding advanced automotive experiences`,
      `Category competition demonstrates strategic focus areas where OEMs compete for segment leadership and customer preference`
    ] : [
      `${oem} demonstrates vehicle segment positioning through strategic feature investments and competitive differentiation across automotive categories`,
      `Feature leadership analysis shows ${oem}'s approach to segment-specific innovation and premium experience development`,
      `Revenue strategy positioning aligns with vehicle segment trends and customer value proposition in automotive market evolution`
    ];

    while (insights.length < 3) {
      insights.push(vehicleSegmentFallbacks[insights.length] || `Strategic vehicle segment opportunity identified for ${country || 'target'} automotive market`);
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
    console.error('Error in vehicle segment data-insights-ai function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        insights: [
          'Vehicle segment insights temporarily unavailable due to technical issues',
          'OEM comparison analysis service currently offline, please retry shortly',
          'Segment competitive analysis unavailable, system maintenance in progress'
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
