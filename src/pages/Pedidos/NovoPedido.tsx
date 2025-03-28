
import React from 'react';
import PedidoForm from '@/components/Pedidos/PedidoForm';

const NovoPedido: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Novo Pedido de Compra</h1>
        <p className="text-muted-foreground">
          Cadastre um novo pedido de compra para qualquer setor
        </p>
      </div>

      <PedidoForm />
    </div>
  );
};

export default NovoPedido;
