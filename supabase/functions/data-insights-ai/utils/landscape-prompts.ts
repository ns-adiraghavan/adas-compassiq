import { createFeedbackContext } from './feedback-context.ts';

export function createLandscapeAnalysisPrompt(
  country: string,
  contextData: any,
  feedbackData?: any[]
): string {
  const { 
    selectedOEM, 
    selectedCountry, 
    ranking, 
    topCategories = [], 
    lighthouseFeaturesList = [],
    categoryDistribution = [],
    businessModels = []
  } = contextData;

  // Get the top 3 categories safely
  const topCategory = topCategories[0] || { category: 'Unknown', count: 0 };
  const secondCategory = topCategories[1] || { category: 'Unknown', count: 0 };
  const topBusinessModel = businessModels[0] || { model: 'Unknown', count: 0 };

  // Calculate competitive positioning
  const marketRank = ranking?.rank || 0;
  const totalOEMs = ranking?.totalOEMs || 0;
  const availableFeatures = ranking?.availableFeatures || 0;
  const lighthouseFeatures = ranking?.lighthouseFeatures || 0;
  const lighthouseRate = availableFeatures > 0 ? Math.round((lighthouseFeatures / availableFeatures) * 100) : 0;

  const feedbackContext = createFeedbackContext(feedbackData);

return `You are an automotive industry analyst. Generate exactly 3 strategic insights based on real data analysis. Each insight must be 15-20 words maximum and provide specific, actionable intelligence.

VERIFIED DATA CONTEXT:
- OEM: ${selectedOEM}
- Country Market: ${selectedCountry}
- Market Position: Rank #${marketRank} of ${totalOEMs} OEMs
- Total Available Features: ${availableFeatures}
- Lighthouse Features: ${lighthouseFeatures} (${lighthouseRate}% of portfolio)
- Leading Category: ${topCategory.category} with ${topCategory.count} features
- Secondary Category: ${secondCategory.category} with ${secondCategory.count} features
- Primary Business Model: ${topBusinessModel.model} (${topBusinessModel.count} implementations)${feedbackContext}

GENERATE EXACTLY 3 INSIGHTS (15-20 words each):

1. OEM Market Position: [Analysis of ${selectedOEM} rank #${marketRank} with ${availableFeatures} features vs ${totalOEMs-1} competitors]

2. Regional Feature Deployment: [Assessment of ${selectedCountry} market with ${topCategory.category} leadership and ${availableFeatures} total features]

3. Innovation Leadership: [Evaluation of ${selectedOEM} lighthouse capabilities through ${lighthouseFeatures} advanced features]

Requirements:
- Use exact numbers from verified data
- Each insight must be 15-20 words maximum
- Focus on competitive intelligence and strategic implications
- Professional, analytical tone

Respond with ONLY a JSON array of exactly 3 strings.`;
}