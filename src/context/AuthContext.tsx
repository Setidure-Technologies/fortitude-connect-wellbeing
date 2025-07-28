import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState, getSpecificErrorMessage } from '@/lib/auth-cleanup';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  userRole: string | null;
  refreshUserData: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
          
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        // Defer profile fetching to prevent deadlocks
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  // Enhanced function to fetch and sync user profile
  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        if (retryCount < 2) {
          setTimeout(() => fetchUserProfile(userId, retryCount + 1), 1000);
        }
        return;
      }

      if (profile) {
        console.log('Profile fetched:', profile);
        setUserRole(profile.role || 'patient');
        
        // Update user metadata
        setUser(current => current ? {
          ...current,
          user_metadata: {
            ...current.user_metadata,
            role: profile.role || 'patient',
            full_name: profile.full_name || current.user_metadata.full_name
          }
        } : null);

        // Force sync role to auth.users metadata using our new function
        try {
          await supabase.rpc('force_role_sync', { target_user_id: userId });
        } catch (syncError) {
          console.error('Error syncing role:', syncError);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (retryCount < 2) {
        setTimeout(() => fetchUserProfile(userId, retryCount + 1), 1000);
      }
    }
  };

  // Function to refresh user data and role
  const refreshUserData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      await fetchUserProfile(user.id);
      
      // Also refresh the session to get latest metadata
      await supabase.auth.refreshSession();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (loading) {
      return { error: 'Login already in progress. Please wait.' };
    }

    try {
      setLoading(true);
      
      // Clean up any existing auth state before new login
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.log('Sign out failed, continuing with login');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error: getSpecificErrorMessage(error) };
      }

      return {};
    } catch (error) {
      console.error('Login error:', error);
      return { error: getSpecificErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      // Clean up any existing auth state before signup
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error: getSpecificErrorMessage(error) };
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      }

      return {};
    } catch (error) {
      console.error('Signup error:', error);
      return { error: getSpecificErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error: getSpecificErrorMessage(error) };
      }

      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions.",
      });

      return {};
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: getSpecificErrorMessage(error) };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/auth';
        }, 500);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    userRole,
    refreshUserData,
    login,
    signUp,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};