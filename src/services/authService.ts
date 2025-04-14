
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Credenciais inválidas. Tente novamente.');
      return { authenticated: false };
    }

    // If authentication is successful, get the user's details from users table
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id, name, email, role_id, active, first_access,
          roles (id, name)
        `)
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        toast.error('Erro ao buscar informações do usuário.');
        return { authenticated: false };
      }

      const isFirstAccess = userData.first_access;
      
      // Store user data in localStorage
      localStorage.setItem('user-authenticated', 'true');
      localStorage.setItem('user-id', userData.id);
      localStorage.setItem('user-name', userData.name);
      localStorage.setItem('user-role', userData.roles.name.toLowerCase());

      if (isFirstAccess) {
        return {
          authenticated: true,
          userId: userData.id,
          role: userData.roles.name.toLowerCase(),
          primeiroAcesso: true
        };
      }

      return {
        authenticated: true,
        userId: userData.id,
        role: userData.roles.name.toLowerCase(),
        primeiroAcesso: false
      };
    }

    return { authenticated: false };
  } catch (error) {
    console.error('Error during login:', error);
    toast.error('Ocorreu um erro durante o login.');
    return { authenticated: false };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error('Erro ao fazer logout.');
      return false;
    }

    // Clear user data from localStorage
    localStorage.removeItem('user-authenticated');
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-name');
    localStorage.removeItem('user-role');
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    toast.error('Ocorreu um erro durante o logout.');
    return false;
  }
}

export async function changePassword(userId: string, newPassword: string) {
  try {
    // Update user in auth
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (authError) {
      toast.error('Erro ao alterar a senha na autenticação.');
      return false;
    }

    // Update first_access flag in users table
    const { error: userError } = await supabase
      .from('users')
      .update({ first_access: false })
      .eq('id', userId);

    if (userError) {
      toast.error('Erro ao atualizar status de primeiro acesso.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    toast.error('Ocorreu um erro ao alterar a senha.');
    return false;
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      toast.error('Erro ao solicitar redefinição de senha.');
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    toast.error('Ocorreu um erro ao solicitar redefinição de senha.');
    return { success: false };
  }
}

export async function validateSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
}
