import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Shield, Clock, User, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  details: any;
  created_at: string;
  admin_profile?: {
    full_name: string;
    email: string;
  };
  target_profile?: {
    full_name: string;
    email: string;
  };
}

const SecurityAuditLog = () => {
  const { userRole } = useAuth();

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    enabled: userRole === 'admin',
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'promote_to_admin':
        return 'bg-red-100 text-red-800';
      case 'role_sync':
        return 'bg-yellow-100 text-yellow-800';
      case 'force_role_sync':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'promote_to_admin':
        return <Shield className="h-4 w-4" />;
      case 'role_sync':
      case 'force_role_sync':
        return <User className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (userRole !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Loading audit logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Log
        </CardTitle>
        <p className="text-sm text-slate-600">
          Track all administrative actions and role changes
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getActionColor(log.action)}>
                        <span className="flex items-center gap-1">
                          {getActionIcon(log.action)}
                          {log.action.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p>
                      <strong>Admin ID:</strong> {log.admin_id}
                    </p>
                    {log.target_user_id && (
                      <p>
                        <strong>Target User ID:</strong> {log.target_user_id}
                      </p>
                    )}
                    {log.details && (
                      <div className="mt-2">
                        <strong>Details:</strong>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No audit logs found</p>
                <p className="text-sm">Administrative actions will appear here</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;