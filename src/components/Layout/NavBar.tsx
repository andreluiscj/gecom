
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Settings, User, LogOut, HelpCircle, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

interface NavBarProps {
  toggleSidebar: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o município selecionado do localStorage
    localStorage.removeItem('municipio-selecionado');
    
    // Exibe notificação
    toast.success("Sessão encerrada com sucesso!");
    
    // Redireciona para a página de admin
    navigate('/admin');
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
        
        <div className="hidden md:flex relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar pedidos, fornecedores..." 
            className="pl-9 w-80 bg-muted/50 focus:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-5 w-5" />
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
                <span>Notificações</span>
                <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">2 novas</span>
              </div>
            </DropdownMenuLabel>
            <div className="max-h-96 overflow-auto py-1">
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start p-3 hover:bg-muted focus:bg-muted border-l-2 border-destructive">
                <div className="flex items-center w-full justify-between">
                  <p className="font-medium">Novo pedido cadastrado</p>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Agora</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Pedido de compra de medicamentos foi cadastrado
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex flex-col items-start p-3 hover:bg-muted focus:bg-muted border-l-2 border-primary">
                <div className="flex items-center w-full justify-between">
                  <p className="font-medium">Pedido aprovado</p>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">1h atrás</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Pedido de material escolar foi aprovado
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
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-lg rounded-xl">
            <DropdownMenuLabel>Configurações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferências</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <span>Tema</span>
            </DropdownMenuItem>
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
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavBar;
