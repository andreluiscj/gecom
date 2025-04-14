
import React, { useState, useEffect } from 'react';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { getPedidos } from '@/services/pedidoService';
import { PedidoCompra } from '@/types';
import { Loader2 } from 'lucide-react';

const ListaPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch pedidos from Supabase
  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <PedidosTable pedidos={pedidos} />
      )}
    </div>
  );
};

export default ListaPedidos;
