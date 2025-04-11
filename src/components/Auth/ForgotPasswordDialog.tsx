
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      toast.error('Por favor, informe seu nome de usuário');
      return;
    }
    
    setIsSubmitting(true);
    
    // Find user by username
    const usuarios = getUsuariosLogin();
    const foundUser = usuarios.find(u => u.username === username);
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (foundUser) {
        const userData = getUserById(foundUser.id);
        if (userData) {
          // In a real app, this would send an email
          // For demo purposes, we'll just show a success message
          setSubmitted(true);
          toast.success('Instruções enviadas para o seu email');
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
  
  const handleClose = () => {
    setUsername('');
    setSubmitted(false);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recuperação de Senha</DialogTitle>
          <DialogDescription>
            Informe seu nome de usuário para receber instruções de recuperação.
          </DialogDescription>
        </DialogHeader>
        
        {!submitted ? (
          <form onSubmit={handlePasswordRecovery}>
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
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome de usuário"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} variant="outline" type="button" disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
              <Check className="h-8 w-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg">Email enviado</h3>
              <p className="text-muted-foreground">
                Se o usuário existir, enviamos as instruções de recuperação para o email associado à conta.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-2">
              Voltar para o login
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
