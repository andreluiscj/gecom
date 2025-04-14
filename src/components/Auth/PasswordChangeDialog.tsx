
import { useState } from 'react';
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

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPassword?: string;
  confirmPassword?: string;
  setNewPassword?: (password: string) => void;
  setConfirmPassword?: (password: string) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function PasswordChangeDialog({
  open,
  onOpenChange,
  newPassword: externalNewPassword,
  confirmPassword: externalConfirmPassword,
  setNewPassword: externalSetNewPassword,
  setConfirmPassword: externalSetConfirmPassword,
  onSubmit: externalOnSubmit,
  isSubmitting: externalIsSubmitting
}: PasswordChangeDialogProps) {
  // Internal state for controlled component
  const [internalNewPassword, setInternalNewPassword] = useState('');
  const [internalConfirmPassword, setInternalConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use external or internal state
  const newPassword = externalNewPassword !== undefined ? externalNewPassword : internalNewPassword;
  const confirmPassword = externalConfirmPassword !== undefined ? externalConfirmPassword : internalConfirmPassword;
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : isLoading;

  // Set password handlers
  const handleSetNewPassword = (value: string) => {
    if (externalSetNewPassword) {
      externalSetNewPassword(value);
    } else {
      setInternalNewPassword(value);
    }
  };

  const handleSetConfirmPassword = (value: string) => {
    if (externalSetConfirmPassword) {
      externalSetConfirmPassword(value);
    } else {
      setInternalConfirmPassword(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!newPassword) {
      setError('A nova senha é obrigatória');
      return;
    }

    if (newPassword.length < 3) {
      setError('A nova senha deve ter pelo menos 3 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (externalOnSubmit) {
      // Use external submit handler
      externalOnSubmit();
    } else {
      // Internal submit logic
      setIsLoading(true);
      // Simulating API call
      setTimeout(() => {
        setIsLoading(false);
        resetForm();
        onOpenChange(false);
      }, 1000);
    }
  };

  const resetForm = () => {
    setInternalNewPassword('');
    setInternalConfirmPassword('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Senha</DialogTitle>
          <DialogDescription>
            Por favor, crie uma nova senha para acessar o sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => handleSetNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                autoComplete="new-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleSetConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
