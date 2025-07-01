
// Prompt generation utilities
export function createVehicleSegmentInsightsPrompt(
  oem: string,
  country: string,
  dashboardMetrics: any,
  isMarketOverview: boolean,
  analysisType?: string,
  contextData?: any
): string {
  // Handle different analysis contexts
  if (contextData) {
    switch (contextData.analysisType) {
      case 'landscape-analysis':
        return createLandscapeAnalysisPrompt(contextData, country);
      case 'category-analysis':
        return createCategoryAnalysisPrompt(contextData, country);
      case 'business-model-analysis':
        return createBusinessModelAnalysisPrompt(country, contextData);
      case 'vehicle-segment-analysis':
        return createVehicleSegmentAnalysisPrompt(contextData, country);
      case 'feature-overlap-analysis':
        return createFeatureOverlapAnalysisPrompt(contextData, country);
    }
  }
  // Fallback to original logic for backward compatibility
  return createOriginalInsightsPrompt(oem, country, dashboardMetrics, isMarketOverview, analysisType, contextData);
}

function createOriginalInsightsPrompt(
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
    return createCategoryAnalysisPrompt(contextData, country);
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
  contextData: any,
  country: string
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

  return `Generate exactly 3 comparative strategic insights for Category Analysis in ${country} focusing on category distribution, feature density, and OEM leadership within categories.

CATEGORY ANALYSIS CONTEXT:
• Market: ${country}
• Selected OEMs: ${selectedOEMs?.join(', ') || 'None'}
• Total Features Analyzed: ${totalFeatures || 0}
• Categories: ${categoryBreakdown.length} total categories analyzed
• Top Category: ${topCategory.category} with ${topCategory.total} features, led by ${topCategory.leader} (${topCategory.leaderCount} features)
• Second Category: ${secondCategory.category} with ${secondCategory.total} features, led by ${secondCategory.leader} (${secondCategory.leaderCount} features)
• Third Category: ${thirdCategory.category} with ${thirdCategory.total} features, led by ${thirdCategory.leader} (${thirdCategory.leaderCount} features)
• Leading OEM: ${leadingOEM.oem} (${leadingOEM.total} features), strongest in ${leadingOEM.strongestCategory}
• Second OEM: ${secondOEM.oem} (${secondOEM.total} features), strongest in ${secondOEM.strongestCategory}
${expandedCategoryData ? `• Category Deep-dive: ${expandedCategory} - ${expandedCategoryData.total} features, led by ${expandedCategoryData.leader}, top business model: ${expandedCategoryData.topBusinessModel}` : ''}

IMPORTANT: Focus on comparative analysis between categories and OEMs using absolute feature counts, not percentages.

GENERATE EXACTLY 3 CATEGORY COMPARATIVE INSIGHTS:

1. Category Leadership Distribution - ${topCategory.category} dominates ${country} with ${topCategory.total} features where ${topCategory.leader} leads with ${topCategory.leaderCount} features, while ${secondCategory.category} shows ${secondCategory.total} features under ${secondCategory.leader} leadership, revealing category specialization strategies

2. OEM Category Positioning - ${leadingOEM.oem} leads overall deployment with ${leadingOEM.total} features, showing dominance in ${leadingOEM.strongestCategory} category, compared to ${secondOEM.oem} with ${secondOEM.total} features focusing on ${secondOEM.strongestCategory}, indicating different category investment priorities

3. Feature Density Analysis - ${topCategory.category} emerges as highest density category with ${topCategory.total} features across ${selectedOEMs?.length || 0} OEMs, followed by ${secondCategory.category} (${secondCategory.total}) and ${thirdCategory.category} (${thirdCategory.total}), showing where OEMs concentrate innovation efforts in ${country}

Each insight should provide specific comparative analysis using actual feature counts and category distributions. Respond with ONLY a JSON array of exactly 3 strings.`;
}

function createLandscapeAnalysisPrompt(contextData: any, country: string): string {
  const { 
    totalFeatures, 
    selectedCountry, 
    selectedOEM,
    oemRankings = [], 
    leadingOEM
  } = contextData;

  return `Generate exactly 3 strategic insights for OEM Feature Distribution landscape analysis in ${country}.

LANDSCAPE ANALYSIS CONTEXT:
• Market: ${selectedCountry}
• Total Features Analyzed: ${totalFeatures || 0}
• Leading OEM: ${leadingOEM?.oem || 'Unknown'} with ${leadingOEM?.total || 0} features
• Top OEMs: ${oemRankings.slice(0, 3).map(oem => `${oem.oem} (${oem.total})`).join(', ')}
${selectedOEM ? `• Selected OEM: ${selectedOEM} for detailed analysis` : ''}

Focus on:
- OEM competitive positioning and market leadership
- Feature distribution patterns across the landscape
- Strategic positioning opportunities and market gaps

Requirements:
- Each insight must be exactly 2-3 sentences
- Reference specific OEMs and their feature counts
- Highlight competitive advantages and strategic positions
- Return insights as a JSON array: ["insight1", "insight2", "insight3"]

Return only the JSON array, no additional text.`;
}

function createVehicleSegmentAnalysisPrompt(contextData: any, country: string): string {
  const { 
    totalFeatures, 
    selectedOEMs, 
    segmentBreakdown = [], 
    topSegments = []
  } = contextData;

  return `Generate exactly 3 strategic insights for Features by Vehicle Segment and Category analysis in ${country}.

VEHICLE SEGMENT ANALYSIS CONTEXT:
• Market: ${country}
• Selected OEMs: ${selectedOEMs?.join(', ') || 'None'}
• Total Features Analyzed: ${totalFeatures || 0}
• Top Segments: ${topSegments.map(seg => `${seg.segment} (${seg.total} features, led by ${seg.leadingOEM})`).join(', ')}

Focus on:
- Vehicle segment distribution and category patterns
- OEM positioning across different vehicle segments
- Segment-specific feature opportunities and gaps

Requirements:
- Each insight must be exactly 2-3 sentences
- Reference specific vehicle segments and their characteristics
- Highlight segment leadership and strategic opportunities
- Return insights as a JSON array: ["insight1", "insight2", "insight3"]

Return only the JSON array, no additional text.`;
}

function createFeatureOverlapAnalysisPrompt(contextData: any, country: string): string {
  const { 
    totalOEMs, 
    selectedOEMs, 
    totalFeatures, 
    sharedFeatures, 
    entities = [], 
    allThreeShared,
    pairwiseIntersections = []
  } = contextData;

  return `Generate exactly 3 strategic insights for Feature Overlap Analysis (Venn Diagram) in ${country}.

FEATURE OVERLAP ANALYSIS CONTEXT:
• Market: ${country}
• Selected OEMs: ${selectedOEMs?.join(', ') || 'None'}
• Total Features: ${totalFeatures || 0}
• Shared Features: ${sharedFeatures || 0}
• All Three OEMs Share: ${allThreeShared || 0} features
• Individual OEM Features: ${entities.map(e => `${e.name} (${e.totalFeatures} total, ${e.uniqueFeatures} unique)`).join(', ')}
• Pairwise Sharing: ${pairwiseIntersections.map(p => `${p.oemPair}: ${p.sharedFeatures}`).join(', ')}

Focus on:
- Feature overlap patterns and competitive dynamics
- Unique feature opportunities and differentiation strategies
- Collaboration and competition insights from shared features

Requirements:
- Each insight must be exactly 2-3 sentences
- Reference specific overlap percentages and unique features
- Highlight differentiation opportunities and market positioning
- Return insights as a JSON array: ["insight1", "insight2", "insight3"]

Return only the JSON array, no additional text.`;
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

  return `Generate exactly 3 comparative strategic insights for Business Model Analysis in ${country} focusing on business model distribution and OEM performance.

BUSINESS MODEL ANALYSIS CONTEXT:
• Market: ${country}
• Selected OEMs: ${selectedOEMs?.join(', ') || 'None'}
• Total Features Analyzed: ${totalFeatures || 0}
• Business Models: ${businessModelComparison.map(bm => `${bm.businessModel} (${bm.total})`).join(', ')}
• Top Business Model: ${topBusinessModel.businessModel} with ${topBusinessModel.total} features, led by ${topBusinessModelLeader.oem} (${topBusinessModelLeader.count})
• Second Business Model: ${secondBusinessModel.businessModel} with ${secondBusinessModel.total} features, led by ${secondBusinessModelLeader.oem} (${secondBusinessModelLeader.count})
• Leading OEM: ${leadingOEM.oem} (${leadingOEM.total} features), strongest in ${leadingOEM.strongestBusinessModel}
• Second OEM: ${secondOEM.oem} (${secondOEM.total} features), strongest in ${secondOEM.strongestBusinessModel}
• Top Categories: ${topCategory.category} (${topCategory.total}, led by ${topCategory.leader}), ${secondCategory.category} (${secondCategory.total}, led by ${secondCategory.leader})
${selectedBusinessModel ? `• Focus: ${selectedBusinessModel} business model` : ''}
${expandedCategory ? `• Category Deep-dive: ${expandedCategory}` : ''}

IMPORTANT: Focus on comparative analysis between business models and OEMs using absolute feature counts, not percentages.

GENERATE EXACTLY 3 BUSINESS MODEL COMPARATIVE INSIGHTS:

1. Business Model Leadership - ${topBusinessModel.businessModel} dominates ${country} market with ${topBusinessModel.total} features, where ${topBusinessModelLeader.oem} leads with ${topBusinessModelLeader.count} features, while ${secondBusinessModel.businessModel} shows ${secondBusinessModel.total} features with ${secondBusinessModelLeader.oem} contributing ${secondBusinessModelLeader.count}

2. OEM Strategy Comparison - ${leadingOEM.oem} leads overall deployment with ${leadingOEM.total} features, showing strength in ${leadingOEM.strongestBusinessModel} model, compared to ${secondOEM.oem} with ${secondOEM.total} features focusing on ${secondOEM.strongestBusinessModel}, indicating different monetization strategies

3. Category-Business Model Alignment - ${topCategory.category} emerges as top category with ${topCategory.total} features led by ${topCategory.leader}, while ${secondCategory.category} shows ${secondCategory.total} features under ${secondCategory.leader} leadership, revealing how OEMs align category investments with business model strategies

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

  return `Generate exactly 3 strategic insights for ${oem} Vehicle Segment Analysis in ${country || 'global market'} focusing on ranking and lighthouse feature analysis.

OEM COMPETITIVE ANALYSIS CONTEXT:
• OEM: ${oem}
• Market: ${country || 'Global'}
• Market Position: #${marketPosition} of ${totalOEMs} OEMs
• ${oem} Available Features: ${selectedOEMData?.features || 0}
• Market Leader: ${topOEM} with ${topOEMFeatures} features
• Second Leader: ${secondOEM} with ${secondOEMFeatures} features
• ${oem} Lighthouse Features: ${selectedOEMData?.lighthouseRate || 0}
• Top OEM Lighthouse: ${topOEMLighthouse}
• Second OEM Lighthouse: ${secondOEMLighthouse}
• Performance Level: ${performanceLevel}
• Feature Gap vs Market Average: ${featureGap > 0 ? '+' : ''}${featureGap}

IMPORTANT: Focus on ranking analysis and lighthouse feature comparison using absolute counts, not percentages.

GENERATE EXACTLY 3 STRATEGIC INSIGHTS:

1. Market Ranking Analysis - ${oem} ranks #${marketPosition} in ${country || 'the market'} with ${selectedOEMData?.features || 0} available features, ${featureGap > 0 ? `exceeding market average by ${featureGap} features showing strong competitive positioning` : `trailing market leaders by ${Math.abs(featureGap)} features, indicating opportunity for feature expansion in key categories like ${topCategory}`}

2. Lighthouse Feature Leadership - ${oem} offers ${selectedOEMData?.lighthouseRate || 0} lighthouse features compared to market leader ${topOEM} with ${topOEMLighthouse} lighthouse features, ${lighthouseGap >= 0 ? `positioning them as premium innovation leaders` : `revealing opportunity to enhance premium feature portfolio and differentiation strategy`} in ${country || 'target market'}

3. Competitive Positioning Strategy - ${oem}'s ${performanceLevel} market position with ${selectedOEMData?.features || 0} features shows ${isTopTier ? `strong competitive advantage and market leadership potential` : isMidTier ? `solid foundation for growth with focused feature development needed` : `significant growth opportunity through strategic feature expansion and lighthouse innovation`} compared to top performers in ${country}

Each insight should provide specific ranking and lighthouse feature analysis using absolute feature counts. Respond with ONLY a JSON array of exactly 3 strings.`;
}
