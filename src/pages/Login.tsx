
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { PasswordChangeDialog } from '@/components/Auth/PasswordChangeDialog';
import { GDPRConsentDialog } from '@/components/Auth/GDPRConsentDialog';
import { ForgotPasswordDialog } from '@/components/Auth/ForgotPasswordDialog';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  
  const { 
    isSubmitting, 
    showChangePasswordDialog, 
    setShowChangePasswordDialog,
    showGDPRDialog,
    setShowGDPRDialog,
    handleLogin,
    handlePasswordChange,
    handleGDPRConsent
  } = useAuth();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  const onSubmitPasswordChange = () => {
    handlePasswordChange(newPassword, confirmPassword);
  };

  const onGDPRConsent = () => {
    handleGDPRConsent(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/d6c59aa6-5f8d-498d-92db-f4a917a2f5b3.png" 
              alt="GECOM Logo" 
              className="h-16"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmitLogin} className="space-y-4">
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <button 
              type="button" 
              onClick={() => setShowForgotPasswordDialog(true)}
              className="text-primary hover:underline"
            >
              Esqueceu sua senha?
            </button>
          </div>
        </CardFooter>
      </Card>
      
      <PasswordChangeDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={onSubmitPasswordChange}
        isSubmitting={isSubmitting}
      />

      <GDPRConsentDialog
        open={showGDPRDialog}
        onAccept={onGDPRConsent}
        onOpenChange={setShowGDPRDialog}
      />

      <ForgotPasswordDialog
        open={showForgotPasswordDialog}
        onOpenChange={setShowForgotPasswordDialog}
      />
    </div>
  );
};

export default Login;
