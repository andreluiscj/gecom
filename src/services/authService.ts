
// Serviços de autenticação Supabase

import { supabase } from "@/integrations/supabase/client";

// Login usando email como usuário
export const signIn = async ({ email, password }: { email: string; password: string }) => {
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
  } catch (err) {
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
  } catch (err) {
    console.error('Unexpected logout error:', err);
    return { success: false, error: err };
  }
};

// Cadastro de usuário
export const signUp = async ({ email, password, name, cpf, birthdate }: { 
  email: string; 
  password: string; 
  name: string; 
  cpf: string; 
  birthdate: string | Date;
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
          role: 'servidor', // padrão
          primeiroAcesso: true // Marca como primeiro acesso para exigir troca de senha
        }
      }
    });

    if (error) {
      console.error('Registration error:', error.message);
      return { success: false, data: null, error };
    }

    return { success: true, data, error: null };
  } catch (err) {
    console.error('Unexpected registration error:', err);
    return { success: false, data: null, error: err };
  }
};

// Validação de CPF
export const validateCpf = async (cpf: string) => {
  try {
    if (!cpf || cpf.length !== 11) {
      return false;
    }
    // Checa se existe no sistema
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('cpf', cpf)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error validating CPF:', error);
      return false;
    }
    // Encontrado? Já existe.
    if (data) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected error validating CPF:', err);
    return false;
  }
};

// Current user info
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return user.user_metadata || null;
    }
    
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

// Busca municípios do usuário
export const getUserMunicipalities = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('municipality_users')
      .select(`
        municipality:municipalities(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user municipalities:', error);
      return [];
    }
    return data?.map(item => item.municipality) || [];
  } catch (err) {
    console.error('Unexpected error fetching user municipalities:', err);
    return [];
  }
};

// Busca setores do usuário
export const getUserSectors = async (userId: string) => {
  try {
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
    return data?.map(item => item.sector) || [];
  } catch (err) {
    console.error('Unexpected error fetching user sectors:', err);
    return [];
  }
};

// Atualiza senha
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) {
      console.error('Error updating password:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error updating password:', err);
    return { success: false, error: err };
  }
};

// Reset de senha (envio do email)
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    
    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error sending password reset email:', err);
    return { success: false, error: err };
  }
};
