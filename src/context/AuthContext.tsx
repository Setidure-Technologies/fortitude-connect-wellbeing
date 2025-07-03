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
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        // Reset login attempts on successful login
        if (event === 'SIGNED_IN' && session?.user) {
          setLoginAttempts(0);
          
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

  // Separate function to fetch user profile - prevents auth deadlocks
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setUser(current => current ? {
        ...current,
        user_metadata: {
          ...current.user_metadata,
          role: profile?.role || 'patient'
        }
      } : null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    // Prevent concurrent login attempts
    if (loading) {
      return { error: 'Login already in progress. Please wait.' };
    }

    // Rate limiting check
    if (loginAttempts >= 3) {
      return { error: 'Too many failed attempts. Please wait 5 minutes before trying again.' };
    }

    try {
      setLoading(true);
      
      // Clean up any existing auth state before new login
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        // Continue even if sign out fails
        console.log('Sign out failed, continuing with login');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setLoginAttempts(prev => prev + 1);
        
        // Reset attempts after 5 minutes
        setTimeout(() => {
          setLoginAttempts(0);
        }, 5 * 60 * 1000);
        
        return { error: getSpecificErrorMessage(error) };
      }

      setLoginAttempts(0);
      return {};
    } catch (error) {
      console.error('Login error:', error);
      setLoginAttempts(prev => prev + 1);
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
    login,
    signUp,
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