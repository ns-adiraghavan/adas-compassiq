// Feedback context utilities
export function createFeedbackContext(feedbackData?: any[]): string {
  if (!feedbackData || feedbackData.length === 0) {
    return '';
  }

  const dislikedInsights = feedbackData
    .filter(f => f.feedback_type === 'dislike')
    .map(f => f.insight_text)
    .slice(0, 5); // Limit to recent 5 dislikes

  const likedInsights = feedbackData
    .filter(f => f.feedback_type === 'like')
    .map(f => f.insight_text)
    .slice(0, 3); // Include 3 liked patterns

  let feedbackContext = '\n\nFEEDBACK CONTEXT:\n';
  
  if (dislikedInsights.length > 0) {
    feedbackContext += `AVOID these patterns (previously disliked):\n${dislikedInsights.map((insight, i) => `- ${insight}`).join('\n')}\n`;
  }
  
  if (likedInsights.length > 0) {
    feedbackContext += `PREFERRED patterns (previously liked):\n${likedInsights.map((insight, i) => `- ${insight}`).join('\n')}\n`;
  }
  
  feedbackContext += '\nGenerate fresh insights that avoid disliked patterns and follow successful patterns.\n';
  
  return feedbackContext;
}