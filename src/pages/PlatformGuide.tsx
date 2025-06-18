
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Users, Calendar, Bot, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const PlatformGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">How to Use Fortitude Network</h1>
          <p className="text-lg text-slate-600">
            Your comprehensive guide to navigating our support platform
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-brand-blue" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">1. Create Your Account</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Sign up with your email to access all platform features. Your information is kept secure and private.
                  </p>
                  <img src="/placeholder.svg" alt="Sign up process" className="w-full h-32 object-cover rounded-lg bg-slate-100" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2. Complete Your Profile</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Add details about your journey to help us connect you with relevant resources and community members.
                  </p>
                  <img src="/placeholder.svg" alt="Profile setup" className="w-full h-32 object-cover rounded-lg bg-slate-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-brand-teal" />
                Community Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto text-brand-teal mb-3" />
                  <h3 className="font-semibold mb-2">Forum Discussions</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Ask questions, share experiences, and get support from others who understand your journey.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/forum">Visit Forum</Link>
                  </Button>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto text-brand-purple mb-3" />
                  <h3 className="font-semibold mb-2">Community Events</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Join virtual support groups, workshops, and educational sessions with experts.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-brand-blue mb-3" />
                  <h3 className="font-semibold mb-2">Survivor Stories</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Read inspiring stories from survivors and share your own journey of hope.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/stories">Read Stories</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-brand-purple" />
                Forti AI Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">24/7 AI Companion</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Forti is your AI support companion, available anytime you need someone to talk to. Get emotional support, resources, and guidance.
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 mb-3">
                    <li>• Emotional support and validation</li>
                    <li>• Resource recommendations</li>
                    <li>• Connection to community members</li>
                    <li>• Treatment preparation guidance</li>
                  </ul>
                  <Button asChild size="sm">
                    <Link to="/chat">Start Chatting</Link>
                  </Button>
                </div>
                <div>
                  <img src="/placeholder.svg" alt="Forti AI Chat" className="w-full h-48 object-cover rounded-lg bg-slate-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Safety */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Your Privacy Matters</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• All conversations are private and secure</li>
                    <li>• You can post anonymously in forums</li>
                    <li>• Personal information is never shared without consent</li>
                    <li>• You control what information you share</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community Guidelines</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Be respectful and supportive</li>
                    <li>• No medical advice - only personal experiences</li>
                    <li>• Report inappropriate content</li>
                    <li>• Maintain confidentiality of shared stories</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                If you need assistance using the platform or have any questions, we're here to help.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/chat">Chat with Forti</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/docs/rules">Community Rules</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlatformGuide;
