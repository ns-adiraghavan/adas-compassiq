-- Enable Row Level Security on all ADAS tables
ALTER TABLE public.adas_onboard_compute_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adas_collaboration_network ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adas_future_focused_tech ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adas_sensing_architecture ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adas_software ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adas_current_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adas_comms_and_positioning_tech ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adas_future_blueprint ENABLE ROW LEVEL SECURITY;

-- Create public SELECT policies for all ADAS tables
CREATE POLICY "Public can view onboard compute systems"
ON public.adas_onboard_compute_systems
FOR SELECT
USING (true);

CREATE POLICY "Public can view collaboration network"
ON public.adas_collaboration_network
FOR SELECT
USING (true);

CREATE POLICY "Public can view future focused tech"
ON public.adas_future_focused_tech
FOR SELECT
USING (true);

CREATE POLICY "Public can view sensing architecture"
ON public.adas_sensing_architecture
FOR SELECT
USING (true);

CREATE POLICY "Public can view software"
ON public.adas_software
FOR SELECT
USING (true);

CREATE POLICY "Public can view current snapshot"
ON public.adas_current_snapshot
FOR SELECT
USING (true);

CREATE POLICY "Public can view comms and positioning tech"
ON public.adas_comms_and_positioning_tech
FOR SELECT
USING (true);

CREATE POLICY "Public can view future blueprint"
ON public.adas_future_blueprint
FOR SELECT
USING (true);