
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Users, BookOpen } from "lucide-react";

const offerings = [
  {
    icon: <Heart className="h-10 w-10 text-brand-purple" />,
    title: "Survivor Stories",
    description: "Inspiring narratives of resilience and hope.",
    details: "Explore powerful survivor stories that highlight personal journeys through cancer. These narratives provide encouragement and foster a sense of community, serving as a source of strength for those currently battling cancer."
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-brand-teal" />,
    title: "Mental Health Support",
    description: "Connect with professionals for guidance.",
    details: "Access mental health resources tailored for cancer patients and survivors. We connect individuals with qualified mental health professionals for counseling and support to address emotional well-being and the psychological impacts of cancer."
  },
  {
    icon: <Users className="h-10 w-10 text-brand-blue" />,
    title: "Community Hub",
    description: "Join a supportive network of peers.",
    details: "Engage in discussions and share experiences in our community hub. This platform facilitates connections among cancer patients and survivors, fostering a sense of belonging while navigating cancer journeys."
  },
   {
    icon: <BookOpen className="h-10 w-10 text-yellow-500" />,
    title: "Resource Hub",
    description: "Comprehensive cancer support resources.",
    details: "We offer detailed information on various cancer types, symptoms, diagnosis, and treatment options, along with resources for managing physical and emotional challenges like pain, fatigue, stress, and anxiety."
  },
];

const Offerings = () => {
  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Empowering Cancer Journeys</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mt-4">
            At Fortitude Network, we offer a range of support services designed for cancer patients and survivors. Our initiatives aim to empower individuals through shared experiences, resources, and expert guidance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offerings.map((offering) => (
            <Card key={offering.title} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                {offering.icon}
                <div>
                  <CardTitle>{offering.title}</CardTitle>
                  <CardDescription>{offering.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-slate-600">{offering.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold">Ready to Find Support?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mt-4 mb-8">
            Join our community to access these resources and connect with a network that understands.
          </p>
          <Button asChild size="lg">
            <Link to="/signup">Join Fortitude Network</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Offerings;
