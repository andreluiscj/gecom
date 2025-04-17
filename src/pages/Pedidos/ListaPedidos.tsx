
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { PedidoCompra } from '@/types';
import { getUserSetorSync, getUserRoleSync } from '@/utils/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ListaPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const userRole = getUserRoleSync();
  const userSetor = getUserSetorSync();
  
  // Fetch pedidos from Supabase
  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      
      try {
        // Check user authentication
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session) {
          toast.error('Você não está autenticado');
          navigate('/login');
          return;
        }
        
        // Base query for dfds table
        let query = supabase
          .from('dfds')
          .select(`
            id, 
            descricao, 
            valor_estimado, 
            valor_realizado,
            data_pedido, 
            status, 
            justificativa,
            local_entrega,
            secretaria_id,
            secretarias(nome),
            dfd_workflows(percentual_completo)
          `)
          .order('created_at', { ascending: false });
        
        // Filter based on user role
        if (userRole !== 'admin' && userRole !== 'prefeito') {
          if (!userSetor) {
            setPedidos([]);
            setLoading(false);
            return;
          }
          // Managers and regular users only see pedidos from their sector
          query = query.eq('secretaria_id', userSetor);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching pedidos:', error);
          toast.error('Erro ao carregar pedidos');
          setPedidos([]);
        } else {
          // Transform the data to match the PedidoCompra type
          const formattedPedidos: PedidoCompra[] = data.map(item => ({
            id: item.id,
            descricao: item.descricao,
            setor: item.secretarias?.nome || 'Outro',
            dataCompra: new Date(item.data_pedido),
            status: item.status,
            valorTotal: item.valor_estimado || 0,
            itens: [], // These would be fetched in a separate query if needed
            fundoMonetario: '', // This would be properly linked if the fundos structure is implemented
            createdAt: new Date(item.data_pedido),
            observacoes: item.justificativa || '',
            fonteRecurso: '',
            localEntrega: item.local_entrega || '',
            responsavel: {
              id: '',
              nome: '',
              email: '',
              cargo: '',
            },
            anexos: [], // Would need separate query to fetch attachments
            workflow: item.dfd_workflows ? {
              percentComplete: item.dfd_workflows.percentual_completo || 0,
              currentStep: 0,
              steps: []
            } : null
          }));
          
          setPedidos(formattedPedidos);
        }
      } catch (err) {
        console.error('Error in pedidos fetch:', err);
        toast.error('Erro ao processar dados dos pedidos');
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, [navigate, userRole, userSetor]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pedidos de Compra</h1>
        <p className="text-muted-foreground">
          Gerencie todos os pedidos de compra do município
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PedidosTable pedidos={pedidos} />
      )}
    </div>
  );
};

export default ListaPedidos;
