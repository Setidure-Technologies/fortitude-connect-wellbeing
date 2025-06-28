import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Video, Download, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Fetch events from database
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          host:profiles!events_host_id_fkey(full_name),
          attendees:event_attendees(count)
        `)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Register for event mutation
  const registerMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: 'registered'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have been registered for the event.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for event.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Support Group': 'bg-brand-skyblue text-blue-800',
      'Workshop': 'bg-brand-green text-green-800',
      'Storytelling': 'bg-brand-pink text-pink-800',
      'Retreat': 'bg-brand-yellow text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const generateCalendarLink = (event: any) => {
    const startDate = new Date(event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = event.end_date 
      ? new Date(event.end_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      : new Date(new Date(event.start_date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;
  };

  const handleRegister = (eventId: string, registrationLink?: string) => {
    if (registrationLink) {
      window.open(registrationLink, '_blank');
    } else {
      registerMutation.mutate(eventId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Community Events & Workshops</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Join our community events designed to support, educate, and connect cancer patients, survivors, and caregivers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events?.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getTypeColor(event.event_type || 'Event')}>
                  {event.event_type || 'Event'}
                </Badge>
                <Badge variant="outline">
                  {event.is_online ? 'Online' : 'In-Person'}
                </Badge>
              </div>
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4 leading-relaxed">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.start_date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  {formatTime(event.start_date)}
                  {event.end_date && ` - ${formatTime(event.end_date)}`}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    {event.is_online ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    {event.location}
                  </div>
                )}
                {event.max_attendees && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    {event.attendees?.[0]?.count || 0}/{event.max_attendees} registered
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1" 
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{selectedEvent?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                      <div className="space-y-4">
                        <p className="text-slate-700">{selectedEvent.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                          <div>
                            <h4 className="font-semibold mb-2">Event Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Date:</strong> {formatDate(selectedEvent.start_date)}</p>
                              <p><strong>Time:</strong> {formatTime(selectedEvent.start_date)}</p>
                              <p><strong>Format:</strong> {selectedEvent.is_online ? 'Online' : 'In-Person'}</p>
                              {selectedEvent.location && (
                                <p><strong>Location:</strong> {selectedEvent.location}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Host Information</h4>
                            <p className="text-sm">{selectedEvent.host?.full_name || 'Fortitude Network'}</p>
                            {selectedEvent.max_attendees && (
                              <p className="text-sm text-slate-600 mt-2">
                                {selectedEvent.attendees?.[0]?.count || 0}/{selectedEvent.max_attendees} registered
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className="flex-1"
                            onClick={() => handleRegister(selectedEvent.id, selectedEvent.registration_link)}
                            disabled={registerMutation.isPending}
                          >
                            {selectedEvent.registration_link ? (
                              <>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Register for Event
                              </>
                            ) : (
                              'Register for Event'
                            )}
                          </Button>
                          <Button variant="outline" asChild>
                            <a 
                              href={generateCalendarLink(selectedEvent)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </a>
                          </Button>
                        </div>

                        {selectedEvent.meeting_link && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Meeting Link:</strong> 
                              <a 
                                href={selectedEvent.meeting_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 underline"
                              >
                                Join Meeting
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a 
                    href={generateCalendarLink(event)}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No events scheduled at the moment.</p>
          <p className="text-slate-500 text-sm mt-2">Check back soon for upcoming community events!</p>
        </div>
      )}
    </div>
  );
};

export default Events;