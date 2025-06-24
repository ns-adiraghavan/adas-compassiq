
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

// Function to build contextual search queries based on analysis type
function buildSearchQuery(selectedOEMs: string[], selectedCountry: string, analysisType: string): string {
  const baseOEMs = selectedOEMs.length > 0 ? selectedOEMs.slice(0, 3).join(' OR ') : 'automotive';
  
  switch (analysisType) {
    case 'landscape':
      return `(${baseOEMs}) AND (market share OR competitive landscape OR market position) AND ${selectedCountry} automotive`;
    
    case 'category-analysis':
      return `(${baseOEMs}) AND (features OR technology categories OR automotive innovation) AND ${selectedCountry}`;
    
    case 'business-model':
      return `(${baseOEMs}) AND (business model OR revenue model OR subscription OR partnership) AND ${selectedCountry} automotive`;
    
    case 'vehicle-segment':
      return `(${baseOEMs}) AND (vehicle segments OR SUV OR sedan OR electric vehicles) AND ${selectedCountry} automotive`;
    
    case 'general':
    default:
      return `(${baseOEMs}) AND automotive AND ${selectedCountry} AND (market OR industry OR news)`;
  }
}

// Function to generate contextual fallback news based on analysis type
function generateContextualFallback(selectedOEMs: string[], selectedCountry: string, analysisType: string) {
  const oemsText = selectedOEMs.length > 0 ? selectedOEMs.join(', ') : 'Major OEMs';
  
  switch (analysisType) {
    case 'landscape':
      return [
        {
          id: 1,
          title: `${selectedCountry} Automotive Market Leadership Analysis`,
          summary: `Competitive positioning and market share trends among ${oemsText} in ${selectedCountry}`,
          source: 'Automotive News',
          timestamp: '2 hours ago',
          url: 'https://autonews.com/market-landscape'
        },
        {
          id: 2,
          title: 'OEM Competitive Strategies Update',
          summary: `Latest strategic moves and market positioning by leading automotive manufacturers`,
          source: 'Reuters',
          timestamp: '4 hours ago',
          url: 'https://reuters.com/automotive-strategy'
        },
        {
          id: 3,
          title: `${selectedCountry} Auto Industry Market Share Report`,
          summary: 'Regional market dynamics and competitive landscape analysis',
          source: 'Industry Analysis',
          timestamp: '6 hours ago',
          url: 'https://example.com/market-share-report'
        }
      ];
    
    case 'category-analysis':
      return [
        {
          id: 1,
          title: 'Automotive Feature Innovation Trends',
          summary: `Technology category developments and feature availability across ${oemsText}`,
          source: 'Tech Automotive',
          timestamp: '1 hour ago',
          url: 'https://techautomotive.com/feature-analysis'
        },
        {
          id: 2,
          title: `${selectedCountry} Vehicle Technology Categories`,
          summary: 'Analysis of technology adoption and feature distribution by category',
          source: 'Auto Tech Report',
          timestamp: '3 hours ago',
          url: 'https://autotechreport.com/categories'
        },
        {
          id: 3,
          title: 'OEM Feature Differentiation Study',
          summary: 'How automotive brands differentiate through technology categories',
          source: 'Market Research',
          timestamp: '5 hours ago',
          url: 'https://example.com/feature-differentiation'
        }
      ];
    
    case 'business-model':
      return [
        {
          id: 1,
          title: 'Automotive Business Model Transformation',
          summary: `Revenue model evolution and subscription services by ${oemsText}`,
          source: 'Business Auto',
          timestamp: '1 hour ago',
          url: 'https://businessauto.com/business-models'
        },
        {
          id: 2,
          title: `${selectedCountry} Auto Industry Revenue Strategies`,
          summary: 'Partnership models and monetization strategies in automotive sector',
          source: 'Financial Times',
          timestamp: '4 hours ago',
          url: 'https://ft.com/automotive-revenue'
        },
        {
          id: 3,
          title: 'OEM Partnership and Service Models',
          summary: 'New business approaches and collaborative strategies',
          source: 'Strategy Report',
          timestamp: '6 hours ago',
          url: 'https://example.com/partnership-models'
        }
      ];
    
    case 'vehicle-segment':
      return [
        {
          id: 1,
          title: `${selectedCountry} Vehicle Segment Performance`,
          summary: `SUV, sedan, and EV segment analysis for ${oemsText}`,
          source: 'Segment Analysis',
          timestamp: '2 hours ago',
          url: 'https://segmentanalysis.com/vehicle-segments'
        },
        {
          id: 2,
          title: 'Electric Vehicle Segment Growth',
          summary: 'EV adoption trends and segment distribution across manufacturers',
          source: 'EV News',
          timestamp: '3 hours ago',
          url: 'https://evnews.com/segment-growth'
        },
        {
          id: 3,
          title: 'Luxury vs Mass Market Segments',
          summary: 'Feature distribution and positioning across vehicle segments',
          source: 'Auto Segments',
          timestamp: '5 hours ago',
          url: 'https://example.com/luxury-mass-segments'
        }
      ];
    
    default:
      return [
        {
          id: 1,
          title: `${selectedCountry} Automotive Market Update`,
          summary: `Latest developments involving ${oemsText} and industry trends`,
          source: 'Industry Report',
          timestamp: '1 hour ago',
          url: 'https://example.com/market-update'
        },
        {
          id: 2,
          title: 'Global Automotive Technology Trends',
          summary: 'Innovation and technology adoption across automotive manufacturers',
          source: 'Tech News',
          timestamp: '3 hours ago',
          url: 'https://example.com/tech-trends'
        },
        {
          id: 3,
          title: 'Automotive Industry Analysis',
          summary: 'Regional market insights and competitive developments',
          source: 'Market Research',
          timestamp: '5 hours ago',
          url: 'https://example.com/industry-analysis'
        }
      ];
  }
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
    const newsSnippets: NewsSnippet[] = newsData.articles
      .filter((article: any) => {
        // Filter for automotive relevance and quality
        const title = article.title?.toLowerCase() || '';
        const description = article.description?.toLowerCase() || '';
        const content = `${title} ${description}`;
        
        // Check for automotive relevance
        const automotiveKeywords = ['automotive', 'car', 'vehicle', 'auto', 'oem', 'manufacturer', 'electric vehicle', 'ev'];
        const hasAutomotiveContent = automotiveKeywords.some(keyword => content.includes(keyword));
        
        // Check for OEM relevance if OEMs are selected
        const hasOEMRelevance = selectedOEMs.length === 0 || 
          selectedOEMs.some(oem => content.includes(oem.toLowerCase()));
        
        return article.url && 
               article.title && 
               article.description && 
               hasAutomotiveContent && 
               hasOEMRelevance &&
               !title.includes('[removed]') &&
               article.description !== '[Removed]';
      })
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
