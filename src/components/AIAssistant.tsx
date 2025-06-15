
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Heart, Calendar, Users, MessageSquare, BookOpen, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const aiPrompts = [
  {
    id: "diagnosed",
    title: "I just got diagnosed",
    description: "Need emotional support and guidance on next steps",
    icon: <Heart className="h-5 w-5" />,
    response: "I understand this news can feel overwhelming. You're not alone in this journey. Let me connect you with resources and others who've walked this path."
  },
  {
    id: "emotional",
    title: "I need emotional support",
    description: "Feeling anxious, scared, or overwhelmed",
    icon: <MessageSquare className="h-5 w-5" />,
    response: "Your feelings are completely valid. Many in our community have felt the same way. Would you like to talk to someone who understands?"
  },
  {
    id: "surgery",
    title: "I'm preparing for surgery",
    description: "What should I expect and how to prepare",
    icon: <Calendar className="h-5 w-5" />,
    response: "Preparation can help ease anxiety. Let me share some practical tips and connect you with others who've been through similar procedures."
  },
  {
    id: "connect",
    title: "I want to connect with someone",
    description: "Find others with similar experiences",
    icon: <Users className="h-5 w-5" />,
    response: "Connection is powerful medicine. I can help you find community members who share similar experiences or interests."
  },
  {
    id: "resources",
    title: "I need information and resources",
    description: "Treatment options, side effects, or general guidance",
    icon: <BookOpen className="h-5 w-5" />,
    response: "Knowledge empowers healing. Let me help you find reliable, easy-to-understand information about your specific situation."
  }
];

const FREE_MESSAGE_LIMIT = 15;

const AIAssistant = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(0);
  const { isAuthenticated } = useAuth();

  // Load free messages count from localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem('forti_free_messages_used');
      if (stored) {
        setFreeMessagesUsed(parseInt(stored, 10));
      }
    }
  }, [isAuthenticated]);

  const handlePromptSelect = (promptId: string) => {
    setSelectedPrompt(promptId);
  };

  const canUseAI = () => {
    return isAuthenticated || freeMessagesUsed < FREE_MESSAGE_LIMIT;
  };

  const selectedPromptData = aiPrompts.find(p => p.id === selectedPrompt);
  const remainingFreeMessages = FREE_MESSAGE_LIMIT - freeMessagesUsed;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full shadow-lg animate-gentle-bounce">
          <Bot className="h-5 w-5 mr-2" />
          Chat with Forti AI
          {!isAuthenticated && (
            <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
              {remainingFreeMessages} free
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bot className="h-6 w-6 text-brand-purple" />
            Hi, I'm Forti - Your Support Companion
          </DialogTitle>
        </DialogHeader>

        {/* Free message limit warning */}
        {!isAuthenticated && freeMessagesUsed >= FREE_MESSAGE_LIMIT && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Lock className="h-5 w-5" />
                Free Messages Used
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-orange-700 mb-4">
                You've used all {FREE_MESSAGE_LIMIT} free messages. Sign up to continue with unlimited access!
              </p>
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

        {!selectedPrompt ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-slate-600">
                I'm here to provide emotional support and connect you with the right resources. 
                How can I help you today?
              </p>
              {!isAuthenticated && (
                <p className="text-sm text-slate-500 mt-2">
                  {remainingFreeMessages} free messages remaining
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiPrompts.map((prompt) => (
                <Card 
                  key={prompt.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow duration-200 border-2 hover:border-brand-purple/30 ${
                    !canUseAI() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => canUseAI() && handlePromptSelect(prompt.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {prompt.icon}
                      {prompt.title}
                      {!canUseAI() && <Lock className="h-4 w-4 text-slate-400" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{prompt.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-brand-purple/5 border-brand-purple/20">
              <CardContent className="p-4">
                <p className="text-slate-700">{selectedPromptData?.response}</p>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                View Support Groups
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Track Your Mood
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask a Survivor
              </Button>
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Resources
              </Button>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setSelectedPrompt(null)} variant="outline">
                Ask Something Else
              </Button>
              <Button asChild>
                <Link to="/chat">Continue in Full Chat</Link>
              </Button>
            </div>
          </div>
        )}

        {!isAuthenticated && canUseAI() && (
          <div className="text-center text-sm text-slate-500 border-t pt-4">
            <Link to="/auth" className="text-brand-blue hover:underline">
              Create a free account
            </Link> for unlimited AI chat and to save your conversation history
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistant;
