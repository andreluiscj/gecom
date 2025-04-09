
import React, { useState, useEffect } from 'react';
import { User, LogOut, Key } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '@/data/funcionarios/mockFuncionarios';
import { ChangePasswordDialog } from '@/components/Auth/ChangePasswordDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProfileDialog } from './ProfileDialog';

interface UserMenuProps {
  userRole?: string | null;
}

const UserMenu = ({ userRole }: UserMenuProps) => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    role: string;
    initials: string;
    birthDate?: Date;
    cpf?: string;
    email?: string;
  }>({ name: 'Usuário', role: 'user', initials: 'U' });

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    const userId = localStorage.getItem('user-id');
    const userName = localStorage.getItem('user-name');
    const userRole = localStorage.getItem('user-role');
    
    if (userId) {
      const userData = getUserById(userId);
      if (userData) {
        const { funcionario } = userData;
        setUserInfo({
          name: funcionario.nome,
          role: userData.usuario.role,
          initials: getInitials(funcionario.nome),
          birthDate: funcionario.dataNascimento,
          cpf: funcionario.cpf,
          email: funcionario.email
        });
        return;
      }
    }
    
    // Fallback for test accounts
    if (userName) {
      setUserInfo({
        name: userName,
        role: userRole || 'user',
        initials: getInitials(userName)
      });
    }
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('municipio-selecionado');
    localStorage.removeItem('user-authenticated');
    localStorage.removeItem('user-id');
    localStorage.removeItem('funcionario-id');
    
    toast.success("Sessão encerrada com sucesso!");
    
    navigate('/login');
  };

  const handleOpenChangePassword = () => {
    setOpenProfile(false); // Close profile dialog first
    setTimeout(() => {
      setOpenChangePassword(true); // Then open change password dialog
    }, 100);
  };

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };

  const handleProfileDialogChange = (open: boolean) => {
    setOpenProfile(open);
  };

  const handleChangePasswordDialogChange = (open: boolean) => {
    setOpenChangePassword(open);
  };

  const texts = {
    profile: "Perfil",
    editProfile: "Editar Perfil",
    changePassword: "Alterar senha",
    logout: "Sair",
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userInfo.initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="shadow-lg rounded-xl">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{userInfo.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{userInfo.role}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{texts.editProfile}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenChangePassword} className="cursor-pointer">
            <Key className="mr-2 h-4 w-4" />
            <span>{texts.changePassword}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            <span>{texts.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog 
        open={openProfile} 
        onOpenChange={handleProfileDialogChange}
        userInfo={userInfo} 
        onProfileUpdate={loadUserInfo}
      />
      
      <ChangePasswordDialog 
        open={openChangePassword} 
        onOpenChange={handleChangePasswordDialogChange}
      />
    </>
  );
};

export default UserMenu;
