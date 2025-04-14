
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/utils/formatters';
import { PedidoCompra } from '@/types';
import { useNavigate } from 'react-router-dom';
import { getPedidos } from '@/services/pedidoService';

interface Notification {
  id: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
  route?: string;
}

export function NotificationMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load notifications
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Fetch real data from API
      const pedidos = await getPedidos();
      generateNotificationsFromPedidos(pedidos);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const generateNotificationsFromPedidos = (pedidos: PedidoCompra[]) => {
    // Generate notifications from recent pedidos
    const recentPedidos = pedidos
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const newNotifications: Notification[] = recentPedidos.map(pedido => ({
      id: pedido.id,
      title: `Novo pedido: ${pedido.descricao}`,
      description: `Um novo pedido foi criado para o setor ${pedido.setor}`,
      date: pedido.createdAt,
      read: false,
      route: `/pedidos/visualizar/${pedido.id}`
    }));

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    
    // Navigate if route exists
    if (notification.route) {
      navigate(notification.route);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-2"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="space-y-1 w-full">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                  {!notification.read && (
                    <div className="flex justify-end mt-1">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Nenhuma notificação disponível
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationMenu;
