// Vehicle Segment Analysis and Insights Analysis specific prompts

function createFeedbackContext(feedbackData?: any[]): string {
  if (!feedbackData || feedbackData.length === 0) {
    return '';
  }

  const dislikedInsights = feedbackData
    .filter(f => f.feedback_type === 'dislike')
    .map(f => f.insight_text)
    .slice(0, 5);

  const likedInsights = feedbackData
    .filter(f => f.feedback_type === 'like')
    .map(f => f.insight_text)
    .slice(0, 3);

  let feedbackContext = '\n\nFEEDBACK CONTEXT:\n';
  
  if (dislikedInsights.length > 0) {
    feedbackContext += `AVOID these patterns (previously disliked):\n${dislikedInsights.map((insight, i) => `- ${insight}`).join('\n')}\n`;
  }
  
  if (likedInsights.length > 0) {
    feedbackContext += `PREFERRED patterns (previously liked):\n${likedInsights.map((insight, i) => `- ${insight}`).join('\n')}\n`;
  }
  
  feedbackContext += '\nGenerate fresh insights that avoid disliked patterns and follow successful patterns.\n';
  
  return feedbackContext;
}

export function createVehicleSegmentAnalysisPrompt(
  country: string,
  contextData: any,
  feedbackData?: any[]
): string {
  const { 
    selectedOEMs = [], 
    selectedCountry, 
    totalFeatures = 0
  } = contextData;

  const feedbackContext = createFeedbackContext(feedbackData);
  
  // Define available terms for validation
  const validOEMs = ['BYD', 'GM', 'Hyundai', 'Mahindra', 'Nio', 'Tata', 'Zeekr'];
  const validCountries = ['Australia', 'China', 'Germany', 'India', 'New Zealand', 'Norway', 'UK', 'US'];
  const validCategories = ['Available', 'Enabler', 'Energy', 'Entertainment', 'Financials', 'Gaming', 'Health', 'Home', 'Mobility', 'Shopping', 'Social', 'Work'];

  return `You are an automotive vehicle segment analyst. Generate exactly 3 strategic insights for Vehicle Segment Analysis in ${country}. Each insight must be 15-20 words maximum and use only raw counts, no percentages.

IMPORTANT: Use ONLY these verified terms from our dataset:
- OEMs: ${validOEMs.join(', ')}
- Countries: ${validCountries.join(', ')}
- Categories: ${validCategories.join(', ')}
- Do NOT use any OEM names, country names, or technical terms not listed above
- Use generic terms like "manufacturers", "automotive market", "connected features" instead of undefined terms

VERIFIED VEHICLE SEGMENT DATA:
- Market Analysis: ${selectedOEMs.join(', ')} in ${country}
- Selected OEMs: ${selectedOEMs.length} manufacturers
- Market Focus: Vehicle segment feature distribution and deployment patterns
- Analysis Scope: Cross-segment feature availability and OEM specialization${feedbackContext}

GENERATE 3 INSIGHTS (15-20 words each, counts only):

1. Segment Leadership: [Cross-segment analysis reveals ${selectedOEMs.join(', ')} deployment patterns in ${country} automotive market]

2. Feature Distribution: [Vehicle segment analysis shows feature concentration patterns across ${selectedOEMs.length} manufacturers in ${country}]

3. Market Positioning: [Segment-specific deployment strategies indicate competitive positioning for ${selectedOEMs.join(', ')} manufacturers]

Use exact counts only, no percentages. Use only verified terms from the dataset. Respond with ONLY a JSON array of exactly 3 strings.`;
}

export function createInsightsAnalysisPrompt(
  country: string,
  contextData: any,
  feedbackData?: any[]
): string {
  const { 
    selectedOEMs = [], 
    selectedCountry
  } = contextData;

  const feedbackContext = createFeedbackContext(feedbackData);
  
  // Define available terms for validation
  const validOEMs = ['BYD', 'GM', 'Hyundai', 'Mahindra', 'Nio', 'Tata', 'Zeekr'];
  const validCountries = ['Australia', 'China', 'Germany', 'India', 'New Zealand', 'Norway', 'UK', 'US'];
  const validCategories = ['Available', 'Enabler', 'Energy', 'Entertainment', 'Financials', 'Gaming', 'Health', 'Home', 'Mobility', 'Shopping', 'Social', 'Work'];

  return `You are an automotive feature overlap analyst. Generate exactly 3 strategic insights for Feature Overlap Analysis in ${country}. Each insight must be 15-20 words maximum and focus on feature intersection patterns.

IMPORTANT: Use ONLY these verified terms from our dataset:
- OEMs: ${validOEMs.join(', ')}
- Countries: ${validCountries.join(', ')}
- Categories: ${validCategories.join(', ')}
- Do NOT use any OEM names, country names, or technical terms not listed above
- Use generic terms like "manufacturers", "automotive market", "connected features" instead of undefined terms

VERIFIED FEATURE OVERLAP DATA:
- Market Analysis: ${selectedOEMs.join(', ')} in ${country}
- Selected OEMs: ${selectedOEMs.length} manufacturers for overlap analysis
- Analysis Focus: Feature intersection patterns and competitive overlaps
- Market Scope: ${country} automotive feature deployment overlaps${feedbackContext}

GENERATE 3 INSIGHTS (15-20 words each):

1. Feature Overlap: [Feature intersection analysis reveals competitive overlaps between ${selectedOEMs.join(', ')} in ${country} market]

2. Differentiation Patterns: [Overlap analysis shows ${selectedOEMs.length} manufacturers feature differentiation strategies in ${country} automotive sector]

3. Market Convergence: [Feature intersection data indicates convergence patterns across ${selectedOEMs.join(', ')} manufacturer portfolios]

Focus on overlap patterns and competitive dynamics. Use only verified terms from the dataset. Respond with ONLY a JSON array of exactly 3 strings.`;
}