-- Insert a large donation entry with proper numeric constraints
-- 20 lakh (2 million) which is still a significant amount
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
  2000000.00, -- 20 lakh
  'INR',
  'Anonymous Philanthropist', 
  'donor@foundation.org',
  'Supporting cancer patients and their families in India. Together we can make a difference.',
  'completed',
  'bank_transfer',
  true,
  now() - interval '1 week'
);

-- Add more donations to build up the total
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
) VALUES 
(
  5000000.00, -- 50 lakh
  'INR',
  'Delhi Cancer Care Foundation',
  'care@foundation.org', 
  'Major contribution for cancer research and patient support programs.',
  'completed',
  'bank_transfer',
  false,
  now() - interval '2 weeks'
),
(
  1500000.00, -- 15 lakh
  'INR',
  'Mumbai Charitable Trust',
  'trust@mumbai.org',
  'Donation for treatment support and medication assistance.',
  'completed',
  'cheque',
  false,
  now() - interval '3 weeks'
),
(
  3000000.00, -- 30 lakh
  'INR',
  'Bangalore Tech Community',
  'tech@bangalore.com',
  'Collective donation from tech community for cancer awareness programs.',
  'completed',
  'online_transfer',
  false,
  now() - interval '1 month'
);

-- Update community stats to reflect total donations
UPDATE community_stats 
SET 
  total_donations = (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE status = 'completed'),
  updated_at = now();