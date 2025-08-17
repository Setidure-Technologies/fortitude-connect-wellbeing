
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Calendar, ArrowRight, Shield, Bot, Brain, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import CollaboratorsSection from '@/components/CollaboratorsSection';
import CommunityGallery from '@/components/CommunityGallery';
import CancerAwarenessStats from '@/components/CancerAwarenessStats';
import DailyQuestion from '@/components/DailyQuestion';
import heroBackground from '@/assets/hero-background.jpg';
import AdSenseAd from '@/components/AdSenseAd';
import LazyImage from '@/components/LazyImage';
import AccessibleButton from '@/components/AccessibleButton';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';

const Index = () => {
  const { isAuthenticated } = useAuth();
  usePerformanceMonitor('Index Page');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/80 via-brand-teal/70 to-brand-purple/60 backdrop-blur-[2px]"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Ribbons */}
          <div className="absolute top-20 left-10 w-8 h-8 bg-pink-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
          <div className="absolute bottom-20 right-32 w-7 h-7 bg-blue-400/35 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.2s' }}></div>
          
          {/* Floating Hearts */}
          <div className="absolute top-60 left-1/4 text-pink-300/40 animate-pulse" style={{ animationDelay: '0.5s' }}>💖</div>
          <div className="absolute bottom-40 right-1/4 text-yellow-300/40 animate-pulse" style={{ animationDelay: '2s' }}>🎗️</div>
          <div className="absolute top-32 right-1/3 text-purple-300/40 animate-pulse" style={{ animationDelay: '1.2s' }}>💜</div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Glass Morphism Container */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center space-x-4 mb-8 animate-fade-in">
                <div className="relative">
                  <LazyImage 
                    src="/Fortitude_logo.png" 
                    alt="Fortitude Network Logo" 
                    className="h-16 w-16 object-contain drop-shadow-lg transform hover:scale-110 transition-transform duration-300"
                    fallbackSrc="/placeholder.svg"
                    priority={true}
                  />
                  <div className="absolute -inset-2 bg-white/20 rounded-full blur-md -z-10"></div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                  Fortitude Network
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed text-white/95 font-medium animate-fade-in" style={{ animationDelay: '0.3s' }}>
                A compassionate community connecting cancer patients, survivors, caregivers, and support organizations in one supportive platform
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                {!isAuthenticated ? (
                  <>
                    <AccessibleButton 
                      size="lg" 
                      className="bg-white text-brand-blue hover:bg-blue-50 font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
                      asChild
                      ariaLabel="Join our cancer support community"
                    >
                      <Link to="/auth">Join Our Community</Link>
                    </AccessibleButton>
                    <AccessibleButton 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-brand-blue backdrop-blur-sm font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
                      asChild
                      ariaLabel="Learn more about Fortitude Network"
                    >
                      <Link to="/about">Learn More</Link>
                    </AccessibleButton>
                  </>
                ) : (
                  <>
                    <AccessibleButton 
                      size="lg" 
                      className="bg-white text-brand-blue hover:bg-blue-50 font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
                      asChild
                      ariaLabel="Start chatting with Forti AI assistant"
                    >
                      <Link to="/chat">Chat with Forti</Link>
                    </AccessibleButton>
                    <AccessibleButton 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-brand-blue backdrop-blur-sm font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
                      asChild
                      ariaLabel="Explore community forums and discussions"
                    >
                      <Link to="/community">Explore Community</Link>
                    </AccessibleButton>
                  </>
                )}
              </div>
            </div>
            
            {/* Support Statistics */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm text-white/80">AI Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold mb-1">1000+</div>
                <div className="text-sm text-white/80">Community Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold mb-1">50+</div>
                <div className="text-sm text-white/80">Support Groups</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-white/80">Confidential</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
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
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-brand-blue" aria-hidden="true" />
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
              <Users className="h-12 w-12 mx-auto mb-4 text-brand-teal" aria-hidden="true" />
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
              <Calendar className="h-12 w-12 mx-auto mb-4 text-brand-orange" aria-hidden="true" />
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

      {/* Daily Question */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <DailyQuestion />
        </div>
      </div>

      {/* Cancer Awareness Stats */}
      <CancerAwarenessStats />

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
              <Bot className="h-20 w-20 mx-auto text-brand-blue mb-4" aria-hidden="true" />
              <h3 className="text-2xl font-bold mb-4">Available 24/7</h3>
              <p className="text-gray-700 mb-6">Whether it's 3 AM anxiety or a midday question about treatments, Forti is always here to listen and help.</p>
              {isAuthenticated ? (
                <AccessibleButton 
                  size="lg" 
                  asChild
                  ariaLabel="Start a chat session with Forti AI assistant"
                >
                  <Link to="/chat">Start Chatting with Forti</Link>
                </AccessibleButton>
              ) : (
                <AccessibleButton 
                  size="lg" 
                  asChild
                  ariaLabel="Join Fortitude Network to chat with Forti"
                >
                  <Link to="/auth">Join to Chat with Forti</Link>
                </AccessibleButton>
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <CommunityGallery />

      {/* Impact Stats - removed as per request */}

      {/* Advertisement */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdSenseAd adSlot="1234567890" />
        </div>
      </div>

      {/* Collaborators Section */}
      <CollaboratorsSection />

      {/* Advertisement */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <AdSenseAd adSlot="1234567891" />
        </div>
      </div>

      {/* Advertisement */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <AdSenseAd adSlot="1234567892" />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of others who have found support, hope, and community through Fortitude Network
          </p>
          {!isAuthenticated ? (
            <AccessibleButton 
              size="lg" 
              className="bg-white text-brand-blue hover:bg-gray-100" 
              asChild
              ariaLabel="Get started with Fortitude Network"
            >
              <Link to="/auth">
                Get Started <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </AccessibleButton>
          ) : (
            <AccessibleButton 
              size="lg" 
              className="bg-white text-brand-blue hover:bg-gray-100" 
              asChild
              ariaLabel="Complete your profile to get personalized support"
            >
              <Link to="/profile">
                Complete Your Profile <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </AccessibleButton>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
