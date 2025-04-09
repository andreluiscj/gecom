
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
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('admin');

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Implement basic login validation
    if (username && password) {
      if (selectedUser === 'admin' && username === 'admin' && password === 'admin') {
        loginSuccess('admin');
      } else if (selectedUser === 'amanda' && username === 'amanda' && password === 'amanda') {
        loginSuccess('manager', 'São Paulo', 'Amanda Amarante');
      } else {
        toast.error('Credenciais inválidas. Tente novamente.');
      }
    } else {
      toast.error('Por favor, preencha todos os campos.');
    }
  };

  const loginSuccess = (role: string, municipality: string = 'all', name: string = '', permittedStep: string = '') => {
    // Set authenticated state in localStorage
    localStorage.setItem('user-authenticated', 'true');
    localStorage.setItem('user-role', role);
    localStorage.setItem('user-municipality', municipality);
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
            <div className="flex items-center space-x-2 bg-primary text-primary-foreground p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
              <Check className="h-6 w-6 -ml-3 -mt-1" />
            </div>
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
    </div>
  );
};

export default Login;
