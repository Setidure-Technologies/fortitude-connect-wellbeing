-- Insert donation of 251,250 rupees
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
  251250.00, -- 2,51,250 rupees
  'INR',
  'Rajesh Kumar',
  'rajesh.kumar@email.com',
  'Donation for cancer patients treatment support. Every small contribution counts.',
  'completed',
  'upi',
  false,
  now() - interval '2 days'
);

-- Update community stats to include the new donation
UPDATE community_stats 
SET 
  total_donations = (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE status = 'completed'),
  updated_at = now();