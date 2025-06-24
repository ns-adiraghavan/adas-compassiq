
import { NewsSnippet } from './fallbackData.ts';

export function processNewsArticles(articles: any[], selectedOEMs: string[]): NewsSnippet[] {
  return articles
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
}
