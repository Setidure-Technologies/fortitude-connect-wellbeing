import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, MessageCircle, Check, X, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ConnectionRequest {
  id: string;
  requester_id: string;
  target_role: string;
  age_range: string | null;
  location: string | null;
  message: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

interface ConnectionResponse {
  id: string;
  request_id: string;
  responder_id: string;
  status: string;
  message: string | null;
  created_at: string;
}

interface UserConnection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  connection_type: string;
  message: string | null;
  created_at: string;
  accepted_at: string | null;
}

const ConnectionManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-requests' | 'responses' | 'connections'>('browse');
  
  const [newRequest, setNewRequest] = useState({
    target_role: '',
    age_range: '',
    location: '',
    message: ''
  });

  // Fetch connection requests
  const { data: connectionRequests } = useQuery({
    queryKey: ['connection-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('is_active', true)
        .neq('requester_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ConnectionRequest[];
    },
    enabled: !!user
  });

  // Fetch my requests
  const { data: myRequests } = useQuery({
    queryKey: ['my-connection-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('requester_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ConnectionRequest[];
    },
    enabled: !!user
  });

  // Fetch my connections
  const { data: myConnections } = useQuery({
    queryKey: ['my-connections', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_connections_enhanced')
        .select('*')
        .or(`requester_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserConnection[];
    },
    enabled: !!user
  });

  // Create connection request
  const createRequestMutation = useMutation({
    mutationFn: async (request: typeof newRequest) => {
      const { data, error } = await supabase
        .from('connection_requests')
        .insert({
          requester_id: user?.id,
          target_role: request.target_role as 'patient' | 'survivor' | 'caregiver' | 'volunteer',
          age_range: request.age_range || null,
          location: request.location || null,
          message: request.message || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-connection-requests'] });
      toast({ title: 'Connection request created successfully' });
      setIsRequestDialogOpen(false);
      setNewRequest({ target_role: '', age_range: '', location: '', message: '' });
    },
    onError: (error) => {
      toast({ title: 'Error creating request', description: error.message, variant: 'destructive' });
    }
  });

  // Respond to connection request
  const respondToRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, message }: { requestId: string; status: string; message?: string }) => {
      const { data, error } = await supabase
        .from('connection_responses')
        .insert({
          request_id: requestId,
          responder_id: user?.id,
          status,
          message: message || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] });
      toast({ title: 'Response sent successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error sending response', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    createRequestMutation.mutate(newRequest);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Connection Center</h2>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Connection Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <Select
                value={newRequest.target_role}
                onValueChange={(value) => setNewRequest({ ...newRequest, target_role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Looking for..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Cancer Patients</SelectItem>
                  <SelectItem value="survivor">Survivors</SelectItem>
                  <SelectItem value="caregiver">Caregivers</SelectItem>
                  <SelectItem value="volunteer">Volunteers</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Age range (e.g., 25-35)"
                value={newRequest.age_range}
                onChange={(e) => setNewRequest({ ...newRequest, age_range: e.target.value })}
              />
              
              <Input
                placeholder="Location (optional)"
                value={newRequest.location}
                onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
              />
              
              <Textarea
                placeholder="Tell others about yourself and what kind of connection you're looking for..."
                value={newRequest.message}
                onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                rows={4}
              />
              
              <Button type="submit" disabled={createRequestMutation.isPending || !newRequest.target_role}>
                {createRequestMutation.isPending ? 'Creating...' : 'Create Request'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        {[
          { key: 'browse', label: 'Browse Requests' },
          { key: 'my-requests', label: 'My Requests' },
          { key: 'responses', label: 'Responses' },
          { key: 'connections', label: 'My Connections' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-2 px-4 ${
              activeTab === tab.key
                ? 'border-b-2 border-brand-blue text-brand-blue font-medium'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browse Requests */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {connectionRequests?.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Looking for {request.target_role}s
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      {request.age_range && (
                        <Badge variant="outline">Age: {request.age_range}</Badge>
                      )}
                      {request.location && (
                        <Badge variant="outline">📍 {request.location}</Badge>
                      )}
                      <Badge variant="secondary">{formatTimeAgo(request.created_at)}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondToRequestMutation.mutate({
                        requestId: request.id,
                        status: 'interested'
                      })}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Interested
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {request.message && (
                <CardContent>
                  <p className="text-gray-600">{request.message}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* My Requests */}
      {activeTab === 'my-requests' && (
        <div className="space-y-4">
          {myRequests?.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Looking for {request.target_role}s
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      {request.age_range && (
                        <Badge variant="outline">Age: {request.age_range}</Badge>
                      )}
                      {request.location && (
                        <Badge variant="outline">📍 {request.location}</Badge>
                      )}
                      <Badge variant={request.is_active ? 'default' : 'secondary'}>
                        {request.is_active ? 'Active' : 'Expired'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {request.message && (
                <CardContent>
                  <p className="text-gray-600">{request.message}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {activeTab === 'responses' && (
        <div className="text-center py-8 text-gray-500">
          Response management coming soon...
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="space-y-4">
          {myConnections?.map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Connection</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={connection.status === 'accepted' ? 'default' : 'secondary'}>
                        {connection.status}
                      </Badge>
                      <Badge variant="outline">{connection.connection_type}</Badge>
                    </div>
                  </div>
                  {connection.status === 'accepted' && (
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionManager;
