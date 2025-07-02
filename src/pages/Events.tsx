
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Plus, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import EventPublisher from '@/components/EventPublisher';

const Events = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('view');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:host_id (
            full_name,
            username
          ),
          event_attendees(count)
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const canCreateEvents = isAuthenticated && user?.user_metadata?.role && 
    ['admin', 'ngo'].includes(user.user_metadata.role);

  const registerForEvent = async (eventId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to register for events');
      return;
    }

    try {
      const { error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user?.id,
          status: 'registered'
        });

      if (error) throw error;
      alert('Successfully registered for event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Calendar className="h-16 w-16 mx-auto text-brand-blue mb-4" />
          <h1 className="text-4xl font-bold mb-4">Community Events</h1>
          <p className="text-lg text-slate-600">
            Join our supportive community events, workshops, and support groups
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="view">View Events</TabsTrigger>
            {canCreateEvents && (
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="view">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
                <p className="text-slate-600">Loading events...</p>
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                          {event.event_type && (
                            <span className="inline-block bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm">
                              {event.event_type}
                            </span>
                          )}
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          Hosted by {event.profiles?.full_name || event.profiles?.username || 'Unknown'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {event.description && (
                        <p className="text-slate-700">{event.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(event.start_date), 'PPP')}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(new Date(event.start_date), 'p')}
                          {event.end_date && ` - ${format(new Date(event.end_date), 'p')}`}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                        
                        {event.max_attendees && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Max {event.max_attendees} attendees
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={() => registerForEvent(event.id)}
                          disabled={!isAuthenticated}
                        >
                          {isAuthenticated ? 'Register' : 'Sign In to Register'}
                        </Button>
                        
                        {event.meeting_link && (
                          <Button variant="outline" asChild>
                            <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Join Meeting
                            </a>
                          </Button>
                        )}
                      </div>

                      {event.is_online && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            📍 This is an online event
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
                <p className="text-slate-600 mb-6">
                  There are no upcoming events at the moment. Check back soon for new community events and workshops!
                </p>
                {!isAuthenticated && (
                  <Button asChild>
                    <a href="/auth">Sign In to Stay Updated</a>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {canCreateEvents && (
            <TabsContent value="create">
              <EventPublisher />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
