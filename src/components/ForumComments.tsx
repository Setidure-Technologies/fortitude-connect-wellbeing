import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Reply, Send, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommentRow {
  id: string;
  post_id: string;
  parent_id: string | null;
  user_id: string | null;
  content: string;
  is_anonymous: boolean | null;
  created_at: string;
}

interface ForumCommentsProps {
  postId: string;
}

const ForumComments: React.FC<ForumCommentsProps> = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const { data: comments, isLoading } = useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as CommentRow[];
    },
  });

  const topLevel = useMemo(() => (comments || []).filter(c => !c.parent_id), [comments]);
  const childrenMap = useMemo(() => {
    const map = new Map<string, CommentRow[]>();
    (comments || []).forEach(c => {
      if (c.parent_id) {
        if (!map.has(c.parent_id)) map.set(c.parent_id, []);
        map.get(c.parent_id)!.push(c);
      }
    });
    return map;
  }, [comments]);

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!user) throw new Error('Please sign in to comment.');
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        parent_id: parentId || null,
        user_id: user.id,
        content: content.trim(),
        is_anonymous: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment('');
      setReplyContent('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
    },
    onError: (e: any) => toast({ title: 'Comment failed', description: e.message, variant: 'destructive' }),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post-comments', postId] }),
    onError: (e: any) => toast({ title: 'Delete failed', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <MessageSquare className="h-4 w-4" />
        <span>{comments?.length || 0} replies</span>
      </div>

      {/* New comment */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Add a reply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Write your reply..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => addCommentMutation.mutate({ content: newComment })}
              disabled={!isAuthenticated || !newComment.trim() || addCommentMutation.isPending}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Post Reply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing comments */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading replies...</p>
        ) : topLevel.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies yet. Be the first to reply.</p>
        ) : (
          topLevel.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{c.is_anonymous ? 'Anonymous' : 'Member'}</span>
                  <span>• {new Date(c.created_at).toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 whitespace-pre-wrap">{c.content}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)} className="flex items-center gap-1">
                    <Reply className="h-4 w-4" /> Reply
                  </Button>
                  {user && c.user_id === user.id && (
                    <Button variant="ghost" size="sm" onClick={() => deleteCommentMutation.mutate(c.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  )}
                </div>

                {/* Reply box */}
                {replyingTo === c.id && (
                  <div className="mt-3 space-y-2">
                    <Input placeholder="Write a reply..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={() => addCommentMutation.mutate({ content: replyContent, parentId: c.id })} disabled={!replyContent.trim() || addCommentMutation.isPending}>
                        Reply
                      </Button>
                    </div>
                  </div>
                )}

                {/* Children */}
                {(childrenMap.get(c.id) || []).length > 0 && (
                  <div className="mt-4 pl-4 border-l">
                    {(childrenMap.get(c.id) || []).map(child => (
                      <div key={child.id} className="mb-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{child.is_anonymous ? 'Anonymous' : 'Member'}</span>
                          <span>• {new Date(child.created_at).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm">{child.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumComments;
