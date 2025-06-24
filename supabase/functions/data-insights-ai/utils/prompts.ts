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
    categoryBreakdown, 
    oemTotals,
    topCategories,
    expandedCategory
  } = contextData;

  // Get top categories and their leaders
  const topCategory = topCategories[0];
  const secondCategory = topCategories[1];
  const thirdCategory = topCategories[2];

  // Calculate OEM performance comparison
  const oemPerformance = selectedOEMs.map(oem => ({
    oem,
    total: oemTotals[oem] || 0,
    strongestCategory: categoryBreakdown.find(cat => 
      cat.oemDistribution[oem] && cat.oemDistribution[oem] === Math.max(...Object.values(cat.oemDistribution))
    )?.category || 'Unknown'
  })).sort((a, b) => b.total - a.total);

  const leadingOEM = oemPerformance[0];
  const secondOEM = oemPerformance[1];

  // Get category-specific insights if expanded
  const expandedCategoryData = expandedCategory ? 
    categoryBreakdown.find(cat => cat.category === expandedCategory) : null;

  return `Generate exactly 3 comparative strategic insights for Category Analysis in ${country} focusing on category distribution, feature density, and OEM leadership within categories.

CATEGORY ANALYSIS CONTEXT:
• Market: ${country}
• Selected OEMs: ${selectedOEMs.join(', ')}
• Total Features Analyzed: ${totalFeatures}
• Categories: ${categoryBreakdown.length} total categories analyzed
• Top Category: ${topCategory?.category} with ${topCategory?.total} features, led by ${topCategory?.leader} (${topCategory?.leaderCount} features)
• Second Category: ${secondCategory?.category} with ${secondCategory?.total} features, led by ${secondCategory?.leader} (${secondCategory?.leaderCount} features)
• Third Category: ${thirdCategory?.category} with ${thirdCategory?.total} features, led by ${thirdCategory?.leader} (${thirdCategory?.leaderCount} features)
• Leading OEM: ${leadingOEM?.oem} (${leadingOEM?.total} features), strongest in ${leadingOEM?.strongestCategory}
• Second OEM: ${secondOEM?.oem} (${secondOEM?.total} features), strongest in ${secondOEM?.strongestCategory}
${expandedCategoryData ? `• Category Deep-dive: ${expandedCategory} - ${expandedCategoryData.total} features, led by ${expandedCategoryData.leader}, top business model: ${expandedCategoryData.topBusinessModel}` : ''}

IMPORTANT: Focus on comparative analysis between categories and OEMs using absolute feature counts, not percentages.

GENERATE EXACTLY 3 CATEGORY COMPARATIVE INSIGHTS:

1. Category Leadership Distribution - ${topCategory?.category} dominates ${country} with ${topCategory?.total} features where ${topCategory?.leader} leads with ${topCategory?.leaderCount} features, while ${secondCategory?.category} shows ${secondCategory?.total} features under ${secondCategory?.leader} leadership, revealing category specialization strategies

2. OEM Category Positioning - ${leadingOEM?.oem} leads overall deployment with ${leadingOEM?.total} features, showing dominance in ${leadingOEM?.strongestCategory} category, compared to ${secondOEM?.oem} with ${secondOEM?.total} features focusing on ${secondOEM?.strongestCategory}, indicating different category investment priorities

3. Feature Density Analysis - ${topCategory?.category} emerges as highest density category with ${topCategory?.total} features across ${selectedOEMs.length} OEMs, followed by ${secondCategory?.category} (${secondCategory?.total}) and ${thirdCategory?.category} (${thirdCategory?.total}), showing where OEMs concentrate innovation efforts in ${country}

Each insight should provide specific comparative analysis using actual feature counts and category distributions. Respond with ONLY a JSON array of exactly 3 strings.`;
}

function createBusinessModelAnalysisPrompt(
  country: string,
  contextData: any
): string {
  const { 
    totalFeatures, 
    selectedOEMs, 
    businessModelComparison, 
    topCategories, 
    oemTotals,
    selectedBusinessModel,
    expandedCategory
  } = contextData;

  // Get top business models and their leaders
  const topBusinessModel = businessModelComparison[0];
  const secondBusinessModel = businessModelComparison[1];
  const topBusinessModelLeader = topBusinessModel?.oemBreakdown[0];
  const secondBusinessModelLeader = secondBusinessModel?.oemBreakdown[0];

  // Get category insights
  const topCategory = topCategories[0];
  const secondCategory = topCategories[1];

  // Calculate OEM performance comparison
  const oemPerformance = selectedOEMs.map(oem => ({
    oem,
    total: oemTotals[oem] || 0,
    strongestBusinessModel: businessModelComparison.find(bm => 
      bm.oemBreakdown.find(breakdown => breakdown.oem === oem && breakdown.count > 0)
    )?.businessModel || 'Unknown'
  })).sort((a, b) => b.total - a.total);

  const leadingOEM = oemPerformance[0];
  const secondOEM = oemPerformance[1];

  return `Generate exactly 3 comparative strategic insights for Business Model Analysis in ${country} focusing on business model distribution and OEM performance.

BUSINESS MODEL ANALYSIS CONTEXT:
• Market: ${country}
• Selected OEMs: ${selectedOEMs.join(', ')}
• Total Features Analyzed: ${totalFeatures}
• Business Models: ${businessModelComparison.map(bm => `${bm.businessModel} (${bm.total})`).join(', ')}
• Top Business Model: ${topBusinessModel?.businessModel} with ${topBusinessModel?.total} features, led by ${topBusinessModelLeader?.oem} (${topBusinessModelLeader?.count})
• Second Business Model: ${secondBusinessModel?.businessModel} with ${secondBusinessModel?.total} features, led by ${secondBusinessModelLeader?.oem} (${secondBusinessModelLeader?.count})
• Leading OEM: ${leadingOEM?.oem} (${leadingOEM?.total} features), strongest in ${leadingOEM?.strongestBusinessModel}
• Second OEM: ${secondOEM?.oem} (${secondOEM?.total} features), strongest in ${secondOEM?.strongestBusinessModel}
• Top Categories: ${topCategory?.category} (${topCategory?.total}, led by ${topCategory?.leader}), ${secondCategory?.category} (${secondCategory?.total}, led by ${secondCategory?.leader})
${selectedBusinessModel ? `• Focus: ${selectedBusinessModel} business model` : ''}
${expandedCategory ? `• Category Deep-dive: ${expandedCategory}` : ''}

IMPORTANT: Focus on comparative analysis between business models and OEMs using absolute feature counts, not percentages.

GENERATE EXACTLY 3 BUSINESS MODEL COMPARATIVE INSIGHTS:

1. Business Model Leadership - ${topBusinessModel?.businessModel} dominates ${country} market with ${topBusinessModel?.total} features, where ${topBusinessModelLeader?.oem} leads with ${topBusinessModelLeader?.count} features, while ${secondBusinessModel?.businessModel} shows ${secondBusinessModel?.total} features with ${secondBusinessModelLeader?.oem} contributing ${secondBusinessModelLeader?.count}

2. OEM Strategy Comparison - ${leadingOEM?.oem} leads overall deployment with ${leadingOEM?.total} features, showing strength in ${leadingOEM?.strongestBusinessModel} model, compared to ${secondOEM?.oem} with ${secondOEM?.total} features focusing on ${secondOEM?.strongestBusinessModel}, indicating different monetization strategies

3. Category-Business Model Alignment - ${topCategory?.category} emerges as top category with ${topCategory?.total} features led by ${topCategory?.leader}, while ${secondCategory?.category} shows ${secondCategory?.total} features under ${secondCategory?.leader} leadership, revealing how OEMs align category investments with business model strategies

Each insight should provide specific comparative analysis using actual feature counts and business model distributions. Respond with ONLY a JSON array of exactly 3 strings.`;
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
  return `Generate exactly 3 strategic insights for Vehicle Segment Analysis in ${country || 'global market'} focusing on OEM and segment comparisons.

VEHICLE SEGMENT ANALYSIS CONTEXT:
• Market: ${country || 'Global'}
• Total Features Analyzed: ${dashboardMetrics.totalFeatures}
• Active OEMs: ${dashboardMetrics.totalOEMs}
• Leading Categories: ${topCategory} (${dashboardMetrics.topCategories?.[0]?.value || 0}), ${secondCategory} (${dashboardMetrics.topCategories?.[1]?.value || 0}), ${thirdCategory} (${dashboardMetrics.topCategories?.[2]?.value || 0})
• Market Leaders: ${topOEM} (${topOEMFeatures} features), ${secondOEM} (${secondOEMFeatures} features)
• Lighthouse Features: ${dashboardMetrics.lighthouseFeatures} across all segments
• Subscription Features: ${dashboardMetrics.subscriptionFeatures}
• Free Features: ${dashboardMetrics.freeFeatures}

IMPORTANT: Do not include percentage values in your insights. Focus on absolute numbers and qualitative comparisons.

GENERATE EXACTLY 3 COMPARATIVE INSIGHTS:

1. Segment Leadership Analysis - ${topOEM} dominates ${country || 'the market'} with ${topOEMFeatures} features across vehicle segments, outpacing ${secondOEM} by ${topOEMFeatures - secondOEMFeatures} features, particularly strong in ${topCategory} category

2. Category Distribution Comparison - ${topCategory} emerges as the most competitive category with ${dashboardMetrics.topCategories?.[0]?.value || 0} features, followed by ${secondCategory} (${dashboardMetrics.topCategories?.[1]?.value || 0}), indicating OEMs prioritize customer experience and technology differentiation

3. Lighthouse Feature Penetration - With ${dashboardMetrics.lighthouseFeatures} lighthouse features across segments in ${country || 'the market'}, leading OEMs are setting premium standards that define customer expectations for next-generation automotive experiences

Each insight should focus on comparative analysis between OEMs and segments using absolute feature counts, not percentages. Respond with ONLY a JSON array of exactly 3 strings.`;
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
  
  // Calculate competitive gaps in absolute numbers
  const featureGap = (selectedOEMData?.features || 0) - (marketAverage?.features || 0);
  const lighthouseGap = (selectedOEMData?.lighthouseRate || 0) - (marketAverage?.lighthouseRate || 0);
  const subscriptionGap = (selectedOEMData?.subscriptionRate || 0) - (marketAverage?.subscriptionRate || 0);

  return `Generate exactly 3 strategic insights for ${oem} Vehicle Segment Analysis in ${country || 'global market'} with competitive comparisons.

OEM COMPETITIVE ANALYSIS CONTEXT:
• OEM: ${oem}
• Market: ${country || 'Global'}
• Market Position: #${marketPosition} of ${dashboardMetrics.totalOEMs} OEMs
• ${oem} Features: ${selectedOEMData?.features || 0} vs Market Average ${marketAverage?.features || 0} (${featureGap > 0 ? '+' : ''}${featureGap} difference)
• ${oem} Lighthouse Features: ${selectedOEMData?.lighthouseRate || 0} vs Market ${marketAverage?.lighthouseRate || 0}
• ${oem} Subscription Features: ${selectedOEMData?.subscriptionRate || 0} vs Market ${marketAverage?.subscriptionRate || 0}
• Leading Market Category: ${topCategory} (${dashboardMetrics.topCategories?.[0]?.value || 0} total features)

IMPORTANT: Do not include percentage values in your insights. Focus on absolute numbers and qualitative comparisons.

GENERATE EXACTLY 3 COMPETITIVE INSIGHTS:

1. Segment Positioning Analysis - ${oem} ranks #${marketPosition} in ${country || 'the market'} with ${selectedOEMData?.features || 0} features, ${featureGap > 0 ? 'leading market average by ' + featureGap + ' features' : 'trailing market average by ' + Math.abs(featureGap) + ' features'}, particularly ${featureGap > 0 ? 'strong' : 'developing'} in competitive segments

2. Lighthouse Feature Strategy - ${oem} offers ${selectedOEMData?.lighthouseRate || 0} lighthouse features compared to market benchmark of ${marketAverage?.lighthouseRate || 0}, ${lighthouseGap > 0 ? 'positioning them as innovation leaders' : 'indicating opportunity to enhance premium feature leadership'} across vehicle segments

3. Revenue Model Comparison - ${oem} provides ${selectedOEMData?.subscriptionRate || 0} subscription features compared to market trend of ${marketAverage?.subscriptionRate || 0}, ${subscriptionGap > 0 ? 'capitalizing on' : 'potentially missing'} monetization opportunities in ${country || 'target'} automotive segments

Each insight should provide specific competitive comparisons using absolute feature counts, not percentages. Respond with ONLY a JSON array of exactly 3 strings.`;
}
