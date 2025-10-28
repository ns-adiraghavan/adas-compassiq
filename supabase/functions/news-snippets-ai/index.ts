
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

async function searchNews(query: string, pageSize: number = 20): Promise<any> {
  console.log(`Searching NewsAPI with query: "${query}"`);
  
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${newsApiKey}`
  );

  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.status} - ${response.statusText}`);
  }

  return await response.json();
}

async function getNewsWithFallback(selectedOEMs: string[], selectedCountry: string, analysisType: string): Promise<any[]> {
  // Try multiple search strategies
  const searchStrategies = [
    // Strategy 1: Primary query
    buildSearchQuery(selectedOEMs, selectedCountry, analysisType),
    
    // Strategy 2: Broader automotive search if primary fails
    selectedOEMs.length > 0 
      ? `${selectedOEMs[0]} automotive ${selectedCountry}`.trim()
      : `automotive ${selectedCountry} news`.trim(),
    
    // Strategy 3: Even broader if still no results
    `automotive news ${selectedCountry}`.trim(),
    
    // Strategy 4: Just automotive news
    'automotive industry news'
  ];

  for (let i = 0; i < searchStrategies.length; i++) {
    try {
      const query = searchStrategies[i];
      console.log(`Trying search strategy ${i + 1}: "${query}"`);
      
      const newsData = await searchNews(query, i === 0 ? 20 : 30); // More articles for broader searches
      
      if (newsData.status === 'ok' && newsData.articles && newsData.articles.length > 0) {
        console.log(`Strategy ${i + 1} found ${newsData.articles.length} articles`);
        
        const processedArticles = processNewsArticles(newsData.articles, selectedOEMs);
        
        if (processedArticles.length > 0) {
          console.log(`Strategy ${i + 1} successful with ${processedArticles.length} relevant articles`);
          return processedArticles;
        } else {
          console.log(`Strategy ${i + 1} had articles but none were relevant after processing`);
        }
      } else {
        console.log(`Strategy ${i + 1} returned no articles`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Strategy ${i + 1} failed:`, errorMessage);
      // Continue to next strategy
    }
  }

  console.log('All search strategies failed, using fallback');
  return [];
}

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
          context: { selectedOEMs, selectedCountry, analysisType, source: 'fallback_no_api_key' }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Use enhanced search with fallback strategies
    const newsSnippets = await getNewsWithFallback(selectedOEMs, selectedCountry, analysisType);

    // If no relevant articles found with any strategy, provide contextual fallback
    if (newsSnippets.length === 0) {
      console.log('No relevant articles found with any search strategy, using contextual fallback');
      const fallbackNews = generateContextualFallback(selectedOEMs, selectedCountry, analysisType);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          newsSnippets: fallbackNews,
          context: { selectedOEMs, selectedCountry, analysisType, source: 'fallback_no_relevant_articles' }
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
        context: { selectedOEMs, selectedCountry, analysisType, source: 'newsapi_enhanced' }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in news-snippets-ai function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return contextual fallback news if there's an error
    const fallbackNews = generateContextualFallback([], '', 'general');

    return new Response(
      JSON.stringify({ 
        success: false, 
        newsSnippets: fallbackNews,
        error: errorMessage,
        context: { source: 'fallback_error' }
      }),
      {
        status: 200, // Return 200 to provide fallback data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
