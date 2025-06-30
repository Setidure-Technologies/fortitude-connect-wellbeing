
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, User, Heart, Calendar } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import PrivateChat from '@/components/PrivateChat';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Send connection request using the new user_connections table
  const sendConnectionMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.id || !userId) throw new Error('Missing user data');
      
      const { data, error } = await supabase
        .from('user_connections')
        .insert({
          requester_id: currentUser.id,
          receiver_id: userId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
    },
  });

  const handleConnect = () => {
    sendConnectionMutation.mutate();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'ngo':
        return 'bg-blue-100 text-blue-800';
      case 'survivor':
        return 'bg-green-100 text-green-800';
      case 'caregiver':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-slate-600">Profile not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showChat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PrivateChat
          recipientId={profile.id}
          recipientName={profile.full_name || 'User'}
          recipientAvatar={profile.profile_image_url}
          onBack={() => setShowChat(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profile_image_url} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">
                    {profile.is_anonymous ? 'Anonymous User' : profile.full_name}
                  </h1>
                  <Badge className={getRoleColor(profile.role || 'patient')}>
                    {profile.role || 'patient'}
                  </Badge>
                </div>
                
                {profile.username && (
                  <p className="text-slate-600 mb-2">@{profile.username}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.cancer_type && (
                    <Badge variant="outline">{profile.cancer_type} cancer</Badge>
                  )}
                  {profile.age_group && (
                    <Badge variant="outline">{profile.age_group} years</Badge>
                  )}
                  {profile.location && (
                    <Badge variant="outline">{profile.location}</Badge>
                  )}
                </div>

                {currentUser?.id !== profile.id && (
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleConnect}
                      disabled={sendConnectionMutation.isPending}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowChat(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          {profile.bio && (
            <CardContent>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
            </CardContent>
          )}
        </Card>

        {profile.diagnosis_date && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Journey Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
                <div>
                  <p className="font-medium">Diagnosis</p>
                  <p className="text-sm text-slate-600">
                    {new Date(profile.diagnosis_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Community Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              This user's stories, posts, and community engagement will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
