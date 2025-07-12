-- Populate awareness_stats with sample data
INSERT INTO public.awareness_stats (stat_key, stat_value, stat_description, display_order, source) VALUES
('global_cancer_cases', '20 million', 'New cancer cases globally in 2024', 1, 'WHO Global Cancer Observatory'),
('survival_rate_improvement', '75%', 'Five-year survival rate for all cancers combined', 2, 'American Cancer Society'),
('early_detection_impact', '90%', 'Survival rate when cancer is detected early', 3, 'National Cancer Institute'),
('community_support_effectiveness', '65%', 'Improvement in treatment outcomes with community support', 4, 'Journal of Cancer Survivorship')
ON CONFLICT (stat_key) DO UPDATE SET
  stat_value = EXCLUDED.stat_value,
  stat_description = EXCLUDED.stat_description;

-- Populate daily_questions with sample questions
INSERT INTO public.daily_questions (question, question_type, featured_date, options) VALUES
('How are you feeling today on your cancer journey?', 'mood', CURRENT_DATE, '["Hopeful", "Anxious", "Grateful", "Overwhelmed", "Strong"]'),
('What''s one thing you''re grateful for today?', 'open', CURRENT_DATE + INTERVAL '1 day', null),
('How do you prefer to connect with others in the community?', 'multiple_choice', CURRENT_DATE + INTERVAL '2 days', '["Online chat", "Video calls", "In-person meetups", "Support groups", "One-on-one conversations"]'),
('What type of support do you find most helpful?', 'multiple_choice', CURRENT_DATE + INTERVAL '3 days', '["Emotional support", "Practical advice", "Medical information", "Financial guidance", "Social connection"]')
ON CONFLICT (featured_date) DO UPDATE SET
  question = EXCLUDED.question,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options;

-- Update community stats with current data
INSERT INTO public.community_stats (id, total_members, total_stories, total_events, total_donations) VALUES
('default', 1250, 89, 24, 15750.00)
ON CONFLICT (id) DO UPDATE SET
  total_members = EXCLUDED.total_members,
  total_stories = EXCLUDED.total_stories,
  total_events = EXCLUDED.total_events,
  total_donations = EXCLUDED.total_donations;