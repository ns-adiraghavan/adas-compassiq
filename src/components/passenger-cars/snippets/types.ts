export interface DataSnippetsProps {
  selectedOEM: string
  selectedCountry: string
  oemClickedFromChart?: boolean
  businessModelAnalysisContext?: any // Business model or category analysis context
}

export interface ContextData {
  analysisType: string
  selectedOEM?: string
  selectedCountry?: string
  selectedOEMs?: string[]
  totalFeatures?: number
  ranking?: any
  topCategories?: any[]
  businessModelComparison?: any[]
  categoryBreakdown?: any[]
}

export interface FeedbackProps {
  insight: string
  index: number
  contextData?: ContextData
  selectedOEM: string
  selectedCountry: string
  onFeedback: (insight: string, feedbackType: 'like' | 'dislike') => void
  getFeedbackState: (insight: string, context: any) => string | null
  submittingFeedback: boolean
  getIcon: () => JSX.Element
}