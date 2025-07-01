import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { FeedbackProps } from "../types"

export function InsightItem({
  insight,
  index,
  contextData,
  selectedOEM,
  selectedCountry,
  onFeedback,
  getFeedbackState,
  submittingFeedback,
  getIcon
}: FeedbackProps) {
  const feedbackState = getFeedbackState(insight, {
    selectedOEM: contextData?.selectedOEM || selectedOEM,
    selectedCountry: contextData?.selectedCountry || selectedCountry,
    analysisType: contextData?.analysisType || 'general'
  })

  return (
    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
      {getIcon()}
      <p className="text-white text-sm leading-relaxed flex-1">
        {insight}
      </p>
      <div className="flex items-center space-x-1 ml-2">
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 hover:bg-green-500/20 ${
            feedbackState === 'like' 
              ? 'bg-green-500/30 text-green-400' 
              : 'text-gray-400 hover:text-green-400'
          }`}
          onClick={() => onFeedback(insight, 'like')}
          disabled={submittingFeedback}
        >
          <ThumbsUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 hover:bg-red-500/20 ${
            feedbackState === 'dislike' 
              ? 'bg-red-500/30 text-red-400' 
              : 'text-gray-400 hover:text-red-400'
          }`}
          onClick={() => onFeedback(insight, 'dislike')}
          disabled={submittingFeedback}
        >
          <ThumbsDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}