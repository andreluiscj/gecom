
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

    console.log("Tentando autenticar usuário:", username);
    
    // Special case for admin login
    if (username === 'admin' && password === 'admin') {
      console.log("Login com credenciais admin/admin");
      localStorage.setItem('user-authenticated', 'true');
      localStorage.setItem('user-role', 'admin');
      localStorage.setItem('user-name', 'Administrador');
      localStorage.setItem('user-id', 'admin-id');
      localStorage.setItem('funcionario-id', 'admin-func-id');
      localStorage.setItem('user-setor', 'TI');
      
      toast.success('Login realizado com sucesso!');
      setIsSubmitting(false);
      navigate('/admin');
      return;
    }
    
    // Check if it's the first login with no data in localStorage
    const storedUsers = localStorage.getItem('usuarios-login');
    
    if ((!storedUsers || JSON.parse(storedUsers).length === 0) && 
        username === 'admin' && password === '123') {
      console.log("Primeiro login como admin");
      // First login as admin
      createInitialAdminUser();
      toast.success('Login realizado com sucesso!');
      setIsSubmitting(false);
      localStorage.setItem('user-authenticated', 'true');
      localStorage.setItem('user-role', 'admin');
      localStorage.setItem('user-name', 'Administrador');
      localStorage.setItem('user-id', 'admin-id');
      navigate('/admin');
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
            result.funcionario.id,
            result.funcionario.setor
          );
        }
      }
    } else {
      toast.error('Credenciais inválidas. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  // Função para criar o usuário admin inicial quando não há dados
  const createInitialAdminUser = () => {
    const adminUser = {
      id: 'admin-id',
      username: 'admin',
      senha: '123',
      role: 'admin',
      ativo: true,
      primeiroAcesso: false
    };
    
    const adminFuncionario = {
      id: 'admin-func-id',
      nome: 'Administrador',
      cargo: 'Administrador do Sistema',
      setor: 'TI',
      ativo: true,
      dataContratacao: new Date().toISOString()
    };
    
    localStorage.setItem('usuarios-login', JSON.stringify([adminUser]));
    localStorage.setItem('funcionarios', JSON.stringify([adminFuncionario]));
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

  const handleGDPRConsent = () => {
    // Save GDPR consent
    localStorage.setItem(`gdpr-accepted-${currentUserId}`, 'true');
    setShowGDPRDialog(false);
    
    // Complete login process with existing credentials
    const userData = getUserById(currentUserId);
    
    if (userData) {
      loginSuccess(
        userData.usuario.role, 
        'São Paulo', 
        userData.funcionario.nome, 
        undefined, 
        userData.usuario.id,
        userData.funcionario.id,
        userData.funcionario.setor
      );
    } else {
      toast.error('Erro ao concluir o login. Por favor, tente novamente.');
      setIsSubmitting(false);
    }
  };
  
  // Helper function to get user data by ID
  const getUserById = (userId: string) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios-login') || '[]');
    const user = usuarios.find((u: any) => u.id === userId);
    
    if (user) {
      const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
      const funcionario = funcionarios.find((f: any) => f.id === user.funcionarioId);
      
      if (funcionario) {
        return { usuario: user, funcionario };
      }
    }
    
    return null;
  };

  const loginSuccess = (
    role: string, 
    municipality: string = 'all', 
    name: string = '', 
    permittedStep: string = '',
    userId: string = '',
    funcionarioId: string = '',
    setor: string = ''
  ) => {
    // Set authenticated state in localStorage
    localStorage.setItem('user-authenticated', 'true');
    localStorage.setItem('user-role', role);
    localStorage.setItem('user-municipality', municipality);
    localStorage.setItem('user-id', userId);
    localStorage.setItem('funcionario-id', funcionarioId);
    localStorage.setItem('user-setor', setor);
    
    if (name) {
      localStorage.setItem('user-name', name);
    }
    if (permittedStep) {
      localStorage.setItem('user-permitted-step', permittedStep);
    }

    toast.success('Login realizado com sucesso!');
    setIsSubmitting(false);
    
    // Direct users according to their access level
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'prefeito') {
      // Prefeito can access dashboard like manager
      navigate('/dashboard');
    } else if (role === 'manager') {
      navigate('/dashboard');
    } else {
      // Regular users (servidores) go directly to the order list
      navigate('/pedidos');
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
