import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ChatFeedbackContext {
  currentSection?: string
  selectedCountry?: string
  messageId?: string
}

interface FeedbackDetails {
  category: string
  description: string
}

export function useChatFeedback() {
  const [submittingFeedback, setSubmittingFeedback] = useState<string | null>(null)
  const [feedbackStates, setFeedbackStates] = useState<Record<string, 'like' | 'dislike' | null>>({})
  const [showFeedbackDialog, setShowFeedbackDialog] = useState<string | null>(null)

  const generateMessageHash = (message: string, context: ChatFeedbackContext): string => {
    const normalizedMessage = message.toLowerCase().trim()
    const contextString = `${context.currentSection || ''}_${context.selectedCountry || ''}_${context.messageId || ''}`
    const textToHash = normalizedMessage + contextString
    let hash = 0
    for (let i = 0; i < textToHash.length; i++) {
      const char = textToHash.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 16)
  }

  const submitFeedback = async (
    message: string, 
    feedbackType: 'like' | 'dislike', 
    context: ChatFeedbackContext,
    feedbackDetails?: FeedbackDetails
  ) => {
    const messageHash = generateMessageHash(message, context)
    setSubmittingFeedback(messageHash)

    try {
      const { error } = await supabase
        .from('strategic_insights_feedback')
        .insert({
          insight_text: message,
          insight_hash: messageHash,
          feedback_type: feedbackType,
          context_info: {
            currentSection: context.currentSection,
            selectedCountry: context.selectedCountry,
            messageId: context.messageId,
            analysisType: 'chat-ai-response',
            feedbackDetails: feedbackDetails ? {
              category: feedbackDetails.category,
              description: feedbackDetails.description
            } : null,
            timestamp: new Date().toISOString()
          } as any
        })

      if (error) {
        console.error('Error submitting feedback:', error)
        toast.error('Failed to submit feedback')
        return
      }

      setFeedbackStates(prev => ({
        ...prev,
        [messageHash]: feedbackType
      }))

      if (feedbackType === 'like') {
        toast.success('👍 Thank you for your feedback!')
      } else {
        toast.success('👎 Feedback submitted. We\'ll work to improve!')
      }
      
      setShowFeedbackDialog(null)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback')
    } finally {
      setSubmittingFeedback(null)
    }
  }

  const getFeedbackState = (message: string, context: ChatFeedbackContext): 'like' | 'dislike' | null => {
    const messageHash = generateMessageHash(message, context)
    return feedbackStates[messageHash] || null
  }

  const handleDislikeFeedback = (messageId: string) => {
    setShowFeedbackDialog(messageId)
  }

  return {
    submitFeedback,
    getFeedbackState,
    submittingFeedback,
    showFeedbackDialog,
    setShowFeedbackDialog,
    handleDislikeFeedback
  }
}