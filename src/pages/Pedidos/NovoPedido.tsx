
import React, { useEffect, useState } from 'react';
import PedidoForm from '@/components/Pedidos/PedidoForm';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const NovoPedido: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nova DFD</h1>
        <p className="text-muted-foreground">
          Preencha o formulário de Documento de Formalização de Demanda com as informações necessárias.
          Após salvar, o sistema atualizará automaticamente todas as listagens e estatísticas.
        </p>
      </div>

      {isAuthenticated ? (
        <PedidoForm />
      ) : (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Você precisa estar autenticado para criar um novo pedido.
          </p>
        </Card>
      )}
    </div>
  );
};

export default NovoPedido;
