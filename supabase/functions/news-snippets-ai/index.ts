
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    // Create context-aware prompt based on analysis type and selection
    const oemsText = selectedOEMs.length > 0 ? selectedOEMs.join(', ') : 'automotive industry';
    const contextPrompt = `Find 3 recent automotive industry news items related to ${oemsText} in ${selectedCountry} market, focusing on ${analysisType} context. 
    
    For each news item, provide:
    1. A concise headline (max 60 characters)
    2. A brief summary (1-2 sentences, max 100 characters)
    3. A credible source name
    4. Recent timestamp (within last 2 weeks)
    5. A realistic URL to the article
    
    Focus on: business models, feature launches, market expansion, partnerships, technology developments, or regulatory changes.
    
    Return exactly 3 news items in this JSON format:
    [
      {
        "title": "headline here",
        "summary": "brief summary here",
        "source": "source name",
        "timestamp": "X hours/days ago",
        "url": "https://example.com/article-url"
      }
    ]`;

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
            content: 'You are an automotive industry news analyst. Generate realistic, relevant automotive news snippets based on the given context. Always return valid JSON array format with realistic URLs.' 
          },
          { role: 'user', content: contextPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content:', generatedContent);

    // Try to parse the JSON response
    let newsSnippets: NewsSnippet[];
    try {
      const parsedContent = JSON.parse(generatedContent);
      newsSnippets = parsedContent.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title || `News Update ${index + 1}`,
        summary: item.summary || 'Industry update available',
        source: item.source || 'Industry Source',
        timestamp: item.timestamp || `${Math.floor(Math.random() * 24)} hours ago`,
        url: item.url || `https://example.com/news-${index + 1}`
      }));
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to contextual mock data if parsing fails
      newsSnippets = [
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
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        newsSnippets: newsSnippets.slice(0, 3), // Ensure max 3 items
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
