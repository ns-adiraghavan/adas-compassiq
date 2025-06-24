
// Fallback insights generation utilities
export function generateFallbackInsights(
  isMarketOverview: boolean,
  oem: string,
  country: string,
  dashboardMetrics: any
): string[] {
  if (isMarketOverview) {
    return generateMarketOverviewFallbacks(country, dashboardMetrics);
  }
  return generateOEMFallbacks(oem, country, dashboardMetrics);
}

function generateMarketOverviewFallbacks(country: string, dashboardMetrics: any): string[] {
  const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'connectivity';
  const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
  const marketLeaders = dashboardMetrics.marketLeaders || [];
  const topOEM = marketLeaders[0]?.oem || 'Leading OEM';
  const secondOEM = marketLeaders[1]?.oem || 'Second OEM';

  return [
    `${topOEM} leads vehicle segment competition in ${country || 'the market'} with strongest feature portfolio across ${topCategory} category, setting benchmark for segment excellence`,
    `Lighthouse feature adoption at ${lighthouseRate}% indicates premium segment maturity in ${country || 'the market'}, with leading OEMs defining next-generation automotive standards`,
    `${topCategory} emerges as most competitive category with OEMs like ${topOEM} and ${secondOEM} driving innovation through comprehensive segment coverage and feature differentiation`
  ];
}

function generateOEMFallbacks(oem: string, country: string, dashboardMetrics: any): string[] {
  const selectedOEMData = dashboardMetrics.competitiveAnalysis?.selectedOEM;
  const marketPosition = dashboardMetrics.competitiveAnalysis?.marketPosition || 'N/A';
  const featureCount = selectedOEMData?.features || 0;
  const lighthouseOEMRate = selectedOEMData?.lighthouseRate || 0;
  const topCategory = dashboardMetrics.topCategories?.[0]?.name || 'connectivity';
  const lighthouseRate = Math.round((dashboardMetrics.lighthouseFeatures / dashboardMetrics.totalFeatures) * 100);
  
  return [
    `${oem} holds #${marketPosition} position in ${country || 'the market'} vehicle segments with ${featureCount} features, demonstrating ${featureCount > 100 ? 'strong' : 'developing'} competitive presence across automotive categories`,
    `${oem}'s ${lighthouseOEMRate}% lighthouse feature rate ${lighthouseOEMRate > lighthouseRate ? 'exceeds' : 'trails'} market average, ${lighthouseOEMRate > lighthouseRate ? 'establishing premium leadership' : 'indicating growth opportunity'} in segment innovation`,
    `${oem} focuses on ${topCategory} category positioning with strategic emphasis on segment-specific feature development and competitive differentiation in ${country || 'target'} automotive market`
  ];
}

export function generateEmptyDataInsights(isMarketOverview: boolean, oem: string, country: string): string[] {
  if (isMarketOverview) {
    return [
      `No segment comparison data available for analysis in ${country || 'selected region'}`,
      `Insufficient OEM competitive data found for meaningful segment insights in ${country || 'selected region'}`,
      `No lighthouse feature data available for segment leadership analysis in ${country || 'selected region'}`
    ];
  }
  
  return [
    `${oem} segment positioning data unavailable for competitive analysis in ${country || 'selected market'}`,
    `${oem} lighthouse feature performance insufficient for segment comparison in ${country || 'selected market'}`,
    `${oem} lacks sufficient segment data for competitive benchmarking in ${country || 'selected market'}`
  ];
}
