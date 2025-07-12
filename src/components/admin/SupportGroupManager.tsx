import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Lock, Unlock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface SupportGroup {
  id: string;
  name: string;
  description: string | null;
  group_type: string;
  is_private: boolean;
  max_members: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const SupportGroupManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SupportGroup | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    group_type: 'general',
    is_private: false,
    max_members: 20,
  });

  // Check if user is admin or NGO
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
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

  const canManage = userProfile?.role === 'admin' || userProfile?.role === 'ngo';

  // Fetch support groups
  const { data: groups, isLoading } = useQuery({
    queryKey: ['support-groups-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_groups')
        .select(`
          *,
          support_group_members(count)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as (SupportGroup & { 
        support_group_members: { count: number }[];
      })[];
    },
    enabled: canManage,
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: typeof formData) => {
      const { data, error } = await supabase
        .from('support_groups')
        .insert({
          ...groupData,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Support Group Created",
        description: "Support group has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['support-groups-admin'] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create support group.",
        variant: "destructive",
      });
    },
  });

  // Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('support_groups')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Support Group Updated",
        description: "Support group has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['support-groups-admin'] });
      setEditingGroup(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update support group.",
        variant: "destructive",
      });
    },
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('support_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Support Group Deleted",
        description: "Support group has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['support-groups-admin'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete support group.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      group_type: 'general',
      is_private: false,
      max_members: 20,
    });
  };

  const handleEdit = (group: SupportGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      group_type: group.group_type,
      is_private: group.is_private,
      max_members: group.max_members || 20,
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Group name is required.",
        variant: "destructive",
      });
      return;
    }

    if (editingGroup) {
      updateGroupMutation.mutate({ id: editingGroup.id, data: formData });
    } else {
      createGroupMutation.mutate(formData);
    }
  };

  if (!canManage) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Admin or NGO access required to manage support groups.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Group Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Support Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Support Group</DialogTitle>
            </DialogHeader>
            <SupportGroupForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={createGroupMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {editingGroup && (
        <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Support Group</DialogTitle>
            </DialogHeader>
            <SupportGroupForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={updateGroupMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {groups?.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <Badge variant={group.is_private ? "destructive" : "default"}>
                        {group.is_private ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                        {group.is_private ? "Private" : "Public"}
                      </Badge>
                      <Badge variant="outline">{group.group_type}</Badge>
                    </div>
                    {group.description && (
                      <p className="text-slate-600 mb-2">{group.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.support_group_members?.[0]?.count || 0} members
                        {group.max_members && ` / ${group.max_members} max`}
                      </div>
                      <span>
                        Created: {new Date(group.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGroupMutation.mutate(group.id)}
                      disabled={deleteGroupMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

interface SupportGroupFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SupportGroupForm: React.FC<SupportGroupFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Group Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Support group name"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the group"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="group_type">Group Type</Label>
          <Select
            value={formData.group_type}
            onValueChange={(value) => setFormData({ ...formData, group_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="cancer_type">Cancer Type Specific</SelectItem>
              <SelectItem value="treatment">Treatment Support</SelectItem>
              <SelectItem value="caregiver">Caregiver Support</SelectItem>
              <SelectItem value="survivor">Survivor Network</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="max_members">Max Members</Label>
          <Input
            id="max_members"
            type="number"
            value={formData.max_members}
            onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) || 20 })}
            min="1"
            max="500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_private"
          checked={formData.is_private}
          onCheckedChange={(checked) => setFormData({ ...formData, is_private: !!checked })}
        />
        <Label htmlFor="is_private">Private group (invitation only)</Label>
      </div>

      <div className="flex gap-3">
        <Button onClick={onSubmit} disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save Group'}
        </Button>
      </div>
    </div>
  );
};

export default SupportGroupManager;