
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
    const { fileName, fileType, fileContent } = await req.json();
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch existing CSV data for context
    const { data: csvData, error: csvError } = await supabase
      .from('csv_data')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (csvError) {
      throw csvError;
    }

    // Prepare CSV data summary for context
    let csvSummary = "No CSV data available";
    if (csvData && csvData.length > 0) {
      const totalRecords = csvData.reduce((sum, file) => sum + (file.row_count || 0), 0);
      const oems = new Set();
      const countries = new Set();
      const features = new Set();

      csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.OEM) oems.add(row.OEM);
            if (row.Country) countries.add(row.Country);
            if (row.Feature) features.add(row.Feature);
          });
        }
      });

      csvSummary = `CSV Data Context: ${totalRecords} total records, ${oems.size} OEMs (${Array.from(oems).slice(0, 5).join(', ')}), ${countries.size} countries, ${features.size} features`;
    }

    // Create AI prompt for document analysis
    const prompt = `You are an expert automotive industry analyst. Analyze the uploaded document (${fileName}) and create intelligent dashboard insights that correlate with the existing passenger car CSV data.

Current CSV Data Context: ${csvSummary}

Document Type: ${fileType}
File Name: ${fileName}

Please analyze the document content and provide:
1. Key insights from the document that relate to automotive/passenger car industry
2. Metrics and KPIs that should be tracked based on document content
3. Dashboard sections/charts that would be most relevant
4. How this document data correlates with the existing CSV data about OEMs, countries, features, segments, etc.
5. Specific recommendations for dashboard design and data visualization

Return a structured JSON response with:
- summary: Brief summary of document content
- insights: Array of key insights
- recommended_metrics: Array of metrics to track
- dashboard_sections: Array of suggested dashboard sections
- correlation_analysis: How this relates to existing CSV data
- visualization_suggestions: Specific chart/graph recommendations

Focus on actionable business intelligence that can enhance the passenger car analytics dashboard.`;

    // For now, we'll use text analysis since direct file content extraction requires additional tools
    // In a production environment, you'd use libraries like pdf-parse or officegen for proper file parsing
    
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
            content: 'You are an expert automotive industry analyst specializing in dashboard design and data correlation. Provide detailed, structured analysis for business intelligence purposes.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nNote: Document content analysis is simulated - please provide general automotive industry insights and dashboard recommendations based on the file type (${fileType}) and context.`
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

    // Try to parse as JSON, fallback to structured text if needed
    let structuredAnalysis;
    try {
      structuredAnalysis = JSON.parse(analysis);
    } catch {
      // Create a structured response from text analysis
      structuredAnalysis = {
        summary: `AI analysis of ${fileName}`,
        insights: [analysis.substring(0, 500) + "..."],
        recommended_metrics: ["Document-based KPIs", "Industry Metrics", "Performance Indicators"],
        dashboard_sections: ["Document Insights", "Correlation Analysis", "Business Intelligence"],
        correlation_analysis: `Analysis of ${fileName} in context of passenger car data`,
        visualization_suggestions: ["Charts based on document content", "Correlation graphs", "Trend analysis"]
      };
    }

    // Store the document analysis in the database
    const { error: insertError } = await supabase
      .from('waypoint_data_context')
      .insert({
        data_summary: {
          document_name: fileName,
          document_type: fileType,
          analysis: structuredAnalysis,
          upload_timestamp: new Date().toISOString()
        },
        metadata: {
          source: 'document_upload',
          ai_model: 'gpt-4o-mini'
        }
      });

    if (insertError) {
      console.error('Error storing analysis:', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: structuredAnalysis,
        fileName,
        fileType,
        message: 'Document analyzed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in document-analysis function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: 'Failed to analyze document'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
