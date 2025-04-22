
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
  cpf: string;
  birthdate: string;
};

export async function signIn({ email, password }: SignInCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    toast.error(error.message || "Erro ao fazer login");
    return { success: false, error };
  }
}

export async function signUp({ email, password, name, cpf, birthdate }: SignUpCredentials) {
  try {
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw error;
    }

    // 2. Update profile with additional data
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          cpf,
          name,
          birthdate,
        })
        .eq("id", data.user.id);

      if (profileError) {
        throw profileError;
      }
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    toast.error(error.message || "Erro ao criar conta");
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error signing out:", error.message);
    toast.error(error.message || "Erro ao fazer logout");
    return { success: false, error };
  }
}

export async function validateCpf(cpf: string): Promise<boolean> {
  // Basic validation
  if (!cpf) return false;
  
  // Remove non-digits
  cpf = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cpf.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Check if CPF already exists in database
  const { data, error } = await supabase
    .from("profiles")
    .select("cpf")
    .eq("cpf", cpf);
    
  if (error) {
    console.error("Error checking CPF:", error);
    return false;
  }
  
  // If data exists and has length > 0, CPF is already in use
  if (data && data.length > 0) {
    return false;
  }
  
  // Validate CPF algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    // Get user profile
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
      
    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserMunicipalities(userId: string) {
  try {
    const { data, error } = await supabase
      .from("municipality_users")
      .select(`
        municipality_id,
        municipalities:municipality_id (
          id, name, state, mayor, logo
        )
      `)
      .eq("user_id", userId);
      
    if (error) throw error;
    return data?.map(item => item.municipalities) || [];
  } catch (error) {
    console.error("Error fetching user municipalities:", error);
    return [];
  }
}

export async function getUserSectors(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_sectors")
      .select(`
        sector_id,
        is_primary,
        sectors:sector_id (
          id, name
        )
      `)
      .eq("user_id", userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user sectors:", error);
    return [];
  }
}

export async function updateUserProfile(userId: string, profileData: any) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId);
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}
