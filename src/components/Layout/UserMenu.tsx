
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, User, Settings, LogOut } from "lucide-react"
import { ProfileDialog } from "./ProfileDialog"
import { useState, useEffect } from "react"
import { ChangePasswordDialog } from "../Auth/ChangePasswordDialog"
import { DeleteAccountDialog } from "./DeleteAccountDialog"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from '@/integrations/supabase/client'

interface UserMenuProps {
  userRole?: string | null;
}

export function UserMenu({ userRole }: UserMenuProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    role: string;
    initials: string;
  }>({
    name: 'Usuário',
    email: '',
    role: '',
    initials: 'US'
  })
  const { handleLogout, user } = useAuth()
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nome, email, role')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setUserData({
            name: data.nome || 'Usuário',
            email: data.email || user.email || '',
            role: data.role || userRole || '',
            initials: data.nome ? data.nome.substring(0, 2).toUpperCase() : 'US'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [user, userRole]);
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">{userData.name}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Alterar Senha</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={() => setShowDeleteDialog(true)}>
            <span>Excluir Conta</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
        userInfo={userData}
      />
      <ChangePasswordDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog} />
      <DeleteAccountDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  )
}
