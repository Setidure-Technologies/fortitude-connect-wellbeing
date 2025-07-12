-- Populate awareness_stats with sample data
INSERT INTO public.awareness_stats (stat_key, stat_value, stat_description, display_order, source) 
SELECT 'global_cancer_cases', '20 million', 'New cancer cases globally in 2024', 1, 'WHO Global Cancer Observatory'
WHERE NOT EXISTS (SELECT 1 FROM public.awareness_stats WHERE stat_key = 'global_cancer_cases');

INSERT INTO public.awareness_stats (stat_key, stat_value, stat_description, display_order, source) 
SELECT 'survival_rate_improvement', '75%', 'Five-year survival rate for all cancers combined', 2, 'American Cancer Society'
WHERE NOT EXISTS (SELECT 1 FROM public.awareness_stats WHERE stat_key = 'survival_rate_improvement');

INSERT INTO public.awareness_stats (stat_key, stat_value, stat_description, display_order, source) 
SELECT 'early_detection_impact', '90%', 'Survival rate when cancer is detected early', 3, 'National Cancer Institute'
WHERE NOT EXISTS (SELECT 1 FROM public.awareness_stats WHERE stat_key = 'early_detection_impact');

INSERT INTO public.awareness_stats (stat_key, stat_value, stat_description, display_order, source) 
SELECT 'community_support_effectiveness', '65%', 'Improvement in treatment outcomes with community support', 4, 'Journal of Cancer Survivorship'
WHERE NOT EXISTS (SELECT 1 FROM public.awareness_stats WHERE stat_key = 'community_support_effectiveness');

-- Populate daily_questions with sample questions (using 'multiple_choice' for valid question type)
INSERT INTO public.daily_questions (question, question_type, featured_date, options) 
SELECT 'How are you feeling today on your cancer journey?', 'multiple_choice', CURRENT_DATE, '["Hopeful", "Anxious", "Grateful", "Overwhelmed", "Strong"]'
WHERE NOT EXISTS (SELECT 1 FROM public.daily_questions WHERE featured_date = CURRENT_DATE);

INSERT INTO public.daily_questions (question, question_type, featured_date, options) 
SELECT 'What''s one thing you''re grateful for today?', 'open', CURRENT_DATE + INTERVAL '1 day', null
WHERE NOT EXISTS (SELECT 1 FROM public.daily_questions WHERE featured_date = CURRENT_DATE + INTERVAL '1 day');

-- Update community stats
UPDATE public.community_stats SET 
  total_members = 1250,
  total_stories = 89,
  total_events = 24,
  total_donations = 15750.00
WHERE id = 'default';

-- Insert if doesn't exist
INSERT INTO public.community_stats (id, total_members, total_stories, total_events, total_donations) 
SELECT 'default', 1250, 89, 24, 15750.00
WHERE NOT EXISTS (SELECT 1 FROM public.community_stats WHERE id = 'default');