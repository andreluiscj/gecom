
import React from 'react';
import PedidoForm from '@/components/Pedidos/PedidoForm';

const NovoPedido: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nova DFD</h1>
        <p className="text-muted-foreground">
          Preencha o formulário de Documento de Formalização de Demanda com as informações necessárias.
          Após salvar, o sistema atualizará automaticamente todas as listagens e estatísticas.
        </p>
      </div>

      <PedidoForm />
    </div>
  );
};

export default NovoPedido;
