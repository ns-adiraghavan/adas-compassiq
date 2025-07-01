import { Loader2 } from "lucide-react"
import { ContextData } from "../types"

interface LoadingStateProps {
  contextData?: ContextData
  showOEMInsights: boolean
}

export function LoadingState({ contextData, showOEMInsights }: LoadingStateProps) {
  const analysisType = contextData?.analysisType
  let loadingText = 'Analyzing data...'
  
  switch (analysisType) {
    case 'landscape-analysis': loadingText = 'Analyzing landscape positioning...'; break
    case 'business-model-analysis': loadingText = 'Analyzing business model patterns...'; break
    case 'category-analysis': loadingText = 'Analyzing category distribution...'; break
    case 'vehicle-segment-analysis': loadingText = 'Analyzing vehicle segment data...'; break
    case 'insights-analysis': loadingText = 'Analyzing feature overlaps...'; break
    default: loadingText = showOEMInsights ? 'Analyzing OEM performance...' : 'Analyzing market landscape...'
  }
  
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
      <span className="text-white/60">{loadingText}</span>
    </div>
  )
}