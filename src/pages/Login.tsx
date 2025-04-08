import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular uma verificação de login
    setTimeout(() => {
      // Admin login
      if (username === 'admin' && password === 'admin') {
        toast.success('Login realizado com sucesso como Administrador!');
        localStorage.setItem('user-authenticated', 'true');
        localStorage.setItem('user-role', 'admin');
        localStorage.setItem('user-municipality', 'all'); // Admin has access to all
        navigate('/admin');
      } 
      // Manager (Gerente) login - username and password are the municipality name
      else if (username === password && username.trim() !== '') {
        toast.success(`Login realizado com sucesso como Gerente de ${username}!`);
        localStorage.setItem('user-authenticated', 'true');
        localStorage.setItem('user-role', 'gerente');
        localStorage.setItem('user-municipality', username.toLowerCase());
        navigate('/dashboard');
      } 
      // Regular user login (keeping existing one)
      else if (username === 'user' && password === 'user') {
        toast.success('Login realizado com sucesso!');
        localStorage.setItem('user-authenticated', 'true');
        localStorage.setItem('user-role', 'user');
        localStorage.setItem('user-municipality', 'default');
        navigate('/dashboard');
      }
      else {
        // Login falhou
        toast.error('Usuário ou senha incorretos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-t-4 border-t-primary animate-fade-in">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">GECOM</CardTitle>
            <CardDescription className="text-center">
              Sistema de Gerenciamento de Compras Públicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Button type="button" variant="link" className="px-0 text-xs h-auto">
                    Esqueceu a senha?
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">
              © 2023 GECOM - Todos os direitos reservados
            </p>
            <div className="w-full border-t pt-2">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Tipos de acesso:</strong>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Administrador - usuário: admin, senha: admin
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Gerente - usuário: [nome do município], senha: [nome do município]
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
