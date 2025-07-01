
// Prompt generation utilities
export function createVehicleSegmentInsightsPrompt(
  oem: string, 
  country: string, 
  dashboardMetrics: any, 
  isMarketOverview: boolean,
  analysisType?: string,
  contextData?: any
): string {
  // Handle Landscape Analysis context
  if (analysisType === "landscape-analysis" && contextData) {
    return createLandscapeAnalysisPrompt(country, contextData);
  }

  // Handle Business Model Analysis context
  if (analysisType === "business-model-analysis" && contextData) {
    return createBusinessModelAnalysisPrompt(country, contextData);
  }

  // Handle Category Analysis context
  if (analysisType === "category-analysis" && contextData) {
    return createCategoryAnalysisPrompt(country, contextData);
  }

  const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'Unknown';
  const secondCategory = dashboardMetrics.topCategories?.[1]?.name || 'Unknown';
  const thirdCategory = dashboardMetrics.topCategories?.[2]?.name || 'Unknown';
  
  // Get market leaders for comparison
  const marketLeaders = dashboardMetrics.marketLeaders || [];
  const topOEM = marketLeaders[0]?.oem || 'Unknown';
  const secondOEM = marketLeaders[1]?.oem || 'Unknown';
  const topOEMFeatures = marketLeaders[0]?.totalFeatures || 0;
  const secondOEMFeatures = marketLeaders[1]?.totalFeatures || 0;

  if (isMarketOverview || oem === "Market Overview") {
    return createMarketOverviewPrompt(
      country, 
      dashboardMetrics, 
      topCategory, 
      secondCategory, 
      thirdCategory, 
      topOEM, 
      secondOEM, 
      topOEMFeatures, 
      secondOEMFeatures
    );
  }

  return createOEMSpecificPrompt(
    oem, 
    country, 
    dashboardMetrics, 
    topCategory
  );
}

function createLandscapeAnalysisPrompt(
  country: string,
  contextData: any
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

  return `Generate exactly 3 strategic insights for Landscape Analysis of ${selectedOEM} in ${selectedCountry}. Each insight must be 20-25 words and follow these specific insight types:

CRITICAL: Use ONLY these exact data points from the Detailed Analysis section:

ACTUAL LANDSCAPE DATA:
- OEM: ${selectedOEM}
- Country: ${selectedCountry}
- Market Rank: #${ranking?.rank || 0} of ${ranking?.totalOEMs || 0} OEMs
- Available Features: ${ranking?.availableFeatures || 0}
- Lighthouse Features: ${ranking?.lighthouseFeatures || 0}
- Top Category: ${topCategory.category} (${topCategory.count} features)
- Second Category: ${secondCategory.category} (${secondCategory.count} features)
- Top Business Model: ${topBusinessModel.model} (${topBusinessModel.count} features)

GENERATE 3 INSIGHTS (20-25 words each) using ONLY the data above:

1. OEM Feature Diversity Leadership: Focus on ${selectedOEM}'s ranking and feature count compared to market position
2. Geographic Feature Availability Hotspots: Focus on ${selectedCountry}'s feature availability and market characteristics  
3. Lighthouse Feature Implementation Excellence: Focus on ${selectedOEM}'s lighthouse features and innovation leadership

Respond with ONLY a JSON array of exactly 3 strings.`;
}

function createCategoryAnalysisPrompt(
  country: string,
  contextData: any
): string {
  const { 
    totalFeatures, 
    selectedOEMs, 
    categoryBreakdown = [], 
    oemTotals = {},
    topCategories = [],
    expandedCategory
  } = contextData;

  // Safely get top categories with fallbacks
  const topCategory = topCategories[0] || { category: 'Unknown', total: 0, leader: 'Unknown', leaderCount: 0 };
  const secondCategory = topCategories[1] || { category: 'Unknown', total: 0, leader: 'Unknown', leaderCount: 0 };
  const thirdCategory = topCategories[2] || { category: 'Unknown', total: 0, leader: 'Unknown', leaderCount: 0 };

  // Calculate OEM performance comparison with safety checks
  const oemPerformance = (selectedOEMs || []).map(oem => ({
    oem,
    total: oemTotals[oem] || 0,
    strongestCategory: categoryBreakdown.find(cat => 
      cat.oemDistribution?.[oem] && cat.oemDistribution[oem] === Math.max(...Object.values(cat.oemDistribution || {}))
    )?.category || 'Unknown'
  })).sort((a, b) => b.total - a.total);

  const leadingOEM = oemPerformance[0] || { oem: 'Unknown', total: 0, strongestCategory: 'Unknown' };
  const secondOEM = oemPerformance[1] || { oem: 'Unknown', total: 0, strongestCategory: 'Unknown' };

  // Get category-specific insights if expanded
  const expandedCategoryData = expandedCategory ? 
    categoryBreakdown.find(cat => cat.category === expandedCategory) : null;

  return `Generate exactly 3 concise strategic insights for Category Analysis in ${country}. Each insight must be exactly 15-20 words maximum.

CRITICAL: Use ONLY these exact OEMs and numbers provided below. Do NOT reference Ford, Toyota, or any OEM not listed:

ACTUAL DATA CONTEXT: 
- Selected OEMs: ${selectedOEMs?.join(', ') || 'None specified'}
- Total Features: ${totalFeatures || 0}
- Top Category: ${topCategory.category} with ${topCategory.total || 0} features led by ${topCategory.leader || 'Unknown'}
- Leading OEM: ${leadingOEM.oem || 'Unknown'} with ${leadingOEM.total || 0} features
- Second OEM: ${secondOEM.oem || 'Unknown'} with ${secondOEM.total || 0} features

GENERATE 3 INSIGHTS using ONLY the data above (15-20 words each):

Respond with ONLY a JSON array of exactly 3 concise strings.`;
}

function createBusinessModelAnalysisPrompt(
  country: string,
  contextData: any
): string {
  const { 
    totalFeatures, 
    selectedOEMs, 
    businessModelComparison = [], 
    topCategories = [], 
    oemTotals = {},
    selectedBusinessModel,
    expandedCategory
  } = contextData;

  // Safely get top business models with fallbacks
  const topBusinessModel = businessModelComparison[0] || { businessModel: 'Unknown', total: 0, oemBreakdown: [] };
  const secondBusinessModel = businessModelComparison[1] || { businessModel: 'Unknown', total: 0, oemBreakdown: [] };
  const topBusinessModelLeader = topBusinessModel.oemBreakdown?.[0] || { oem: 'Unknown', count: 0 };
  const secondBusinessModelLeader = secondBusinessModel.oemBreakdown?.[0] || { oem: 'Unknown', count: 0 };

  // Get category insights with safety checks
  const topCategory = topCategories[0] || { category: 'Unknown', total: 0, leader: 'Unknown' };
  const secondCategory = topCategories[1] || { category: 'Unknown', total: 0, leader: 'Unknown' };

  // Calculate OEM performance comparison with safety checks
  const oemPerformance = (selectedOEMs || []).map(oem => ({
    oem,
    total: oemTotals[oem] || 0,
    strongestBusinessModel: businessModelComparison.find(bm => 
      bm.oemBreakdown?.find(breakdown => breakdown.oem === oem && breakdown.count > 0)
    )?.businessModel || 'Unknown'
  })).sort((a, b) => b.total - a.total);

  const leadingOEM = oemPerformance[0] || { oem: 'Unknown', total: 0, strongestBusinessModel: 'Unknown' };
  const secondOEM = oemPerformance[1] || { oem: 'Unknown', total: 0, strongestBusinessModel: 'Unknown' };

  return `Generate exactly 3 concise strategic insights for Business Model Analysis in ${country}. Each insight must be exactly 15-20 words maximum.

CRITICAL: Use ONLY these exact OEMs and numbers provided below. Do NOT reference Ford, Toyota, or any OEM not listed:

ACTUAL DATA CONTEXT:
- Selected OEMs: ${selectedOEMs?.join(', ') || 'None specified'}
- Total Features: ${totalFeatures || 0}
- Top Business Model: ${topBusinessModel.businessModel || 'Unknown'} with ${topBusinessModel.total || 0} features led by ${topBusinessModelLeader.oem || 'Unknown'}
- Leading OEM: ${leadingOEM.oem || 'Unknown'} with ${leadingOEM.total || 0} features
- Second OEM: ${secondOEM.oem || 'Unknown'} with ${secondOEM.total || 0} features

GENERATE 3 INSIGHTS using ONLY the data above (15-20 words each):

Respond with ONLY a JSON array of exactly 3 concise strings.`;
}

function createMarketOverviewPrompt(
  country: string,
  dashboardMetrics: any,
  topCategory: string,
  secondCategory: string,
  thirdCategory: string,
  topOEM: string,
  secondOEM: string,
  topOEMFeatures: number,
  secondOEMFeatures: number
): string {
  return `Generate exactly 3 concise strategic insights for Vehicle Segment Analysis in ${country || 'global market'}. Each insight must be exactly 15-20 words maximum.

CRITICAL: Use ONLY these exact OEMs and numbers provided below. Do NOT reference Ford, Toyota, or any OEM not listed:

ACTUAL DATA CONTEXT:
- Top OEM: ${topOEM || 'Unknown'} with ${topOEMFeatures || 0} features
- Second OEM: ${secondOEM || 'Unknown'} with ${secondOEMFeatures || 0} features  
- Top Category: ${topCategory || 'Unknown'} with ${dashboardMetrics.topCategories?.[0]?.value || 0} features
- Lighthouse Features: ${dashboardMetrics.lighthouseFeatures || 0} total

GENERATE 3 INSIGHTS using ONLY the data above (15-20 words each):

Respond with ONLY a JSON array of exactly 3 concise strings.`;
}

function createOEMSpecificPrompt(
  oem: string,
  country: string,
  dashboardMetrics: any,
  topCategory: string
): string {
  const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
  const marketAverage = dashboardMetrics.competitiveAnalysis?.marketAverage;
  const marketPosition = dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A';
  const totalOEMs = dashboardMetrics.totalOEMs || 0;
  
  // Calculate competitive gaps in absolute numbers
  const featureGap = (selectedOEMData?.features || 0) - (marketAverage?.features || 0);
  const lighthouseGap = (selectedOEMData?.lighthouseRate || 0) - (marketAverage?.lighthouseRate || 0);
  const subscriptionGap = (selectedOEMData?.subscriptionRate || 0) - (marketAverage?.subscriptionRate || 0);

  // Get market leaders for better comparison
  const marketLeaders = dashboardMetrics.marketLeaders || [];
  const topOEM = marketLeaders[0]?.oem || 'Unknown';
  const secondOEM = marketLeaders[1]?.oem || 'Unknown';
  const topOEMFeatures = marketLeaders[0]?.totalFeatures || 0;
  const secondOEMFeatures = marketLeaders[1]?.totalFeatures || 0;
  const topOEMLighthouse = marketLeaders[0]?.lighthouseFeatures || 0;
  const secondOEMLighthouse = marketLeaders[1]?.lighthouseFeatures || 0;

  // Calculate strengths and weaknesses based on ranking
  const isTopTier = marketPosition <= 3;
  const isMidTier = marketPosition > 3 && marketPosition <= Math.ceil(totalOEMs / 2);
  const performanceLevel = isTopTier ? 'leading' : isMidTier ? 'competitive' : 'developing';

  return `Generate exactly 3 concise strategic insights for ${oem} analysis in ${country || 'global market'}. Each insight must be exactly 15-20 words maximum.

CRITICAL: Use ONLY these exact OEMs and numbers provided below. Do NOT reference Ford, Toyota, or any OEM not listed:

ACTUAL DATA CONTEXT:
- Analyzed OEM: ${oem}
- Market Rank: #${marketPosition} of ${totalOEMs} OEMs
- Available Features: ${selectedOEMData?.features || 0}
- Lighthouse Features: ${selectedOEMData?.lighthouseRate || 0}
- Top Market OEM: ${topOEM || 'Unknown'} with ${topOEMLighthouse || 0} lighthouse features

GENERATE 3 INSIGHTS using ONLY the data above (15-20 words each):

Respond with ONLY a JSON array of exactly 3 concise strings.`;
}
