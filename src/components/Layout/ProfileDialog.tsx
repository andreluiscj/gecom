
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
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { getUserId } from '@/utils/authHelpers';
import { toast } from 'sonner';
import { updateFuncionario, getUserById } from '@/data/funcionarios/mockFuncionarios';

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
  onProfileUpdate?: () => void;
}

export function ProfileDialog({ open, onOpenChange, userInfo, onProfileUpdate }: ProfileDialogProps) {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo.name,
    email: userInfo.email || '',
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        name: userInfo.name,
        email: userInfo.email || '',
      });
      setIsEditing(false);
    }
  }, [open, userInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Não foi possível identificar o usuário");
      return;
    }

    const userData = getUserById(userId);
    if (!userData) {
      toast.error("Dados do usuário não encontrados");
      return;
    }

    updateFuncionario(userData.funcionario.id, {
      nome: formData.name,
      email: formData.email,
    });

    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
    
    // Call the update callback if provided
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  const texts = {
    profile: "Perfil",
    personalInfo: "Informações Pessoais",
    name: "Nome",
    birthDate: "Data de Nascimento",
    cpf: "CPF",
    email: "Email",
    deleteAccount: "Excluir conta",
    close: "Fechar",
    edit: "Editar",
    save: "Salvar",
    cancel: "Cancelar",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        // This prevents the dialog from trapping focus when closed
        if (!open) {
          // Short timeout to ensure dialog is fully closed before releasing focus trapping
          setTimeout(() => {
            onOpenChange(false);
          }, 0);
        } else {
          onOpenChange(true);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => {
          // Prevent outside clicks from closing if editing
          if (isEditing) {
            e.preventDefault();
          }
        }}>
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
              
              {isEditing ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="name">{texts.name}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="email">{texts.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col space-y-2">
            {isEditing ? (
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {texts.cancel}
                </Button>
                <Button onClick={handleSaveChanges}>
                  {texts.save}
                </Button>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <Button variant="destructive" onClick={() => {onOpenChange(false); setOpenDeleteConfirm(true);}}>
                  {texts.deleteAccount}
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    {texts.close}
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>
                    {texts.edit}
                  </Button>
                </div>
              </div>
            )}
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
