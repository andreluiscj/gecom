
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PedidoForm from '@/components/Pedidos/PedidoForm';
import { PedidoCompra } from '@/types';
import { toast } from 'sonner';

const NovoPedido: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (pedido: PedidoCompra) => {
    toast.success('Pedido criado com sucesso!');
    navigate('/pedidos');
  };

  const handleCancel = () => {
    navigate('/pedidos');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nova DFD</h1>
        <p className="text-muted-foreground">
          Preencha o formulário de Documento de Formalização de Demanda com as informações necessárias.
          Após salvar, o sistema atualizará automaticamente todas as listagens e estatísticas.
        </p>
      </div>

      <PedidoForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default NovoPedido;
