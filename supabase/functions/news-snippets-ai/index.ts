
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildSearchQuery } from './utils/searchQueries.ts';
import { generateContextualFallback } from './utils/fallbackData.ts';
import { processNewsArticles } from './utils/articleProcessor.ts';
import { NewsSnippetsRequest, NewsSnippetsResponse } from './utils/types.ts';

const newsApiKey = Deno.env.get('NEWS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { selectedOEMs, selectedCountry, analysisType }: NewsSnippetsRequest = await req.json();

    console.log('News Snippets AI request:', { selectedOEMs, selectedCountry, analysisType });

    if (!newsApiKey) {
      console.warn('NEWS_API_KEY not found, using contextual fallback data');
      const fallbackNews = generateContextualFallback(selectedOEMs, selectedCountry, analysisType);

      return new Response(
        JSON.stringify({ 
          success: true, 
          newsSnippets: fallbackNews,
          context: { selectedOEMs, selectedCountry, analysisType }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Build contextual search query based on analysis type
    const searchQuery = buildSearchQuery(selectedOEMs, selectedCountry, analysisType);

    console.log('Searching NewsAPI with contextual query:', searchQuery);

    // Fetch real news from NewsAPI
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`
    );

    if (!newsResponse.ok) {
      console.error(`NewsAPI error: ${newsResponse.status} - ${newsResponse.statusText}`);
      throw new Error(`NewsAPI error: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    console.log('NewsAPI response status:', newsData.status);
    console.log('NewsAPI articles found:', newsData.totalResults);

    if (newsData.status !== 'ok') {
      console.error('NewsAPI error:', newsData.message);
      throw new Error(`NewsAPI error: ${newsData.message}`);
    }

    // Transform NewsAPI articles to our format with better filtering
    const newsSnippets = processNewsArticles(newsData.articles, selectedOEMs);

    console.log('Processed contextual news snippets:', newsSnippets.length);

    // If no relevant articles found, provide contextual fallback
    if (newsSnippets.length === 0) {
      console.log('No relevant articles found, using contextual fallback');
      const fallbackNews = generateContextualFallback(selectedOEMs, selectedCountry, analysisType);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          newsSnippets: fallbackNews,
          context: { selectedOEMs, selectedCountry, analysisType }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        newsSnippets: newsSnippets,
        context: { selectedOEMs, selectedCountry, analysisType }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in news-snippets-ai function:', error);
    
    // Return contextual fallback news if there's an error
    const fallbackNews = generateContextualFallback([], '', 'general');

    return new Response(
      JSON.stringify({ 
        success: false, 
        newsSnippets: fallbackNews,
        error: error.message
      }),
      {
        status: 200, // Return 200 to provide fallback data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
