import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { getUserIdSync } from '@/utils/auth';
import { toast } from 'sonner';
import { updateFuncionario, getUserById } from '@/data/funcionarios/mockFuncionarios';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';

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
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    name: userInfo.name,
    email: userInfo.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    profilePhoto: null as string | null,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: userInfo.name,
        email: userInfo.email || '',
        phone: localStorage.getItem('user-phone') || '',
        address: localStorage.getItem('user-address') || '',
        city: localStorage.getItem('user-city') || '',
        state: localStorage.getItem('user-state') || '',
        profilePhoto: localStorage.getItem('user-profile-photo')
      });
      setIsEditing(false);
      setActiveTab("info");
    }
  }, [open, userInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePhotoChange = (photoUrl: string | null) => {
    setFormData(prev => ({
      ...prev,
      profilePhoto: photoUrl
    }));
  };

  const handleSaveChanges = () => {
    const userId = getUserIdSync();
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

    localStorage.setItem('user-phone', formData.phone);
    localStorage.setItem('user-address', formData.address);
    localStorage.setItem('user-city', formData.city);
    localStorage.setItem('user-state', formData.state);
    
    if (formData.profilePhoto !== null) {
      localStorage.setItem('user-profile-photo', formData.profilePhoto);
    } else {
      localStorage.removeItem('user-profile-photo');
    }

    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
    
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  const texts = {
    profile: "Perfil",
    personalInfo: "Informações Pessoais",
    name: "Nome",
    birthDate: "Data de Nascimento",
    cpf: "CPF",
    email: "Email",
    phone: "Telefone",
    address: "Endereço",
    city: "Cidade",
    state: "Estado",
    contactInfo: "Informações de Contato",
    addressInfo: "Endereço",
    security: "Segurança",
    deleteAccount: "Excluir conta",
    close: "Fechar",
    edit: "Editar",
    save: "Salvar",
    cancel: "Cancelar",
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const ProfileContent = () => (
    <>
      <div className="grid gap-4 py-4">
        <ProfilePhotoUpload 
          initials={userInfo.initials}
          onPhotoChange={handleProfilePhotoChange}
          currentPhoto={formData.profilePhoto}
        />

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full mt-4"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="info">Perfil</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-4">
            <div className="grid gap-4">
              {isEditing ? (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">{texts.name}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{texts.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1"
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
          </TabsContent>
          
          <TabsContent value="contact" className="mt-4">
            <div className="grid gap-4">
              {isEditing ? (
                <div>
                  <Label htmlFor="phone">{texts.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-[120px_1fr] gap-2 items-center text-sm">
                  <span className="font-medium">{texts.phone}:</span>
                  <span>{formData.phone || '—'}</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="address" className="mt-4">
            <div className="grid gap-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="address">{texts.address}</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="city">{texts.city}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">{texts.state}</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-[120px_1fr] gap-2 items-center text-sm">
                  <span className="font-medium">{texts.address}:</span>
                  <span>{formData.address || '—'}</span>
                  
                  <span className="font-medium">{texts.city}:</span>
                  <span>{formData.city || '—'}</span>
                  
                  <span className="font-medium">{texts.state}:</span>
                  <span>{formData.state || '—'}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <DialogFooter className="sm:justify-between flex flex-col sm:flex-row gap-2">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => {handleCloseDialog(); setOpenDeleteConfirm(true);}}
        >
          {texts.deleteAccount}
        </Button>
        
        {isEditing ? (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              {texts.cancel}
            </Button>
            <Button onClick={handleSaveChanges}>
              {texts.save}
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              {texts.close}
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              {texts.edit}
            </Button>
          </div>
        )}
      </DialogFooter>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent className="sm:max-w-[425px] px-2">
            <SheetHeader>
              <SheetTitle>{texts.profile}</SheetTitle>
              <SheetDescription>
                Suas informações de perfil no sistema.
              </SheetDescription>
            </SheetHeader>
            <ProfileContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog
          open={open}
          onOpenChange={(value) => {
            if (!value && isEditing) {
              return;
            }
            onOpenChange(value);
          }}
        >
          <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => {
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
            <ProfileContent />
          </DialogContent>
        </Dialog>
      )}

      <DeleteAccountDialog
        open={openDeleteConfirm}
        onOpenChange={setOpenDeleteConfirm}
      />
    </>
  );
}
