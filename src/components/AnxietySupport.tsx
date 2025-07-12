import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnxietySupportProps {
  onClose: () => void;
}

const AnxietySupport: React.FC<AnxietySupportProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-12 w-12 text-brand-purple" />
            <CardTitle className="text-2xl">You're Not Alone</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Anxiety is a natural response to uncertainty, and it's incredibly common among cancer patients and their loved ones.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Inspirational Quote */}
          <div className="bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 p-6 rounded-lg border-l-4 border-brand-purple">
            <blockquote className="text-lg italic text-gray-700 mb-2">
              "Courage doesn't mean you don't get afraid. Courage means you don't let fear stop you."
            </blockquote>
            <cite className="text-sm text-gray-600">- Bethany Hamilton</cite>
          </div>

          {/* Statistics */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-brand-blue" />
              You're in Good Company
            </h3>
            <p className="text-gray-700 mb-2">
              Studies show that <strong>70% of cancer patients</strong> experience anxiety at some point during their journey. 
              This is completely normal and understandable.
            </p>
            <p className="text-gray-700">
              Remember: feeling anxious doesn't make you weak—it makes you human.
            </p>
          </div>

          {/* How Fortitude Can Help */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-teal" />
              How Fortitude Can Support You
            </h3>
            
            <div className="grid gap-4">
              <div className="flex gap-3 p-4 bg-white border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-brand-blue mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">24/7 AI Companion</h4>
                  <p className="text-sm text-gray-600">Chat with Forti anytime you're feeling anxious—day or night</p>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 bg-white border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-brand-teal mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Peer Support Groups</h4>
                  <p className="text-sm text-gray-600">Connect with others who understand exactly what you're going through</p>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 bg-white border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-brand-purple mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Guided Resources</h4>
                  <p className="text-sm text-gray-600">Access anxiety management techniques and coping strategies</p>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 bg-white border rounded-lg">
                <div className="w-2 h-2 rounded-full bg-brand-orange mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium">Professional Connections</h4>
                  <p className="text-sm text-gray-600">Find mental health professionals who specialize in cancer care</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" className="flex-1" asChild>
              <Link to="/auth">
                Join Our Community <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="flex-1" asChild>
              <Link to="/chat">
                Chat with Forti Now
              </Link>
            </Button>
          </div>

          {/* Close Button */}
          <div className="text-center pt-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnxietySupport;