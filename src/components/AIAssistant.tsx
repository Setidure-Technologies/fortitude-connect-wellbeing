
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot, Heart, Calendar, Users, MessageSquare, BookOpen } from "lucide-react";

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

const AIAssistant = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePromptSelect = (promptId: string) => {
    setSelectedPrompt(promptId);
  };

  const selectedPromptData = aiPrompts.find(p => p.id === selectedPrompt);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full shadow-lg animate-gentle-bounce">
          <Bot className="h-5 w-5 mr-2" />
          Chat with Forti AI
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bot className="h-6 w-6 text-brand-purple" />
            Hi, I'm Forti - Your Support Companion
          </DialogTitle>
        </DialogHeader>

        {!selectedPrompt ? (
          <div className="space-y-6">
            <p className="text-slate-600 text-center">
              I'm here to provide emotional support and connect you with the right resources. 
              How can I help you today?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiPrompts.map((prompt) => (
                <Card 
                  key={prompt.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-2 hover:border-brand-purple/30"
                  onClick={() => handlePromptSelect(prompt.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {prompt.icon}
                      {prompt.title}
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
                <a href="/chat">Continue in Full Chat</a>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistant;
