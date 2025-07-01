export function createMarketOverviewPrompt(
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

  return `You are a senior automotive market analyst. Generate exactly 3 strategic insights for Market Overview in ${country || 'Global'}. Each insight must be 15-20 words maximum and provide actionable market intelligence.

VERIFIED MARKET DATA:
- Geographic Market: ${country || 'Global'} automotive technology landscape
- Market Leader: ${topOEM || 'Unknown'} (${topOEMFeatures || 0} features, ${topOEMShare}% market share)
- Second Player: ${secondOEM || 'Unknown'} (${secondOEMFeatures || 0} features, ${secondOEMShare}% share)
- Dominant Category: ${topCategory || 'Unknown'} (${topCategoryFeatures} implementations)
- Secondary Category: ${secondCategory || 'Unknown'} (${secondCategoryFeatures} implementations)
- Innovation Index: ${totalLighthouseFeatures} lighthouse features (${lighthouseRate}% of total market)
- Total Market Size: ${totalMarketFeatures} connected features deployed

GENERATE EXACTLY 3 INSIGHTS (15-20 words each):

1. Market Leadership: [${topOEM} dominates with ${topOEMFeatures} features (${topOEMShare}%) vs ${secondOEM} ${secondOEMFeatures} features (${secondOEMShare}%)]

2. Regional Maturity: [${country || 'Global'} shows ${totalMarketFeatures} deployed features with ${topCategory} category leading market development]

3. Innovation Index: [Market achieves ${totalLighthouseFeatures} lighthouse features representing ${lighthouseRate}% innovation rate across OEM portfolios]

Requirements:
- Use exact numbers and percentages from verified data
- Each insight must be 15-20 words maximum
- Focus on competitive positioning and market dynamics
- Professional analytical tone

Respond with ONLY a JSON array of exactly 3 strings.`;
}

export function createOEMSpecificPrompt(
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

  return `Generate exactly 3 strategic insights for ${oem} analysis in ${country || 'global market'}. Each insight must be 15-20 words maximum.

CRITICAL: Use ONLY these exact OEMs and numbers provided below. Do NOT reference Ford, Toyota, or any OEM not listed:

ACTUAL DATA CONTEXT:
- Analyzed OEM: ${oem}
- Market Rank: #${marketPosition} of ${totalOEMs} OEMs
- Available Features: ${selectedOEMData?.features || 0}
- Lighthouse Features: ${selectedOEMData?.lighthouseRate || 0}
- Top Market OEM: ${topOEM || 'Unknown'} with ${topOEMLighthouse || 0} lighthouse features

GENERATE 3 INSIGHTS using ONLY the data above (15-20 words each):

1. Market Position: [${oem} ranks #${marketPosition} with ${selectedOEMData?.features || 0} features among ${totalOEMs} competitors in ${country || 'market'}]

2. Feature Portfolio: [${oem} achieves ${selectedOEMData?.lighthouseRate || 0}% lighthouse rate showing ${performanceLevel} innovation capabilities]

3. Competitive Gap: [${oem} needs ${Math.abs(featureGap)} additional features to match market average performance levels]

Use exact numbers only. Do NOT mention any OEMs not provided in the data context above.
Respond with ONLY a JSON array of exactly 3 strings.`;
}