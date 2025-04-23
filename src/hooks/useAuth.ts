
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { autenticarUsuario, atualizarSenhaUsuario } from '@/data/funcionarios/mockFuncionarios';

export function useAuth() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);

  const handleLogin = (username: string, password: string) => {
    setIsSubmitting(true);

    // Basic validation
    if (!username || !password) {
      toast.error('Por favor, preencha todos os campos.');
      setIsSubmitting(false);
      return;
    }

    // Try to authenticate user
    const result = autenticarUsuario(username, password);
    if (result.authenticated) {
      // Check if it's first login, if so show password change dialog
      if (result.primeiroAcesso) {
        setShowChangePasswordDialog(true);
        setCurrentUserId(result.userId);
        setIsSubmitting(false);
      } else {
        // Check if GDPR consent is needed
        const gdprAccepted = localStorage.getItem(`gdpr-accepted-${result.userId}`);
        if (!gdprAccepted) {
          setCurrentUserId(result.userId);
          setShowGDPRDialog(true);
          setIsSubmitting(false);
        } else {
          loginSuccess(
            result.role, 
            'São Paulo', 
            result.funcionario.nome, 
            undefined, 
            result.userId, 
            result.funcionario.id
          );
        }
      }
    } else {
      toast.error('Credenciais inválidas. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (newPassword: string, confirmPassword: string) => {
    // Validate passwords
    if (!newPassword || newPassword.length < 3) {
      toast.error('A nova senha deve ter pelo menos 3 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    // Update password
    if (atualizarSenhaUsuario(currentUserId, newPassword)) {
      toast.success('Senha alterada com sucesso!');
      
      // Login after password change - show GDPR dialog
      setShowChangePasswordDialog(false);
      setShowGDPRDialog(true);
    } else {
      toast.error('Erro ao alterar senha. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handleGDPRConsent = (username: string, password: string) => {
    // Save GDPR consent
    localStorage.setItem(`gdpr-accepted-${currentUserId}`, 'true');
    setShowGDPRDialog(false);
    
    // Complete login process
    const result = autenticarUsuario(username, password);
    if (result.authenticated) {
      loginSuccess(
        result.role, 
        'São Paulo', 
        result.funcionario.nome, 
        undefined, 
        result.userId,
        result.funcionario.id
      );
    }
  };

  const loginSuccess = (
    role: string, 
    municipality: string = 'all', 
    name: string = '', 
    permittedStep: string = '',
    userId: string = '',
    funcionarioId: string = ''
  ) => {
    // Set authenticated state in localStorage
    localStorage.setItem('user-authenticated', 'true');
    localStorage.setItem('user-role', role);
    localStorage.setItem('user-municipality', municipality);
    localStorage.setItem('user-id', userId);
    localStorage.setItem('funcionario-id', funcionarioId);
    
    if (name) {
      localStorage.setItem('user-name', name);
    }
    if (permittedStep) {
      localStorage.setItem('user-permitted-step', permittedStep);
    }

    toast.success('Login realizado com sucesso!');
    
    // Direct admin users to the admin panel, others to dashboard
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return {
    isSubmitting,
    showChangePasswordDialog,
    setShowChangePasswordDialog,
    showGDPRDialog,
    setShowGDPRDialog,
    currentUserId,
    handleLogin,
    handlePasswordChange,
    handleGDPRConsent
  };
}
