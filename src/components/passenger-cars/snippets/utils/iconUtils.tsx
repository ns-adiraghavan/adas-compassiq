import { TrendingUp, Grid, BarChart, Lightbulb } from "lucide-react"
import { ContextData } from "../types"

export function getIcon(
  contextData?: ContextData, 
  businessModelAnalysisContext?: any, 
  showOEMInsights?: boolean
): JSX.Element {
  if (contextData?.analysisType === 'landscape-analysis') {
    return <TrendingUp className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
  }
  if (businessModelAnalysisContext?.analysisType === 'category-analysis') {
    return <Grid className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
  }
  if (businessModelAnalysisContext?.analysisType === 'business-model-analysis') {
    return <BarChart className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
  }
  if (showOEMInsights) {
    return <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
  }
  return <TrendingUp className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
}