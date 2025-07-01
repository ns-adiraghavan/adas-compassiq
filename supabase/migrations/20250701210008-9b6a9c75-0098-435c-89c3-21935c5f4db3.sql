-- Create table for strategic insights feedback
CREATE TABLE public.strategic_insights_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_text TEXT NOT NULL,
  insight_hash TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('like', 'dislike')),
  context_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.strategic_insights_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Public can view feedback" 
ON public.strategic_insights_feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Public can submit feedback" 
ON public.strategic_insights_feedback 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance on queries
CREATE INDEX idx_strategic_insights_feedback_hash ON public.strategic_insights_feedback(insight_hash);
CREATE INDEX idx_strategic_insights_feedback_context ON public.strategic_insights_feedback USING GIN(context_info);