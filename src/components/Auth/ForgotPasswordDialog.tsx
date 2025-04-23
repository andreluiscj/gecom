
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Check } from 'lucide-react';
import { getUserById, getUsuariosLogin } from '@/data/funcionarios/mockFuncionarios';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username && !email) {
      toast.error('Por favor, informe seu nome de usuário ou email');
      return;
    }
    
    setIsSubmitting(true);
    
    // Find user by username or email
    const usuarios = getUsuariosLogin();
    const foundUser = usuarios.find(u => 
      u.username === username || 
      (email && getUserById(u.id)?.funcionario?.email === email)
    );
    
    // Simulate email sending with a delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (foundUser) {
        const userData = getUserById(foundUser.id);
        if (userData) {
          // In a real app, this would send an email
          setSubmitted(true);
          
          // Show detailed toast with email preview
          showSuccessEmail(userData.funcionario.email, userData.funcionario.nome);
        } else {
          toast.error('Ocorreu um erro ao recuperar os dados do usuário');
        }
      } else {
        // For security reasons, we still show success even if user doesn't exist
        setSubmitted(true);
        toast.success('Se o usuário existir, as instruções foram enviadas para o email associado');
      }
    }, 1500);
  };
  
  const showSuccessEmail = (userEmail: string, userName: string) => {
    toast.success(
      <div className="space-y-2">
        <p className="font-medium">Email enviado para {userEmail || 'seu endereço de email'}</p>
        <div className="text-sm bg-muted p-2 rounded">
          <p><strong>Assunto:</strong> Recuperação de Senha - GECOM</p>
          <p><strong>Para:</strong> {userEmail || 'seu email'}</p>
          <p><strong>Mensagem:</strong></p>
          <p>Olá {userName},</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Para concluir o processo, por favor clique no link abaixo:</p>
          <p className="text-primary">[Link de Recuperação de Senha]</p>
          <p>Se você não solicitou esta mudança, ignore este email.</p>
          <p>Atenciosamente,<br/>Equipe GECOM</p>
        </div>
      </div>,
      {
        duration: 8000,
      }
    );
  };
  
  const handleClose = () => {
    setUsername('');
    setEmail('');
    setSubmitted(false);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recuperação de Senha</DialogTitle>
          <DialogDescription>
            Informe seu nome de usuário ou email para receber instruções de recuperação.
          </DialogDescription>
        </DialogHeader>
        
        {submitted ? (
          <SuccessView onClose={handleClose} />
        ) : (
          <RecoveryForm 
            username={username}
            email={email}
            isSubmitting={isSubmitting}
            onUsernameChange={setUsername}
            onEmailChange={setEmail}
            onSubmit={handlePasswordRecovery}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface RecoveryFormProps {
  username: string;
  email: string;
  isSubmitting: boolean;
  onUsernameChange: (username: string) => void;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function RecoveryForm({
  username,
  email,
  isSubmitting,
  onUsernameChange,
  onEmailChange,
  onSubmit,
  onCancel
}: RecoveryFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="flex justify-center mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Nome de usuário</Label>
          <Input 
            id="username"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Seu nome de usuário"
            disabled={isSubmitting}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Ou email</Label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Seu endereço de email"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">Você pode usar seu nome de usuário ou email para recuperação</p>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onCancel} variant="outline" type="button" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface SuccessViewProps {
  onClose: () => void;
}

function SuccessView({ onClose }: SuccessViewProps) {
  return (
    <div className="py-6 flex flex-col items-center gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
        <Check className="h-8 w-8" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-medium text-lg">Email enviado</h3>
        <p className="text-muted-foreground">
          Se o usuário existir, enviamos as instruções de recuperação para o email associado.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Por favor, verifique sua caixa de entrada e pasta de spam.
        </p>
      </div>
      <Button onClick={onClose} className="mt-2">
        Voltar para o login
      </Button>
    </div>
  );
}
