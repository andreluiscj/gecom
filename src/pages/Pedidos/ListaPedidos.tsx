
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { obterTodosPedidos } from '@/data/mockData';
import { PedidoCompra } from '@/types';
import { getUserSetor, getUserRole } from '@/utils/auth';
import { shouldFilterByUserSetor } from '@/utils/auth/permissionHelpers';
import { toast } from 'sonner';

const ListaPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const navigate = useNavigate();
  const userRole = getUserRole();
  
  // Check permissions and fetch pedidos on component mount
  useEffect(() => {
    const todosPedidos = obterTodosPedidos();
    const userSetor = getUserSetor();
    
    // Filter pedidos based on user role
    if (userRole === 'admin' || userRole === 'prefeito') {
      // Admin and prefeito can see all pedidos
      setPedidos(todosPedidos);
    } else if (userRole === 'manager' || userRole === 'user') {
      // Managers (gerentes) and regular users can only see pedidos from their sector
      if (userSetor) {
        const pedidosFiltrados = todosPedidos.filter(pedido => pedido.setor === userSetor);
        setPedidos(pedidosFiltrados);
      } else {
        // No sector assigned
        setPedidos([]);
        toast.error('Usuário sem setor atribuído');
      }
    } else {
      // Unauthorized access attempt
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/login');
    }
  }, [navigate, userRole]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pedidos de Compra</h1>
        <p className="text-muted-foreground">
          Gerencie todos os pedidos de compra do município
        </p>
      </div>

      <PedidosTable pedidos={pedidos} />
    </div>
  );
};

export default ListaPedidos;
