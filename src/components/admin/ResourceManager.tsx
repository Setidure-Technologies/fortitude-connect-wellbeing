import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResourceLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
}

const ResourceManager = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceLink | null>(null);
  const [newResource, setNewResource] = useState({
    title: '',
    url: '',
    description: '',
    category: 'general',
    tags: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_links')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ResourceLink[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (resource: typeof newResource) => {
      const { data, error } = await supabase
        .from('resource_links')
        .insert({
          title: resource.title,
          url: resource.url,
          description: resource.description || null,
          category: resource.category,
          tags: resource.tags ? resource.tags.split(',').map(tag => tag.trim()) : null
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast({ title: 'Resource created successfully' });
      setIsAddDialogOpen(false);
      setNewResource({ title: '', url: '', description: '', category: 'general', tags: '' });
    },
    onError: (error) => {
      toast({ title: 'Error creating resource', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ResourceLink> }) => {
      const { data, error } = await supabase
        .from('resource_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast({ title: 'Resource updated successfully' });
      setEditingResource(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating resource', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resource_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast({ title: 'Resource deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting resource', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newResource);
  };

  const toggleActive = (resource: ResourceLink) => {
    updateMutation.mutate({
      id: resource.id,
      updates: { is_active: !resource.is_active }
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Resource Title"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                required
              />
              <Input
                placeholder="URL"
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              />
              <Select
                value={newResource.category}
                onValueChange={(value) => setNewResource({ ...newResource, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Tags (comma-separated)"
                value={newResource.tags}
                onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
              />
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Resource'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {resources?.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {resource.title}
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:text-brand-blue/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardTitle>
                  {resource.description && (
                    <p className="text-gray-600 mt-2">{resource.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={resource.is_active ? 'default' : 'secondary'}>
                    {resource.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(resource)}
                  >
                    {resource.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(resource.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center">
                <Badge variant="outline">{resource.category}</Badge>
                {resource.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResourceManager;