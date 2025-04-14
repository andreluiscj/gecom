
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signIn, changePassword, saveGDPRConsent } from '@/services/authService';

export function useAuth() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (username: string, password: string) => {
    setIsSubmitting(true);

    // Basic validation
    if (!username || !password) {
      toast.error('Por favor, preencha todos os campos.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Use email as username for Supabase
      const result = await signIn(username, password);
      
      if (result.authenticated) {
        // Check if it's first login, if so show password change dialog
        if (result.primeiroAcesso) {
          setShowChangePasswordDialog(true);
          setCurrentUserId(result.userId || '');
          setIsSubmitting(false);
        } else {
          // Check if GDPR consent is needed
          const gdprAccepted = localStorage.getItem(`gdpr-accepted-${result.userId}`);
          if (!gdprAccepted) {
            setCurrentUserId(result.userId || '');
            setShowGDPRDialog(true);
            setIsSubmitting(false);
          } else {
            loginSuccess(
              result.role || 'user', 
              'São Paulo', 
              result.name || 'Usuário', 
              undefined, 
              result.userId || '', 
              result.userId || ''
            );
          }
        }
      } else {
        toast.error('Credenciais inválidas. Tente novamente.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Erro ao fazer login. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
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

    try {
      // Update password
      const success = await changePassword(currentUserId, newPassword);
      
      if (success) {
        toast.success('Senha alterada com sucesso!');
        
        // Login after password change - show GDPR dialog
        setShowChangePasswordDialog(false);
        setShowGDPRDialog(true);
      } else {
        toast.error('Erro ao alterar senha. Tente novamente.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error('Erro ao alterar senha. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handleGDPRConsent = async () => {
    try {
      // Save GDPR consent
      await saveGDPRConsent(currentUserId);
      localStorage.setItem(`gdpr-accepted-${currentUserId}`, 'true');
      setShowGDPRDialog(false);
      
      // Get user info from localStorage (set during login)
      const role = localStorage.getItem('user-role') || '';
      const name = localStorage.getItem('user-name') || '';
      const userId = localStorage.getItem('user-id') || '';
      
      // Complete login process
      loginSuccess(role, 'São Paulo', name, undefined, userId, userId);
    } catch (error) {
      console.error("GDPR consent error:", error);
      toast.error('Erro ao processar consentimento. Tente novamente.');
      setIsSubmitting(false);
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
    toast.success('Login realizado com sucesso!');
    setIsSubmitting(false);
    
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
    handleGDPRConsent,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword
  };
}
