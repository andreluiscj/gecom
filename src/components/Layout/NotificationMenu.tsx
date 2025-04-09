
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NotificationMenu = () => {
  const texts = {
    notifications: "Notificações",
    new: "novas",
  };

  return (
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
  );
};

export default NotificationMenu;
