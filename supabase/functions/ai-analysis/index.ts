
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country, analysisType } = await req.json();
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch data from Supabase
    const { data: csvData, error } = await supabase
      .from('csv_data')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(3);

    if (error) {
      throw error;
    }

    // Filter and process data based on OEM and Country
    let filteredData = [];
    if (csvData && csvData.length > 0) {
      csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          const fileData = file.data.filter((row: any) => {
            const matchesOEM = !oem || row.OEM === oem;
            const matchesCountry = country === "Global" || row.Country === country;
            return matchesOEM && matchesCountry;
          });
          filteredData.push(...fileData);
        }
      });
    }

    // Create a comprehensive data summary for AI analysis
    const dataSummary = {
      totalRecords: filteredData.length,
      availableFeatures: filteredData.filter(row => row["Feature Availability"] === "Available").length,
      categories: [...new Set(filteredData.map(row => row.Category).filter(Boolean))],
      businessModels: [...new Set(filteredData.map(row => row["Business Model Type"]).filter(Boolean))],
      features: [...new Set(filteredData.map(row => row.Feature).filter(Boolean))].slice(0, 10),
      segments: [...new Set(filteredData.map(row => row.Segment).filter(Boolean))],
    };

    // Create detailed prompt for AI analysis
    let prompt = '';
    if (analysisType === 'insights') {
      prompt = `Analyze the automotive data for ${oem} in ${country} and provide exactly 5 key business insights in JSON format.

      Data Summary:
      - Total Records: ${dataSummary.totalRecords}
      - Available Features: ${dataSummary.availableFeatures}
      - Categories: ${dataSummary.categories.join(', ')}
      - Business Models: ${dataSummary.businessModels.join(', ')}
      - Key Features: ${dataSummary.features.join(', ')}
      - Segments: ${dataSummary.segments.join(', ')}

      Provide strategic insights about market positioning, competitive advantages, feature adoption patterns, business model effectiveness, and growth opportunities.

      Return ONLY this JSON format:
      {
        "insights": [
          {"text": "First strategic insight", "context": "supporting context"},
          {"text": "Second market insight", "context": "supporting context"},
          {"text": "Third competitive insight", "context": "supporting context"},
          {"text": "Fourth business model insight", "context": "supporting context"},
          {"text": "Fifth growth opportunity insight", "context": "supporting context"}
        ]
      }`;
    }

    // Call OpenAI API
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
            content: 'You are an expert automotive industry analyst. Provide concise, actionable business insights based on the provided data. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;

    // Parse AI response
    let structuredAnalysis;
    try {
      structuredAnalysis = JSON.parse(analysis);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      structuredAnalysis = {
        insights: [
          { text: `${oem} shows strong market presence in ${country}`, context: "Based on feature availability data" },
          { text: "Feature distribution indicates competitive positioning", context: "Analysis of available vs. planned features" },
          { text: "Business model diversity suggests strategic flexibility", context: "Multiple revenue streams identified" },
          { text: "Technology adoption patterns align with market trends", context: "Feature categories show innovation focus" },
          { text: "Growth opportunities exist in underrepresented segments", context: "Gap analysis reveals potential areas" }
        ]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: structuredAnalysis,
        dataPoints: filteredData.length,
        oem,
        country,
        analysisType
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Failed to generate AI analysis'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
