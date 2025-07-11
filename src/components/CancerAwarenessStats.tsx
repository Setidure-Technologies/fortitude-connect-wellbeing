import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AwarenessStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_description: string;
  display_order: number;
  source: string;
}

const CancerAwarenessStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['awareness-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('awareness_stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as AwarenessStat[];
    }
  });

  const getStatIcon = (statKey: string) => {
    switch (statKey) {
      case 'new_cases_india':
        return <Users className="h-6 w-6 text-red-500" />;
      case 'annual_deaths':
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case 'early_detection_rate':
        return <Shield className="h-6 w-6 text-blue-500" />;
      case 'survival_rate':
        return <Heart className="h-6 w-6 text-purple-500" />;
      case 'lifetime_risk':
        return <TrendingUp className="h-6 w-6 text-yellow-500" />;
      default:
        return <Users className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatColor = (statKey: string) => {
    switch (statKey) {
      case 'new_cases_india':
        return 'border-red-200 bg-red-50 dark:bg-red-950/20';
      case 'annual_deaths':
        return 'border-orange-200 bg-orange-50 dark:bg-orange-950/20';
      case 'early_detection_rate':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20';
      case 'survival_rate':
        return 'border-purple-200 bg-purple-50 dark:bg-purple-950/20';
      case 'lifetime_risk':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cancer in India: The Reality</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cancer in India: The Reality</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Understanding the scale of cancer in India helps us realize why early awareness, 
            community support, and timely intervention are crucial for saving lives.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {stats.map((stat) => (
            <Card 
              key={stat.id} 
              className={`relative overflow-hidden border-2 ${getStatColor(stat.stat_key)} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  {getStatIcon(stat.stat_key)}
                  <Badge variant="outline" className="text-xs">
                    {stat.source.split('/')[0]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {stat.stat_value}
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {stat.stat_description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Source: {stat.source}
                </p>
              </CardContent>
              
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/50 dark:bg-black/20 rounded-2xl p-8 border backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-4">
            Together, We Can Change These Numbers
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Early detection saves lives. Community support provides strength. 
            Knowledge empowers action. Join Fortitude Network in the fight against cancer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              🔍 Early Detection Awareness
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              🤝 Community Support
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              📚 Education & Resources
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              💪 Survivor Stories
            </Badge>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                The Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                With only 29% of cancers detected early in India, we face a critical challenge. 
                Late diagnosis often means limited treatment options and lower survival rates.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                The Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Through awareness, regular screening, community support, and platforms like 
                Fortitude Network, we can improve early detection and provide crucial support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CancerAwarenessStats;