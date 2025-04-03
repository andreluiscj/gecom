
import React from 'react';
import PedidoForm from '@/components/Pedidos/PedidoForm';

const NovoPedido: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nova DFD</h1>
        <p className="text-muted-foreground">
          Cadastre um novo Documento de Formalização de Demanda para qualquer setor
        </p>
      </div>

      <PedidoForm />
    </div>
  );
};

export default NovoPedido;
