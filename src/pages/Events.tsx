
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Plus, ExternalLink, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import EventPublisher from '@/components/EventPublisher';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { PageSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';

const Events = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('view');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter events based on search term
  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Event registration mutation
  const registerForEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!isAuthenticated) throw new Error('Authentication required');
      
      // Check if already registered
      const { data: existingRegistration } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user?.id)
        .single();

      if (existingRegistration) {
        throw new Error('Already registered for this event');
      }

      const { error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user?.id,
          status: 'registered'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have been registered for the event!",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message === 'Already registered for this event' 
          ? "You're already registered for this event." 
          : "Failed to register for event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const registerForEvent = (eventId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to register for events.",
        variant: "destructive",
      });
      return;
    }
    registerForEventMutation.mutate(eventId);
  };

  return (
    <ResponsiveContainer maxWidth="6xl">
      <div>
        <div className="text-center mb-6 lg:mb-8">
          <Calendar className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-brand-blue mb-4" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Community Events</h1>
          <p className="text-lg text-slate-600">
            Join our supportive community events, workshops, and support groups
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 lg:mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 lg:mb-8">
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
              <PageSkeleton />
            ) : filteredEvents && filteredEvents.length > 0 ? (
              <div className="grid gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg sm:text-xl mb-2">{event.title}</CardTitle>
                          {event.event_type && (
                            <span className="inline-block bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm">
                              {event.event_type}
                            </span>
                          )}
                        </div>
                        <div className="text-left sm:text-right text-sm text-slate-500 flex-shrink-0">
                          Hosted by {event.profiles?.full_name || event.profiles?.username || 'Unknown'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {event.description && (
                        <p className="text-slate-700">{event.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-slate-600">
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

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                          onClick={() => registerForEvent(event.id)}
                          disabled={!isAuthenticated || registerForEventMutation.isPending}
                        >
                          {registerForEventMutation.isPending 
                            ? 'Registering...' 
                            : isAuthenticated 
                              ? 'Register' 
                              : 'Sign In to Register'
                          }
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
              <EmptyState
                icon={Calendar}
                title={searchTerm ? "No Events Found" : "No Events Yet"}
                description={searchTerm 
                  ? `No events match "${searchTerm}". Try adjusting your search terms.`
                  : "There are no upcoming events at the moment. Check back soon for new community events and workshops!"
                }
                action={!isAuthenticated ? {
                  label: "Sign In to Stay Updated",
                  onClick: () => window.location.href = "/auth"
                } : undefined}
              />
            )}
          </TabsContent>

          {canCreateEvents && (
            <TabsContent value="create">
              <EventPublisher />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ResponsiveContainer>
  );
};

export default Events;
