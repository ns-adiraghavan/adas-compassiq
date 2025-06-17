
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { prompt, selectedOEM, selectedCountry, filteredData, contextData } = await req.json();

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
            content: 'You are an expert automotive industry analyst. Analyze data and provide structured JSON responses for automotive dashboards. Focus on connected services, market positioning, and business intelligence.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    let analysis;

    try {
      analysis = JSON.parse(aiData.choices[0].message.content);
    } catch {
      // If JSON parsing fails, create structured response
      analysis = {
        companyOverview: aiData.choices[0].message.content.substring(0, 300),
        connectedPlatform: {
          name: `${selectedOEM} Connect`,
          description: "Connected services platform",
          features: ["Digital Services", "Connected Features", "Smart Integration"]
        },
        lighthouseFeatures: [],
        vehicleTypes: { entry: true, mid: true, premium: true, luxury: false },
        geographicalPresence: [selectedCountry !== "Global" ? selectedCountry : "Multiple Markets"],
        keyServices: {
          safety: ["Safety Features"],
          maintenance: ["Maintenance Services"],
          otaUpdates: ["OTA Updates"],
          telematics: ["Telematics"],
          remoteControl: ["Remote Control"]
        },
        financialInsights: {
          revenue: "Data not available",
          marketShare: "Data not available"
        }
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in openai-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
