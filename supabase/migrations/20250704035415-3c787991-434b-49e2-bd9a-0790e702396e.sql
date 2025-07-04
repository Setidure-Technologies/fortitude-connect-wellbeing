-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-attachments', 'chat-attachments', true);

-- Create policies for chat attachments bucket
CREATE POLICY "Authenticated users can upload chat attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'chat-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view chat attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'chat-attachments');

CREATE POLICY "Users can delete their own chat attachments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table for chat message attachments
CREATE TABLE public.chat_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_attachments
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_attachments
CREATE POLICY "Users can view their own chat attachments" 
ON public.chat_attachments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat attachments" 
ON public.chat_attachments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat attachments" 
ON public.chat_attachments 
FOR DELETE 
USING (auth.uid() = user_id);