
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Calendar, User, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const stories = [
  {
    id: 1,
    title: "Finding Strength in Community",
    author: "Maria Santos",
    cancerType: "Breast Cancer",
    tone: "Hopeful",
    ageGroup: "40-50",
    excerpt: "When I was first diagnosed, I felt completely alone. But through this community, I found strength I never knew I had...",
    content: "My journey began two years ago with a routine mammogram that changed everything. The words 'you have cancer' echoed in my mind for days. But what I discovered through Fortitude Network was that healing isn't just physical—it's emotional, spiritual, and deeply connected to community.",
    dateShared: "2024-11-15",
    reactions: 89,
    anonymous: false
  },
  {
    id: 2,
    title: "A Mother's Fight and Victory",
    author: "Anonymous",
    cancerType: "Lung Cancer", 
    tone: "Inspirational",
    ageGroup: "30-40",
    excerpt: "Being a single mother with cancer seemed impossible until I learned that vulnerability is actually my greatest strength...",
    content: "As a single mother of two young children, my diagnosis felt like the end of the world. How could I fight this battle while protecting my kids? The community here taught me that asking for help isn't weakness—it's wisdom.",
    dateShared: "2024-11-10",
    reactions: 124,
    anonymous: true
  },
  {
    id: 3,
    title: "Life After Treatment: Rediscovering Joy",
    author: "David Kim",
    cancerType: "Colon Cancer",
    tone: "Hopeful",
    ageGroup: "50-60", 
    excerpt: "Survivorship brought its own challenges, but also unexpected gifts. Here's how I learned to embrace life after cancer...",
    content: "Treatment ended, but my journey didn't. The fear of recurrence, the changed relationships, the new perspective on life—survivorship is complex. Through sharing my story here, I've found purpose in helping others navigate this path.",
    dateShared: "2024-11-05",
    reactions: 67,
    anonymous: false
  }
];

const Stories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTone, setFilterTone] = useState("all");
  const [filterCancerType, setFilterCancerType] = useState("all");
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTone = filterTone === "all" || story.tone.toLowerCase() === filterTone;
    const matchesCancerType = filterCancerType === "all" || story.cancerType.toLowerCase().includes(filterCancerType.toLowerCase());
    return matchesSearch && matchesTone && matchesCancerType;
  });

  const getToneColor = (tone: string) => {
    const colors = {
      'Hopeful': 'bg-brand-green text-green-800',
      'Inspirational': 'bg-brand-yellow text-yellow-800', 
      'Raw': 'bg-brand-pink text-pink-800',
      'Grief': 'bg-slate-200 text-slate-800'
    };
    return colors[tone as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="story-title">Story Title</Label>
                  <Input id="story-title" placeholder="Give your story a meaningful title" />
                </div>
                <div>
                  <Label htmlFor="story-content">Your Story</Label>
                  <Textarea 
                    id="story-content" 
                    placeholder="Share your journey, challenges, victories, and wisdom..."
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cancer-type">Cancer Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breast">Breast Cancer</SelectItem>
                        <SelectItem value="lung">Lung Cancer</SelectItem>
                        <SelectItem value="colon">Colon Cancer</SelectItem>
                        <SelectItem value="blood">Blood Cancer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="story-tone">Story Tone</Label>
                    <Select>
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
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Share anonymously
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Allow community to contact me
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setIsSubmitOpen(false)} className="flex-1">
                    Share Story
                  </Button>
                  <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
                    Save Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <Card key={story.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getToneColor(story.tone)}>
                  {story.tone}
                </Badge>
                <Badge variant="outline">
                  {story.cancerType}
                </Badge>
              </div>
              <CardTitle className="text-lg">{story.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="h-4 w-4" />
                {story.author} • {story.ageGroup}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">
                {story.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {story.reactions}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(story.dateShared).toLocaleDateString()}
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
                            <span>By {selectedStory.author}</span>
                            <Badge className={getToneColor(selectedStory.tone)}>
                              {selectedStory.tone}
                            </Badge>
                            <Badge variant="outline">
                              {selectedStory.cancerType}
                            </Badge>
                          </div>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {selectedStory.content}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors">
                                <Heart className="h-5 w-5" />
                                <span>{selectedStory.reactions}</span>
                              </button>
                            </div>
                            <div className="text-sm text-slate-500">
                              Shared on {new Date(selectedStory.dateShared).toLocaleDateString()}
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
