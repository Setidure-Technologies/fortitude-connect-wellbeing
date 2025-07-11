import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Users, UserPlus, MessageCircle, Clock, Check, X, Circle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  cancer_type?: string;
  age_group?: string;
  location?: string;
  bio?: string;
  profile_image_url?: string;
  is_online?: boolean;
}

interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  message?: string;
  created_at: string;
  requester?: UserProfile;
  receiver?: UserProfile;
}

const Connect = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  // Fetch users to connect with
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['connect-users'],
    queryFn: async () => {
      if (!user) return [];
      
      // Get user activity to determine online status
      const { data: activities } = await supabase
        .from('user_activity')
        .select('user_id, last_active')
        .gte('last_active', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

      const onlineUserIds = activities?.map(a => a.user_id) || [];

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .order('full_name');
      
      if (error) throw error;
      
      return (data as UserProfile[]).map(profile => ({
        ...profile,
        is_online: onlineUserIds.includes(profile.id)
      }));
    },
    enabled: !!user
  });

  // Fetch user connections
  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ['user-connections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First get the connections
      const { data: connectionsData, error } = await supabase
        .from('user_connections_enhanced')
        .select('*')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!connectionsData) return [];

      // Get unique user IDs to fetch profiles
      const userIds = [...new Set([
        ...connectionsData.map(c => c.requester_id),
        ...connectionsData.map(c => c.receiver_id)
      ])];

      // Fetch user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, role, profile_image_url')
        .in('id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Combine the data
      const connectionsWithProfiles = connectionsData.map(conn => ({
        ...conn,
        requester: profilesMap.get(conn.requester_id),
        receiver: profilesMap.get(conn.receiver_id)
      }));
      
      return connectionsWithProfiles as Connection[];
    },
    enabled: !!user
  });

  // Send connection request mutation
  const sendConnectionMutation = useMutation({
    mutationFn: async ({ receiverId, message }: { receiverId: string; message: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_connections_enhanced')
        .insert({
          requester_id: user.id,
          receiver_id: receiverId,
          message: message.trim() || null,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['user-connections'] });
      setShowMessageDialog(false);
      setConnectionMessage('');
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
    }
  });

  // Update connection status mutation
  const updateConnectionMutation = useMutation({
    mutationFn: async ({ connectionId, status }: { connectionId: string; status: string }) => {
      const { error } = await supabase
        .from('user_connections_enhanced')
        .update({ 
          status,
          accepted_at: status === 'accepted' ? new Date().toISOString() : null
        })
        .eq('id', connectionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Connection Updated",
        description: "Connection status updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['user-connections'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update connection.",
        variant: "destructive",
      });
    }
  });

  // Filter users for search
  const filteredUsers = users?.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter connections by status
  const pendingConnections = connections?.filter(conn => 
    conn.status === 'pending' && conn.receiver_id === user?.id
  ) || [];
  
  const acceptedConnections = connections?.filter(conn => 
    conn.status === 'accepted'
  ) || [];

  const sentRequests = connections?.filter(conn => 
    conn.status === 'pending' && conn.requester_id === user?.id
  ) || [];

  // Check if already connected or request sent
  const getConnectionStatus = (userId: string) => {
    if (!connections) return null;
    return connections.find(conn => 
      (conn.requester_id === userId || conn.receiver_id === userId) &&
      (conn.requester_id === user?.id || conn.receiver_id === user?.id)
    );
  };

  const handleSendRequest = (targetUser: UserProfile) => {
    setSelectedUser(targetUser);
    setShowMessageDialog(true);
  };

  const confirmSendRequest = () => {
    if (!selectedUser) return;
    sendConnectionMutation.mutate({
      receiverId: selectedUser.id,
      message: connectionMessage
    });
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Connect</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find and connect with others in the Fortitude Network community. Build meaningful relationships for support and friendship.
        </p>
      </div>

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Requests ({pendingConnections.length})
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connections ({acceptedConnections.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* Discover Users Tab */}
        <TabsContent value="discover" className="space-y-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {usersLoading ? (
            <LoadingSpinner />
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'No other users available to connect with.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((profile) => {
                const connectionStatus = getConnectionStatus(profile.id);
                
                return (
                  <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          {profile.profile_image_url ? (
                            <img 
                              src={profile.profile_image_url} 
                              alt={profile.full_name} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          {profile.is_online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{profile.full_name}</CardTitle>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">{profile.role}</Badge>
                            {profile.is_online && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                <Circle className="h-2 w-2 mr-1 fill-green-600" />
                                Online
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {profile.bio && (
                        <CardDescription className="line-clamp-2 mt-2">
                          {profile.bio}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        {profile.cancer_type && (
                          <p><span className="font-medium">Cancer Type:</span> {profile.cancer_type}</p>
                        )}
                        {profile.location && (
                          <p><span className="font-medium">Location:</span> {profile.location}</p>
                        )}
                        {profile.age_group && (
                          <p><span className="font-medium">Age Group:</span> {profile.age_group}</p>
                        )}
                      </div>

                      <div className="pt-2">
                        {!connectionStatus ? (
                          <Button 
                            onClick={() => handleSendRequest(profile)}
                            className="w-full flex items-center gap-2"
                            disabled={sendConnectionMutation.isPending}
                          >
                            <UserPlus className="h-4 w-4" />
                            Send Request
                          </Button>
                        ) : connectionStatus.status === 'pending' ? (
                          <Button variant="outline" disabled className="w-full">
                            {connectionStatus.requester_id === user?.id ? 'Request Sent' : 'Request Received'}
                          </Button>
                        ) : connectionStatus.status === 'accepted' ? (
                          <Button variant="outline" disabled className="w-full flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Connected
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleSendRequest(profile)}
                            className="w-full flex items-center gap-2"
                            disabled={sendConnectionMutation.isPending}
                          >
                            <UserPlus className="h-4 w-4" />
                            Send Request
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Connection Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          {connectionsLoading ? (
            <LoadingSpinner />
          ) : pendingConnections.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground">Connection requests will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingConnections.map((connection) => {
                const requester = connection.requester as UserProfile;
                
                return (
                  <Card key={connection.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{requester?.full_name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">{requester?.role}</Badge>
                        </div>
                      </div>
                      
                      {connection.message && (
                        <CardDescription className="mt-2">
                          <span className="font-medium">Message:</span> {connection.message}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => updateConnectionMutation.mutate({ 
                            connectionId: connection.id, 
                            status: 'accepted' 
                          })}
                          className="flex-1"
                          disabled={updateConnectionMutation.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => updateConnectionMutation.mutate({ 
                            connectionId: connection.id, 
                            status: 'declined' 
                          })}
                          className="flex-1"
                          disabled={updateConnectionMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* My Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          {connectionsLoading ? (
            <LoadingSpinner />
          ) : acceptedConnections.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Connections Yet</h3>
              <p className="text-muted-foreground">Start connecting with others to build your support network!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedConnections.map((connection) => {
                const otherUser = connection.requester_id === user?.id 
                  ? connection.receiver as UserProfile
                  : connection.requester as UserProfile;
                
                return (
                  <Card key={connection.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{otherUser?.full_name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">{otherUser?.role}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <Button className="w-full flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Sent Requests Tab */}
        <TabsContent value="sent" className="space-y-6">
          {connectionsLoading ? (
            <LoadingSpinner />
          ) : sentRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sent Requests</h3>
              <p className="text-muted-foreground">Connection requests you send will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sentRequests.map((connection) => {
                const receiver = connection.receiver as UserProfile;
                
                return (
                  <Card key={connection.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{receiver?.full_name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">{receiver?.role}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sent {new Date(connection.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Send Connection Request Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
            <DialogDescription>
              Send a connection request to {selectedUser?.full_name}. You can include a personal message.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Hi! I'd like to connect with you for mutual support on our journey..."
              value={connectionMessage}
              onChange={(e) => setConnectionMessage(e.target.value)}
              rows={3}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={confirmSendRequest}
                disabled={sendConnectionMutation.isPending}
                className="flex-1"
              >
                Send Request
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMessageDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Connect;