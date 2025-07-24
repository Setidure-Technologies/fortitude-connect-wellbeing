import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const promoteToAdminMutation = useMutation({
    mutationFn: async (userEmail: string) => {
      // Use the secure admin promotion function with audit logging
      const { error } = await supabase.rpc('promote_user_to_admin', {
        target_email: userEmail
      });
      
      if (error) throw error;
      
      return { email: userEmail };
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "User has been promoted to admin with audit logging and notification sent.",
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user to admin. Make sure you have admin privileges.",
        variant: "destructive",
      });
    },
  });

  const handlePromoteToAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      promoteToAdminMutation.mutate(email.trim());
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-blue" />
          Admin Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePromoteToAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email Address</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="Enter email to make admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={promoteToAdminMutation.isPending}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {promoteToAdminMutation.isPending ? 'Promoting...' : 'Promote to Admin'}
          </Button>
        </form>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong>
          </p>
          <ol className="text-sm text-blue-700 mt-2 space-y-1">
            <li>1. Enter the email of the user you want to make admin</li>
            <li>2. The user must already have an account</li>
            <li>3. After promotion, they'll have full admin access</li>
            <li>4. Refresh the page to see changes</li>
          </ol>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Security:</strong> This uses secure database functions with audit logging and requires admin privileges.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSetup;