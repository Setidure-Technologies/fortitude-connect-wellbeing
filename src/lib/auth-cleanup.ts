// Authentication state cleanup utility
// Prevents authentication limbo states and session conflicts

export const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
  
  console.log('Auth state cleaned up');
};

export const getSpecificErrorMessage = (error: any): string => {
  const message = error?.message || error || '';
  
  // Rate limiting
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many login attempts. Please wait a few minutes before trying again.';
  }
  
  // Invalid credentials
  if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  // Email not confirmed
  if (message.includes('email not confirmed') || message.includes('unconfirmed')) {
    return 'Please check your email and click the confirmation link before logging in.';
  }
  
  // Account locked/disabled
  if (message.includes('account locked') || message.includes('disabled')) {
    return 'Your account has been temporarily locked. Please contact support.';
  }
  
  // Network issues
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network connection issue. Please check your internet and try again.';
  }
  
  // Generic fallback
  return message || 'An unexpected error occurred. Please try again.';
};