
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { InsightsCache } from './utils/cache.ts';
import { createVehicleSegmentInsightsPrompt } from './utils/prompts.ts';
import { generateFallbackInsights, generateEmptyDataInsights } from './utils/fallbacks.ts';
import { 
  callOpenAIAPI, 
  parseAIResponse, 
  ensureThreeInsights, 
  createSuccessResponse, 
  createErrorResponse 
} from './utils/response.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country, dashboardMetrics, isMarketOverview, analysisType, contextData } = await req.json();
    
    // Create cache key that includes context data type
    const contextType = analysisType || 'general';
    const requestCacheKey = InsightsCache.generateCacheKey(oem, country, dashboardMetrics, isMarketOverview, contextType);
    
    // Check cache first
    if (InsightsCache.has(requestCacheKey)) {
      console.log('Returning cached insights for:', requestCacheKey);
      return new Response(
        JSON.stringify(InsightsCache.get(requestCacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle empty data case
    const dataMetrics = contextData || dashboardMetrics;
    const totalFeatures = dataMetrics?.totalFeatures || 0;
    
    if (!dataMetrics || totalFeatures === 0) {
      const emptyInsights = generateEmptyDataInsights(isMarketOverview, oem, country);
      const emptyResult = createSuccessResponse(emptyInsights, 0);
      
      InsightsCache.set(requestCacheKey, emptyResult);
      return new Response(
        JSON.stringify(emptyResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI insights with context-aware prompts
    const prompt = createVehicleSegmentInsightsPrompt(
      oem, 
      country, 
      dashboardMetrics, 
      isMarketOverview, 
      analysisType, 
      contextData
    );
    
    let insights: string[] = [];
    try {
      const aiResponse = await callOpenAIAPI(prompt, openAIApiKey);
      insights = parseAIResponse(aiResponse);
    } catch (parseError) {
      console.log('AI response parsing failed, using fallback insights:', parseError);
      insights = generateFallbackInsights(isMarketOverview, oem, country, dataMetrics);
    }

    // Ensure exactly 3 insights
    const fallbackInsights = generateFallbackInsights(isMarketOverview, oem, country, dataMetrics);
    const finalInsights = ensureThreeInsights(insights, fallbackInsights);

    const result = createSuccessResponse(finalInsights, totalFeatures);
    InsightsCache.set(requestCacheKey, { ...result, cached: true });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in data-insights-ai function:', error);
    const errorResponse = createErrorResponse(error);
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
