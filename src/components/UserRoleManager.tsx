import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Heart } from 'lucide-react';

type UserRole = 'admin' | 'ngo' | 'patient' | 'survivor' | 'caregiver' | 'volunteer';

const UserRoleManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

  // Check current user role from database
  const { data: currentUserProfile } = useQuery({
    queryKey: ['current-user-role', user?.id],
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

  // Fetch all users (admin only)
  const { data: users } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: currentUserProfile?.role === 'admin',
  });

  // Update user role mutation using secure admin function
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      // Use the secure admin function to update role with audit logging
      const { error } = await supabase.rpc('sync_user_role', {
        user_id: userId,
        new_role: newRole
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully with audit logging.",
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setSelectedUserId('');
      setSelectedRole('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role. Admin privileges required.",
        variant: "destructive",
      });
    },
  });

  const handleRoleUpdate = () => {
    if (selectedUserId && selectedRole) {
      updateRoleMutation.mutate({ userId: selectedUserId, newRole: selectedRole as UserRole });
    }
  };

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'ngo':
        return <Users className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'ngo':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (currentUserProfile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Role Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="ngo">NGO/Organization</SelectItem>
                <SelectItem value="patient">Patient/User</SelectItem>
                <SelectItem value="survivor">Survivor</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleRoleUpdate}
              disabled={!selectedUserId || !selectedRole || updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{user.full_name || 'No name'}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <Badge className={getRoleColor(user.role)}>
                  <span className="flex items-center gap-1">
                    {getRoleIcon(user.role)}
                    {user.role || 'patient'}
                  </span>
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleManager;
