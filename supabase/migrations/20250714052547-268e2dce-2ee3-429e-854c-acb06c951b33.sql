-- Insert a large donation to reflect on home page statistics
INSERT INTO donations (
  amount, 
  currency, 
  donor_name, 
  donor_email, 
  message, 
  status, 
  payment_method, 
  is_anonymous, 
  created_at
) VALUES (
  2000000000, -- 200,000 lakh = 20 crores
  'INR',
  'Anonymous Philanthropist',
  'donor@foundation.org',
  'Supporting cancer patients and their families in India. Together we can make a difference.',
  'completed',
  'bank_transfer',
  true,
  now() - interval '1 week'
);

-- Update community stats to reflect the donation impact
UPDATE community_stats 
SET 
  total_donations = total_donations + 2000000000,
  updated_at = now()
WHERE id IS NOT NULL;