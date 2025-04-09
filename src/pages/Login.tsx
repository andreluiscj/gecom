import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Key } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { autenticarUsuario, atualizarSenhaUsuario } from '@/data/funcionarios/mockFuncionarios';
import { Label } from '@/components/ui/label';
import GecomLogo from '@/assets/GecomLogo';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('admin');
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (selectedUser === 'admin' && username === 'admin' && password === 'admin') {
      loginSuccess('admin', undefined, 'Administrador');
      return;
    } 
    if (selectedUser === 'amanda' && username === 'amanda' && password === 'amanda') {
      loginSuccess('manager', 'São Paulo', 'Amanda Amarante');
      return;
    }

    const result = autenticarUsuario(username, password);
    if (result.authenticated) {
      if (result.primeiroAcesso) {
        setShowChangePasswordDialog(true);
        setCurrentUserId(result.userId);
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
    } else {
      toast.error('Credenciais inválidas. Tente novamente.');
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword || newPassword.length < 3) {
      toast.error('A nova senha deve ter pelo menos 3 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (atualizarSenhaUsuario(currentUserId, newPassword)) {
      toast.success('Senha alterada com sucesso!');
      
      const result = autenticarUsuario(username, newPassword);
      if (result.authenticated) {
        loginSuccess(
          result.role, 
          'São Paulo', 
          result.funcionario.nome, 
          undefined, 
          result.userId,
          result.funcionario.id
        );
        setShowChangePasswordDialog(false);
      }
    } else {
      toast.error('Erro ao alterar senha. Tente novamente.');
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
    navigate('/dashboard');
  };

  const handleQuickLogin = (userType: string) => {
    setSelectedUser(userType);
    
    if (userType === 'admin') {
      setUsername('admin');
      setPassword('admin');
    } else if (userType === 'amanda') {
      setUsername('amanda');
      setPassword('amanda');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <GecomLogo size={50} />
          </div>
          <CardTitle className="text-2xl font-bold">GECOM</CardTitle>
          <CardDescription>
            Sistema de Gestão de Compras Municipais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="username"
                  placeholder="Nome de usuário"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Senha"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Para testar o sistema, utilize um dos logins abaixo:</p>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            <Button
              variant={selectedUser === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuickLogin('admin')}
            >
              Admin
            </Button>
            <Button
              variant={selectedUser === 'amanda' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuickLogin('amanda')}
            >
              Amanda
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Primeiro acesso</DialogTitle>
            <DialogDescription>
              Por favor, altere sua senha padrão para continuar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <Key className="h-6 w-6" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input 
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input 
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordChange}>
              Alterar senha e continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
