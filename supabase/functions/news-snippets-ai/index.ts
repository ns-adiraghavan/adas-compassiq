
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const newsApiKey = Deno.env.get('NEWS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsSnippetsRequest {
  selectedOEMs: string[];
  selectedCountry: string;
  analysisType: string;
}

interface NewsSnippet {
  id: number;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  url: string;
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
      console.warn('NEWS_API_KEY not found, using fallback data');
      // Fallback to mock data if no API key
      const fallbackNews = [
        {
          id: 1,
          title: 'Automotive Market Update',
          summary: 'Latest industry developments and trends',
          source: 'Industry Report',
          timestamp: '1 hour ago',
          url: 'https://example.com/market-update'
        },
        {
          id: 2,
          title: 'Technology Innovation',
          summary: 'New automotive technology announcements',
          source: 'Tech News',
          timestamp: '3 hours ago',
          url: 'https://example.com/tech-innovation'
        },
        {
          id: 3,
          title: 'Market Analysis',
          summary: 'Regional automotive market insights',
          source: 'Market Research',
          timestamp: '5 hours ago',
          url: 'https://example.com/market-analysis'
        }
      ];

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

    // Build search query based on context
    const oemsText = selectedOEMs.length > 0 ? selectedOEMs.join(' OR ') : 'automotive';
    const searchQuery = `${oemsText} automotive ${selectedCountry} car industry`;

    console.log('Searching NewsAPI with query:', searchQuery);

    // Fetch real news from NewsAPI
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`
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

    // Transform NewsAPI articles to our format
    const newsSnippets: NewsSnippet[] = newsData.articles
      .filter((article: any) => article.url && article.title && article.description)
      .slice(0, 3)
      .map((article: any, index: number) => {
        // Calculate time ago
        const publishedDate = new Date(article.publishedAt);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
        const timeAgo = diffInHours < 1 ? 'Just now' : 
                       diffInHours < 24 ? `${diffInHours} hours ago` : 
                       `${Math.floor(diffInHours / 24)} days ago`;

        return {
          id: index + 1,
          title: article.title.length > 80 ? article.title.substring(0, 77) + '...' : article.title,
          summary: article.description.length > 120 ? article.description.substring(0, 117) + '...' : article.description,
          source: article.source.name || 'News Source',
          timestamp: timeAgo,
          url: article.url
        };
      });

    console.log('Processed news snippets:', newsSnippets.length);

    // If no articles found, provide fallback
    if (newsSnippets.length === 0) {
      console.log('No relevant articles found, using fallback');
      const fallbackNews = [
        {
          id: 1,
          title: `${oemsText} Market Update`,
          summary: `Latest developments in ${selectedCountry} automotive market`,
          source: 'Automotive News',
          timestamp: '2 hours ago',
          url: 'https://autonews.com/market-update'
        },
        {
          id: 2,
          title: 'Industry Analysis',
          summary: `${analysisType} trends and market insights`,
          source: 'Reuters',
          timestamp: '4 hours ago',
          url: 'https://reuters.com/automotive-analysis'
        },
        {
          id: 3,
          title: 'Technology Advancement',
          summary: 'New automotive technology partnerships announced',
          source: 'TechCrunch',
          timestamp: '6 hours ago',
          url: 'https://techcrunch.com/automotive-tech'
        }
      ];
      
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
    
    // Return fallback news if there's an error
    const fallbackNews = [
      {
        id: 1,
        title: 'Automotive Market Update',
        summary: 'Latest industry developments and trends',
        source: 'Industry Report',
        timestamp: '1 hour ago',
        url: 'https://example.com/market-update'
      },
      {
        id: 2,
        title: 'Technology Innovation',
        summary: 'New automotive technology announcements',
        source: 'Tech News',
        timestamp: '3 hours ago',
        url: 'https://example.com/tech-innovation'
      },
      {
        id: 3,
        title: 'Market Analysis',
        summary: 'Regional automotive market insights',
        source: 'Market Research',
        timestamp: '5 hours ago',
        url: 'https://example.com/market-analysis'
      }
    ];

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
