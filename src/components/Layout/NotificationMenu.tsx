
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { obterTodosPedidos } from '@/data/mockData';
import { PedidoCompra } from '@/types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Definir interface para notificações
interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'novo' | 'aprovado' | 'atualizado' | 'info';
  link?: string;
}

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();
  
  // Função para gerar notificações com base nos pedidos
  const generateNotifications = (pedidos: PedidoCompra[]): Notification[] => {
    return pedidos.slice(0, 5).map((pedido, index) => {
      const isNew = index < 2; // Primeiros dois pedidos são considerados novos
      const timeOffset = index * 2 * 60 * 60 * 1000; // Cada notificação é 2 horas mais antiga
      const timestamp = new Date(Date.now() - timeOffset);
      
      return {
        id: pedido.id,
        title: index === 0 ? "Novo DFD cadastrado" : 
               index === 1 ? "DFD aprovado" :
               index === 2 ? "Etapa atualizada" : 
               "Informação sobre DFD",
        content: index === 0 ? `DFD "${pedido.descricao}" foi cadastrado` : 
                 index === 1 ? `DFD de ${pedido.descricao} foi aprovado` :
                 index === 2 ? `Uma etapa do processo "${pedido.descricao}" foi atualizada` : 
                 `Informação sobre o DFD "${pedido.descricao}"`,
        timestamp: timestamp,
        read: !isNew,
        type: index === 0 ? 'novo' : 
              index === 1 ? 'aprovado' : 
              index === 2 ? 'atualizado' : 
              'info',
        link: `/pedidos/${pedido.id}`
      };
    });
  };

  // Carregar notificações ao montar o componente
  useEffect(() => {
    const pedidos = obterTodosPedidos();
    const newNotifications = generateNotifications(pedidos);
    setNotifications(newNotifications);
    
    // Verificar se há notificações não lidas
    setHasUnread(newNotifications.some(notification => !notification.read));
  }, []);

  // Função para marcar notificação como lida
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Atualizar o estado de notificações não lidas
    setHasUnread(notifications.some(notification => !notification.read && notification.id !== notificationId));
  };

  // Função para marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setHasUnread(false);
  };

  // Função para navegar até o DFD e marcar como lido
  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      markAsRead(notification.id);
      navigate(notification.link);
    }
  };

  // Função para formatar a data relativa
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Contador de notificações não lidas
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg rounded-xl">
        <DropdownMenuLabel className="px-4 py-3 border-b bg-primary/5">
          <div className="flex justify-between items-center">
            <span>Notificações</span>
            {unreadCount > 0 && (
              <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">{unreadCount} novas</span>
            )}
          </div>
        </DropdownMenuLabel>
        <div className="max-h-96 overflow-auto py-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`cursor-pointer flex flex-col items-start p-3 hover:bg-muted focus:bg-muted ${
                  !notification.read ? 'border-l-2 border-destructive' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-center w-full justify-between">
                  <p className={`font-medium ${!notification.read ? 'text-primary-foreground' : ''}`}>
                    {notification.title}
                  </p>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {formatRelativeTime(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.content}
                </p>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação no momento
            </div>
          )}
        </div>
        <div className="border-t p-2 text-center">
          <Button variant="ghost" size="sm" className="w-full text-sm text-primary" onClick={markAllAsRead}>
            Marcar todas como lidas
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
