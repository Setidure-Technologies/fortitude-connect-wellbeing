import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Paperclip, MoreVertical, Heart, Reply } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isYesterday } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedPrivateChatProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  onBack: () => void;
}

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  thread_id?: string;
  is_deleted: boolean;
  message_type: string;
  attachment_url?: string;
  parent_message_id?: string;
}

export const EnhancedPrivateChat: React.FC<EnhancedPrivateChatProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  onBack
}) => {
  const [message, setMessage] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<DirectMessage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['direct-messages', user?.id, recipientId],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as DirectMessage[];
    },
    enabled: !!user?.id && !!recipientId,
    refetchInterval: 3000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, fileUrl, messageType, parentId }: {
      content: string;
      fileUrl?: string;
      messageType?: string;
      parentId?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const messageData = {
        sender_id: user.id,
        receiver_id: recipientId,
        message: content,
        message_type: messageType || 'text',
        attachment_url: fileUrl,
        parent_message_id: parentId,
      };

      const { data, error } = await supabase
        .from('direct_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direct-messages', user?.id, recipientId] });
      setMessage('');
      setSelectedFile(null);
      setReplyToMessage(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat/${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: 'File upload failed',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !selectedFile) return;
    
    let fileUrl: string | undefined;
    let messageType = 'text';
    
    if (selectedFile) {
      fileUrl = await handleFileUpload(selectedFile) || undefined;
      messageType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
    }

    sendMessageMutation.mutate({
      content: message.trim() || (selectedFile ? selectedFile.name : ''),
      fileUrl,
      messageType,
      parentId: replyToMessage?.id,
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

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('direct-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id}))`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['direct-messages', user.id, recipientId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, recipientId, queryClient]);

  const renderMessage = (msg: DirectMessage) => {
    const isOwnMessage = msg.sender_id === user?.id;
    const repliedMessage = msg.parent_message_id 
      ? messages.find(m => m.id === msg.parent_message_id)
      : null;

    return (
      <div
        key={msg.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          {repliedMessage && (
            <div className="mb-2 text-xs text-muted-foreground bg-muted p-2 rounded-md">
              <div className="font-medium">Replying to:</div>
              <div className="truncate">{repliedMessage.message}</div>
            </div>
          )}
          
          <Card className={`${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
            <CardContent className="p-3">
              {msg.message_type === 'image' && msg.attachment_url && (
                <img
                  src={msg.attachment_url}
                  alt="Attachment"
                  className="rounded-md max-w-full h-auto mb-2"
                />
              )}
              {msg.message_type === 'file' && msg.attachment_url && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-background/10 rounded">
                  <Paperclip className="w-4 h-4" />
                  <a 
                    href={msg.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    {msg.message || 'Download file'}
                  </a>
                </div>
              )}
              {msg.message && (
                <p className="text-sm break-words">{msg.message}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {formatMessageDate(msg.created_at)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setReplyToMessage(msg)}>
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="w-4 h-4 mr-2" />
                      React
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center space-y-0 pb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3 ml-4">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            <div className="w-24 h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-3 ml-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={recipientAvatar} alt={recipientName} />
            <AvatarFallback>{recipientName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">{recipientName}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Start your conversation with {recipientName}</p>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {replyToMessage && (
          <div className="px-4 py-2 bg-muted/50 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Reply className="w-4 h-4" />
              <span>Replying to: {replyToMessage.message.slice(0, 50)}...</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyToMessage(null)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        )}

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