
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Calendar, User, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Stories = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTone, setFilterTone] = useState("all");
  const [filterCancerType, setFilterCancerType] = useState("all");
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    cancer_type: '',
    tone: '',
    age_group: '',
    is_anonymous: false
  });

  // Fetch stories from database
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username
          ),
          story_reactions(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Create story mutation
  const createStoryMutation = useMutation({
    mutationFn: async (storyData: any) => {
      if (!isAuthenticated) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('stories')
        .insert({
          title: storyData.title,
          content: storyData.content,
          excerpt: storyData.content.substring(0, 150) + '...',
          cancer_type: storyData.cancer_type,
          tone: storyData.tone,
          age_group: storyData.age_group,
          is_anonymous: storyData.is_anonymous,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Story Shared",
        description: "Your story has been shared with the community.",
      });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      setIsSubmitOpen(false);
      setFormData({
        title: '',
        content: '',
        cancer_type: '',
        tone: '',
        age_group: '',
        is_anonymous: false
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to share your story. Please try again.",
        variant: "destructive",
      });
    },
  });

  // React to story mutation
  const reactToStoryMutation = useMutation({
    mutationFn: async ({ storyId, reactionType }: { storyId: string, reactionType: string }) => {
      if (!isAuthenticated) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('story_reactions')
        .upsert({
          story_id: storyId,
          user_id: user?.id,
          reaction_type: reactionType,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const filteredStories = stories.filter((story: any) => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (story.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTone = filterTone === "all" || story.tone === filterTone;
    const matchesCancerType = filterCancerType === "all" || story.cancer_type === filterCancerType;
    return matchesSearch && matchesTone && matchesCancerType;
  });

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to share your story.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title || !formData.content || !formData.cancer_type || !formData.tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    createStoryMutation.mutate(formData);
  };

  const handleReaction = (storyId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to react to stories.",
        variant: "destructive",
      });
      return;
    }
    reactToStoryMutation.mutate({ storyId, reactionType: 'heart' });
  };

  const getToneColor = (tone: string) => {
    const colors = {
      'hopeful': 'bg-brand-green text-green-800',
      'inspirational': 'bg-brand-yellow text-yellow-800', 
      'raw': 'bg-brand-pink text-pink-800',
      'grief': 'bg-slate-200 text-slate-800'
    };
    return colors[tone as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Survivor Stories</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Real stories of courage, hope, and resilience from our community members. Every journey is unique, every voice matters.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex-1">
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={filterTone} onValueChange={setFilterTone}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tones</SelectItem>
              <SelectItem value="hopeful">Hopeful</SelectItem>
              <SelectItem value="inspirational">Inspirational</SelectItem>
              <SelectItem value="raw">Raw</SelectItem>
              <SelectItem value="grief">Grief</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterCancerType} onValueChange={setFilterCancerType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Cancer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="breast">Breast</SelectItem>
              <SelectItem value="lung">Lung</SelectItem>
              <SelectItem value="colon">Colon</SelectItem>
              <SelectItem value="blood">Blood</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Share Your Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Share Your Story</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitStory} className="space-y-4">
                <div>
                  <Label htmlFor="story-title">Story Title *</Label>
                  <Input 
                    id="story-title" 
                    placeholder="Give your story a meaningful title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="story-content">Your Story *</Label>
                  <Textarea 
                    id="story-content" 
                    placeholder="Share your journey, challenges, victories, and wisdom..."
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cancer-type">Cancer Type *</Label>
                    <Select value={formData.cancer_type} onValueChange={(value) => setFormData({ ...formData, cancer_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breast">Breast Cancer</SelectItem>
                        <SelectItem value="lung">Lung Cancer</SelectItem>
                        <SelectItem value="colon">Colon Cancer</SelectItem>
                        <SelectItem value="blood">Blood Cancer</SelectItem>
                        <SelectItem value="prostate">Prostate Cancer</SelectItem>
                        <SelectItem value="skin">Skin Cancer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="story-tone">Story Tone *</Label>
                    <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hopeful">Hopeful</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="raw">Raw & Honest</SelectItem>
                        <SelectItem value="grief">Processing Grief</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="age-group">Age Group</Label>
                  <Select value={formData.age_group} onValueChange={(value) => setFormData({ ...formData, age_group: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-30">18-30</SelectItem>
                      <SelectItem value="30-40">30-40</SelectItem>
                      <SelectItem value="40-50">40-50</SelectItem>
                      <SelectItem value="50-60">50-60</SelectItem>
                      <SelectItem value="60+">60+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={formData.is_anonymous}
                      onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    />
                    Share anonymously
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createStoryMutation.isPending}
                  >
                    {createStoryMutation.isPending ? 'Sharing...' : 'Share Story'}
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setIsSubmitOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story: any) => (
          <Card key={story.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getToneColor(story.tone)}>
                  {story.tone}
                </Badge>
                <Badge variant="outline">
                  {story.cancer_type}
                </Badge>
              </div>
              <CardTitle className="text-lg">{story.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="h-4 w-4" />
                {story.is_anonymous ? 'Anonymous' : story.profiles?.full_name || story.profiles?.username || 'Unknown'}
                {story.age_group && ` • ${story.age_group}`}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">
                {story.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <button 
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    onClick={() => handleReaction(story.id)}
                    disabled={reactToStoryMutation.isPending}
                  >
                    <Heart className="h-4 w-4" />
                    {story.story_reactions?.[0]?.count || 0}
                  </button>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(story.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedStory(story)}
                    >
                      Read Full Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    {selectedStory && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedStory.title}</DialogTitle>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>By {selectedStory.is_anonymous ? 'Anonymous' : selectedStory.profiles?.full_name || selectedStory.profiles?.username || 'Unknown'}</span>
                            <Badge className={getToneColor(selectedStory.tone)}>
                              {selectedStory.tone}
                            </Badge>
                            <Badge variant="outline">
                              {selectedStory.cancer_type}
                            </Badge>
                          </div>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {selectedStory.content}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-4">
                              <button 
                                className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                                onClick={() => handleReaction(selectedStory.id)}
                                disabled={reactToStoryMutation.isPending}
                              >
                                <Heart className="h-5 w-5" />
                                <span>{selectedStory.story_reactions?.[0]?.count || 0}</span>
                              </button>
                            </div>
                            <div className="text-sm text-slate-500">
                              Shared on {new Date(selectedStory.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No stories found matching your criteria.</p>
          <Button className="mt-4" onClick={() => setIsSubmitOpen(true)}>
            Share the first story!
          </Button>
        </div>
      )}
    </div>
  );
};

export default Stories;
