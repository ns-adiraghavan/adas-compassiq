
// Prompt generation utilities
export function createVehicleSegmentInsightsPrompt(
  oem: string, 
  country: string, 
  dashboardMetrics: any, 
  isMarketOverview: boolean
): string {
  const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'Unknown';
  const secondCategory = dashboardMetrics.topCategories?.[1]?.name || 'Unknown';
  const thirdCategory = dashboardMetrics.topCategories?.[2]?.name || 'Unknown';
  const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
  const subscriptionRate = Math.round((dashboardMetrics.subscriptionFeatures / dashboardMetrics.totalFeatures) * 100);
  const freeRate = Math.round((dashboardMetrics.freeFeatures / dashboardMetrics.totalFeatures) * 100);
  
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
      lighthouseRate, 
      subscriptionRate, 
      freeRate, 
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
    topCategory, 
    lighthouseRate
  );
}

function createMarketOverviewPrompt(
  country: string,
  dashboardMetrics: any,
  topCategory: string,
  secondCategory: string,
  thirdCategory: string,
  lighthouseRate: number,
  subscriptionRate: number,
  freeRate: number,
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
• Lighthouse Adoption: ${lighthouseRate}% across all segments
• Business Model Split: ${subscriptionRate}% Subscription, ${freeRate}% Free

GENERATE EXACTLY 3 COMPARATIVE INSIGHTS:

1. Segment Leadership Analysis - ${topOEM} dominates ${country || 'the market'} with ${topOEMFeatures} features across vehicle segments, outpacing ${secondOEM} by ${topOEMFeatures - secondOEMFeatures} features, particularly strong in ${topCategory} category

2. Category Distribution Comparison - ${topCategory} emerges as the most competitive category with ${dashboardMetrics.topCategories?.[0]?.value || 0} features, followed by ${secondCategory} (${dashboardMetrics.topCategories?.[1]?.value || 0}), indicating OEMs prioritize customer experience and technology differentiation

3. Lighthouse Feature Penetration - With ${lighthouseRate}% lighthouse feature adoption across segments in ${country || 'the market'}, leading OEMs are setting premium standards that define customer expectations for next-generation automotive experiences

Each insight should focus on comparative analysis between OEMs and segments. Respond with ONLY a JSON array of exactly 3 strings.`;
}

function createOEMSpecificPrompt(
  oem: string,
  country: string,
  dashboardMetrics: any,
  topCategory: string,
  lighthouseRate: number
): string {
  const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
  const marketAverage = dashboardMetrics.competitiveAnalysis?.marketAverage;
  const marketPosition = dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A';
  
  // Calculate competitive gaps
  const featureGap = (selectedOEMData?.features || 0) - (marketAverage?.features || 0);
  const lighthouseGap = (selectedOEMData?.lighthouseRate || 0) - (marketAverage?.lighthouseRate || 0);
  const subscriptionGap = (selectedOEMData?.subscriptionRate || 0) - (marketAverage?.subscriptionRate || 0);

  return `Generate exactly 3 strategic insights for ${oem} Vehicle Segment Analysis in ${country || 'global market'} with competitive comparisons.

OEM COMPETITIVE ANALYSIS CONTEXT:
• OEM: ${oem}
• Market: ${country || 'Global'}
• Market Position: #${marketPosition} of ${dashboardMetrics.totalOEMs} OEMs
• ${oem} Features: ${selectedOEMData?.features || 0} vs Market Average ${marketAverage?.features || 0} (${featureGap > 0 ? '+' : ''}${featureGap} difference)
• ${oem} Lighthouse Rate: ${selectedOEMData?.lighthouseRate || 0}% vs Market ${marketAverage?.lighthouseRate || 0}% (${lighthouseGap > 0 ? '+' : ''}${lighthouseGap}pp difference)
• ${oem} Subscription Rate: ${selectedOEMData?.subscriptionRate || 0}% vs Market ${marketAverage?.subscriptionRate || 0}% (${subscriptionGap > 0 ? '+' : ''}${subscriptionGap}pp difference)
• Leading Market Category: ${topCategory} (${dashboardMetrics.topCategories?.[0]?.value || 0} total features)

GENERATE EXACTLY 3 COMPETITIVE INSIGHTS:

1. Segment Positioning Analysis - ${oem} ranks #${marketPosition} in ${country || 'the market'} with ${selectedOEMData?.features || 0} features, ${featureGap > 0 ? 'leading market average by ' + featureGap + ' features' : 'trailing market average by ' + Math.abs(featureGap) + ' features'}, particularly ${featureGap > 0 ? 'strong' : 'developing'} in competitive segments

2. Lighthouse Feature Strategy - ${oem}'s ${selectedOEMData?.lighthouseRate || 0}% lighthouse adoption ${lighthouseGap > 0 ? 'exceeds' : 'lags'} market benchmark of ${marketAverage?.lighthouseRate || 0}%, ${lighthouseGap > 0 ? 'positioning them as innovation leaders' : 'indicating opportunity to enhance premium feature leadership'} across vehicle segments

3. Revenue Model Comparison - ${oem}'s ${selectedOEMData?.subscriptionRate || 0}% subscription strategy ${subscriptionGap > 0 ? 'outpaces' : 'trails'} market trend of ${marketAverage?.subscriptionRate || 0}%, ${subscriptionGap > 0 ? 'capitalizing on' : 'potentially missing'} monetization opportunities in ${country || 'target'} automotive segments

Each insight should provide specific competitive comparisons. Respond with ONLY a JSON array of exactly 3 strings.`;
}
