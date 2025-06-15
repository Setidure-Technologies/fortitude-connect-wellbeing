
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
      <section className="bg-slate-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Personalized Cancer Support Network
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Empowering – one connection at a time. You are not alone. Find strength, support, and community with Fortitude Network.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/signup">Join the Community</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Support for Cancer Journeys</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mt-4">
              Explore the various ways Fortitude Network assists patients. From mental health support to community engagement, find the resources tailored for your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-slate-100 rounded-full p-4 w-fit mb-4">
                    {offering.icon}
                  </div>
                  <CardTitle>{offering.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{offering.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
       <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Heart Behind Fortitude Network</h2>
              <p className="text-slate-600 mb-4">
                Fortitude Network is a dedicated non-profit organization based in India, focused on supporting cancer patients and survivors. Our comprehensive online platform offers survivor stories, vital resources for cancer care, and a community hub.
              </p>
              <p className="text-slate-600 mb-6">
                We aim to empower individuals impacted by cancer, ensuring they feel connected and informed throughout their journey. With our user-friendly website, we prioritize accessibility and data privacy to foster trust among our community.
              </p>
              <Button asChild>
                <Link to="/about">Read More</Link>
              </Button>
            </div>
            <div>
              <img src="/placeholder.svg" alt="Community support" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Connect with Us?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mt-4 mb-8">
            Join Fortitude Network today and start your journey toward empowerment and healing with a supportive community behind you.
          </p>
          <Button asChild size="lg">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
