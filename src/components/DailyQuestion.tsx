import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Heart, Send, Users, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DailyQuestion {
  id: string;
  question: string;
  question_type: string;
  options?: any;
  featured_date: string;
  created_at: string;
}

interface QuestionResponse {
  id: string;
  response_text?: string;
  selected_option?: string;
  is_anonymous: boolean;
  created_at: string;
  user_id: string;
  profiles?: {
    id: string;
    full_name: string;
    role: string;
  };
}

const DailyQuestion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [responseText, setResponseText] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  // Fetch today's question
  const { data: todayQuestion, isLoading } = useQuery({
    queryKey: ['daily-question'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('featured_date', today)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data as DailyQuestion | null;
    }
  });

  // Fetch user's response
  const { data: userResponse } = useQuery({
    queryKey: ['user-daily-response', todayQuestion?.id, user?.id],
    queryFn: async () => {
      if (!todayQuestion || !user) return null;
      
      const { data, error } = await supabase
        .from('question_responses')
        .select('*')
        .eq('question_id', todayQuestion.id)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!todayQuestion && !!user,
  });

  // Fetch all responses for the question
  const { data: allResponses } = useQuery({
    queryKey: ['daily-question-responses', todayQuestion?.id],
    queryFn: async () => {
      if (!todayQuestion) return [];
      
      const { data, error } = await supabase
        .from('question_responses')
        .select(`
          id,
          response_text,
          selected_option,
          is_anonymous,
          created_at,
          user_id,
          profiles:user_id(id, full_name, role)
        `)
        .eq('question_id', todayQuestion.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QuestionResponse[];
    },
    enabled: !!todayQuestion,
  });

  // Submit response mutation
  const submitResponseMutation = useMutation({
    mutationFn: async () => {
      if (!todayQuestion || !user) throw new Error('Missing data');
      
      const responseData = {
        question_id: todayQuestion.id,
        user_id: user.id,
        is_anonymous: isAnonymous,
        ...(todayQuestion.question_type === 'open' ? 
          { response_text: responseText.trim() } : 
          { selected_option: selectedOption }
        )
      };

      const { error } = await supabase
        .from('question_responses')
        .insert(responseData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Response Submitted!",
        description: "Thank you for sharing your thoughts with the community.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-daily-response'] });
      queryClient.invalidateQueries({ queryKey: ['daily-question-responses'] });
      setResponseText('');
      setSelectedOption('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit response.",
        variant: "destructive",
      });
    }
  });

  const handleSubmitResponse = () => {
    if (todayQuestion?.question_type === 'open' && !responseText.trim()) {
      toast({
        title: "Please write a response",
        description: "Your response cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    if (todayQuestion?.question_type !== 'open' && !selectedOption) {
      toast({
        title: "Please select an option",
        description: "You must choose one of the available options.",
        variant: "destructive",
      });
      return;
    }

    submitResponseMutation.mutate();
  };

  // Calculate poll results if it's a poll
  const getPollResults = () => {
    if (!todayQuestion || !allResponses || todayQuestion.question_type === 'open') return null;
    
    const options = todayQuestion.options || [];
    const totalResponses = allResponses.length;
    
    if (totalResponses === 0) return null;

    return options.map((option: string) => {
      const count = allResponses.filter(r => r.selected_option === option).length;
      const percentage = Math.round((count / totalResponses) * 100);
      return { option, count, percentage };
    });
  };

  const pollResults = getPollResults();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!todayQuestion) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Daily Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No question featured today. Check back tomorrow!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            Question of the Day
          </CardTitle>
          <Badge variant="outline" className="text-purple-600">
            {new Date(todayQuestion.featured_date).toLocaleDateString()}
          </Badge>
        </div>
        <CardDescription>
          Share your thoughts and connect with the community
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border">
          <h3 className="font-medium text-lg mb-2">{todayQuestion.question}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {allResponses?.length || 0} responses
            </span>
            <Badge variant="secondary" className="text-xs">
              {todayQuestion.question_type === 'open' ? 'Open Question' : 'Poll'}
            </Badge>
          </div>
        </div>

        {!userResponse ? (
          /* Response Form */
          <div className="space-y-4">
            {todayQuestion.question_type === 'open' ? (
              <Textarea
                placeholder="Share your thoughts..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-[100px] bg-white/70 dark:bg-black/30"
                disabled={!user}
              />
            ) : (
              /* Poll Options */
              <div className="space-y-3">
                <ToggleGroup
                  type="single"
                  value={selectedOption}
                  onValueChange={(value) => setSelectedOption(value || '')}
                  className="flex flex-wrap justify-start gap-2"
                  disabled={!user}
                >
                  {(todayQuestion.options || []).map((option: string, index: number) => (
                    <ToggleGroupItem
                      key={index}
                      value={option}
                      className="px-4 py-2 rounded-full border border-purple-200 data-[state=on]:bg-purple-600 data-[state=on]:text-white hover:bg-purple-50 transition-colors"
                    >
                      {option}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}

            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  />
                  <label htmlFor="anonymous" className="text-sm cursor-pointer">
                    Respond anonymously
                  </label>
                </div>

                <Button 
                  onClick={handleSubmitResponse}
                  disabled={submitResponseMutation.isPending}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Response
                </Button>
              </>
            )}

            {!user && (
              <p className="text-center text-muted-foreground text-sm">
                Please sign in to participate in daily questions
              </p>
            )}
          </div>
        ) : (
          /* User has already responded */
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">Thank you for responding!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your response has been recorded. Check out what others are saying below.
            </p>
          </div>
        )}

        {/* Poll Results */}
        {pollResults && (
          <div className="space-y-3">
            <h4 className="font-medium">Results:</h4>
            {pollResults.map((result, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{result.option}</span>
                  <span>{result.count} votes ({result.percentage}%)</span>
                </div>
                <Progress value={result.percentage} className="h-2" />
              </div>
            ))}
          </div>
        )}

        {/* Toggle Responses View */}
        {allResponses && allResponses.length > 0 && (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowResponses(!showResponses)}
              className="w-full flex items-center gap-2"
            >
              {showResponses ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showResponses ? 'Hide' : 'Show'} Community Responses ({allResponses.length})
            </Button>

            {showResponses && todayQuestion.question_type === 'open' && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allResponses
                  .filter(response => response.response_text?.trim())
                  .map((response) => (
                  <div key={response.id} className="bg-white/70 dark:bg-black/30 rounded-lg p-3 border">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">
                        {response.is_anonymous ? 
                          'Anonymous Community Member' : 
                          response.profiles?.full_name || 'Community Member'
                        }
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(response.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{response.response_text}</p>
                    {!response.is_anonymous && response.profiles?.role && (
                      <Badge variant="outline" className="text-xs mt-2">
                        {response.profiles.role}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyQuestion;