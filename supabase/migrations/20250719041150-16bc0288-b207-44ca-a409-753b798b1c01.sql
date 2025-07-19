
-- Update the donations table to support tiered subscriptions
ALTER TABLE public.donations 
ADD COLUMN tier INTEGER,
ADD COLUMN benefits_status TEXT DEFAULT 'pending',
ADD COLUMN subscription_type TEXT DEFAULT 'support';

-- Update the payment_method default to razorpay
ALTER TABLE public.donations 
ALTER COLUMN payment_method SET DEFAULT 'razorpay';

-- Add a comment to clarify the table's new purpose
COMMENT ON TABLE public.donations IS 'Support subscriptions and payments for Fortitude Network platform';
