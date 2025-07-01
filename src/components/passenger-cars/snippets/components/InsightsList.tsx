import { InsightItem } from "./InsightItem"
import { ContextData } from "../types"

interface InsightsListProps {
  insights: string[]
  contextData?: ContextData
  selectedOEM: string
  selectedCountry: string
  onFeedback: (insight: string, feedbackType: 'like' | 'dislike') => void
  getFeedbackState: (insight: string, context: any) => string | null
  submittingFeedback: boolean
  getIcon: () => JSX.Element
}

export function InsightsList({
  insights,
  contextData,
  selectedOEM,
  selectedCountry,
  onFeedback,
  getFeedbackState,
  submittingFeedback,
  getIcon
}: InsightsListProps) {
  return (
    <div className="space-y-3">
      {insights.map((insight: string, index: number) => (
        <InsightItem
          key={index}
          insight={insight}
          index={index}
          contextData={contextData}
          selectedOEM={selectedOEM}
          selectedCountry={selectedCountry}
          onFeedback={onFeedback}
          getFeedbackState={getFeedbackState}
          submittingFeedback={submittingFeedback}
          getIcon={getIcon}
        />
      ))}
    </div>
  )
}