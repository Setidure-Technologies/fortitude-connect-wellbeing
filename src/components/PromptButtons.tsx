
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, HandHeart, HelpCircle, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import AnxietySupport from "./AnxietySupport";

const prompts = [
  {
    id: "patient",
    title: "I'm a Patient",
    description: "Just diagnosed or currently in treatment",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-brand-pink",
    path: "/patient-support"
  },
  {
    id: "survivor",
    title: "I'm a Survivor",
    description: "Share your journey and inspire others",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-brand-green",
    path: "/survivor-hub"
  },
  {
    id: "caregiver",
    title: "I'm a Caregiver",
    description: "Supporting a loved one through their journey",
    icon: <Users className="h-6 w-6" />,
    color: "bg-brand-skyblue",
    path: "/caregiver-resources"
  },
  {
    id: "volunteer",
    title: "I'm a Volunteer",
    description: "Want to help and make a difference",
    icon: <HandHeart className="h-6 w-6" />,
    color: "bg-brand-yellow",
    path: "/volunteer-opportunities"
  },
  {
    id: "anxious",
    title: "I'm Feeling Anxious",
    description: "Need support for anxiety and worry",
    icon: <Brain className="h-6 w-6" />,
    color: "bg-brand-purple",
    isSpecial: true
  },
  {
    id: "help",
    title: "I Need Help",
    description: "Not sure where to start? We're here for you",
    icon: <HelpCircle className="h-6 w-6" />,
    color: "bg-brand-purple/20",
    path: "/get-help"
  }
];

const PromptButtons = () => {
  const [showAnxietySupport, setShowAnxietySupport] = useState(false);

  const handlePromptClick = (prompt: any) => {
    if (prompt.id === "anxious") {
      setShowAnxietySupport(true);
    }
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Can We Support You Today?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your path to connect with the right resources, community, and support tailored just for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${prompt.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 text-white`}>
                    {prompt.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{prompt.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{prompt.description}</p>
                  {prompt.isSpecial ? (
                    <Button 
                      size="sm" 
                      className="w-full rounded-full"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      Get Support
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="w-full rounded-full">
                      <Link to={prompt.path}>Get Started</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {showAnxietySupport && (
        <AnxietySupport onClose={() => setShowAnxietySupport(false)} />
      )}
    </>
  );
};

export default PromptButtons;
