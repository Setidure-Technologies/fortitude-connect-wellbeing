import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface MediaFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  caption?: string;
  uploaded_by: string;
  created_at: string;
}

interface MediaGallery {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  gallery_type: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  media_files?: MediaFile[];
}

export const useMediaGallery = () => {
  const [galleries, setGalleries] = useState<MediaGallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGalleries = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_galleries')
        .select(`
          *,
          media_files (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleries(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load galleries",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createGallery = async (name: string, description: string, galleryType: string = 'user', isPublic: boolean = true) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('media_galleries')
        .insert({
          name,
          description,
          owner_id: user.id,
          gallery_type: galleryType,
          is_public: isPublic
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Gallery created",
        description: "Your gallery has been created successfully."
      });

      fetchGalleries();
      return data;
    } catch (error: any) {
      toast({
        title: "Failed to create gallery",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const uploadToGallery = async (galleryId: string, file: File, caption?: string) => {
    if (!user?.id) return null;

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${galleryId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      // Save to database
      const { data, error } = await supabase
        .from('media_files')
        .insert({
          gallery_id: galleryId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          caption,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully."
      });

      fetchGalleries();
      return data;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteGallery = async (galleryId: string) => {
    try {
      const { error } = await supabase
        .from('media_galleries')
        .delete()
        .eq('id', galleryId);

      if (error) throw error;

      toast({
        title: "Gallery deleted",
        description: "Gallery has been deleted successfully."
      });

      fetchGalleries();
    } catch (error: any) {
      toast({
        title: "Failed to delete gallery",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [user?.id]);

  return {
    galleries,
    loading,
    uploading,
    fetchGalleries,
    createGallery,
    uploadToGallery,
    deleteGallery
  };
};