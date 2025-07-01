import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface FeedbackContext {
  selectedOEM?: string
  selectedCountry?: string
  analysisType?: string
}

export function useInsightFeedback() {
  const [submittingFeedback, setSubmittingFeedback] = useState<string | null>(null)
  const [feedbackStates, setFeedbackStates] = useState<Record<string, 'like' | 'dislike' | null>>({})

  const generateInsightHash = (insight: string, context: FeedbackContext): string => {
    const normalizedInsight = insight.toLowerCase().trim()
    const contextString = `${context.selectedOEM || ''}_${context.selectedCountry || ''}_${context.analysisType || ''}`
    return btoa(normalizedInsight + contextString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
  }

  const submitFeedback = async (
    insight: string, 
    feedbackType: 'like' | 'dislike', 
    context: FeedbackContext
  ) => {
    const insightHash = generateInsightHash(insight, context)
    setSubmittingFeedback(insightHash)

    try {
      const { error } = await supabase
        .from('strategic_insights_feedback')
        .insert({
          insight_text: insight,
          insight_hash: insightHash,
          feedback_type: feedbackType,
          context_info: {
            selectedOEM: context.selectedOEM,
            selectedCountry: context.selectedCountry,
            analysisType: context.analysisType,
            timestamp: new Date().toISOString()
          }
        })

      if (error) {
        console.error('Error submitting feedback:', error)
        toast.error('Failed to submit feedback')
        return
      }

      setFeedbackStates(prev => ({
        ...prev,
        [insightHash]: feedbackType
      }))

      toast.success(`Feedback ${feedbackType === 'like' ? '👍' : '👎'} submitted`)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback')
    } finally {
      setSubmittingFeedback(null)
    }
  }

  const getFeedbackState = (insight: string, context: FeedbackContext): 'like' | 'dislike' | null => {
    const insightHash = generateInsightHash(insight, context)
    return feedbackStates[insightHash] || null
  }

  return {
    submitFeedback,
    getFeedbackState,
    submittingFeedback
  }
}