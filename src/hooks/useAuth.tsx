
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole, getUserSecretarias } from '@/utils/auth/authCore';

export function useAuth() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  // Initialize user session and set up listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Update localStorage for backward compatibility
        if (currentSession) {
          localStorage.setItem('user-authenticated', 'true');
          localStorage.setItem('user-id', currentSession.user.id);
          localStorage.setItem('user-email', currentSession.user.email);

          // Fetch and store additional user data
          setTimeout(() => {
            fetchUserData(currentSession.user.id);
          }, 0);
        } else {
          localStorage.removeItem('user-authenticated');
          localStorage.removeItem('user-id');
          localStorage.removeItem('user-email');
          localStorage.removeItem('user-role');
          localStorage.removeItem('user-name');
          localStorage.removeItem('user-municipality');
          localStorage.removeItem('funcionario-id');
          localStorage.removeItem('user-secretarias');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession) {
        fetchUserData(currentSession.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      // Fetch user details
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Store in localStorage for backward compatibility
      if (userData) {
        localStorage.setItem('user-role', userData.role);
        localStorage.setItem('user-name', userData.nome);
        localStorage.setItem('user-municipality', userData.municipio_id);
        localStorage.setItem('funcionario-id', userId); // For backward compatibility
      }

      // Fetch user secretarias
      const secretarias = await getUserSecretarias();
      localStorage.setItem('user-secretarias', JSON.stringify(secretarias));
      
      // Check for first access
      if (userData.primeiro_acesso) {
        setShowChangePasswordDialog(true);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(`Tentando login com email: ${email}`);
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro na autenticação:', error.message);
        toast.error('Credenciais inválidas. Verifique seu email e senha.');
        setIsSubmitting(false);
        return;
      }

      if (!data.user) {
        console.error('Usuário não encontrado');
        toast.error('Usuário não encontrado');
        setIsSubmitting(false);
        return;
      }

      console.log('Usuário autenticado:', data.user.id);
      
      // Fetch user information to check primeiro_acesso
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('primeiro_acesso')
        .eq('id', data.user.id)
        .single();

      if (usuarioError) {
        console.error('Erro ao verificar primeiro acesso:', usuarioError);
        toast.error('Erro ao verificar dados do usuário');
        setIsSubmitting(false);
        return;
      }

      // Check for first login
      if (usuarioData.primeiro_acesso) {
        setShowChangePasswordDialog(true);
        setIsSubmitting(false);
        return;
      }

      toast.success('Login realizado com sucesso!');
      
      // Redirect will happen via onAuthStateChange and fetchUserData
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro no login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast.error(error.message);
        setIsSubmitting(false);
        return;
      }

      // Update first access flag
      const userId = user?.id;
      if (userId) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ primeiro_acesso: false })
          .eq('id', userId);

        if (updateError) {
          toast.error(updateError.message);
          setIsSubmitting(false);
          return;
        }
      }

      toast.success('Senha alterada com sucesso!');
      setShowChangePasswordDialog(false);
      
      // If user was in first access flow, redirect to dashboard
      const role = await getUserRole();
      redirectBasedOnRole(role);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'prefeito':
        navigate('/dashboard');
        break;
      case 'gestor':
        navigate('/dashboard');
        break;
      case 'servidor':
        navigate('/pedidos');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Function to handle GDPR consent
  const handleGDPRConsent = () => {
    setShowGDPRDialog(false);
    toast.success('Termos aceitos com sucesso!');
  };

  return {
    isSubmitting,
    showChangePasswordDialog,
    setShowChangePasswordDialog,
    showGDPRDialog,
    setShowGDPRDialog,
    handleLogin,
    handleLogout,
    handlePasswordChange,
    handleGDPRConsent,
    user,
    session
  };
}
