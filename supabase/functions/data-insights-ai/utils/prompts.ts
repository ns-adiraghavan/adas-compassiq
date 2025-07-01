
// Prompt generation utilities
export function createVehicleSegmentInsightsPrompt(
  oem: string, 
  country: string, 
  dashboardMetrics: any, 
  isMarketOverview: boolean,
  analysisType?: string,
  contextData?: any
): string {
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

CONTEXT: ${selectedOEMs?.join(', ')} • ${totalFeatures} features • ${topCategory.category} leads with ${topCategory.total} features

GENERATE 3 INSIGHTS (15-20 words each):

1. ${topCategory.category} dominates with ${topCategory.total} features led by ${topCategory.leader}
2. ${leadingOEM.oem} leads deployment with ${leadingOEM.total} features across categories  
3. ${secondCategory.category} shows ${secondCategory.total} features indicating competitive landscape

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

CONTEXT: ${selectedOEMs?.join(', ')} • ${totalFeatures} features • ${topBusinessModel.businessModel} leads with ${topBusinessModel.total} features

GENERATE 3 INSIGHTS (15-20 words each):

1. ${topBusinessModel.businessModel} dominates with ${topBusinessModel.total} features led by ${topBusinessModelLeader.oem}
2. ${leadingOEM.oem} leads with ${leadingOEM.total} features focusing on ${leadingOEM.strongestBusinessModel} model
3. ${secondBusinessModel.businessModel} shows ${secondBusinessModel.total} features indicating diverse monetization strategies

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

CONTEXT: ${topOEM} leads with ${topOEMFeatures} features • ${topCategory} dominates with ${dashboardMetrics.topCategories?.[0]?.value || 0} features

GENERATE 3 INSIGHTS (15-20 words each):

1. ${topOEM} dominates ${country || 'market'} with ${topOEMFeatures} features leading in ${topCategory} category
2. ${topCategory} shows highest feature density with ${dashboardMetrics.topCategories?.[0]?.value || 0} features across segments
3. ${dashboardMetrics.lighthouseFeatures} lighthouse features indicate premium innovation focus across vehicle segments

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

CONTEXT: ${oem} ranks #${marketPosition} with ${selectedOEMData?.features || 0} features • ${selectedOEMData?.lighthouseRate || 0} lighthouse features

GENERATE 3 INSIGHTS (15-20 words each):

1. ${oem} ranks #${marketPosition} in ${country || 'market'} with ${selectedOEMData?.features || 0} features ${featureGap > 0 ? 'exceeding' : 'trailing'} market average
2. ${oem} offers ${selectedOEMData?.lighthouseRate || 0} lighthouse features compared to leader ${topOEM} with ${topOEMLighthouse} features
3. ${oem} shows ${performanceLevel} positioning with ${selectedOEMData?.features || 0} features indicating ${isTopTier ? 'market leadership' : 'growth opportunity'}

Respond with ONLY a JSON array of exactly 3 concise strings.`;
}
