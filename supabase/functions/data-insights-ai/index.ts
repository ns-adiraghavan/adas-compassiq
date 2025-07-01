import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createVehicleSegmentInsightsPrompt } from './utils/prompts.ts';

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
    
    // Generate context-aware prompt
    const prompt = createVehicleSegmentInsightsPrompt(
      oem, 
      country, 
      dashboardMetrics, 
      isMarketOverview, 
      analysisType, 
      contextData
    );
    
    // Enhanced logging for debugging
    console.log('=== Data Insights AI Request ===')
    console.log('OEM:', oem)
    console.log('Country:', country) 
    console.log('Analysis Type:', analysisType)
    console.log('Is Market Overview:', isMarketOverview)
    console.log('Dashboard Metrics Keys:', Object.keys(dashboardMetrics || {}))
    console.log('Context Data Keys:', contextData ? Object.keys(contextData) : 'None')
    
    // Log detailed context data for debugging
    if (contextData) {
      console.log('=== Context Data Details ===')
      console.log('Analysis Type:', contextData.analysisType)
      if (contextData.ranking) {
        console.log('Ranking Data:', JSON.stringify(contextData.ranking))
      }
      if (contextData.topCategories) {
        console.log('Top Categories:', JSON.stringify(contextData.topCategories.slice(0, 3)))
      }
      if (contextData.selectedOEMs) {
        console.log('Selected OEMs:', JSON.stringify(contextData.selectedOEMs))
      }
    }
    
    console.log('Generated Prompt Length:', prompt.length)
    console.log('=== Prompt Preview ===')
    console.log(prompt.substring(0, 600) + '...')
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a senior automotive technology analyst with deep expertise in connected vehicle markets, OEM competitive positioning, and feature deployment strategies. Generate precise, actionable strategic insights using exact data points provided. Always respond with valid JSON containing exactly 3 insight strings, each 22-28 words, focusing on competitive intelligence and market dynamics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API Error:', response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('=== OpenAI Response Analysis ===')
    console.log('Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
    console.log('Full OpenAI Response:', JSON.stringify(data, null, 2))

    let insights: string[] = []
    
    try {
      const content = data.choices[0]?.message?.content || ''
      console.log('=== AI Response Content ===')
      console.log('Raw Content:', content)
      console.log('Content Length:', content.length)
      
      // Enhanced JSON parsing with better error handling
      let parsed: any
      
      // Try direct JSON parse first
      try {
        parsed = JSON.parse(content)
      } catch (directParseError) {
        console.log('Direct JSON parse failed, trying to extract JSON from content...')
        
        // Try to extract JSON array from content
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in response')
        }
      }
      
      console.log('Parsed Content:', JSON.stringify(parsed, null, 2))
      
      if (Array.isArray(parsed)) {
        insights = parsed.filter(insight => typeof insight === 'string' && insight.trim().length > 0)
      } else if (parsed.insights && Array.isArray(parsed.insights)) {
        insights = parsed.insights.filter(insight => typeof insight === 'string' && insight.trim().length > 0)
      } else if (parsed.data && Array.isArray(parsed.data)) {
        insights = parsed.data.filter(insight => typeof insight === 'string' && insight.trim().length > 0)
      } else {
        throw new Error(`Response format not recognized: ${typeof parsed}`)
      }
      
      console.log('Extracted Insights:', insights)
      
      // Validate insights length and content
      if (insights.length !== 3) {
        console.warn(`Expected 3 insights, got ${insights.length}`)
      }
      
    } catch (parseError) {
      console.error('=== Parse Error Details ===')
      console.error('Parse Error:', parseError)
      console.error('Original Content:', data.choices[0]?.message?.content)
      
      // Enhanced fallback with more specific data
      if (analysisType === "landscape-analysis" && contextData) {
        const { selectedOEM, selectedCountry, ranking } = contextData;
        insights = [
          `${selectedOEM || oem} ranks #${ranking?.rank || 'N/A'} of ${ranking?.totalOEMs || 'N/A'} OEMs in ${selectedCountry || country} with ${ranking?.availableFeatures || 0} connected features demonstrating competitive market positioning.`,
          `${selectedCountry || country} market shows ${ranking?.availableFeatures || 0} available features across automotive technology landscape indicating strong regional adoption and deployment maturity.`,
          `${selectedOEM || oem} implements ${ranking?.lighthouseFeatures || 0} lighthouse features representing innovation leadership and advanced technology deployment in connected vehicle segment.`
        ]
      } else if (analysisType === "business-model-analysis" && contextData) {
        const { selectedOEMs = [], totalFeatures = 0 } = contextData;
        insights = [
          `Business model analysis across ${selectedOEMs.join(', ')} reveals ${totalFeatures} total features indicating diverse monetization strategies in ${country} market.`,
          `OEM portfolio diversification shows strategic focus on subscription-based and feature-enabled revenue models across ${selectedOEMs.length} analyzed manufacturers.`,
          `Market opportunity assessment indicates significant growth potential through targeted business model optimization and strategic feature deployment approaches.`
        ]
      } else if (analysisType === "category-analysis" && contextData) {
        const { selectedOEMs = [], totalFeatures = 0, topCategories = [] } = contextData;
        const topCategory = topCategories[0]?.category || 'Technology';
        insights = [
          `Category analysis reveals ${topCategory} leads market distribution with strategic concentration across ${selectedOEMs.join(', ')} in ${country} automotive sector.`,
          `Technology portfolio assessment shows ${totalFeatures} analyzed features indicating comprehensive market coverage and competitive differentiation opportunities.`,
          `Strategic category positioning enables market leaders to capture value through focused technology deployment and targeted customer engagement strategies.`
        ]
      } else {
        // Generic market overview fallback
        insights = [
          `Market analysis reveals competitive automotive technology landscape in ${country} with strategic opportunities for OEM differentiation and feature deployment.`,
          `Connected vehicle market shows strong adoption patterns across multiple technology categories indicating sustained growth and innovation potential.`,
          `Strategic technology investments demonstrate industry commitment to advanced feature implementation and competitive market positioning strategies.`
        ]
      }
      
      console.log('Using Fallback Insights:', insights)
    }

    // Ensure we have exactly 3 insights
    while (insights.length < 3) {
      insights.push(`Strategic market analysis indicates competitive opportunities and technology deployment potential in ${country} automotive sector.`)
    }
    if (insights.length > 3) {
      insights = insights.slice(0, 3)
    }

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
        "Strategic market analysis indicates competitive opportunities in automotive technology deployment.",
        "Connected vehicle innovation shows significant potential for OEM differentiation and customer engagement.",
        "Market dynamics suggest strategic positioning advantages through targeted technology implementation approaches."
      ],
      dataPoints: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});