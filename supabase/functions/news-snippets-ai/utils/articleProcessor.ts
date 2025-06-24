
import { NewsSnippet } from './fallbackData.ts';

// List of reputable news domains for validation
const REPUTABLE_DOMAINS = [
  'reuters.com',
  'bloomberg.com',
  'autonews.com',
  'automotive-news.com',
  'cnn.com',
  'bbc.com',
  'theguardian.com',
  'wsj.com',
  'financialtimes.com',
  'techcrunch.com',
  'forbes.com',
  'motortrend.com',
  'caranddriver.com',
  'autoblog.com',
  'electrek.co',
  'insideevs.com',
  'abc.net.au',
  'news.com.au',
  'smh.com.au',
  'theage.com.au'
];

function isValidNewsURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check if it's HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check if domain is from a reputable source
    const domain = urlObj.hostname.toLowerCase();
    const isReputableDomain = REPUTABLE_DOMAINS.some(reputableDomain => 
      domain === reputableDomain || domain.endsWith('.' + reputableDomain)
    );
    
    // Allow other domains but exclude obvious spam/invalid ones
    const hasValidPath = urlObj.pathname && urlObj.pathname !== '/';
    const notSpamDomain = !domain.includes('spam') && !domain.includes('fake');
    
    return isReputableDomain || (hasValidPath && notSpamDomain);
  } catch (error) {
    console.log('Invalid URL detected:', url);
    return false;
  }
}

export function processNewsArticles(articles: any[], selectedOEMs: string[]): NewsSnippet[] {
  console.log('Processing articles, initial count:', articles.length);
  
  return articles
    .filter((article: any) => {
      // Basic article quality checks
      if (!article.url || !article.title || !article.description) {
        return false;
      }
      
      // Check for removed content
      if (article.title.includes('[removed]') || article.description === '[Removed]') {
        return false;
      }
      
      // Validate URL
      if (!isValidNewsURL(article.url)) {
        console.log('Filtered out article with invalid URL:', article.url);
        return false;
      }
      
      const title = article.title?.toLowerCase() || '';
      const description = article.description?.toLowerCase() || '';
      const content = `${title} ${description}`;
      
      // More lenient automotive relevance check
      const automotiveKeywords = [
        'automotive', 'car', 'vehicle', 'auto', 'oem', 'manufacturer', 
        'electric vehicle', 'ev', 'hybrid', 'battery', 'charging',
        'tesla', 'ford', 'gm', 'toyota', 'honda', 'bmw', 'mercedes',
        'volkswagen', 'audi', 'porsche', 'ferrari', 'lamborghini',
        'suv', 'sedan', 'truck', 'motorcycle', 'scooter', 'bike',
        'autonomous', 'self-driving', 'mobility', 'transport',
        'dealership', 'sales', 'recall', 'safety', 'crash test'
      ];
      
      const hasAutomotiveContent = automotiveKeywords.some(keyword => 
        content.includes(keyword)
      );
      
      // More lenient OEM relevance check
      let hasOEMRelevance = true;
      if (selectedOEMs.length > 0) {
        hasOEMRelevance = selectedOEMs.some(oem => 
          content.includes(oem.toLowerCase()) ||
          // Also check for partial matches and common abbreviations
          content.includes(oem.toLowerCase().substring(0, 3))
        );
      }
      
      const isRelevant = hasAutomotiveContent && hasOEMRelevance;
      
      if (!isRelevant) {
        console.log('Filtered out article:', article.title, 'Automotive:', hasAutomotiveContent, 'OEM:', hasOEMRelevance);
      }
      
      return isRelevant;
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
}
