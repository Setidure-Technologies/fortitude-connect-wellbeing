
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, User, Calendar, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const forumPosts = [
  {
    id: 1,
    title: "How do you deal with chemo brain?",
    content: "I'm halfway through my treatment and struggling with memory and concentration. Any tips?",
    author: "Sarah M.",
    role: "Patient",
    tags: ["chemo", "side-effects", "memory"],
    reactions: { hearts: 12, comments: 8 },
    timeAgo: "2 hours ago",
    anonymous: false
  },
  {
    id: 2,
    title: "Celebrating 2 years cancer-free!",
    content: "Just wanted to share some hope with everyone here. The journey was tough but here I am, stronger than ever.",
    author: "Anonymous",
    role: "Survivor", 
    tags: ["celebration", "hope", "survivor"],
    reactions: { hearts: 45, comments: 23 },
    timeAgo: "5 hours ago",
    anonymous: true
  },
  {
    id: 3,
    title: "Supporting my teenage daughter",
    content: "My 16-year-old was just diagnosed. How do I help her cope with the emotional side while staying strong myself?",
    author: "Michelle K.",
    role: "Caregiver",
    tags: ["teenager", "parent", "emotional-support"],
    reactions: { hearts: 18, comments: 15 },
    timeAgo: "1 day ago",
    anonymous: false
  }
];

const Forum = () => {
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const filteredPosts = forumPosts.filter(post => {
    const matchesRole = filterRole === "all" || post.role.toLowerCase() === filterRole;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
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
                  <Input id="post-title" placeholder="What's on your mind?" />
                </div>
                <div>
                  <Label htmlFor="post-content">Your Message</Label>
                  <Textarea id="post-content" placeholder="Share your thoughts, questions, or experiences..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="post-tags">Tags (comma-separated)</Label>
                  <Input id="post-tags" placeholder="chemo, support, questions..." />
                </div>
                <div className="flex items-center gap-4">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="survivor">Survivor</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Post anonymously
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setIsCreatePostOpen(false)} className="flex-1">
                    Share Post
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
                      {post.author} • {post.role}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.timeAgo}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4 leading-relaxed">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{post.reactions.hearts}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-600 hover:text-brand-blue transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">{post.reactions.comments} replies</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
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
