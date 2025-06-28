import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import PromptButtons from "@/components/PromptButtons";
import ImpactStats from "@/components/ImpactStats";
import AIAssistant from "@/components/AIAssistant";
import CollaboratorsSection from "@/components/CollaboratorsSection";

const offerings = [
  {
    icon: <Heart className="h-8 w-8 text-brand-purple" />,
    title: "Survivor Stories",
    description: "Access inspiring survivor stories that encourage and uplift fellow cancer warriors during their journeys.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-brand-teal" />,
    title: "Mental Health Support",
    description: "Find valuable resources and information for effective cancer care and mental wellness tailored to your situation.",
  },
  {
    icon: <Users className="h-8 w-8 text-brand-blue" />,
    title: "Community Hub",
    description: "Join a vibrant community hub where you can share experiences, seek advice, and connect with others facing similar challenges.",
  },
];

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-brand-skyblue/10 to-brand-green/10 relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
              You Are More Than Your Diagnosis
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Empowering your Cancer Journey, one connection at a time. Find strength, support, and community with Fortitude Network — because you are never alone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Link to="/auth">Join Our Community</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/donate">Support Others</Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <AIAssistant />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-brand-pink/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-brand-yellow/20 rounded-full blur-xl"></div>
      </section>

      {/* Prompt Buttons */}
      <PromptButtons />

      {/* Offerings Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Support for Your Journey</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore the various ways Fortitude Network assists patients, survivors, and caregivers with resources tailored for every step of the journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-full p-6 w-fit mb-4 shadow-inner">
                    {offering.icon}
                  </div>
                  <CardTitle className="text-xl">{offering.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{offering.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* Collaborators Section */}
      <CollaboratorsSection />
      
      {/* About Section */}
       <section className="bg-gradient-to-r from-brand-skyblue/20 to-brand-green/20 py-20">
        <div className="container mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Heart Behind Fortitude Network</h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Founded by Vanshika Rao, Fortitude Network was born from personal experience and the deep understanding that healing goes beyond medical treatment. We're a dedicated non-profit organization focused on supporting cancer patients and survivors through every step of their journey.
              </p>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Our comprehensive platform offers survivor stories, mental health resources, and a vibrant community hub. We prioritize accessibility, data privacy, and creating genuine connections that foster hope and resilience.
              </p>
              <Button asChild className="rounded-full">
                <Link to="/about">Learn More About Our Story</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="/placeholder.svg" alt="Community support" className="rounded-lg w-full h-64 object-cover" />
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600 italic">"Together, we turn struggles into strength"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey of Connection?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of individuals who have found strength, hope, and healing through our supportive community. Your story matters, and you belong here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full shadow-lg">
              <Link to="/auth">Start Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/community">Explore Community</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;