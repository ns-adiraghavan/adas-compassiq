// Feedback handling utilities
export async function getFeedbackData(supabase: any, feedbackContext: any): Promise<any[]> {
  const { data: feedbackData } = await supabase
    .from('strategic_insights_feedback')
    .select('insight_text, feedback_type')
    .eq('context_info->selectedCountry', feedbackContext.selectedCountry)
    .eq('context_info->analysisType', feedbackContext.analysisType)
    .order('created_at', { ascending: false })
    .limit(50);
  
  console.log('=== Feedback Data Retrieved ===')
  console.log(`Found ${feedbackData?.length || 0} feedback entries for ${feedbackContext.analysisType}`)
  
  return feedbackData || [];
}