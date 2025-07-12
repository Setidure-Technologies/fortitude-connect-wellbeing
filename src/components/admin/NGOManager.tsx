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
import { Plus, Edit, Trash2, Building, Eye, EyeOff, Phone, Mail, Globe } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface NGO {
  id: string;
  name: string;
  description: string | null;
  focus_area: string | null;
  location: string | null;
  region: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  services_offered: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const NGOManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNGO, setEditingNGO] = useState<NGO | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    focus_area: '',
    location: '',
    region: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    services_offered: '',
    is_active: true,
  });

  // Check if user is admin
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

  const isAdmin = userProfile?.role === 'admin';

  // Fetch NGOs
  const { data: ngos, isLoading } = useQuery({
    queryKey: ['ngos-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ngos')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as NGO[];
    },
    enabled: isAdmin,
  });

  // Create NGO mutation
  const createNGOMutation = useMutation({
    mutationFn: async (ngoData: typeof formData) => {
      const services = ngoData.services_offered
        ? ngoData.services_offered.split(',').map(s => s.trim()).filter(Boolean)
        : null;

      const { data, error } = await supabase
        .from('ngos')
        .insert({
          ...ngoData,
          services_offered: services,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "NGO Created",
        description: "NGO has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['ngos-admin'] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create NGO.",
        variant: "destructive",
      });
    },
  });

  // Update NGO mutation
  const updateNGOMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const services = data.services_offered
        ? data.services_offered.split(',').map(s => s.trim()).filter(Boolean)
        : null;

      const { error } = await supabase
        .from('ngos')
        .update({
          ...data,
          services_offered: services,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "NGO Updated",
        description: "NGO has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['ngos-admin'] });
      setEditingNGO(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update NGO.",
        variant: "destructive",
      });
    },
  });

  // Delete NGO mutation
  const deleteNGOMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ngos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "NGO Deleted",
        description: "NGO has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['ngos-admin'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete NGO.",
        variant: "destructive",
      });
    },
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('ngos')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "NGO status updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['ngos-admin'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      focus_area: '',
      location: '',
      region: '',
      address: '',
      contact_email: '',
      contact_phone: '',
      website: '',
      services_offered: '',
      is_active: true,
    });
  };

  const handleEdit = (ngo: NGO) => {
    setEditingNGO(ngo);
    setFormData({
      name: ngo.name,
      description: ngo.description || '',
      focus_area: ngo.focus_area || '',
      location: ngo.location || '',
      region: ngo.region || '',
      address: ngo.address || '',
      contact_email: ngo.contact_email || '',
      contact_phone: ngo.contact_phone || '',
      website: ngo.website || '',
      services_offered: ngo.services_offered?.join(', ') || '',
      is_active: ngo.is_active,
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "NGO name is required.",
        variant: "destructive",
      });
      return;
    }

    if (editingNGO) {
      updateNGOMutation.mutate({ id: editingNGO.id, data: formData });
    } else {
      createNGOMutation.mutate(formData);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Admin access required to manage NGOs.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">NGO Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add NGO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New NGO</DialogTitle>
            </DialogHeader>
            <NGOForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={createNGOMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {editingNGO && (
        <Dialog open={!!editingNGO} onOpenChange={() => setEditingNGO(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit NGO</DialogTitle>
            </DialogHeader>
            <NGOForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={updateNGOMutation.isPending}
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
          {ngos?.map((ngo) => (
            <Card key={ngo.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{ngo.name}</h3>
                      <Badge variant={ngo.is_active ? "default" : "secondary"}>
                        {ngo.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {ngo.focus_area && (
                        <Badge variant="outline">{ngo.focus_area}</Badge>
                      )}
                    </div>
                    {ngo.description && (
                      <p className="text-slate-600 mb-3">{ngo.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 mb-3">
                      {ngo.location && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {ngo.location} {ngo.region && `(${ngo.region})`}
                        </div>
                      )}
                      {ngo.contact_email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {ngo.contact_email}
                        </div>
                      )}
                      {ngo.contact_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {ngo.contact_phone}
                        </div>
                      )}
                      {ngo.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                    {ngo.services_offered && ngo.services_offered.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {ngo.services_offered.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-400">
                      Created: {new Date(ngo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActiveMutation.mutate({
                        id: ngo.id,
                        is_active: !ngo.is_active
                      })}
                      disabled={toggleActiveMutation.isPending}
                    >
                      {ngo.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(ngo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNGOMutation.mutate(ngo.id)}
                      disabled={deleteNGOMutation.isPending}
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

interface NGOFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const NGOForm: React.FC<NGOFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">NGO Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Organization name"
          />
        </div>
        <div>
          <Label htmlFor="focus_area">Focus Area</Label>
          <Input
            id="focus_area"
            value={formData.focus_area}
            onChange={(e) => setFormData({ ...formData, focus_area: e.target.value })}
            placeholder="e.g., Cancer Support, Treatment"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the organization"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, Country"
          />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            placeholder="State/Province"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Full address"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            placeholder="contact@ngo.org"
          />
        </div>
        <div>
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://www.ngo.org"
        />
      </div>

      <div>
        <Label htmlFor="services_offered">Services Offered (comma-separated)</Label>
        <Textarea
          id="services_offered"
          value={formData.services_offered}
          onChange={(e) => setFormData({ ...formData, services_offered: e.target.value })}
          placeholder="Support Groups, Counseling, Financial Aid, Educational Resources"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
        />
        <Label htmlFor="is_active">Active organization</Label>
      </div>

      <div className="flex gap-3">
        <Button onClick={onSubmit} disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save NGO'}
        </Button>
      </div>
    </div>
  );
};

export default NGOManager;