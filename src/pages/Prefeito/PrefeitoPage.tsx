
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { getUserRoleSync } from '@/utils/auth';
import { PedidoCompra, PedidoStatus } from '@/types';
import { obterPedidos, atualizarStatusPedido } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

const PrefeitoPage: React.FC = () => {
  const [pedidosPendentes, setPedidosPendentes] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = getUserRoleSync();

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      try {
        // Check if user has access
        if (userRole !== 'admin' && userRole !== 'prefeito') {
          toast.error('Você não tem permissão para acessar esta página');
          return;
        }
        
        // Fetch pedidos pendentes
        const allPedidos = await obterPedidos();
        const pendentes = allPedidos.filter(p => p.status === 'Pendente');
        setPedidosPendentes(pendentes);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
        toast.error('Erro ao carregar pedidos pendentes');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPedidos();
  }, [userRole]);

  const handleAprove = async (pedido: PedidoCompra) => {
    try {
      // Update pedido status to 'aprovado'
      const updatedPedido = await atualizarStatusPedido(pedido.id, 'Aprovado');
      
      if (updatedPedido) {
        toast.success('Pedido aprovado com sucesso!');
        
        // Remove from pendentes list
        setPedidosPendentes(prev => prev.filter(p => p.id !== pedido.id));
        
        // Create workflow if needed
        try {
          const { data: workflow } = await supabase
            .from('dfd_workflows')
            .select('*')
            .eq('dfd_id', pedido.id)
            .single();
          
          if (!workflow) {
            // Create workflow
            await supabase
              .from('dfd_workflows')
              .insert({
                dfd_id: pedido.id,
                percentual_completo: 10,
                etapa_atual: 1
              });
          }
        } catch (err) {
          console.error('Error checking/creating workflow:', err);
        }
      } else {
        toast.error('Erro ao aprovar pedido');
      }
    } catch (error) {
      console.error('Error approving pedido:', error);
      toast.error('Erro ao aprovar pedido');
    }
  };

  const handleReject = async (pedido: PedidoCompra) => {
    try {
      // Update pedido status to 'rejeitado'
      const updatedPedido = await atualizarStatusPedido(pedido.id, 'Rejeitado');
      
      if (updatedPedido) {
        toast.success('Pedido rejeitado com sucesso!');
        
        // Remove from pendentes list
        setPedidosPendentes(prev => prev.filter(p => p.id !== pedido.id));
      } else {
        toast.error('Erro ao rejeitar pedido');
      }
    } catch (error) {
      console.error('Error rejecting pedido:', error);
      toast.error('Erro ao rejeitar pedido');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userRole !== 'admin' && userRole !== 'prefeito') {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Portal do Prefeito</h1>
        <p className="text-muted-foreground">
          Aprove ou rejeite pedidos de compra pendentes
        </p>
      </div>

      {pedidosPendentes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Não há pedidos pendentes de aprovação.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pedidosPendentes.map((pedido) => (
            <Card key={pedido.id}>
              <CardHeader>
                <CardTitle className="text-lg">{pedido.descricao}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Secretaria</span>
                    <span>{pedido.setor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data do Pedido</span>
                    <span>{pedido.dataCompra.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Valor Total</span>
                    <span>{formatCurrency(pedido.valorTotal)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleReject(pedido)}>
                  Rejeitar
                </Button>
                <Button onClick={() => handleAprove(pedido)}>
                  Aprovar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrefeitoPage;
