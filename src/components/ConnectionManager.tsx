import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, Check, X, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ConnectionManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch connection requests
  const { data: connectionRequests } = useQuery({
    queryKey: ['connection-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connection_requests')
        .select(`
          *,
          requester:profiles!connection_requests_requester_id_fkey(*)
        `)
        .eq('target_role', user?.user_metadata?.role || 'patient')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch received connection requests
  const { data: receivedRequests } = useQuery({
    queryKey: ['received-requests', user?.id],
    queryFn: async () => {
      // This would need a proper connection system - for now showing concept
      const { data, error } = await supabase
        .from('connection_responses')
        .select(`
          *,
          request:connection_requests!connection_responses_request_id_fkey(
            *,
            requester:profiles!connection_requests_requester_id_fkey(*)
          )
        `)
        .eq('responder_id', user?.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Send connection request
  const sendConnectionMutation = useMutation({
    mutationFn: async ({ targetUserId, message }: { targetUserId: string; message: string }) => {
      const { data, error } = await supabase
        .from('connection_requests')
        .insert({
          requester_id: user?.id,
          target_role: 'patient', // This should be dynamic based on target user
          message,
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
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] });
    },
  });

  // Respond to connection request
  const respondToConnectionMutation = useMutation({
    mutationFn: async ({ requestId, status, message }: { requestId: string; status: string; message?: string }) => {
      const { data, error } = await supabase
        .from('connection_responses')
        .insert({
          request_id: requestId,
          responder_id: user?.id,
          status,
          message,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.status === 'accepted' ? "Connection Accepted" : "Connection Declined",
        description: `You have ${variables.status} the connection request.`,
      });
      queryClient.invalidateQueries({ queryKey: ['received-requests'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Pending Connection Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Pending Connection Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {receivedRequests?.length === 0 ? (
            <p className="text-slate-600 text-center py-4">No pending connection requests</p>
          ) : (
            <div className="space-y-4">
              {receivedRequests?.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.request?.requester?.profile_image_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.request?.requester?.full_name}</p>
                      <p className="text-sm text-slate-600">{request.request?.message}</p>
                      <Badge variant="outline">{request.request?.requester?.role}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondToConnectionMutation.mutate({
                        requestId: request.request?.id,
                        status: 'accepted'
                      })}
                      disabled={respondToConnectionMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respondToConnectionMutation.mutate({
                        requestId: request.request?.id,
                        status: 'declined'
                      })}
                      disabled={respondToConnectionMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Your Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 text-center py-4">
            Your accepted connections will appear here. You can start private chats with connected users.
          </p>
          {/* This would show accepted connections with chat buttons */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionManager;