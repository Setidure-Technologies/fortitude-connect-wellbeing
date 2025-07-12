import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AwarenessStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_description: string | null;
  source: string | null;
  display_order: number | null;
  is_active: boolean;
  updated_at: string;
}

const StatsManager = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<AwarenessStat | null>(null);
  const [newStat, setNewStat] = useState({
    stat_key: '',
    stat_value: '',
    stat_description: '',
    source: '',
    display_order: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-awareness-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('awareness_stats')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AwarenessStat[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (stat: typeof newStat) => {
      const { data, error } = await supabase
        .from('awareness_stats')
        .insert({
          stat_key: stat.stat_key,
          stat_value: stat.stat_value,
          stat_description: stat.stat_description || null,
          source: stat.source || null,
          display_order: stat.display_order
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-awareness-stats'] });
      toast({ title: 'Stat created successfully' });
      setIsAddDialogOpen(false);
      setNewStat({ stat_key: '', stat_value: '', stat_description: '', source: '', display_order: 0 });
    },
    onError: (error) => {
      toast({ title: 'Error creating stat', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AwarenessStat> }) => {
      const { data, error } = await supabase
        .from('awareness_stats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-awareness-stats'] });
      toast({ title: 'Stat updated successfully' });
      setEditingStat(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating stat', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('awareness_stats')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-awareness-stats'] });
      toast({ title: 'Stat deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting stat', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newStat);
  };

  const toggleActive = (stat: AwarenessStat) => {
    updateMutation.mutate({
      id: stat.id,
      updates: { is_active: !stat.is_active }
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cancer Awareness Stats</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Awareness Stat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Stat Key (e.g., 'New Cancer Cases')"
                value={newStat.stat_key}
                onChange={(e) => setNewStat({ ...newStat, stat_key: e.target.value })}
                required
              />
              <Input
                placeholder="Stat Value (e.g., '1.9 million')"
                value={newStat.stat_value}
                onChange={(e) => setNewStat({ ...newStat, stat_value: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={newStat.stat_description}
                onChange={(e) => setNewStat({ ...newStat, stat_description: e.target.value })}
              />
              <Input
                placeholder="Source (e.g., 'American Cancer Society 2024')"
                value={newStat.source}
                onChange={(e) => setNewStat({ ...newStat, source: e.target.value })}
              />
              <Input
                placeholder="Display Order"
                type="number"
                value={newStat.display_order}
                onChange={(e) => setNewStat({ ...newStat, display_order: parseInt(e.target.value) })}
              />
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Stat'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {stats?.map((stat) => (
          <Card key={stat.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {stat.stat_key}: {stat.stat_value}
                    </CardTitle>
                    {stat.stat_description && (
                      <p className="text-gray-600 mt-1">{stat.stat_description}</p>
                    )}
                    {stat.source && (
                      <p className="text-sm text-gray-500 mt-1">Source: {stat.source}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Order: {stat.display_order}</Badge>
                  <Badge variant={stat.is_active ? 'default' : 'secondary'}>
                    {stat.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(stat)}
                  >
                    {stat.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(stat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsManager;