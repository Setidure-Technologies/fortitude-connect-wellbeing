
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FREE_MESSAGE_LIMIT = 15;

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi there! I'm Forti, your AI support companion. How are you feeling today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Load free messages count from localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem('forti_free_messages_used');
      if (stored) {
        setFreeMessagesUsed(parseInt(stored, 10));
      }
    }
  }, [isAuthenticated]);

  const canSendMessage = () => {
    return isAuthenticated || freeMessagesUsed < FREE_MESSAGE_LIMIT;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || !canSendMessage() || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Update free message count for unauthenticated users
    if (!isAuthenticated) {
      const newCount = freeMessagesUsed + 1;
      setFreeMessagesUsed(newCount);
      localStorage.setItem('forti_free_messages_used', newCount.toString());
    }

    try {
      // Send request to your n8n webhook
      const response = await fetch('https://n8n.erudites.in/webhook-test/forti', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.text();
        const botResponse: Message = { 
          text: data || "Thank you for sharing. I'm here to listen and support you through this journey.", 
          sender: 'bot', 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, botResponse]);
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

  const remainingFreeMessages = FREE_MESSAGE_LIMIT - freeMessagesUsed;

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] container py-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Chat with Forti</h1>
        <p className="text-sm text-slate-500">
          {isAuthenticated 
            ? "Unlimited chat access. Your conversation history is saved to your account."
            : `${remainingFreeMessages} free messages remaining. Sign up for unlimited access.`
          }
        </p>
      </div>

      {/* Message limit warning for unauthenticated users */}
      {!isAuthenticated && freeMessagesUsed >= FREE_MESSAGE_LIMIT && (
        <Card className="mb-4 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Lock className="h-5 w-5" />
              Free Messages Used
            </CardTitle>
            <CardDescription className="text-orange-700">
              You've used all {FREE_MESSAGE_LIMIT} free messages. Sign up to continue chatting with unlimited access!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/auth">Sign Up Free</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth">Log In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
          placeholder={canSendMessage() ? "Type your message..." : "Sign up to continue chatting..."}
          className="flex-grow"
          disabled={!canSendMessage() || isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!canSendMessage() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {!isAuthenticated && (
        <div className="mt-2 text-xs text-center text-slate-500">
          <Link to="/auth" className="text-brand-blue hover:underline">
            Create a free account
          </Link> to save your chat history and get unlimited messages
        </div>
      )}
    </div>
  );
};

export default Chat;
