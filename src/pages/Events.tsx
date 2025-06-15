
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Video, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const events = [
  {
    id: 1,
    title: "Monthly Support Group Session",
    description: "Join fellow survivors and patients for emotional support and shared experiences.",
    date: "2024-12-20",
    time: "2:00 PM - 3:30 PM",
    type: "Support Group",
    format: "Online",
    platform: "Zoom",
    host: "Dr. Sarah Wilson, Counselor",
    maxSeats: 20,
    bookedSeats: 12,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Nutrition During Treatment Workshop",
    description: "Learn about maintaining proper nutrition during cancer treatment with expert guidance.",
    date: "2024-12-22",
    time: "11:00 AM - 12:30 PM", 
    type: "Workshop",
    format: "Online",
    platform: "Zoom",
    host: "Lisa Chen, Registered Dietitian",
    maxSeats: 50,
    bookedSeats: 28,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Survivor Storytelling Circle",
    description: "Share your journey or listen to inspiring stories from the community.",
    date: "2024-12-25",
    time: "6:00 PM - 7:30 PM",
    type: "Storytelling", 
    format: "Hybrid",
    platform: "Zoom + Local Center",
    host: "Fortitude Network Team",
    maxSeats: 30,
    bookedSeats: 18,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Weekend Wellness Retreat",
    description: "A weekend getaway focused on relaxation, mindfulness, and community bonding.",
    date: "2024-12-28",
    time: "9:00 AM - 5:00 PM",
    type: "Retreat",
    format: "In-Person",
    platform: "Mumbai Wellness Center",
    host: "Multiple Facilitators",
    maxSeats: 25,
    bookedSeats: 20,
    image: "/placeholder.svg"
  }
];

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
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

  const generateCalendarLink = (event: typeof events[0]) => {
    const startDate = new Date(event.date + ' ' + event.time.split(' - ')[0]).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(event.date + ' ' + event.time.split(' - ')[1]).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.platform)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Community Events & Workshops</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Join our community events designed to support, educate, and connect cancer patients, survivors, and caregivers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getTypeColor(event.type)}>
                  {event.type}
                </Badge>
                <Badge variant="outline">
                  {event.format}
                </Badge>
              </div>
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4 leading-relaxed">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {event.format === 'Online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  {event.platform}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4" />
                  {event.bookedSeats}/{event.maxSeats} seats filled
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1" 
                      onClick={() => setSelectedEvent(event)}
                      disabled={event.bookedSeats >= event.maxSeats}
                    >
                      {event.bookedSeats >= event.maxSeats ? 'Event Full' : 'Join Event'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{selectedEvent?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                      <div className="space-y-4">
                        <img 
                          src={selectedEvent.image} 
                          alt={selectedEvent.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-slate-700">{selectedEvent.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                          <div>
                            <h4 className="font-semibold mb-2">Event Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
                              <p><strong>Time:</strong> {selectedEvent.time}</p>
                              <p><strong>Format:</strong> {selectedEvent.format}</p>
                              <p><strong>Platform:</strong> {selectedEvent.platform}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Host Information</h4>
                            <p className="text-sm">{selectedEvent.host}</p>
                            <p className="text-sm text-slate-600 mt-2">
                              {selectedEvent.bookedSeats}/{selectedEvent.maxSeats} attendees
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1">
                            Confirm Registration
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
    </div>
  );
};

export default Events;
