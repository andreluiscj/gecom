
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ForgotPasswordDialog from '@/components/Auth/ForgotPasswordDialog';
import GDPRConsentDialog from '@/components/Auth/GDPRConsentDialog';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login: ' + (error.message || 'Verifique suas credenciais e tente novamente'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <img 
            src="/lovable-uploads/d6c59aa6-5f8d-498d-92db-f4a917a2f5b3.png" 
            alt="GECOM Logo" 
            className="h-16"
          />
        </div>
        
        <Card>
          <CardHeader className="text-center pb-3">
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o GECOM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu.email@exemplo.com" 
                          {...field} 
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="********" 
                          type="password" 
                          {...field}
                          autoComplete="current-password" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-4">
            <Button 
              variant="link" 
              className="text-sm"
              onClick={() => setShowForgotPassword(true)}
            >
              Esqueceu sua senha?
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Ao acessar, você concorda com os{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm" 
                  onClick={() => setShowConsent(true)}
                >
                  Termos de Uso e Política de Privacidade
                </Button>
              </p>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GECOM - Sistema de Gestão de Compras Municipais
          </p>
        </div>
      </div>
      
      {showForgotPassword && (
        <ForgotPasswordDialog 
          open={showForgotPassword} 
          onClose={() => setShowForgotPassword(false)} 
        />
      )}
      
      {showConsent && (
        <GDPRConsentDialog
          open={showConsent}
          onClose={() => setShowConsent(false)}
        />
      )}
    </div>
  );
};

export default Login;
