import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, BookOpen, Youtube, Phone, Building2, Globe, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  external_url?: string;
  image_url?: string;
  category: string;
  created_at: string;
  content?: string;
}

interface ResourceLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags?: string[];
}

interface NGO {
  id: string;
  name: string;
  description: string;
  focus_area: string;
  location: string;
  region: string;
  contact_email?: string;
  website?: string;
  services_offered?: string[];
}

interface Professional {
  id: string;
  name: string;
  specialization: string;
  location?: string;
  contact_email?: string;
  phone?: string;
  website?: string;
  is_active: boolean;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('articles');

  // Fetch articles
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    }
  });

  // Fetch resource links
  const { data: resourceLinks, isLoading: linksLoading } = useQuery({
    queryKey: ['resource_links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_links')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ResourceLink[];
    }
  });

// Fetch NGOs
const { data: ngos, isLoading: ngosLoading } = useQuery({
  queryKey: ['ngos'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return data as NGO[];
  }
});

// Fetch healthcare professionals
const { data: professionals, isLoading: professionalsLoading } = useQuery({
  queryKey: ['healthcare_professionals'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('healthcare_professionals')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return data as Professional[];
  }
});

  // Filter functions
  const filteredArticles = articles?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredLinks = resourceLinks?.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredNGOs = ngos?.filter(ngo =>
    ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.region?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'helpline': return <Phone className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Resources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive cancer support resources, expert articles, helpful links, and NGO directory for your journey
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
  <TabsList className="grid w-full grid-cols-4">
    <TabsTrigger value="articles" className="flex items-center gap-2">
      <BookOpen className="h-4 w-4" />
      Latest Articles
    </TabsTrigger>
    <TabsTrigger value="links" className="flex items-center gap-2">
      <ExternalLink className="h-4 w-4" />
      Support Links
    </TabsTrigger>
    <TabsTrigger value="ngos" className="flex items-center gap-2">
      <Building2 className="h-4 w-4" />
      NGOs in India
    </TabsTrigger>
    <TabsTrigger value="professionals" className="flex items-center gap-2">
      <Phone className="h-4 w-4" />
      Professionals
    </TabsTrigger>
  </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          {articlesLoading ? (
            <LoadingSpinner />
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Articles will appear here once published.'}
              </p>
            </div>
          ) : (
            <div className="h-48 overflow-hidden rounded-t-lg">
              {article.image_url && (
                <img src={article.image_url} alt={`${article.title} image`} className="w-full h-48 object-cover" loading="lazy" decoding="async" />
              )}
            </div>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="mb-2">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                      {article.external_url && (
                        <Button asChild size="sm" variant="outline">
                          <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                            Read More <ArrowRight className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Support Links Tab */}
        <TabsContent value="links" className="space-y-6">
          {linksLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Category sections */}
              {['youtube', 'website', 'helpline'].map((category) => {
                const categoryLinks = filteredLinks.filter(link => link.category === category);
                if (categoryLinks.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-semibold capitalize flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {category === 'youtube' ? 'YouTube Channels' : 
                       category === 'website' ? 'Helpful Websites' : 
                       'Support Helplines'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryLinks.map((link) => (
                        <Card key={link.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              {getCategoryIcon(link.category)}
                              {link.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {link.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Button asChild size="sm" className="w-full">
                              <a href={link.url} target="_blank" rel="noopener noreferrer">
                                Visit Resource <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </TabsContent>

        {/* NGOs Tab */}
        <TabsContent value="ngos" className="space-y-6">
          {ngosLoading ? (
            <LoadingSpinner />
          ) : filteredNGOs.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No NGOs Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'NGO listings will appear here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNGOs.map((ngo) => (
                <Card key={ngo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-2">{ngo.name}</span>
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{ngo.focus_area}</Badge>
                      <Badge variant="secondary">{ngo.region}</Badge>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {ngo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <p className="font-medium text-muted-foreground">Location:</p>
                      <p>{ngo.location}</p>
                    </div>
                    
                    {ngo.services_offered && ngo.services_offered.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground mb-1">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {ngo.services_offered.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {ngo.website && (
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <a href={ngo.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        </Button>
                      )}
                      {ngo.contact_email && (
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <a href={`mailto:${ngo.contact_email}`}>
                            Contact
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </Tabs>

      {/* Article inline preview component */}
      {/* ... keep existing code (other components) */}
    </div>
  );
};

const ArticlePreview = ({ article }: { article: Article }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Read <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Close</button>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{article.content || article.excerpt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Resources;