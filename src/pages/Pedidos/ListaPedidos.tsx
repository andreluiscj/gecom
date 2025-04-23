
import React, { useState, useEffect } from 'react';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { pedidoService } from '@/services/supabase';
import { PedidoCompra } from '@/types';
import { toast } from 'sonner';

const ListaPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Buscar pedidos do Supabase
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const data = await pedidoService.getAll();
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        toast.error("Não foi possível carregar os pedidos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pedidos de Compra</h1>
        <p className="text-muted-foreground">
          Gerencie todos os pedidos de compra do município
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <PedidosTable pedidos={pedidos} />
      )}
    </div>
  );
};

export default ListaPedidos;
