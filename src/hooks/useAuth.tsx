
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(`Tentando login com email: ${email}`);
      
      // Autenticar no Supabase
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

      // Buscar informações do usuário na tabela usuarios
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*, usuario_secretarias(secretaria_id)')
        .eq('id', data.user.id)
        .single();

      if (usuarioError || !usuarioData) {
        console.error('Erro ao buscar dados do usuário:', usuarioError);
        toast.error('Erro ao buscar dados do usuário');
        setIsSubmitting(false);
        return;
      }

      console.log('Dados do usuário obtidos:', usuarioData);

      // Verificar primeiro acesso
      if (usuarioData.primeiro_acesso) {
        localStorage.setItem('user-id', data.user.id);
        setShowChangePasswordDialog(true);
        setIsSubmitting(false);
        return;
      }

      // Salvar informações no localStorage
      localStorage.setItem('user-authenticated', 'true');
      localStorage.setItem('user-role', usuarioData.role);
      localStorage.setItem('user-municipality', usuarioData.municipio_id);
      localStorage.setItem('user-name', usuarioData.nome);
      localStorage.setItem('user-id', data.user.id);
      localStorage.setItem('user-email', usuarioData.email);
      
      // Manter funcionario-id para compatibilidade com código existente
      localStorage.setItem('funcionario-id', data.user.id);

      // Preparar lista de secretarias
      const secretarias = usuarioData.usuario_secretarias.map(
        (us: { secretaria_id: string }) => us.secretaria_id
      );
      
      localStorage.setItem('user-secretarias', JSON.stringify(secretarias));

      console.log('Login bem-sucedido, redirecionando com base na role:', usuarioData.role);

      // Redirecionar baseado na role
      switch (usuarioData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'prefeito':
          navigate('/dashboard');
          break;
        case 'gestor':
          navigate(`/setores/${secretarias[0]}`);
          break;
        case 'servidor':
          navigate(`/setores/${secretarias[0]}`);
          break;
        default:
          navigate('/dashboard');
      }

      toast.success('Login realizado com sucesso!');
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
      
      // Limpar dados do localStorage
      localStorage.removeItem('user-authenticated');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-municipality');
      localStorage.removeItem('user-name');
      localStorage.removeItem('user-id');
      localStorage.removeItem('user-email');
      localStorage.removeItem('funcionario-id');
      localStorage.removeItem('user-secretarias');
      
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
        return;
      }

      // Atualizar flag de primeiro acesso
      const userId = localStorage.getItem('user-id');
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ primeiro_acesso: false })
        .eq('id', userId);

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      toast.success('Senha alterada com sucesso!');
      setShowChangePasswordDialog(false);
      
      // Verificar se foi autenticado anteriormente
      const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
      
      if (!isAuthenticated) {
        // Redirecionar para login para autenticar com a nova senha
        navigate('/login');
      } else {
        // Já autenticado, redirecionar para o dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Erro ao alterar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com o consentimento GDPR
  const handleGDPRConsent = () => {
    setShowGDPRDialog(false);
    const userId = localStorage.getItem('user-id');
    
    if (userId) {
      localStorage.setItem(`gdpr-accepted-${userId}`, 'true');
    }
    
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
    handleGDPRConsent
  };
}
