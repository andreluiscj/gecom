
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { PedidoCompra } from '@/types';
import { getUserSetor, getUserRole } from '@/utils/auth';
import { shouldFilterByUserSetor } from '@/utils/auth/permissionHelpers';
import { toast } from 'sonner';
import { getPedidos } from '@/integrations/supabase/pedidos';

const ListaPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userSetor = getUserSetor();
  
  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await getPedidos();
        
        // Filter pedidos based on user role
        if (userRole === 'admin' || userRole === 'prefeito') {
          // Admin and prefeito can see all pedidos
          setPedidos(data);
        } else if (userRole === 'manager' || userRole === 'user') {
          // Managers (gerentes) and regular users can only see pedidos from their sector
          if (userSetor) {
            const pedidosFiltrados = data.filter(pedido => pedido.setor === userSetor);
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
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        toast.error('Erro ao carregar pedidos');
        
        // Fallback to local storage
        const pedidosStorage = localStorage.getItem('pedidos');
        if (pedidosStorage) {
          const storedPedidos = JSON.parse(pedidosStorage);
          setPedidos(storedPedidos);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchPedidos();
  }, [navigate, userRole, userSetor]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pedidos de Compra</h1>
        <p className="text-muted-foreground">
          Gerencie todos os pedidos de compra do município
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PedidosTable pedidos={pedidos} />
      )}
    </div>
  );
};

export default ListaPedidos;
