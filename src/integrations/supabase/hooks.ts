
import { useEffect, useState } from 'react';
import { supabase } from './client';
import { Session } from '@supabase/supabase-js';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export function useAuth() {
  const { session, loading } = useSession();
  
  const user = session?.user || null;
  
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };
  
  const signUp = async (email: string, password: string, userData?: any) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: userData
      }
    });
    return { error };
  };
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };
  
  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  };
}
