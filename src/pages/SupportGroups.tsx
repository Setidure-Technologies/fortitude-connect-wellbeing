import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Lock, Globe, MessageCircle, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  group_type: string;
  max_members: number;
  is_private: boolean;
  created_at: string;
  member_count?: number;
  is_member?: boolean;
}

const SupportGroups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    group_type: 'general',
    max_members: 20,
    is_private: false
  });

  const userRole = user?.user_metadata?.role;
  const canCreateGroups = userRole === 'admin' || userRole === 'ngo';

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('support_groups')
        .select(`
          *,
          support_group_members(count)
        `);

      if (error) throw error;

      const groupsWithCounts = data?.map(group => ({
        ...group,
        member_count: group.support_group_members?.[0]?.count || 0
      })) || [];

      setGroups(groupsWithCounts);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: "Failed to load support groups.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!user || !canCreateGroups) return;

    try {
      const { error } = await supabase
        .from('support_groups')
        .insert([{
          ...newGroup,
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Support group created successfully!",
      });

      setShowCreateDialog(false);
      setNewGroup({
        name: '',
        description: '',
        group_type: 'general',
        max_members: 20,
        is_private: false
      });
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create support group.",
        variant: "destructive",
      });
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('support_group_members')
        .insert([{
          group_id: groupId,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Joined support group!",
      });

      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join support group.",
        variant: "destructive",
      });
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return;
    
    const userRole = user.user_metadata?.role;
    if (userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only admins can delete support groups.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('support_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Support group deleted successfully!",
      });

      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: "Error",
        description: "Failed to delete support group.",
        variant: "destructive",
      });
    }
  };

  const isAdmin = user?.user_metadata?.role === 'admin';

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Groups</h1>
            <p className="text-muted-foreground mt-2">
              Connect with others who understand your journey
            </p>
          </div>
          
          {canCreateGroups && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Support Group</DialogTitle>
                  <DialogDescription>
                    Create a new support group for the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Group name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  />
                  <Textarea
                    placeholder="Group description"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  />
                  <Select
                    value={newGroup.group_type}
                    onValueChange={(value) => setNewGroup({...newGroup, group_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Support</SelectItem>
                      <SelectItem value="cancer_specific">Cancer-Specific</SelectItem>
                      <SelectItem value="caregiver">Caregiver Support</SelectItem>
                      <SelectItem value="survivor">Survivor Network</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="private"
                      checked={newGroup.is_private}
                      onChange={(e) => setNewGroup({...newGroup, is_private: e.target.checked})}
                    />
                    <label htmlFor="private">Private group</label>
                  </div>
                  <Button onClick={createGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search support groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Support Groups Yet</h3>
              <p className="text-muted-foreground">
                {canCreateGroups ? "Create the first support group to get started!" : "Support groups will appear here once created."}
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        {group.name}
                        {group.is_private ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {group.group_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {group.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{group.member_count || 0} members</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => joinGroup(group.id)}
                        disabled={!user}
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Join
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteGroup(group.id)}
                          className="flex items-center gap-1"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportGroups;