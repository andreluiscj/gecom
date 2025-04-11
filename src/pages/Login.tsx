
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
import { GDPRConsentDialog } from '@/components/Auth/GDPRConsentDialog';
import { ForgotPasswordDialog } from '@/components/Auth/ForgotPasswordDialog';
import { useAuth } from '@/hooks/useAuth';

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

  // Check if user is already logged in
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
      
      {/* Password Change Dialog */}
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

      {/* GDPR Consent Dialog */}
      <GDPRConsentDialog
        open={showGDPRDialog}
        onAccept={onGDPRConsent}
        onOpenChange={setShowGDPRDialog}
      />

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={showForgotPasswordDialog}
        onOpenChange={setShowForgotPasswordDialog}
      />
    </div>
  );
};

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

import { Dialog as UIDialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

function PasswordChangeDialog({
  open,
  onOpenChange,
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  onSubmit,
  isSubmitting
}: PasswordChangeDialogProps) {
  return (
    <UIDialog open={open} onOpenChange={onOpenChange}>
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
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Alterando...' : 'Alterar senha e continuar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </UIDialog>
  );
}

export default Login;
