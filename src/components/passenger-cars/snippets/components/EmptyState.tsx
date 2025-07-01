import { ContextData } from "../types"

interface EmptyStateProps {
  contextData?: ContextData
  selectedCountry: string
}

export function EmptyState({ contextData, selectedCountry }: EmptyStateProps) {
  if (!contextData) {
    return (
      <div className="py-4">
        <p className="text-white/60 text-sm">No analysis context available</p>
        <p className="text-white/40 text-xs mt-1">
          Select OEMs and ensure data is loaded to view strategic insights
        </p>
      </div>
    )
  }

  const analysisType = contextData?.analysisType
  let noDataText = 'No insights available for current selection'
  let helpText = selectedCountry ? `No data found for ${selectedCountry}` : 'Select a country to view analysis'
  
  switch (analysisType) {
    case 'landscape-analysis':
      noDataText = 'No landscape insights available'
      helpText = 'Ensure OEM is selected and data is available'
      break
    case 'business-model-analysis':
      noDataText = 'No business model insights available'
      helpText = 'Select OEMs to analyze business model patterns'
      break
    case 'category-analysis':
      noDataText = 'No category insights available'
      helpText = 'Select OEMs to analyze category distribution'
      break
    case 'vehicle-segment-analysis':
      noDataText = 'No vehicle segment insights available'
      helpText = 'Select OEMs and country for segment analysis'
      break
    case 'insights-analysis':
      noDataText = 'No feature overlap insights available'
      helpText = 'Select multiple OEMs to analyze feature overlaps'
      break
  }
  
  return (
    <div className="py-4">
      <p className="text-white/60 text-sm">{noDataText}</p>
      <p className="text-white/40 text-xs mt-1">{helpText}</p>
    </div>
  )
}