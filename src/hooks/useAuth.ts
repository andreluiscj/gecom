
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
    setIsSubmitting(true);

    try {
      // Autenticar no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        setIsSubmitting(false);
        return;
      }

      if (!data.user) {
        toast.error('Usuário não encontrado');
        setIsSubmitting(false);
        return;
      }

      // Buscar informações do usuário na tabela usuarios
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*, usuario_secretarias(secretaria_id)')
        .eq('id', data.user.id)
        .single();

      if (usuarioError || !usuarioData) {
        toast.error('Erro ao buscar dados do usuário');
        setIsSubmitting(false);
        return;
      }

      // Verificar primeiro acesso
      if (usuarioData.primeiro_acesso) {
        setShowChangePasswordDialog(true);
        setIsSubmitting(false);
        return;
      }

      // Salvar informações no localStorage
      localStorage.setItem('user-authenticated', 'true');
      localStorage.setItem('user-role', usuarioData.role);
      localStorage.setItem('user-municipality', usuarioData.municipio_id);
      localStorage.setItem('user-name', usuarioData.nome);
      localStorage.setItem('funcionario-id', data.user.id);

      // Preparar lista de secretarias
      const secretarias = usuarioData.usuario_secretarias.map(
        (us: { secretaria_id: string }) => us.secretaria_id
      );
      
      localStorage.setItem('user-secretarias', JSON.stringify(secretarias));

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
      }

      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Erro no login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
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
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ primeiro_acesso: false })
        .eq('id', supabase.auth.getUser().data.user?.id);

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      toast.success('Senha alterada com sucesso!');
      setShowChangePasswordDialog(false);
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao alterar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    showChangePasswordDialog,
    setShowChangePasswordDialog,
    handleLogin,
    handlePasswordChange,
  };
}
