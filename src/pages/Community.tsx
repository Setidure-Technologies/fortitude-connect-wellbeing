
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, MessageSquare, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Community = () => {
  const { isAuthenticated } = useAuth();

  // Fetch community stats from database
  const { data: stats } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <Users className="h-16 w-16 mx-auto text-brand-blue mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to the Community Hub</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          This is a safe space for patients, survivors, and caregivers to connect, share stories, and find strength together.
        </p>
      </div>

      {/* Community Stats */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-brand-blue text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.total_members}</div>
            <div className="text-sm opacity-90">Community Members</div>
          </div>
          <div className="bg-brand-teal text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.total_stories}</div>
            <div className="text-sm opacity-90">Survivor Stories</div>
          </div>
          <div className="bg-brand-purple text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">{stats.total_events}</div>
            <div className="text-sm opacity-90">Community Events</div>
          </div>
          <div className="bg-brand-green text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">${stats.total_donations?.toLocaleString()}</div>
            <div className="text-sm opacity-90">Funds Raised</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <MessageSquare className="h-10 w-10 mx-auto text-brand-teal mb-3" />
          <h3 className="font-semibold text-lg mb-2">Discussion Forums</h3>
          <p className="text-sm text-slate-600">Join topic-based forums to discuss treatments, share experiences, and ask questions.</p>
          {isAuthenticated && (
            <Button asChild className="mt-4" size="sm">
              <Link to="/forum">Join Discussions</Link>
            </Button>
          )}
        </div>
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <Users className="h-10 w-10 mx-auto text-brand-blue mb-3" />
          <h3 className="font-semibold text-lg mb-2">Support Groups</h3>
          <p className="text-sm text-slate-600">Connect in smaller, private groups for more focused support based on your journey.</p>
          {isAuthenticated && (
            <Button asChild className="mt-4" size="sm">
              <Link to="/events">Find Groups</Link>
            </Button>
          )}
        </div>
        <div className="bg-slate-50 p-6 rounded-lg text-center">
          <Calendar className="h-10 w-10 mx-auto text-brand-purple mb-3" />
          <h3 className="font-semibold text-lg mb-2">Community Events</h3>
          <p className="text-sm text-slate-600">Participate in virtual events, workshops, and Q&A sessions with experts and survivors.</p>
          {isAuthenticated && (
            <Button asChild className="mt-4" size="sm">
              <Link to="/events">View Events</Link>
            </Button>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="text-center mt-16">
          <p className="text-slate-700 mb-4">To be part of our community, sign up today!</p>
          <Button asChild size="lg">
            <Link to="/auth">Join Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Community;
