
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
    
    // Fetch relevant data from csv_data table
    const { data: csvData, error } = await supabase
      .from('csv_data')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Filter and process data based on OEM and Country
    let filteredData = [];
    csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const matchesOEM = !oem || row.OEM === oem;
          const matchesCountry = country === "Global" || row.Country === country;
          
          if (matchesOEM && matchesCountry) {
            filteredData.push(row);
          }
        });
      }
    });

    // Prepare data summary for AI analysis
    const dataSummary = {
      totalRecords: filteredData.length,
      features: filteredData.map(row => row.Feature).filter(Boolean),
      categories: filteredData.map(row => row.Category).filter(Boolean),
      featureAvailability: filteredData.map(row => row["Feature Availability"]).filter(Boolean),
      entrySegment: filteredData.map(row => row["Entry Segment"]).filter(Boolean),
      midSegment: filteredData.map(row => row["Mid Segment"]).filter(Boolean),
      luxurySegment: filteredData.map(row => row["Luxury Segment"]).filter(Boolean),
      premiumSegment: filteredData.map(row => row["Premium Segment"]).filter(Boolean),
      lighthouseFeatures: filteredData.map(row => row["Lighthouse Feature"]).filter(Boolean),
      businessModelTypes: filteredData.map(row => row["Business Model Type"]).filter(Boolean),
    };

    // Create AI prompt based on analysis type
    let prompt = '';
    switch (analysisType) {
      case 'category':
        prompt = `Analyze the automotive category data for ${oem} in ${country}. 
        Categories: ${JSON.stringify([...new Set(dataSummary.categories)])}
        Feature Availability: ${JSON.stringify([...new Set(dataSummary.featureAvailability)])}
        Provide insights on category performance, trends, and market share analysis. Return a structured JSON response with categories, performance metrics, and insights.`;
        break;
      
      case 'segment':
        prompt = `Analyze the automotive segment data for ${oem} in ${country}.
        Entry Segment: ${JSON.stringify([...new Set(dataSummary.entrySegment)])}
        Mid Segment: ${JSON.stringify([...new Set(dataSummary.midSegment)])}
        Luxury Segment: ${JSON.stringify([...new Set(dataSummary.luxurySegment)])}
        Premium Segment: ${JSON.stringify([...new Set(dataSummary.premiumSegment)])}
        Provide detailed segment analysis with volume, pricing insights, and growth trends. Return structured JSON.`;
        break;
      
      case 'feature':
        prompt = `Analyze the automotive feature adoption for ${oem} in ${country}.
        Features: ${JSON.stringify([...new Set(dataSummary.features)])}
        Lighthouse Features: ${JSON.stringify([...new Set(dataSummary.lighthouseFeatures)])}
        Feature Availability: ${JSON.stringify([...new Set(dataSummary.featureAvailability)])}
        Provide insights on feature adoption rates, importance levels, and technology trends. Return structured JSON.`;
        break;
      
      case 'business':
        prompt = `Analyze the business model distribution for ${oem} in ${country}.
        Business Model Types: ${JSON.stringify([...new Set(dataSummary.businessModelTypes)])}
        Provide insights on business model effectiveness, market share, and revenue implications. Return structured JSON.`;
        break;
      
      default:
        prompt = `Provide a comprehensive overview analysis for ${oem} in ${country} based on this automotive data:
        ${JSON.stringify(dataSummary)}
        Include market insights, key metrics, and strategic recommendations. Return structured JSON.`;
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
            content: 'You are an expert automotive industry analyst. Provide detailed, accurate analysis based on the data provided. Always return valid JSON responses with structured insights.'
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
    const analysis = aiData.choices[0].message.content;

    // Try to parse as JSON, fallback to text if needed
    let structuredAnalysis;
    try {
      structuredAnalysis = JSON.parse(analysis);
    } catch {
      structuredAnalysis = { analysis, rawData: dataSummary };
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
