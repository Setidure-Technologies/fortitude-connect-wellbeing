
-- Create private_messages table for user-to-user messaging
CREATE TABLE public.private_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read boolean NOT NULL DEFAULT false
);

-- Enable RLS on private_messages
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for private messages
CREATE POLICY "Users can view their own messages" 
  ON public.private_messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
  ON public.private_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Create connections table for user-to-user connections
CREATE TABLE public.user_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid REFERENCES public.profiles(id) NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);

-- Enable RLS on user_connections
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for user connections
CREATE POLICY "Users can view their own connections" 
  ON public.user_connections 
  FOR SELECT 
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connection requests" 
  ON public.user_connections 
  FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their connection status" 
  ON public.user_connections 
  FOR UPDATE 
  USING (auth.uid() = receiver_id OR auth.uid() = requester_id);

-- Add ngo role to user_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE t.typname = 'user_role' AND e.enumlabel = 'ngo'
    ) THEN
        ALTER TYPE user_role ADD VALUE 'ngo';
    END IF;
END $$;
