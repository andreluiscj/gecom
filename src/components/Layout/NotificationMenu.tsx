
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { obterPedidos } from '@/data/mockData';
import { PedidoCompra } from '@/types';

const NotificationMenu: React.FC = () => {
  const navigate = useNavigate();
  const [pendingNotifications, setPendingNotifications] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(false);

  // Load notifications on component mount
  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      try {
        const pedidos = await obterPedidos();
        // Filter for recent or important pedidos
        const recentPedidos = pedidos
          .filter(pedido => 
            pedido.status === 'pendente' || 
            pedido.status === 'aprovado' || 
            pedido.status === 'em_andamento'
          )
          .slice(0, 5); // Limit to 5 notifications
        
        setPendingNotifications(recentPedidos);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadNotifications();
  }, []);

  const handleClickNotification = (id: string) => {
    navigate(`/pedidos/${id}`);
  };

  const getNotificationTitle = (pedido: PedidoCompra) => {
    switch (pedido.status) {
      case 'pendente':
        return 'Nova DFD para aprovação';
      case 'aprovado':
        return 'DFD aprovada recentemente';
      case 'em_andamento':
        return 'Processo em andamento';
      default:
        return 'Atualização de DFD';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {pendingNotifications.length > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500" 
              variant="destructive"
            >
              {pendingNotifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Carregando notificações...
          </div>
        )}
        
        {!loading && pendingNotifications.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação no momento
          </div>
        )}
        
        {!loading && pendingNotifications.map(pedido => (
          <DropdownMenuItem 
            key={pedido.id}
            onClick={() => handleClickNotification(pedido.id)}
            className="cursor-pointer p-3"
          >
            <div className="flex flex-col">
              <span className="font-medium">{getNotificationTitle(pedido)}</span>
              <span className="text-sm text-muted-foreground truncate max-w-[250px]">
                {pedido.descricao}
              </span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">{pedido.setor}</span>
                <Badge 
                  variant="outline" 
                  className={
                    pedido.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                    pedido.status === 'aprovado' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {pedido.status}
                </Badge>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => navigate('/pedidos')}
          className="justify-center text-sm cursor-pointer"
        >
          Ver Todos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
