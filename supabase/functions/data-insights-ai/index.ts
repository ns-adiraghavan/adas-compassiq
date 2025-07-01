import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { createVehicleSegmentInsightsPrompt } from './utils/prompts.ts';
import { validateRequest, validateContextData, createFeedbackContext } from './utils/validation.ts';
import { callOpenAI, parseOpenAIResponse } from './utils/openai.ts';
import { getFeedbackData } from './utils/feedback.ts';
import { logRequestDetails, logContextDataDetails, logPromptDetails, logOpenAIResponse } from './utils/logging.ts';
import { generateEnhancedFallbacks, ensureThreeInsights } from './utils/enhanced-fallbacks.ts';

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
    
    // Validate input data
    validateRequest(oem, country, contextData);
    validateContextData(contextData);
    
    // Log request details
    logRequestDetails(oem, country, analysisType, contextData);
    
    // Initialize Supabase client for feedback queries
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    
    // Get feedback context and data
    const feedbackContext = createFeedbackContext(contextData, oem, country);
    const feedbackData = await getFeedbackData(supabase, feedbackContext);
    
    // Generate context-aware prompt with feedback data
    const prompt = createVehicleSegmentInsightsPrompt(
      oem, 
      country, 
      dashboardMetrics, 
      isMarketOverview, 
      analysisType, 
      contextData,
      feedbackData
    );
    
    // Log context data and prompt details
    logContextDataDetails(contextData);
    logPromptDetails(prompt);
    
    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found')
    }

    // Call OpenAI API
    const data = await callOpenAI(prompt, openAIApiKey);
    logOpenAIResponse(data);

    let insights: string[] = []
    
    try {
      insights = parseOpenAIResponse(data);
    } catch (parseError) {
      console.error('=== Parse Error Details ===')
      console.error('Parse Error:', parseError)
      console.error('Original Content:', data.choices[0]?.message?.content)
      
      // Use enhanced fallback with actual context data
      insights = generateEnhancedFallbacks(analysisType, contextData, oem, country);
      console.log('Using Fallback Insights:', insights)
    }

    // Ensure we have exactly 3 insights
    insights = ensureThreeInsights(insights);

    const result = {
      success: true,
      insights,
      dataPoints: contextData?.totalFeatures || dashboardMetrics?.totalFeatures || 0
    }

    console.log('Final Result:', JSON.stringify(result, null, 2))

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in data-insights-ai function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      insights: [
        "Strategic market analysis indicates competitive opportunities in automotive technology deployment",
        "Connected vehicle innovation shows significant potential for OEM differentiation and engagement",
        "Market dynamics suggest strategic positioning advantages through targeted technology implementation"
      ],
      dataPoints: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});