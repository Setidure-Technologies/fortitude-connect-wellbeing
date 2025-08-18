import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Image, Trash2, Edit, Eye } from 'lucide-react';
import { useMediaGallery } from '@/hooks/useMediaGallery';
import { LazyImage } from '@/components/LazyImage';
import { useAuth } from '@/context/AuthContext';
import { MediaGallery } from '@/components/MediaGallery';

export const MediaGalleryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('galleries');
  const { user } = useAuth();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to access media management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Gallery Management</h1>
          <p className="text-muted-foreground">
            Manage photo galleries for users, support groups, and admin content.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="galleries">All Galleries</TabsTrigger>
          <TabsTrigger value="user">User Galleries</TabsTrigger>
          <TabsTrigger value="group">Group Galleries</TabsTrigger>
          <TabsTrigger value="admin">Admin Galleries</TabsTrigger>
        </TabsList>

        <TabsContent value="galleries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Media Galleries</CardTitle>
              <CardDescription>
                Overview of all galleries across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaGallery galleryType="all" showCreateButton={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Photo Galleries</CardTitle>
              <CardDescription>
                Personal photo galleries created by users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaGallery galleryType="user" showCreateButton={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="group" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Group Galleries</CardTitle>
              <CardDescription>
                Photo galleries associated with support groups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaGallery galleryType="group" showCreateButton={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Content Galleries</CardTitle>
              <CardDescription>
                Administrative photo galleries for platform content and events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaGallery galleryType="admin" showCreateButton={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};