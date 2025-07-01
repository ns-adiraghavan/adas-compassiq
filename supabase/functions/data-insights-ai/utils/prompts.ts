
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

  // Calculate competitive positioning
  const marketRank = ranking?.rank || 0;
  const totalOEMs = ranking?.totalOEMs || 0;
  const availableFeatures = ranking?.availableFeatures || 0;
  const lighthouseFeatures = ranking?.lighthouseFeatures || 0;
  const lighthouseRate = availableFeatures > 0 ? Math.round((lighthouseFeatures / availableFeatures) * 100) : 0;

  return `You are an automotive industry analyst. Generate exactly 3 strategic insights based on real data analysis. Each insight must be 22-28 words and provide specific, actionable intelligence.

VERIFIED DATA CONTEXT:
- OEM: ${selectedOEM}
- Country Market: ${selectedCountry}
- Market Position: Rank #${marketRank} of ${totalOEMs} OEMs
- Total Available Features: ${availableFeatures}
- Lighthouse Features: ${lighthouseFeatures} (${lighthouseRate}% of portfolio)
- Leading Category: ${topCategory.category} with ${topCategory.count} features
- Secondary Category: ${secondCategory.category} with ${secondCategory.count} features
- Primary Business Model: ${topBusinessModel.model} (${topBusinessModel.count} implementations)

GENERATE EXACTLY 3 INSIGHTS IN THIS FORMAT:

1. OEM Feature Diversity Leadership: [Analysis of ${selectedOEM}'s feature portfolio strength, ranking (#${marketRank}), and competitive positioning against ${totalOEMs-1} competitors]

2. Geographic Feature Availability Hotspots: [Assessment of ${selectedCountry} market characteristics, feature deployment density, and regional technology adoption patterns]

3. Lighthouse Feature Implementation Excellence: [Evaluation of ${selectedOEM}'s innovation leadership through ${lighthouseFeatures} lighthouse features representing ${lighthouseRate}% implementation rate]

Requirements:
- Use exact numbers from the data above
- Each insight must be 22-28 words
- Focus on competitive intelligence and strategic implications
- Maintain professional, analytical tone

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

  // Calculate market share percentages
  const topCategoryShare = totalFeatures > 0 ? Math.round((topCategory.total / totalFeatures) * 100) : 0;
  const secondCategoryShare = totalFeatures > 0 ? Math.round((secondCategory.total / totalFeatures) * 100) : 0;
  const leadingOEMShare = totalFeatures > 0 ? Math.round((leadingOEM.total / totalFeatures) * 100) : 0;

  return `You are an automotive technology analyst. Generate exactly 3 strategic insights for Category Analysis in ${country}. Each insight must be 22-28 words and provide specific competitive intelligence.

VERIFIED CATEGORY DATA:
- Market Scope: ${selectedOEMs?.join(', ') || 'All OEMs'} in ${country}
- Total Features Analyzed: ${totalFeatures || 0}
- Leading Category: ${topCategory.category} (${topCategory.total} features, ${topCategoryShare}% market share, led by ${topCategory.leader})
- Secondary Category: ${secondCategory.category} (${secondCategory.total} features, ${secondCategoryShare}% share)
- Market Leader: ${leadingOEM.oem} (${leadingOEM.total} features, ${leadingOEMShare}% portfolio, strongest in ${leadingOEM.strongestCategory})
- Second Player: ${secondOEM.oem} (${secondOEM.total} features, strongest in ${secondOEM.strongestCategory})

GENERATE EXACTLY 3 INSIGHTS:

1. Category Market Dominance: [Analysis of ${topCategory.category}'s ${topCategoryShare}% market leadership and strategic implications for ${topCategory.leader}]

2. OEM Portfolio Strategy: [Assessment of ${leadingOEM.oem}'s ${leadingOEMShare}% market control and specialization in ${leadingOEM.strongestCategory} category]

3. Technology Distribution Patterns: [Evaluation of feature distribution across ${selectedOEMs?.length || 0} OEMs and competitive gaps in ${secondCategory.category}]

Requirements:
- Use exact numbers and percentages from verified data
- Each insight must be 22-28 words
- Focus on strategic business implications
- Professional analytical tone

Respond with ONLY a JSON array of exactly 3 strings.`;
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
  const totalLighthouseFeatures = dashboardMetrics.lighthouseFeatures || 0;
  const topCategoryFeatures = dashboardMetrics.topCategories?.[0]?.value || 0;
  const secondCategoryFeatures = dashboardMetrics.topCategories?.[1]?.value || 0;
  const totalMarketFeatures = dashboardMetrics.totalFeatures || (topOEMFeatures + secondOEMFeatures);
  
  // Calculate market share percentages
  const topOEMShare = totalMarketFeatures > 0 ? Math.round((topOEMFeatures / totalMarketFeatures) * 100) : 0;
  const secondOEMShare = totalMarketFeatures > 0 ? Math.round((secondOEMFeatures / totalMarketFeatures) * 100) : 0;
  const lighthouseRate = totalMarketFeatures > 0 ? Math.round((totalLighthouseFeatures / totalMarketFeatures) * 100) : 0;

  return `You are a senior automotive market analyst. Generate exactly 3 strategic insights for Market Overview in ${country || 'Global'}. Each insight must be 22-28 words and provide actionable market intelligence.

VERIFIED MARKET DATA:
- Geographic Market: ${country || 'Global'} automotive technology landscape
- Market Leader: ${topOEM || 'Unknown'} (${topOEMFeatures || 0} features, ${topOEMShare}% market share)
- Second Player: ${secondOEM || 'Unknown'} (${secondOEMFeatures || 0} features, ${secondOEMShare}% share)
- Dominant Category: ${topCategory || 'Unknown'} (${topCategoryFeatures} implementations)
- Secondary Category: ${secondCategory || 'Unknown'} (${secondCategoryFeatures} implementations)
- Innovation Index: ${totalLighthouseFeatures} lighthouse features (${lighthouseRate}% of total market)
- Total Market Size: ${totalMarketFeatures} connected features deployed

GENERATE EXACTLY 3 INSIGHTS:

1. OEM Feature Diversity Leadership: [Analysis of ${topOEM}'s ${topOEMShare}% market dominance with ${topOEMFeatures} features versus ${secondOEM}'s ${secondOEMShare}% position]

2. Geographic Feature Availability Hotspots: [Assessment of ${country || 'Global'} market maturity through ${totalMarketFeatures} deployed features and ${topCategory} category leadership]

3. Lighthouse Feature Implementation Excellence: [Evaluation of market innovation through ${totalLighthouseFeatures} lighthouse features representing ${lighthouseRate}% implementation rate across OEMs]

Requirements:
- Use exact numbers and percentages from verified data
- Each insight must be 22-28 words
- Focus on competitive positioning and market dynamics
- Professional analytical tone

Respond with ONLY a JSON array of exactly 3 strings.`;
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
