
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

// Add missing functions that are imported in RegisterForm.tsx
export const signUp = async ({ email, password, name, cpf, birthdate }: { 
  email: string, 
  password: string,
  name: string,
  cpf: string,
  birthdate: string 
}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          cpf,
          birthdate,
          role: 'servidor', // Default role for new users
        }
      }
    });

    if (error) {
      console.error('Registration error:', error.message);
      return { success: false, data: null, error };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Unexpected registration error:', err);
    return { success: false, data: null, error: err };
  }
};

export const validateCpf = async (cpf: string) => {
  try {
    // Basic CPF validation (format check)
    if (!cpf || cpf.length !== 11) {
      return false;
    }
    
    // Check if CPF is already registered in the system
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('cpf', cpf)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error validating CPF:', error);
      return false;
    }
    
    // If we found a record, the CPF is already taken
    if (data) {
      return false;
    }
    
    // CPF is valid and not registered
    return true;
  } catch (err) {
    console.error('Unexpected error validating CPF:', err);
    return false;
  }
};

// Add missing functions that are imported in AuthContext.tsx
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get additional profile data from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return user.user_metadata || null;
    }

    // Merge user metadata with profile data
    return {
      ...user.user_metadata,
      ...profile,
      id: user.id,
      email: user.email,
    };
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

export const getUserMunicipalities = async (userId: string) => {
  try {
    // Query for municipalities the user belongs to
    const { data, error } = await supabase
      .from('user_municipalities')
      .select(`
        municipality:municipalities(*)
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user municipalities:', error);
      return [];
    }
    
    return data.map(item => item.municipality) || [];
  } catch (err) {
    console.error('Unexpected error fetching user municipalities:', err);
    return [];
  }
};

export const getUserSectors = async (userId: string) => {
  try {
    // Query for sectors the user belongs to
    const { data, error } = await supabase
      .from('user_sectors')
      .select(`
        sector:sectors(*)
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user sectors:', error);
      return [];
    }
    
    return data.map(item => item.sector) || [];
  } catch (err) {
    console.error('Unexpected error fetching user sectors:', err);
    return [];
  }
};
