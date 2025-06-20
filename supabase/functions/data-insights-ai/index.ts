
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
  return `You are an automotive industry analyst specializing in feature analysis and competitive intelligence. 

Based on the following comprehensive data analysis for ${oem} in ${country || 'global market'}:

CORE METRICS:
- Total Features: ${dashboardMetrics.totalFeatures}
- Lighthouse Features: ${dashboardMetrics.lighthouseFeatures} (${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}%)
- Subscription Features: ${dashboardMetrics.subscriptionFeatures} (${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}%)
- Free Features: ${dashboardMetrics.freeFeatures}
- Total Countries: ${dashboardMetrics.totalCountries}
- Total OEMs in dataset: ${dashboardMetrics.totalOEMs}

TOP CATEGORIES:
${dashboardMetrics.topCategories?.map((cat: any) => `- ${cat.name}: ${cat.value} features`).join('\n') || 'No category data available'}

BUSINESS MODEL BREAKDOWN:
${dashboardMetrics.businessModelData?.map((model: any) => `- ${model.name}: ${model.value} features`).join('\n') || 'No business model data available'}

OEM PERFORMANCE CONTEXT:
${dashboardMetrics.oemPerformance?.slice(0, 3).map((oem: any) => `- ${oem.name}: ${oem.features} features`).join('\n') || 'No OEM performance data available'}

COUNTRY COMPARISON INSIGHTS:
${dashboardMetrics.countryComparison?.slice(0, 3).map((country: any) => 
  `- ${country.country}: ${country.totalFeatures} features (${country.lighthouseRate}% lighthouse, ${country.subscriptionRate}% subscription)`
).join('\n') || 'No country comparison data available'}

Generate EXACTLY 4 strategic business insights as bullet points. Each insight should be:
- Data-driven and specific to the metrics provided
- Actionable for automotive executives
- Focused on competitive positioning, market opportunities, or strategic advantages
- Concise (maximum 25 words per bullet point)

Format as a JSON array of exactly 4 strings. Focus on:
1. Market positioning strength/weakness
2. Feature strategy opportunities  
3. Business model insights
4. Competitive differentiation potential

Example format: ["Insight about market position", "Insight about feature strategy", "Insight about business model", "Insight about competitive advantage"]`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country, dashboardMetrics } = await req.json();
    
    // Create cache key based on the processed metrics
    const requestCacheKey = `insights-${oem}-${country || 'global'}-${JSON.stringify(dashboardMetrics).slice(0, 50)}`;
    
    if (insightsCache.has(requestCacheKey)) {
      console.log('Returning cached insights for:', requestCacheKey);
      return new Response(
        JSON.stringify(insightsCache.get(requestCacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate that we have meaningful data to work with
    if (!dashboardMetrics || dashboardMetrics.totalFeatures === 0) {
      const emptyResult = {
        success: true,
        insights: [
          `No feature data available for ${oem} in ${country || 'selected market'}`,
          "Consider expanding data collection or adjusting filters",
          "Market analysis requires comprehensive feature tracking",
          "Data availability is crucial for strategic insights"
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
            content: 'You are an automotive industry analyst. Generate exactly 4 concise, actionable insights as a JSON array of strings. Each insight must be under 25 words and data-driven.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;

    let insights: string[] = [];
    try {
      insights = JSON.parse(analysis);
      if (!Array.isArray(insights)) {
        insights = [analysis];
      }
    } catch {
      // Fallback to parsing if JSON fails
      insights = analysis.split('\n').filter((line: string) => line.trim().length > 0).slice(0, 4);
    }

    // Ensure we have exactly 4 insights
    if (insights.length < 4) {
      const fallbackInsights = [
        `${oem} tracks ${dashboardMetrics.totalFeatures} features across ${dashboardMetrics.totalCountries} markets`,
        `${Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100)}% of features are lighthouse innovations`,
        `Subscription model adoption: ${Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100)}% of total features`,
        `Strong presence in ${dashboardMetrics.topCategories?.[0]?.name || 'key'} category with competitive feature set`
      ];
      
      while (insights.length < 4) {
        insights.push(fallbackInsights[insights.length] || `Strategic opportunity in ${country || 'global'} market`);
      }
    }

    // Limit to exactly 4 insights
    insights = insights.slice(0, 4);

    const result = {
      success: true,
      insights,
      dataPoints: dashboardMetrics.totalFeatures,
      cached: false
    };

    insightsCache.set(requestCacheKey, { ...result, cached: true });
    
    // Clean up cache if it gets too large
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
          'Unable to generate insights at this time',
          'Please check data availability and try again',
          'Technical analysis temporarily unavailable',
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
