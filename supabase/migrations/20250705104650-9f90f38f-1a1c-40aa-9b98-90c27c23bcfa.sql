-- Create support groups table
CREATE TABLE public.support_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  group_type TEXT NOT NULL DEFAULT 'general',
  max_members INTEGER DEFAULT 20,
  created_by UUID NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support group members table
CREATE TABLE public.support_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  role TEXT NOT NULL DEFAULT 'member',
  UNIQUE(group_id, user_id)
);

-- Create support group messages table
CREATE TABLE public.support_group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_messages ENABLE ROW LEVEL SECURITY;

-- Support groups policies
CREATE POLICY "Anyone can view public support groups" 
ON public.support_groups 
FOR SELECT 
USING (is_private = false OR created_by = auth.uid() OR EXISTS (
  SELECT 1 FROM public.support_group_members 
  WHERE group_id = support_groups.id AND user_id = auth.uid() AND status = 'active'
));

CREATE POLICY "Admins and NGOs can create support groups" 
ON public.support_groups 
FOR INSERT 
WITH CHECK (auth.uid() = created_by AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role IN ('admin', 'ngo')
));

CREATE POLICY "Group creators can update their groups" 
ON public.support_groups 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups" 
ON public.support_groups 
FOR DELETE 
USING (auth.uid() = created_by);

-- Support group members policies
CREATE POLICY "Users can view group members of groups they belong to" 
ON public.support_group_members 
FOR SELECT 
USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.support_group_members sgm 
  WHERE sgm.group_id = support_group_members.group_id AND sgm.user_id = auth.uid() AND sgm.status = 'active'
));

CREATE POLICY "Users can join groups" 
ON public.support_group_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
ON public.support_group_members 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own membership" 
ON public.support_group_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- Support group messages policies
CREATE POLICY "Group members can view messages" 
ON public.support_group_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.support_group_members 
  WHERE group_id = support_group_messages.group_id AND user_id = auth.uid() AND status = 'active'
));

CREATE POLICY "Group members can create messages" 
ON public.support_group_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND EXISTS (
  SELECT 1 FROM public.support_group_members 
  WHERE group_id = support_group_messages.group_id AND user_id = auth.uid() AND status = 'active'
));

-- Create update timestamp trigger
CREATE TRIGGER update_support_groups_updated_at
BEFORE UPDATE ON public.support_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();