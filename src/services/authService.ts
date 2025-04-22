
import { supabase } from "@/integrations/supabase/client";

export const signIn = async ({ email, password }: { email: string, password: string }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error.message);
      return { success: false, data: null, error };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Unexpected login error:', err);
    return { success: false, data: null, error: err };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected logout error:', err);
    return { success: false, error: err };
  }
};
