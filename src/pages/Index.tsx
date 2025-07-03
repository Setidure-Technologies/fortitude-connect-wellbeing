
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Calendar, ArrowRight, Shield, Bot, Brain, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ImpactStats from '@/components/ImpactStats';
import CollaboratorsSection from '@/components/CollaboratorsSection';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-blue to-brand-teal text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img 
              src="/FORTI_LOGO.png" 
              alt="Fortitude Network Logo" 
              className="h-12 w-12 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <h1 className="text-4xl md:text-6xl font-bold">Fortitude Network</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            A compassionate community connecting cancer patients, survivors, caregivers, and support organizations in one supportive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100" asChild>
                  <Link to="/auth">Join Our Community</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-brand-blue backdrop-blur-sm font-medium" 
                  asChild
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100" asChild>
                  <Link to="/chat">Chat with Forti</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-brand-blue backdrop-blur-sm font-medium" 
                  asChild
                >
                  <Link to="/community">Explore Community</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Forti AI Support Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bot className="h-12 w-12 text-brand-blue" />
                <h2 className="text-3xl md:text-4xl font-bold">Meet Forti - Your AI Support Companion</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Forti is our specially trained AI companion designed to understand the unique challenges of cancer journey and provide personalized, empathetic support 24/7.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Brain className="h-8 w-8 text-brand-teal mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Trained on Cancer Care</h3>
                    <p className="text-gray-600">Forti has been specifically trained on cancer support, treatment information, and emotional wellbeing to provide relevant, accurate guidance.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <HeartHandshake className="h-8 w-8 text-brand-purple mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Empathetic Conversations</h3>
                    <p className="text-gray-600">Experience compassionate, understanding conversations that acknowledge your feelings and provide emotional support when you need it most.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-brand-orange mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Safe & Confidential</h3>
                    <p className="text-gray-600">Your conversations with Forti are private and secure. Share your thoughts, fears, and questions in a judgment-free environment.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 p-8 rounded-2xl">
                <div className="text-center">
                  <Bot className="h-20 w-20 mx-auto text-brand-blue mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Available 24/7</h3>
                  <p className="text-gray-700 mb-6">Whether it's 3 AM anxiety or a midday question about treatments, Forti is always here to listen and help.</p>
                  {isAuthenticated ? (
                    <Button size="lg" asChild>
                      <Link to="/chat">Start Chatting with Forti</Link>
                    </Button>
                  ) : (
                    <Button size="lg" asChild>
                      <Link to="/auth">Join to Chat with Forti</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Support You</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers comprehensive support throughout your cancer journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
                <CardTitle>AI Support Companion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Chat with Forti, our AI companion trained to provide emotional support and practical guidance throughout your journey
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto mb-4 text-brand-teal" />
                <CardTitle>Community Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with fellow patients, survivors, and caregivers who understand your experience
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Calendar className="h-12 w-12 mx-auto mb-4 text-brand-orange" />
                <CardTitle>Events & Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Join support groups, educational workshops, and community events designed for your needs
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* Collaborators Section */}
      <CollaboratorsSection />

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of others who have found support, hope, and community through Fortitude Network
          </p>
          {!isAuthenticated ? (
            <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100" asChild>
              <Link to="/auth">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100" asChild>
              <Link to="/profile">
                Complete Your Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
