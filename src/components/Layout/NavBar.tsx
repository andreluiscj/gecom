import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  HelpCircle, 
  Moon,
  Sun,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface NavBarProps {
  toggleSidebar: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const isDark = localStorage.getItem('dark-mode') === 'true';
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    localStorage.setItem('dark-mode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    
    toast.success(newDarkMode ? "Modo escuro ativado" : "Modo claro ativado");
  };

  const handleLogout = () => {
    localStorage.removeItem('municipio-selecionado');
    localStorage.removeItem('user-authenticated');
    
    toast.success("Sessão encerrada com sucesso!");
    
    navigate('/login');
  };
  
  const handleDeleteAccount = () => {
    toast.success("Conta excluída com sucesso!");
    localStorage.removeItem('municipio-selecionado');
    localStorage.removeItem('user-authenticated');
    navigate('/login');
    setOpenDeleteConfirm(false);
  };

  const texts = {
    search: "Buscar pedidos, fornecedores...",
    preferences: "Preferências",
    profile: "Perfil",
    logout: "Sair",
    deleteAccount: "Excluir conta",
    new: "novas",
    theme: isDarkMode ? "Modo claro" : "Modo escuro",
    settings: "Configurações",
    myAccount: "Minha Conta",
    personalInfo: "Informações Pessoais",
    name: "Nome",
    birthDate: "Data de Nascimento",
    cpf: "CPF",
    confirmDelete: "Confirmar exclusão",
    confirmDeleteMsg: "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
    cancel: "Cancelar",
    confirm: "Confirmar",
    systemPreferences: "Preferências do Sistema",
    appearance: "Aparência",
    notifications: "Notificações",
    enableNotifs: "Habilitar notificações",
    save: "Salvar alterações",
    close: "Fechar",
    editProfile: "Editar Perfil",
  };

  return (
    <div className="border-b bg-background h-16 flex items-center justify-between px-4 shadow-nav">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode} 
          className="text-muted-foreground hover:text-foreground"
          aria-label={texts.theme}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg rounded-xl">
            <DropdownMenuLabel className="px-4 py-3 border-b bg-primary/5">
              <div className="flex justify-between items-center">
                <span>{texts.notifications}</span>
                <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">2 {texts.new}</span>
              </div>
            </DropdownMenuLabel>
            <div className="max-h-96 overflow-auto py-1">
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start p-3 hover:bg-muted focus:bg-muted border-l-2 border-destructive">
                <div className="flex items-center w-full justify-between">
                  <p className="font-medium">Novo DFD cadastrado</p>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Agora</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  DFD de compra de medicamentos foi cadastrado
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start p-3 hover:bg-muted focus:bg-muted border-l-2 border-primary">
                <div className="flex items-center w-full justify-between">
                  <p className="font-medium">DFD aprovado</p>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">1h atrás</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  DFD de material escolar foi aprovado
                </p>
              </DropdownMenuItem>
            </div>
            <div className="border-t p-2 text-center">
              <Button variant="ghost" size="sm" className="w-full text-sm text-primary">
                Ver todas as notificações
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium">
                A
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-lg rounded-xl">
            <DropdownMenuLabel>{texts.myAccount}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenProfile(true)} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{texts.editProfile}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              <span>{texts.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
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
                A
              </div>
            </div>
            <div className="grid gap-2">
              <Label>{texts.personalInfo}</Label>
              <div className="grid grid-cols-[120px_1fr] gap-2 items-center text-sm">
                <span className="font-medium">{texts.name}:</span>
                <span>André Luis Caldeira</span>
                
                <span className="font-medium">{texts.birthDate}:</span>
                <span>22/07/2004</span>
                
                <span className="font-medium">{texts.cpf}:</span>
                <span>022.221.586-05</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => {setOpenProfile(false); setOpenDeleteConfirm(true);}}>
              {texts.deleteAccount}
            </Button>
            <Button onClick={() => setOpenProfile(false)}>{texts.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">{texts.confirmDelete}</DialogTitle>
            <DialogDescription>
              {texts.confirmDeleteMsg}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpenDeleteConfirm(false)}>
              {texts.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              {texts.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavBar;
