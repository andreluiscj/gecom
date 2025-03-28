
import React from 'react';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { obterTodosPedidos } from '@/data/mockData';

const ListaPedidos: React.FC = () => {
  const pedidos = obterTodosPedidos();

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
