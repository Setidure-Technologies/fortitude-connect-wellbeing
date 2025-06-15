
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, MessageSquare, Calendar } from "lucide-react";

const Community = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <Users className="h-16 w-16 mx-auto text-brand-blue mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to the Community Hub</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          This is a safe space for patients, survivors, and caregivers to connect, share stories, and find strength together. Our community features are currently under development.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <MessageSquare className="h-10 w-10 mx-auto text-brand-teal mb-3" />
          <h3 className="font-semibold text-lg mb-2">Discussion Forums</h3>
          <p className="text-sm text-slate-600">Soon, you'll be able to join topic-based forums to discuss treatments, share experiences, and ask questions.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <Users className="h-10 w-10 mx-auto text-brand-blue mb-3" />
          <h3 className="font-semibold text-lg mb-2">Support Groups</h3>
          <p className="text-sm text-slate-600">Connect in smaller, private groups for more focused support based on your journey.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <Calendar className="h-10 w-10 mx-auto text-brand-purple mb-3" />
          <h3 className="font-semibold text-lg mb-2">Community Events</h3>
          <p className="text-sm text-slate-600">Participate in virtual events, workshops, and Q&A sessions with experts and survivors.</p>
        </div>
      </div>

      <div className="text-center mt-16">
        <p className="text-slate-700 mb-4">To be part of our community when it launches, sign up today!</p>
        <Button asChild size="lg">
          <Link to="/signup">Join Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Community;
