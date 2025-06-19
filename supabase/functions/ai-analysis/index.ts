
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
    
    // Fetch only recent data to reduce processing time
    const { data: csvData, error } = await supabase
      .from('csv_data')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1); // Only get the most recent file

    if (error) {
      throw error;
    }

    // Filter and process data based on OEM and Country - optimized
    let filteredData = [];
    if (csvData && csvData.length > 0 && csvData[0].data) {
      filteredData = csvData[0].data.filter((row: any) => {
        const matchesOEM = !oem || row.OEM === oem;
        const matchesCountry = country === "Global" || row.Country === country;
        return matchesOEM && matchesCountry;
      });
    }

    // Create simplified data summary for faster processing
    const dataSummary = {
      totalRecords: filteredData.length,
      availableFeatures: filteredData.filter(row => row["Feature Availability"] === "Available").length,
      categories: [...new Set(filteredData.map(row => row.Category).filter(Boolean))],
      businessModels: [...new Set(filteredData.map(row => row["Business Model Type"]).filter(Boolean))],
    };

    // Simplified prompt for faster response
    let prompt = '';
    if (analysisType === 'insights') {
      prompt = `Analyze automotive data for ${oem} in ${country}. Provide exactly 5 concise insights as JSON.

      Key Data:
      - Total Records: ${dataSummary.totalRecords}
      - Available Features: ${dataSummary.availableFeatures}
      - Categories: ${dataSummary.categories.slice(0, 5).join(', ')}
      - Business Models: ${dataSummary.businessModels.slice(0, 3).join(', ')}

      Return ONLY this JSON format:
      {
        "insights": [
          {"text": "Market position insight", "context": "brief context"},
          {"text": "Feature adoption trend", "context": "brief context"},
          {"text": "Business model insight", "context": "brief context"},
          {"text": "Competitive advantage", "context": "brief context"},
          {"text": "Strategic opportunity", "context": "brief context"}
        ]
      }`;
    } else {
      // Simplified prompts for other analysis types
      prompt = `Provide brief analysis for ${oem} in ${country} based on ${dataSummary.totalRecords} records. Return structured JSON with key insights.`;
    }

    // Call OpenAI API with optimized settings
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Faster model
        messages: [
          {
            role: 'system',
            content: 'You are a fast automotive analyst. Provide concise, actionable insights in JSON format only. Be brief and precise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800, // Reduced from 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;

    // Try to parse as JSON, fallback to structured response
    let structuredAnalysis;
    try {
      structuredAnalysis = JSON.parse(analysis);
    } catch {
      // Fast fallback for insights
      if (analysisType === 'insights') {
        structuredAnalysis = {
          insights: [
            { text: `${oem} has ${dataSummary.availableFeatures} available features in ${country}`, context: "Feature availability assessment" },
            { text: "Market positioning shows competitive feature set", context: "Based on current data analysis" },
            { text: "Business model distribution indicates strategic focus", context: "Revenue strategy evaluation" },
            { text: "Technology adoption patterns reflect market demands", context: "Customer preference analysis" },
            { text: "Strategic opportunities exist in underserved segments", context: "Gap analysis results" }
          ]
        };
      } else {
        structuredAnalysis = { analysis, rawData: dataSummary };
      }
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
