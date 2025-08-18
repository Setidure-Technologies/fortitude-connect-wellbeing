import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export function GlobalNotificationToast() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Subscribe to new notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications-toast')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new;
          
          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
            action: notification.action_url ? (
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <a 
                  href={notification.action_url} 
                  className="text-sm underline hover:no-underline"
                >
                  View
                </a>
              </div>
            ) : undefined,
          });

          // Invalidate notifications query to update UI
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast, queryClient]);

  return null; // This component doesn't render anything visible
}

export default GlobalNotificationToast;