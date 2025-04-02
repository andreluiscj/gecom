
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  HelpCircle, 
  Accessibility, 
  Globe, 
  Trash2,
  LayoutDashboard,
  Calendar
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
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [language, setLanguage] = useState('pt');
  const [openProfile, setOpenProfile] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  
  useEffect(() => {
    // Apply high contrast mode
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);
  
  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    toast.success(isHighContrast ? "Modo de contraste padrão ativado" : "Modo de alto contraste ativado");
  };
  
  const toggleLanguage = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLanguage);
    
    // Salvamos a preferência de idioma no localStorage
    localStorage.setItem('app-language', newLanguage);
    
    toast.success(newLanguage === 'pt' ? "Idioma alterado para Português" : "Language changed to English");
    
    // Recarregar a página para aplicar o idioma
    window.location.reload();
  };

  const handleLogout = () => {
    // Remove o município selecionado e a autenticação do localStorage
    localStorage.removeItem('municipio-selecionado');
    localStorage.removeItem('user-authenticated');
    
    // Exibe notificação
    toast.success(language === 'pt' ? "Sessão encerrada com sucesso!" : "Session ended successfully!");
    
    // Redireciona para a página de login
    navigate('/login');
  };
  
  const handleDeleteAccount = () => {
    // Simulating account deletion
    toast.success(language === 'pt' ? "Conta excluída com sucesso!" : "Account deleted successfully!");
    localStorage.removeItem('municipio-selecionado');
    localStorage.removeItem('user-authenticated');
    navigate('/login');
    setOpenDeleteConfirm(false);
  };

  // Verifica o idioma salvo no localStorage ao carregar o componente
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Translated texts
  const texts = {
    search: language === 'pt' ? "Buscar pedidos, fornecedores..." : "Search orders, suppliers...",
    preferences: language === 'pt' ? "Preferências" : "Preferences",
    profile: language === 'pt' ? "Perfil" : "Profile",
    logout: language === 'pt' ? "Sair" : "Logout",
    deleteAccount: language === 'pt' ? "Excluir conta" : "Delete account",
    new: language === 'pt' ? "novas" : "new",
    contrast: language === 'pt' ? "Contraste" : "Contrast",
    highContrast: language === 'pt' ? "Alto contraste" : "High contrast",
    language: language === 'pt' ? "Idioma" : "Language",
    languageToggle: language === 'pt' ? "English" : "Português",
    accessibility: language === 'pt' ? "Acessibilidade" : "Accessibility",
    settings: language === 'pt' ? "Configurações" : "Settings",
    myAccount: language === 'pt' ? "Minha Conta" : "My Account",
    personalInfo: language === 'pt' ? "Informações Pessoais" : "Personal Information",
    name: language === 'pt' ? "Nome" : "Name",
    birthDate: language === 'pt' ? "Data de Nascimento" : "Birth Date",
    cpf: language === 'pt' ? "CPF" : "Tax ID",
    confirmDelete: language === 'pt' ? "Confirmar exclusão" : "Confirm deletion",
    confirmDeleteMsg: language === 'pt' ? "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita." : "Are you sure you want to delete your account? This action cannot be undone.",
    cancel: language === 'pt' ? "Cancelar" : "Cancel",
    confirm: language === 'pt' ? "Confirmar" : "Confirm",
    systemPreferences: language === 'pt' ? "Preferências do Sistema" : "System Preferences",
    appearance: language === 'pt' ? "Aparência" : "Appearance",
    notifications: language === 'pt' ? "Notificações" : "Notifications",
    enableNotifs: language === 'pt' ? "Habilitar notificações" : "Enable notifications",
    save: language === 'pt' ? "Salvar alterações" : "Save changes",
    close: language === 'pt' ? "Fechar" : "Close",
    editProfile: language === 'pt' ? "Editar Perfil" : "Edit Profile",
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
        
        {/* Accessibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Accessibility className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-lg rounded-xl">
            <DropdownMenuLabel>{texts.accessibility}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleContrast} className="cursor-pointer">
              <div className={`p-1 mr-2 ${isHighContrast ? 'bg-white text-black' : 'bg-black text-white'} rounded`}>
                <span className="text-xs">Aa</span>
              </div>
              {texts.contrast}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleLanguage} className="cursor-pointer">
              <div className="p-1 mr-2 bg-primary/10 text-primary rounded">
                <Globe className="h-3 w-3" />
              </div>
              {texts.language}: {texts.languageToggle}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-white font-medium">
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
      
      {/* Profile Dialog */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{texts.profile}</DialogTitle>
            <DialogDescription>
              {language === 'pt' ? "Suas informações de perfil no sistema." : "Your profile information in the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
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
      
      {/* Delete Confirmation Dialog */}
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
