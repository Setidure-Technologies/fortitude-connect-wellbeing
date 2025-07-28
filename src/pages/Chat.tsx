import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, MessageSquare, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VoiceRecorder } from '@/components/chat/VoiceRecorder';
import { FileUploader } from '@/components/chat/FileUploader';
import { FileInfo } from '@/hooks/useFileUpload';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const predefinedMessages = [
  "I just got diagnosed and I'm feeling overwhelmed",
  "I need support preparing for surgery",
  "How do I manage treatment side effects?",
  "I want to connect with other survivors",
  "Can you help me understand my treatment options?"
];

// Helper function to extract response text from various n8n response formats
const extractResponseText = (jsonResponse: any): string => {
  // Handle array responses
  if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
    const first = jsonResponse[0];
    if (first?.output) return first.output;
    if (first?.response?.body?.[0]?.output) return first.response.body[0].output;
    if (first?.message) return first.message;
    if (typeof first === 'string') return first;
  }
  
  // Handle object responses
  if (jsonResponse?.response?.body?.[0]?.output) return jsonResponse.response.body[0].output;
  if (jsonResponse?.output) return jsonResponse.output;
  if (jsonResponse?.message) return jsonResponse.message;
  if (typeof jsonResponse === 'string') return jsonResponse;
  
  // Fallback to stringified JSON
  return JSON.stringify(jsonResponse);
};

const Chat = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<FileInfo[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only scroll to bottom when new messages are added (not on initial load)
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  // Fetch user profile for personalized greeting
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        const name = profile?.full_name || user.email?.split('@')[0] || 'Friend';
        setUserName(name);
        
        // Set personalized welcome message
        if (messages.length === 0) {
          setMessages([{
            sender: 'bot',
            text: `Hi ${name}! Welcome to Fortitude Network. We're here to support you through your journey. How can I help you today?`,
            timestamp: new Date()
          }]);
        }
      }
    };

    if (user && messages.length === 0) {
      fetchUserProfile();
    }
  }, [user, messages.length]);

  // Fetch conversations
  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Load conversation messages
  const loadConversationMessages = async (conversationId: string) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    
    const loadedMessages = data.map(msg => ({
      text: msg.message,
      sender: msg.sender as 'user' | 'bot',
      timestamp: new Date(msg.created_at)
    }));
    
    setMessages(loadedMessages);
    setCurrentConversationId(conversationId);
    
    // Close sidebar on mobile after selecting conversation
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: 'New Chat'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      const welcomeMessage = {
        sender: 'bot' as const,
        text: `Hi ${userName}! Welcome to Fortitude Network. We're here to support you through your journey. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      // Close sidebar on mobile after creating new conversation
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    },
  });

  // Save message to database
  const saveMessageMutation = useMutation({
    mutationFn: async ({ message, sender }: { message: string; sender: 'user' | 'bot' }) => {
      if (!user || !currentConversationId) return;
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          conversation_id: currentConversationId,
          message,
          sender
        });
      
      if (error) throw error;
    },
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = input;
    if (textToSend.trim() === '' || isLoading) return;

    // Create conversation if none exists
    if (!currentConversationId && user) {
      await createConversationMutation.mutateAsync();
    }

    const userMessage: Message = { text: textToSend, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message and update conversation title if it's a new conversation
    if (currentConversationId) {
      saveMessageMutation.mutate({ message: textToSend, sender: 'user' });
      
      // Update conversation title based on first user message
      const conversation = conversations?.find(c => c.id === currentConversationId);
      if (conversation && conversation.title === 'New Chat') {
        const title = textToSend.length > 50 ? textToSend.substring(0, 47) + '...' : textToSend;
        supabase
          .from('chat_conversations')
          .update({ title })
          .eq('id', currentConversationId)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          });
      }
    }

    try {
      // Get user profile for the request
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Send request to n8n webhook using FormData to avoid CORS preflight
      const formData = new FormData();
      
      // Add profile data as individual form fields
      formData.append('userId', user?.id || '');
      formData.append('name', profile?.full_name || '');
      formData.append('email', profile?.email || user?.email || '');
      formData.append('role', profile?.role || 'patient');
      formData.append('cancerType', profile?.cancer_type || '');
      formData.append('ageGroup', profile?.age_group || '');
      formData.append('location', profile?.location || '');
      formData.append('diagnosisDate', profile?.diagnosis_date || '');
      formData.append('message', textToSend);
      
      // Add attached files data
      if (attachedFiles.length > 0) {
        formData.append('hasFiles', 'true');
        formData.append('filesCount', attachedFiles.length.toString());
        attachedFiles.forEach((file, index) => {
          formData.append(`file_${index}_name`, file.name);
          formData.append(`file_${index}_type`, file.type);
          formData.append(`file_${index}_size`, file.size.toString());
          formData.append(`file_${index}_url`, file.url);
          formData.append(`file_${index}_base64`, file.base64);
        });
      }

      const response = await fetch('https://n8n.erudites.in/webhook/forti', {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });

      if (response.ok) {
        // Simplified response parsing
        let responseData;
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json();
            
            // Extract text from various possible response structures
            responseData = extractResponseText(jsonResponse);
          } else {
            responseData = await response.text();
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          responseData = await response.text();
        }
        
        // Clean up the response text - handle line breaks properly
        let cleanedText = responseData || "Thank you for sharing. I'm here to listen and support you through this journey.";
        
        // Convert \n\n to proper line breaks and clean up any JSON artifacts
        cleanedText = cleanedText
          .replace(/\\n\\n/g, '\n\n')
          .replace(/\\n/g, '\n')
          .replace(/\s*{\s*}\s*/g, '')
          .trim();
        
        const botResponse: Message = { 
          text: cleanedText, 
          sender: 'bot', 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Save bot response
        if (currentConversationId) {
          saveMessageMutation.mutate({ message: botResponse.text, sender: 'bot' });
        }
        
        // Clear attached files after successful send
        setAttachedFiles([]);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse: Message = { 
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    createConversationMutation.mutate();
  };

  const handlePredefinedMessage = (message: string) => {
    setInput(message);
    // Trigger form submission programmatically
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setInput(text);
  };

  const handleFilesUploaded = (files: FileInfo[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  // Mobile sidebar component
  const Sidebar = () => (
    <div className={`
      ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out' : 'w-80'}
      ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      bg-white border-r flex flex-col h-full
    `}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="p-4 border-b">
        <Button onClick={startNewChat} className="w-full" disabled={createConversationMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Conversations</h3>
        <div className="space-y-2">
          {conversations?.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => loadConversationMessages(conversation.id)}
              className={`w-full text-left p-3 rounded-lg text-sm hover:bg-muted transition-colors ${
                currentConversationId === conversation.id ? 'bg-primary text-primary-foreground' : 'text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate font-medium">{conversation.title}</span>
              </div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(conversation.created_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-primary">Forti</h1>
            <p className="text-sm text-muted-foreground">
              Your AI support companion
            </p>
          </div>
          {isMobile && <div className="w-10" />} {/* Spacer for centering */}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {/* Predefined Messages */}
            {messages.length <= 1 && (
              <Card className="p-4 mb-4">
                <p className="text-sm font-medium text-foreground mb-3">Quick start questions:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedMessages.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePredefinedMessage(message)}
                      className="text-xs"
                      disabled={isLoading}
                    >
                      {message}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      F
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {msg.text}
                    </div>
                    <div className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <User className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground p-1 flex-shrink-0" />
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-end gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    F
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4 space-y-3">
          {/* File attachments preview */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 bg-background border rounded-lg text-xs"
                >
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                      📄
                    </div>
                  )}
                  <span className="truncate max-w-24" title={file.name}>
                    {file.name}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAttachedFiles(prev => prev.filter(f => f.id !== file.id))}
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow pr-12"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <VoiceRecorder onTranscription={handleVoiceTranscription} />
                <FileUploader onFilesUploaded={handleFilesUploaded} />
              </div>
            </div>
            <Button type="submit" disabled={isLoading || input.trim() === ''} className="px-4">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;