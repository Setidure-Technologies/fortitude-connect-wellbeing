import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface RoleConsistencyCheck {
  profile_role: string | null;
  auth_role: string | null;
  is_consistent: boolean;
}

const RoleDebugPanel = () => {
  const { user, userRole, refreshUserData } = useAuth();
  const [consistency, setConsistency] = useState<RoleConsistencyCheck | null>(null);
  const [loading, setLoading] = useState(false);

  const checkRoleConsistency = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('check_role_consistency', {
        target_user_id: user.id
      });
      
      if (error) {
        console.error('Error checking role consistency:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setConsistency(data[0]);
      }
    } catch (error) {
      console.error('Error checking role consistency:', error);
    } finally {
      setLoading(false);
    }
  };

  const forceRoleSync = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await supabase.rpc('force_role_sync', {
        target_user_id: user.id
      });
      
      // Refresh user data
      await refreshUserData();
      
      // Check consistency again
      await checkRoleConsistency();
    } catch (error) {
      console.error('Error forcing role sync:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      checkRoleConsistency();
    }
  }, [user?.id]);

  if (!user) return null;

  // Only show for admin users in development
  const isAdmin = userRole === 'admin' || user?.user_metadata?.role === 'admin';
  const isDev = import.meta.env.DEV;
  
  if (!isAdmin || !isDev) return null;

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <span>Role Debug Panel</span>
          {consistency?.is_consistent ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Context Role:</p>
            <Badge variant="outline">{userRole || 'None'}</Badge>
          </div>
          <div>
            <p className="font-medium">Auth Metadata:</p>
            <Badge variant="outline">{user?.user_metadata?.role || 'None'}</Badge>
          </div>
        </div>
        
        {consistency && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Profile DB Role:</p>
                <Badge variant="outline">{consistency.profile_role || 'None'}</Badge>
              </div>
              <div>
                <p className="font-medium">Auth DB Role:</p>
                <Badge variant="outline">{consistency.auth_role || 'None'}</Badge>
              </div>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">Consistency Status:</p>
              <Badge variant={consistency.is_consistent ? 'default' : 'destructive'}>
                {consistency.is_consistent ? 'Consistent' : 'Inconsistent'}
              </Badge>
            </div>
          </>
        )}
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={checkRoleConsistency}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Check
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={forceRoleSync}
            disabled={loading}
          >
            Force Sync
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshUserData}
            disabled={loading}
          >
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleDebugPanel;