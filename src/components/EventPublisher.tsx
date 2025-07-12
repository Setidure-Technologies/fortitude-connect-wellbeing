import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Users, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const EventPublisher = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user role from database (primary source)
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    is_online: false,
    meeting_link: '',
    registration_link: '',
    max_attendees: '',
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const startDateTime = new Date(`${eventData.start_date}T${eventData.start_time}`).toISOString();
      const endDateTime = eventData.end_date && eventData.end_time 
        ? new Date(`${eventData.end_date}T${eventData.end_time}`).toISOString()
        : null;

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          event_type: eventData.event_type,
          start_date: startDateTime,
          end_date: endDateTime,
          location: eventData.location,
          is_online: eventData.is_online,
          meeting_link: eventData.meeting_link,
          registration_link: eventData.registration_link,
          max_attendees: eventData.max_attendees ? parseInt(eventData.max_attendees) : null,
          host_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Event Published",
        description: "Your event has been published successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setFormData({
        title: '',
        description: '',
        event_type: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        location: '',
        is_online: false,
        meeting_link: '',
        registration_link: '',
        max_attendees: '',
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate(formData);
  };

  // Check role from database first, fallback to auth metadata
  const userRole = userProfile?.role || user?.user_metadata?.role;
  const canPublishEvents = userRole === 'admin' || userRole === 'ngo';

  if (!canPublishEvents) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Access denied. Admin or NGO privileges required to publish events.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Publish New Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <Input
                id="event_type"
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                placeholder="e.g., Support Group, Workshop, Webinar"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe your event..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Date & Time *
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                End Date & Time
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_online"
                checked={formData.is_online}
                onChange={(e) => setFormData({ ...formData, is_online: e.target.checked })}
              />
              <Label htmlFor="is_online">This is an online event</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {formData.is_online ? 'Platform/Meeting Details' : 'Location'}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={formData.is_online ? "Zoom, Google Meet, etc." : "Event venue address"}
                />
              </div>

              {formData.is_online && (
                <div className="space-y-2">
                  <Label htmlFor="meeting_link" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Meeting Link
                  </Label>
                  <Input
                    id="meeting_link"
                    type="url"
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="registration_link" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Registration Link
              </Label>
              <Input
                id="registration_link"
                type="url"
                value={formData.registration_link}
                onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                placeholder="External registration URL (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_attendees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Attendees
              </Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={createEventMutation.isPending}
          >
            {createEventMutation.isPending ? 'Publishing...' : 'Publish Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventPublisher;