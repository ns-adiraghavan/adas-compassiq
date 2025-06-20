
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

// In-memory cache for processed data
const processedDataCache = new Map<string, any>();
let csvDataCache: any[] | null = null;
let cacheTimestamp = 0;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const getFilteredData = (csvData: any[], oem: string, country: string) => {
  let filteredData: any[] = [];
  
  csvData.forEach(file => {
    if (file.data && Array.isArray(file.data)) {
      file.data.forEach((row: any) => {
        const rowOEM = row.OEM?.trim()
        const rowCountry = row.Country?.trim()
        
        // Apply filters
        if (oem && rowOEM !== oem) return
        if (country && country !== "Global" && rowCountry !== country) return
        
        filteredData.push(row)
      })
    }
  })
  
  return filteredData
}

const createDataSummary = (filteredData: any[], oem: string, country: string) => {
  const features = [...new Set(filteredData.map(row => row.Feature).filter(Boolean))]
  const categories = [...new Set(filteredData.map(row => row.Category).filter(Boolean))]
  const lighthouseFeatures = filteredData.filter(row => row["Lighthouse Feature"] === "Yes").length
  const subscriptionFeatures = filteredData.filter(row => row["Business Model Type"] === "Subscription").length
  
  return {
    totalRecords: filteredData.length,
    oem,
    country: country || "Global",
    topFeatures: features.slice(0, 10),
    topCategories: categories.slice(0, 8),
    lighthouseCount: lighthouseFeatures,
    subscriptionCount: subscriptionFeatures,
    segments: {
      entry: [...new Set(filteredData.map(row => row["Entry Segment"]).filter(Boolean))].length,
      mid: [...new Set(filteredData.map(row => row["Mid Segment"]).filter(Boolean))].length,
      luxury: [...new Set(filteredData.map(row => row["Luxury Segment"]).filter(Boolean))].length,
      premium: [...new Set(filteredData.map(row => row["Premium Segment"]).filter(Boolean))].length,
    }
  }
}

const createInsightsPrompt = (dataSummary: any) => {
  return `Generate exactly 3-5 concise data insights in bullet point format based on this automotive data:

OEM: ${dataSummary.oem}
Market: ${dataSummary.country}
Total Features: ${dataSummary.totalRecords}
Lighthouse Features: ${dataSummary.lighthouseCount}
Subscription Features: ${dataSummary.subscriptionCount}
Top Categories: ${dataSummary.topCategories.slice(0, 5).join(', ')}
Segment Coverage: Entry(${dataSummary.segments.entry}), Mid(${dataSummary.segments.mid}), Luxury(${dataSummary.segments.luxury}), Premium(${dataSummary.segments.premium})

Provide 3-5 actionable business insights as bullet points focusing on:
- Market positioning strengths
- Feature adoption patterns  
- Competitive advantages
- Strategic opportunities

Format as JSON array of strings with each insight being concise and data-driven.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oem, country } = await req.json();
    
    const requestCacheKey = `insights-${oem}-${country}`;
    
    if (processedDataCache.has(requestCacheKey)) {
      console.log('Returning cached insights for:', requestCacheKey);
      return new Response(
        JSON.stringify(processedDataCache.get(requestCacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
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

    const filteredData = getFilteredData(csvDataCache!, oem, country);
    
    if (filteredData.length === 0) {
      const emptyResult = {
        success: true,
        insights: [`No data available for ${oem} in ${country || 'selected market'}`],
        dataPoints: 0
      };
      
      processedDataCache.set(requestCacheKey, emptyResult);
      return new Response(
        JSON.stringify(emptyResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dataSummary = createDataSummary(filteredData, oem, country);
    const prompt = createInsightsPrompt(dataSummary);

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
            content: 'You are an automotive industry analyst. Generate exactly 3-5 concise, actionable insights as a JSON array of strings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
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
      insights = [analysis];
    }

    // Ensure we have 3-5 insights
    insights = insights.slice(0, 5);
    if (insights.length < 3) {
      insights.push(`${oem} shows strong market presence with ${dataSummary.totalRecords} tracked features`);
    }

    const result = {
      success: true,
      insights,
      dataPoints: filteredData.length,
      cached: false
    };

    processedDataCache.set(requestCacheKey, { ...result, cached: true });
    
    if (processedDataCache.size > 50) {
      const firstKey = processedDataCache.keys().next().value;
      processedDataCache.delete(firstKey);
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
        insights: ['Unable to generate insights at this time'],
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
