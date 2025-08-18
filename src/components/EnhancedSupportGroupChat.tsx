import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Heart, ThumbsUp, Smile, MoreVertical, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isYesterday } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedSupportGroupChatProps {
  groupId: string;
  groupName: string;
}

interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  has_attachments: boolean;
  profiles?: {
    full_name: string;
    profile_image_url?: string;
    role: string;
  };
  support_group_message_reactions?: MessageReaction[];
}

interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export const EnhancedSupportGroupChat: React.FC<EnhancedSupportGroupChatProps> = ({
  groupId,
  groupName
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch group messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['support-group-messages', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_group_messages')
        .select(`
          *,
          support_group_message_reactions (*)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch user profiles separately
      const userIds = [...new Set(data?.map(m => m.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, profile_image_url, role')
        .in('id', userIds);

      // Map profiles to messages
      const messagesWithProfiles = data?.map(message => ({
        ...message,
        profiles: profiles?.find(p => p.id === message.user_id),
      }));

      return messagesWithProfiles as GroupMessage[];
    },
    enabled: !!groupId,
    refetchInterval: 3000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, hasAttachments }: {
      content: string;
      hasAttachments: boolean;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('support_group_messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          message: content,
          has_attachments: hasAttachments,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-group-messages', groupId] });
      setMessage('');
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // React to message mutation
  const reactToMessageMutation = useMutation({
    mutationFn: async ({ messageId, reactionType }: {
      messageId: string;
      reactionType: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Check if user already reacted with this type
      const existingReaction = messages
        .find(m => m.id === messageId)?.support_group_message_reactions
        ?.find(r => r.user_id === user.id && r.reaction_type === reactionType);

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('support_group_message_reactions')
          .delete()
          .eq('id', existingReaction.id);
        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase
          .from('support_group_message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction_type: reactionType,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-group-messages', groupId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to react',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !selectedFile) return;

    // TODO: Handle file upload to storage and create file_attachments record
    const hasAttachments = !!selectedFile;

    sendMessageMutation.mutate({
      content: message.trim(),
      hasAttachments,
    });
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Format message date
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM d, HH:mm');
    }
  };

  // Get reaction count
  const getReactionCount = (reactions: MessageReaction[] = [], type: string) => {
    return reactions.filter(r => r.reaction_type === type).length;
  };

  // Check if user reacted
  const hasUserReacted = (reactions: MessageReaction[] = [], type: string) => {
    return reactions.some(r => r.user_id === user?.id && r.reaction_type === type);
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('support-group-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_group_messages',
          filter: `group_id=eq.${groupId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['support-group-messages', groupId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_group_message_reactions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['support-group-messages', groupId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, queryClient]);

  const renderMessage = (msg: GroupMessage) => {
    const isOwnMessage = msg.user_id === user?.id;

    return (
      <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-start space-x-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={msg.profiles?.profile_image_url} alt={msg.profiles?.full_name} />
            <AvatarFallback>
              {msg.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
              <span className="text-sm font-medium">
                {isOwnMessage ? 'You' : msg.profiles?.full_name || 'Unknown User'}
              </span>
              <Badge variant="secondary" className="text-xs">
                {msg.profiles?.role || 'member'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatMessageDate(msg.created_at)}
              </span>
            </div>
            
            <Card className={`${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
              <CardContent className="p-3">
                <p className="text-sm break-words">{msg.message}</p>
                
                {/* Reactions */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-1">
                    {['like', 'heart', 'smile'].map(reactionType => {
                      const count = getReactionCount(msg.support_group_message_reactions, reactionType);
                      const userReacted = hasUserReacted(msg.support_group_message_reactions, reactionType);
                      
                      if (count === 0) return null;
                      
                      return (
                        <Button
                          key={reactionType}
                          variant={userReacted ? 'default' : 'ghost'}
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => reactToMessageMutation.mutate({
                            messageId: msg.id,
                            reactionType
                          })}
                        >
                          {reactionType === 'like' && <ThumbsUp className="w-3 h-3" />}
                          {reactionType === 'heart' && <Heart className="w-3 h-3" />}
                          {reactionType === 'smile' && <Smile className="w-3 h-3" />}
                          <span className="ml-1 text-xs">{count}</span>
                        </Button>
                      );
                    })}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => reactToMessageMutation.mutate({
                          messageId: msg.id,
                          reactionType: 'like'
                        })}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Like
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => reactToMessageMutation.mutate({
                          messageId: msg.id,
                          reactionType: 'heart'
                        })}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Love
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => reactToMessageMutation.mutate({
                          messageId: msg.id,
                          reactionType: 'smile'
                        })}
                      >
                        <Smile className="w-4 h-4 mr-2" />
                        Smile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <div className="w-32 h-4 bg-muted rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {groupName} Chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {selectedFile && (
          <div className="px-4 py-2 bg-muted/50 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Paperclip className="w-4 h-4" />
                <span>{selectedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <form onSubmit={handleSend} className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="resize-none"
              />
            </div>
            <div className="flex space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                disabled={(!message.trim() && !selectedFile) || sendMessageMutation.isPending}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};