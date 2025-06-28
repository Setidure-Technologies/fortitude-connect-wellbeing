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
      // First, try to find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', userEmail)
        .single();
      
      if (userError || !userData) {
        throw new Error('User not found. Make sure the user has an account.');
      }
      
      // Update the user's role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', userEmail);
      
      if (updateError) throw updateError;
      
      return userData;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "User has been promoted to admin. Please refresh the page.",
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user to admin.",
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
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a temporary admin setup. For production, you should set up proper database functions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSetup;