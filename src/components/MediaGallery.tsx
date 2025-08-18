import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Upload, Image, FileText, MoreHorizontal, Trash2 } from 'lucide-react';
import { useMediaGallery } from '@/hooks/useMediaGallery';
import { LazyImage } from '@/components/LazyImage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

interface MediaGalleryProps {
  galleryType?: string;
  entityId?: string;
  showCreateButton?: boolean;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  galleryType = 'user',
  entityId,
  showCreateButton = true
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string>('');
  const [newGallery, setNewGallery] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  
  const { galleries, loading, uploading, createGallery, uploadToGallery, deleteGallery } = useMediaGallery();
  const { user } = useAuth();

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createGallery(
      newGallery.name,
      newGallery.description,
      galleryType,
      newGallery.isPublic
    );
    if (result) {
      setCreateDialogOpen(false);
      setNewGallery({ name: '', description: '', isPublic: true });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !selectedGallery) return;

    const result = await uploadToGallery(selectedGallery, uploadFile, uploadCaption);
    if (result) {
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadCaption('');
      setSelectedGallery('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const userGalleries = galleries.filter(g => 
    galleryType === 'user' ? g.gallery_type === 'user' : 
    galleryType === 'group' ? g.gallery_type === 'group' : 
    g.gallery_type === galleryType
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Photo Galleries</h2>
          <p className="text-muted-foreground">Manage and share your photos</p>
        </div>
        {showCreateButton && (
          <div className="flex gap-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Gallery
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Gallery</DialogTitle>
                  <DialogDescription>
                    Create a new photo gallery to organize your images.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGallery} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Gallery Name</Label>
                    <Input
                      id="name"
                      value={newGallery.name}
                      onChange={(e) => setNewGallery({ ...newGallery, name: e.target.value })}
                      placeholder="My Photo Gallery"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newGallery.description}
                      onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                      placeholder="Describe your gallery..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public"
                      checked={newGallery.isPublic}
                      onCheckedChange={(checked) => setNewGallery({ ...newGallery, isPublic: checked })}
                    />
                    <Label htmlFor="public">Make gallery public</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Create Gallery
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {userGalleries.length > 0 && (
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Photo</DialogTitle>
                    <DialogDescription>
                      Add a new photo to one of your galleries.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gallery">Select Gallery</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedGallery}
                        onChange={(e) => setSelectedGallery(e.target.value)}
                        required
                      >
                        <option value="">Choose a gallery...</option>
                        {userGalleries.filter(g => g.owner_id === user?.id).map(gallery => (
                          <option key={gallery.id} value={gallery.id}>
                            {gallery.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Photo</Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                      {uploadFile && (
                        <p className="text-sm text-muted-foreground">
                          {uploadFile.name} ({formatFileSize(uploadFile.size)})
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caption">Caption</Label>
                      <Input
                        id="caption"
                        value={uploadCaption}
                        onChange={(e) => setUploadCaption(e.target.value)}
                        placeholder="Add a caption..."
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>

      {userGalleries.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No galleries yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first gallery to start organizing your photos.
            </p>
            {showCreateButton && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Gallery
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGalleries.map(gallery => (
            <Card key={gallery.id} className="overflow-hidden">
              <div className="relative">
                {gallery.media_files && gallery.media_files.length > 0 ? (
                  <LazyImage
                    src={gallery.media_files[0].file_url}
                    alt={gallery.media_files[0].caption || gallery.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Image className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {gallery.owner_id === user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => deleteGallery(gallery.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Gallery
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{gallery.name}</CardTitle>
                {gallery.description && (
                  <CardDescription className="mb-3">
                    {gallery.description}
                  </CardDescription>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {gallery.media_files?.length || 0} photo{(gallery.media_files?.length || 0) !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    {gallery.is_public ? (
                      <>
                        <FileText className="w-3 h-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3" />
                        Private
                      </>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};