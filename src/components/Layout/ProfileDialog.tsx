
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
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { DeleteAccountDialog } from './DeleteAccountDialog';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: {
    name: string;
    role: string;
    initials: string;
    birthDate?: Date;
    cpf?: string;
    email?: string;
  };
}

export function ProfileDialog({ open, onOpenChange, userInfo }: ProfileDialogProps) {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const texts = {
    profile: "Perfil",
    personalInfo: "Informações Pessoais",
    name: "Nome",
    birthDate: "Data de Nascimento",
    cpf: "CPF",
    email: "Email",
    deleteAccount: "Excluir conta",
    close: "Fechar",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        onOpenChange(open);
        // Force React to fully unmount and remount the dialog when closing
        if (!open) {
          document.body.style.pointerEvents = '';
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{texts.profile}</DialogTitle>
            <DialogDescription>
              Suas informações de perfil no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold dark:bg-gray-700 dark:text-gray-300">
                {userInfo.initials}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>{texts.personalInfo}</Label>
              <div className="grid grid-cols-[120px_1fr] gap-2 items-center text-sm">
                <span className="font-medium">{texts.name}:</span>
                <span>{userInfo.name}</span>
                
                {userInfo.birthDate && (
                  <>
                    <span className="font-medium">{texts.birthDate}:</span>
                    <span>{format(new Date(userInfo.birthDate), 'dd/MM/yyyy')}</span>
                  </>
                )}
                
                {userInfo.cpf && (
                  <>
                    <span className="font-medium">{texts.cpf}:</span>
                    <span>{userInfo.cpf}</span>
                  </>
                )}
                
                {userInfo.email && (
                  <>
                    <span className="font-medium">{texts.email}:</span>
                    <span>{userInfo.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => {onOpenChange(false); setOpenDeleteConfirm(true);}}>
              {texts.deleteAccount}
            </Button>
            <Button onClick={() => onOpenChange(false)}>{texts.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteAccountDialog
        open={openDeleteConfirm}
        onOpenChange={setOpenDeleteConfirm}
      />
    </>
  );
}
