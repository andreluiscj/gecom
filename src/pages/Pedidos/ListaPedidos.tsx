
import React, { useState, useEffect } from 'react';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { obterTodosPedidos } from '@/data/mockData';
import { PedidoCompra } from '@/types';

const ListaPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  
  // Fetch pedidos whenever the component renders to ensure fresh data
  useEffect(() => {
    setPedidos(obterTodosPedidos());
  }, []);

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
