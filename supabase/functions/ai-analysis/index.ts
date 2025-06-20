
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

// In-memory cache for processed data to avoid repeated filtering
const processedDataCache = new Map<string, any>();
let csvDataCache: any[] | null = null;
let cacheTimestamp = 0;

// Cache duration: 1 hour for static data
const CACHE_DURATION = 60 * 60 * 1000;

// Pre-process and index data for faster filtering
const preprocessData = (csvData: any[]) => {
  const indexedData = new Map<string, any[]>();
  
  csvData.forEach(file => {
    if (file.data && Array.isArray(file.data)) {
      file.data.forEach((row: any) => {
        const oem = row.OEM;
        const country = row.Country;
        
        if (oem && country) {
          const key = `${oem}-${country}`;
          if (!indexedData.has(key)) {
            indexedData.set(key, []);
          }
          indexedData.get(key)!.push(row);
        }
      });
    }
  });
  
  return indexedData;
};

// Optimized data filtering function
const getFilteredData = (indexedData: Map<string, any[]>, oem: string, country: string) => {
  const exactKey = `${oem}-${country}`;
  const globalKey = `${oem}-Global`;
  
  // Try exact match first
  let filteredData = indexedData.get(exactKey) || [];
  
  // If no exact match and country is not Global, try Global
  if (filteredData.length === 0 && country !== "Global") {
    filteredData = indexedData.get(globalKey) || [];
  }
  
  // If still no data, try all entries for the OEM
  if (filteredData.length === 0) {
    for (const [key, data] of indexedData.entries()) {
      if (key.startsWith(`${oem}-`)) {
        filteredData = [...filteredData, ...data];
      }
    }
  }
  
  return filteredData;
};

// Create optimized data summary
const createDataSummary = (filteredData: any[], analysisType: string) => {
  const baseData = {
    totalRecords: filteredData.length,
    features: [...new Set(filteredData.map(row => row.Feature).filter(Boolean))],
    categories: [...new Set(filteredData.map(row => row.Category).filter(Boolean))],
    featureAvailability: [...new Set(filteredData.map(row => row["Feature Availability"]).filter(Boolean))],
  };

  // Only include relevant data based on analysis type to reduce token usage
  switch (analysisType) {
    case 'segment':
      return {
        ...baseData,
        entrySegment: [...new Set(filteredData.map(row => row["Entry Segment"]).filter(Boolean))],
        midSegment: [...new Set(filteredData.map(row => row["Mid Segment"]).filter(Boolean))],
        luxurySegment: [...new Set(filteredData.map(row => row["Luxury Segment"]).filter(Boolean))],
        premiumSegment: [...new Set(filteredData.map(row => row["Premium Segment"]).filter(Boolean))],
      };
    case 'feature':
      return {
        ...baseData,
        lighthouseFeatures: [...new Set(filteredData.map(row => row["Lighthouse Feature"]).filter(Boolean))],
      };
    case 'business':
      return {
        ...baseData,
        businessModelTypes: [...new Set(filteredData.map(row => row["Business Model Type"]).filter(Boolean))],
      };
    default:
      return {
        ...baseData,
        entrySegment: [...new Set(filteredData.map(row => row["Entry Segment"]).filter(Boolean))],
        midSegment: [...new Set(filteredData.map(row => row["Mid Segment"]).filter(Boolean))],
        luxurySegment: [...new Set(filteredData.map(row => row["Luxury Segment"]).filter(Boolean))],
        premiumSegment: [...new Set(filteredData.map(row => row["Premium Segment"]).filter(Boolean))],
        lighthouseFeatures: [...new Set(filteredData.map(row => row["Lighthouse Feature"]).filter(Boolean))],
        businessModelTypes: [...new Set(filteredData.map(row => row["Business Model Type"]).filter(Boolean))],
      };
  }
};

// Optimized prompt creation with reduced token usage
const createOptimizedPrompt = (oem: string, country: string, analysisType: string, dataSummary: any) => {
  const baseContext = `Analyze automotive data for ${oem} in ${country}. Total records: ${dataSummary.totalRecords}.`;
  
  switch (analysisType) {
    case 'category':
      return `${baseContext} Categories: ${dataSummary.categories.slice(0, 20).join(', ')}. Feature availability: ${dataSummary.featureAvailability.slice(0, 10).join(', ')}. Provide category performance insights and market trends in structured JSON format.`;
      
    case 'segment':
      return `${baseContext} Segments - Entry: ${dataSummary.entrySegment?.slice(0, 10).join(', ') || 'None'}, Mid: ${dataSummary.midSegment?.slice(0, 10).join(', ') || 'None'}, Luxury: ${dataSummary.luxurySegment?.slice(0, 10).join(', ') || 'None'}, Premium: ${dataSummary.premiumSegment?.slice(0, 10).join(', ') || 'None'}. Provide segment analysis with key insights in JSON format.`;
      
    case 'feature':
      return `${baseContext} Features: ${dataSummary.features.slice(0, 15).join(', ')}. Lighthouse features: ${dataSummary.lighthouseFeatures?.slice(0, 10).join(', ') || 'None'}. Analyze feature adoption and technology trends in JSON format.`;
      
    case 'business':
      return `${baseContext} Business models: ${dataSummary.businessModelTypes?.slice(0, 10).join(', ') || 'None'}. Analyze business model effectiveness and market positioning in JSON format.`;
      
    default:
      return `${baseContext} Provide comprehensive market overview with key performance metrics, competitive positioning, and strategic recommendations in structured JSON format.`;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country, analysisType } = await req.json();
    
    // Create cache key for this request
    const requestCacheKey = `${oem}-${country}-${analysisType}`;
    
    // Check if we have cached result for this exact request
    if (processedDataCache.has(requestCacheKey)) {
      console.log('Returning cached analysis for:', requestCacheKey);
      return new Response(
        JSON.stringify(processedDataCache.get(requestCacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if we need to refresh CSV data cache
    const now = Date.now();
    if (!csvDataCache || (now - cacheTimestamp) > CACHE_DURATION) {
      console.log('Refreshing CSV data cache...');
      const { data: csvData, error } = await supabase
        .from('csv_data')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      csvDataCache = csvData;
      cacheTimestamp = now;
    }

    // Pre-process data for faster filtering
    const indexedData = preprocessData(csvDataCache!);
    
    // Get filtered data using optimized method
    const filteredData = getFilteredData(indexedData, oem, country);
    
    if (filteredData.length === 0) {
      const emptyResult = {
        success: true,
        analysis: { message: `No data found for ${oem} in ${country}`, insights: [] },
        dataPoints: 0,
        oem,
        country,
        analysisType
      };
      
      // Cache empty result too
      processedDataCache.set(requestCacheKey, emptyResult);
      
      return new Response(
        JSON.stringify(emptyResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create optimized data summary
    const dataSummary = createDataSummary(filteredData, analysisType);
    
    // Create optimized prompt
    const prompt = createOptimizedPrompt(oem, country, analysisType, dataSummary);

    // Call OpenAI API with optimized settings
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
            content: 'You are an expert automotive industry analyst. Provide concise, structured JSON responses with key insights and metrics. Focus on actionable intelligence.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Lower temperature for more consistent results
        max_tokens: 1500, // Reduced token limit for faster responses
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
      structuredAnalysis = { 
        analysis: analysis, 
        summary: `Analysis for ${oem} in ${country}`,
        insights: [analysis.substring(0, 200) + '...']
      };
    }

    const result = {
      success: true,
      analysis: structuredAnalysis,
      dataPoints: filteredData.length,
      oem,
      country,
      analysisType,
      cached: false
    };

    // Cache the result
    processedDataCache.set(requestCacheKey, { ...result, cached: true });
    
    // Limit cache size to prevent memory issues
    if (processedDataCache.size > 100) {
      const firstKey = processedDataCache.keys().next().value;
      processedDataCache.delete(firstKey);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
