
import { NewsSnippet } from './fallbackData.ts';

// Expanded list of reputable news domains - much more inclusive
const REPUTABLE_DOMAINS = [
  // Automotive specific
  'reuters.com', 'bloomberg.com', 'autonews.com', 'automotive-news.com',
  'motortrend.com', 'caranddriver.com', 'autoblog.com', 'electrek.co', 'insideevs.com',
  
  // Major news outlets
  'cnn.com', 'bbc.com', 'theguardian.com', 'wsj.com', 'financialtimes.com',
  'techcrunch.com', 'forbes.com', 'businessinsider.com', 'cnbc.com', 'axios.com',
  
  // Regional news
  'abc.net.au', 'news.com.au', 'smh.com.au', 'theage.com.au',
  'nytimes.com', 'washingtonpost.com', 'usatoday.com',
  
  // Industry publications
  'automotive-fleet.com', 'fleet-magazine.com', 'wardsauto.com',
  'just-auto.com', 'automotive-logistics.com',
  
  // Technology focused
  'theverge.com', 'wired.com', 'arstechnica.com', 'engadget.com'
];

function isValidNewsURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check if it's HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    const domain = urlObj.hostname.toLowerCase();
    
    // Check if domain is from expanded reputable source list
    const isReputableDomain = REPUTABLE_DOMAINS.some(reputableDomain => 
      domain === reputableDomain || domain.endsWith('.' + reputableDomain)
    );
    
    // More lenient validation - allow other domains but exclude obvious spam
    const hasValidPath = urlObj.pathname && urlObj.pathname !== '/';
    const notSpamDomain = !domain.includes('spam') && !domain.includes('fake') && 
                         !domain.includes('malware') && !domain.includes('virus');
    
    // Accept if reputable OR (has valid path AND not spam AND reasonable domain)
    const reasonableDomain = domain.length > 4 && domain.includes('.') && 
                           !domain.startsWith('localhost') && !domain.includes('127.0.0.1');
    
    return isReputableDomain || (hasValidPath && notSpamDomain && reasonableDomain);
  } catch (error) {
    console.log('Invalid URL detected:', url);
    return false;
  }
}

export function processNewsArticles(articles: any[], selectedOEMs: string[]): NewsSnippet[] {
  console.log('Processing articles, initial count:', articles.length);
  
  const processedArticles = articles
    .filter((article: any) => {
      // Basic article quality checks
      if (!article.url || !article.title || !article.description) {
        console.log('Filtered out: Missing basic fields');
        return false;
      }
      
      // Check for removed content
      if (article.title.includes('[removed]') || article.description === '[Removed]') {
        console.log('Filtered out: Removed content');
        return false;
      }
      
      // Validate URL - more lenient now
      if (!isValidNewsURL(article.url)) {
        console.log('Filtered out article with invalid URL:', article.url);
        return false;
      }
      
      const title = article.title?.toLowerCase() || '';
      const description = article.description?.toLowerCase() || '';
      const content = `${title} ${description}`;
      
      // Enhanced automotive relevance check with requested focus terms
      const automotiveKeywords = [
        // Core automotive
        'automotive', 'car', 'vehicle', 'auto', 'oem', 'manufacturer',
        // Electric/Future
        'electric vehicle', 'ev', 'hybrid', 'battery', 'charging', 'autonomous', 'self-driving',
        // Vehicle types
        'suv', 'sedan', 'truck', 'motorcycle', 'scooter',
        // Brands - major OEMs
        'tesla', 'ford', 'gm', 'toyota', 'honda', 'bmw', 'mercedes', 'volkswagen', 
        'audi', 'porsche', 'hyundai', 'kia', 'nissan', 'mazda', 'subaru', 'volvo',
        'jaguar', 'ferrari', 'lamborghini', 'byd', 'nio', 'xpeng', 'rivian', 'lucid',
        // Industry terms
        'mobility', 'transport', 'dealership', 'sales', 'recall', 'safety', 'crash test',
        'market share', 'revenue', 'profit', 'earnings', 'production', 'manufacturing'
      ];

      // Requested focus terms for enhanced relevance
      const focusKeywords = [
        'connected features', 'connected', 'connectivity',
        'launch', 'launched', 'launching', 'debut', 'unveil', 'unveiling',
        'introduction', 'introduced', 'introducing', 'announce', 'announcement',
        'partnership', 'partnership agreement', 'collaboration', 'joint venture', 'alliance',
        'technology', 'tech', 'innovation', 'breakthrough', 'advancement',
        'update', 'updated', 'upgrade', 'upgraded', 'enhancement', 'improved'
      ];
      
      const hasAutomotiveContent = automotiveKeywords.some(keyword => 
        content.includes(keyword)
      );

      const hasFocusContent = focusKeywords.some(keyword => 
        content.includes(keyword)
      );
      
      // Very lenient OEM relevance check
      let hasOEMRelevance = true; // Default to true
      if (selectedOEMs.length > 0) {
        hasOEMRelevance = selectedOEMs.some(oem => {
          const oemLower = oem.toLowerCase();
          return content.includes(oemLower) ||
                 // Check for partial matches for compound names
                 content.includes(oemLower.split(' ')[0]) ||
                 // Common abbreviations
                 (oemLower.includes('general motors') && content.includes('gm')) ||
                 (oemLower.includes('volkswagen') && content.includes('vw')) ||
                 // Allow if automotive content is strong even without exact OEM match
                 (hasAutomotiveContent && (
                   content.includes('automotive') || 
                   content.includes('vehicle') || 
                   content.includes('car manufacturer')
                 ));
        });
      }
      
      // Enhanced relevance scoring - prioritize articles with focus terms
      const isRelevant = (hasAutomotiveContent || hasOEMRelevance) && (hasFocusContent || hasAutomotiveContent);
      
      if (!isRelevant) {
        console.log('Filtered out article (not relevant):', article.title.substring(0, 50));
      }
      
      return isRelevant;
    })
    .slice(0, 6) // Get more articles initially
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
    })
    .slice(0, 3); // Final limit to 3 best articles

  console.log('Final processed articles count:', processedArticles.length);
  return processedArticles;
}
