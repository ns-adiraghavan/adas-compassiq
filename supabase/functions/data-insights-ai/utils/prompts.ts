import { createVehicleSegmentAnalysisPrompt, createInsightsAnalysisPrompt } from './vehicle-segment-prompts.ts';
import { createLandscapeAnalysisPrompt } from './landscape-prompts.ts';
import { createBusinessModelAnalysisPrompt } from './business-model-prompts.ts';
import { createCategoryAnalysisPrompt } from './category-prompts.ts';
import { createMarketOverviewPrompt, createOEMSpecificPrompt } from './market-prompts.ts';

export function createVehicleSegmentInsightsPrompt(
  oem: string, 
  country: string, 
  dashboardMetrics: any, 
  isMarketOverview: boolean,
  analysisType?: string,
  contextData?: any,
  feedbackData?: any[]
): string {
  console.log('Creating prompt for analysis type:', analysisType)
  
  // Handle Landscape Analysis context
  if (analysisType === "landscape-analysis" && contextData) {
    return createLandscapeAnalysisPrompt(country, contextData, feedbackData);
  }

  // Handle Business Model Analysis context
  if (analysisType === "business-model-analysis" && contextData) {
    return createBusinessModelAnalysisPrompt(country, contextData, feedbackData);
  }

  // Handle Category Analysis context
  if (analysisType === "category-analysis" && contextData) {
    return createCategoryAnalysisPrompt(country, contextData, feedbackData);
  }
  
  // Handle Vehicle Segment Analysis context
  if (analysisType === "vehicle-segment-analysis" && contextData) {
    return createVehicleSegmentAnalysisPrompt(country, contextData, feedbackData);
  }
  
  // Handle Insights/Venn Diagram Analysis context
  if (analysisType === "insights-analysis" && contextData) {
    return createInsightsAnalysisPrompt(country, contextData, feedbackData);
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