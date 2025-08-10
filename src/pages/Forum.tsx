
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, User, Calendar, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const Forum = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: '',
    postType: 'question' as const,
    isAnonymous: false
  });

  // Fetch forum posts with related data
  const { data: posts, isLoading } = useQuery({
    queryKey: ['forum-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username,
            role
          ),
          post_reactions(count),
          comments(count),
          post_tags(tag)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postPayload: typeof postData) => {
      if (!isAuthenticated || !user) throw new Error('Authentication required');
      
      const { data: post, error: postError } = await supabase
        .from('forum_posts')
        .insert({
          title: postPayload.title.trim(),
          content: postPayload.content.trim(),
          user_id: user.id,
          post_type: postPayload.postType,
          is_anonymous: postPayload.isAnonymous
        })
        .select()
        .single();

      if (postError) throw postError;

      // Add tags if provided
      if (postPayload.tags.trim()) {
        const tags = postPayload.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        const tagInserts = tags.map(tag => ({
          post_id: post.id,
          tag: tag.toLowerCase()
        }));

        const { error: tagsError } = await supabase
          .from('post_tags')
          .insert(tagInserts);

        if (tagsError) throw tagsError;
      }

      return post;
    },
    onSuccess: () => {
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community!",
      });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      setIsCreatePostOpen(false);
      setPostData({
        title: '',
        content: '',
        tags: '',
        postType: 'question',
        isAnonymous: false
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Post",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete post mutation (admin only)
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!isAuthenticated || !user) throw new Error('Authentication required');
      
      // Check role from database consistently
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Post Deleted",
        description: "The post has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete post.",
        variant: "destructive",
      });
    },
  });

  // Toggle reaction mutation
  const toggleReactionMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!isAuthenticated || !user) throw new Error('Authentication required');

      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', 'heart')
        .single();

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existingReaction.id);
        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'heart'
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to create a post.",
        variant: "destructive",
      });
      return;
    }

    if (!postData.title.trim() || !postData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate(postData);
  };

  const handleReaction = (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to react to posts.",
        variant: "destructive",
      });
      return;
    }
    toggleReactionMutation.mutate(postId);
  };

  const handleDeletePost = (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in first.",
        variant: "destructive",
      });
      return;
    }
    deletePostMutation.mutate(postId);
  };

  // Query to get current user role from database
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

  const isAdmin = currentUserProfile?.role === 'admin';

  // Filter posts based on search and role
  const filteredPosts = (posts || []).filter(post => {
    const matchesRole = filterRole === "all" || 
      (post.profiles?.role && post.profiles.role.toLowerCase() === filterRole);
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.post_tags || []).some((tagObj: any) => 
                           tagObj.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Community Forum</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Share your experiences, ask questions, and connect with others who understand your journey.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex-1">
          <Input
            placeholder="Search posts, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="survivor">Survivor</SelectItem>
              <SelectItem value="caregiver">Caregiver</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Share with the Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-title">Title</Label>
                  <Input 
                    id="post-title" 
                    placeholder="What's on your mind?"
                    value={postData.title}
                    onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="post-content">Your Message</Label>
                  <Textarea 
                    id="post-content" 
                    placeholder="Share your thoughts, questions, or experiences..." 
                    rows={4}
                    value={postData.content}
                    onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="post-tags">Tags (comma-separated)</Label>
                  <Input 
                    id="post-tags" 
                    placeholder="chemo, support, questions..."
                    value={postData.tags}
                    onChange={(e) => setPostData(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Select 
                    value={postData.postType} 
                    onValueChange={(value: any) => setPostData(prev => ({ ...prev, postType: value }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="anonymous" 
                      checked={postData.isAnonymous}
                      onCheckedChange={(checked) => 
                        setPostData(prev => ({ ...prev, isAnonymous: !!checked }))
                      }
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      Post anonymously
                    </Label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                    className="flex-1"
                  >
                    {createPostMutation.isPending ? 'Sharing...' : 'Share Post'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Forum Posts */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading posts...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 hover:text-brand-blue cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.is_anonymous 
                          ? 'Anonymous' 
                          : (post.profiles?.full_name || post.profiles?.username || 'Unknown')
                        } • {post.profiles?.role || 'Member'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletePostMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4 leading-relaxed">{post.content}</p>
                
                {post.post_tags && post.post_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.post_tags.map((tagObj: any, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tagObj.tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => handleReaction(post.id)}
                    disabled={toggleReactionMutation.isPending}
                    className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{post.post_reactions?.length || 0}</span>
                  </button>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">{post.comments?.length || 0} replies</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-4">
                  <ForumComments postId={post.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No posts found matching your criteria.</p>
          <Button className="mt-4" onClick={() => setIsCreatePostOpen(true)}>
            Be the first to post!
          </Button>
        </div>
      )}
    </div>
  );
};

export default Forum;
