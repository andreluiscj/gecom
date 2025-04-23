
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import GecomLogo from '@/assets/GecomLogo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  // Redirecionar se o usuário já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      const { success, error } = await signIn(email, password);
      
      if (success) {
        toast.success('Login realizado com sucesso!');
        // Redirecionar para o dashboard após o login
        navigate('/dashboard');
      } else {
        toast.error(error || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-md w-full p-8 shadow-lg border rounded-lg">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-20 w-20">
            <GecomLogo size={80} />
          </div>
          <h1 className="text-2xl font-bold mt-4 text-blue-700">GECOM</h1>
          <p className="text-gray-600 text-sm">Sistema de Gestão de Compras Públicas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a 
                href="#" 
                className="text-xs text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Função de recuperação de senha não implementada');
                }}
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full border-white"></div>
                Autenticando...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Entrar
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} GECOM - Todos os direitos reservados
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sistema de Gestão de Compras Públicas v1.0
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
