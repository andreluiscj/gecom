
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const navigate = useNavigate();
  
  const handleDeleteAccount = () => {
    toast.success("Conta excluída com sucesso!");
    localStorage.removeItem('municipio-selecionado');
    localStorage.removeItem('user-authenticated');
    navigate('/login');
    onOpenChange(false);
  };

  const texts = {
    confirmDelete: "Confirmar exclusão",
    confirmDeleteMsg: "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
    cancel: "Cancelar",
    confirm: "Confirmar",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">{texts.confirmDelete}</DialogTitle>
          <DialogDescription>
            {texts.confirmDeleteMsg}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {texts.cancel}
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            {texts.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
