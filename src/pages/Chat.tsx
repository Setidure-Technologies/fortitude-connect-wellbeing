
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Plus, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

const Chat = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi there! I'm Forti, your AI support companion. How are you feeling today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

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
      setMessages([{ sender: 'bot', text: "Hi there! I'm Forti, your AI support companion. How are you feeling today?", timestamp: new Date() }]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
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
    if (input.trim() === '' || isLoading) return;

    // Create conversation if none exists
    if (!currentConversationId && user) {
      await createConversationMutation.mutateAsync();
    }

    const userMessage: Message = { text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message
    if (currentConversationId) {
      saveMessageMutation.mutate({ message: input, sender: 'user' });
    }

    try {
      // Send request to n8n webhook with the actual message
      const response = await fetch('https://n8n.erudites.in/webhook-test/forti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          user_id: user?.id
        }),
      });

      if (response.ok) {
        const data = await response.text();
        const botResponse: Message = { 
          text: data || "Thank you for sharing. I'm here to listen and support you through this journey.", 
          sender: 'bot', 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Save bot response
        if (currentConversationId) {
          saveMessageMutation.mutate({ message: botResponse.text, sender: 'bot' });
        }
      } else {
        throw new Error('Failed to get response');
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

  return (
    <div className="flex h-[calc(100vh-112px)] container py-4 gap-4">
      {/* Chat History Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-sm p-4 flex flex-col">
        <Button onClick={startNewChat} className="mb-4 w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Chat History</h3>
          <div className="space-y-2">
            {conversations?.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setCurrentConversationId(conversation.id)}
                className={`w-full text-left p-2 rounded text-sm hover:bg-slate-50 transition-colors ${
                  currentConversationId === conversation.id ? 'bg-brand-blue text-white' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  <span className="truncate">{conversation.title}</span>
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(conversation.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Chat with Forti</h1>
          <p className="text-sm text-slate-500">
            Your AI support companion is here to help you through your journey.
          </p>
        </div>

        <div className="flex-grow bg-slate-50 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-teal flex-shrink-0" />}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 text-white ${
                  msg.sender === 'user' ? 'bg-brand-blue rounded-br-none' : 'bg-brand-teal rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-teal flex-shrink-0" />
              <div className="bg-brand-teal rounded-2xl rounded-bl-none p-3 text-white">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
