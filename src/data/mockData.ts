
// This file will be greatly simplified as we transition to Supabase
import { PedidoCompra, PedidoStatus, DbPedidoStatus, Setor, Item, Workflow, WorkflowStep } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Utility function to generate ID (maintained for compatibility)
export function gerarId(): string {
  return crypto.randomUUID();
}

// Empty array as placeholder - no more static data
const todosPedidos: PedidoCompra[] = [];

// Map between database status and UI status
const mapDbStatusToUiStatus = (dbStatus: DbPedidoStatus): PedidoStatus => {
  const statusMap: Record<DbPedidoStatus, PedidoStatus> = {
    'pendente': 'Pendente',
    'em_analise': 'Em Análise',
    'aprovado': 'Aprovado',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído',
    'rejeitado': 'Rejeitado'
  };
  return statusMap[dbStatus] || 'Pendente';
};

// Map between UI status and database status
const mapUiStatusToDbStatus = (uiStatus: PedidoStatus): DbPedidoStatus => {
  const statusMap: Record<PedidoStatus, DbPedidoStatus> = {
    'Pendente': 'pendente',
    'Em Análise': 'em_analise',
    'Aprovado': 'aprovado',
    'Em Andamento': 'em_andamento',
    'Concluído': 'concluido',
    'Rejeitado': 'rejeitado'
  };
  return statusMap[uiStatus] || 'pendente';
};

// Function to add a new pedido to Supabase
export async function adicionarPedido(pedido: PedidoCompra): Promise<PedidoCompra | null> {
  try {
    // Convert setor from Setor type to string if needed
    const { data, error } = await supabase
      .from('dfds')
      .insert({
        id: pedido.id,
        descricao: pedido.descricao,
        secretaria_id: pedido.setor, // Assuming setor contains the secretaria_id
        data_pedido: pedido.dataCompra.toISOString(),
        status: mapUiStatusToDbStatus(pedido.status),
        valor_estimado: pedido.valorTotal,
        justificativa: pedido.observacoes || '',
        local_entrega: pedido.localEntrega || '',
        solicitante_id: '00000000-0000-0000-0000-000000000000' // Default user ID - should be replaced with actual user ID
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding pedido:', error);
      toast.error('Erro ao cadastrar pedido');
      return null;
    }
    
    // Add workflow for the pedido
    if (pedido.itens && pedido.itens.length > 0) {
      for (const item of pedido.itens) {
        const { error: itemError } = await supabase
          .from('dfd_itens')
          .insert({
            dfd_id: pedido.id,
            nome: item.nome,
            quantidade: item.quantidade,
            valor_unitario: item.valorUnitario
          });
        
        if (itemError) {
          console.error('Error adding item:', itemError);
        }
      }
    }
    
    return pedido;
  } catch (err) {
    console.error('Error in adicionarPedido:', err);
    return null;
  }
}

// Function to remove pedido
export async function removerPedido(id: string, setor?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dfds')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting pedido:', error);
      toast.error('Erro ao excluir pedido');
      return false;
    }
    
    toast.success('Pedido excluído com sucesso');
    return true;
  } catch (err) {
    console.error('Error in removerPedido:', err);
    return false;
  }
}

// Simplified function to fetch pedidos from Supabase
export async function obterTodosPedidos(): Promise<PedidoCompra[]> {
  try {
    const { data, error } = await supabase
      .from('dfds')
      .select(`
        id, 
        descricao, 
        valor_estimado, 
        data_pedido, 
        status, 
        secretaria_id,
        justificativa,
        local_entrega,
        secretarias(nome)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pedidos:', error);
      toast.error('Erro ao carregar pedidos');
      return [];
    }
    
    // Transform to match PedidoCompra type
    const pedidos: PedidoCompra[] = data.map(item => ({
      id: item.id,
      descricao: item.descricao,
      setor: item.secretarias?.nome as Setor || 'Outro',
      dataCompra: new Date(item.data_pedido),
      status: mapDbStatusToUiStatus(item.status as DbPedidoStatus || 'pendente'),
      valorTotal: item.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(item.data_pedido),
      observacoes: item.justificativa || '',
      localEntrega: item.local_entrega || '',
      fonteRecurso: '',
      responsavel: {
        id: '',
        nome: 'Sistema',
        email: '',
        cargo: '',
      },
      anexos: [],
      workflow: { 
        percentComplete: 0, 
        currentStep: 0, 
        totalSteps: 5,
        steps: [] 
      }
    }));
    
    // Fetch workflow information for each pedido
    for (const pedido of pedidos) {
      try {
        const { data: workflowData } = await supabase
          .from('dfd_workflows')
          .select('*')
          .eq('dfd_id', pedido.id)
          .single();
          
        if (workflowData) {
          pedido.workflow = {
            percentComplete: workflowData.percentual_completo || 0,
            currentStep: workflowData.etapa_atual || 0,
            totalSteps: 5, // Default value
            steps: []
          };
        }
      } catch (err) {
        console.error(`Error fetching workflow for pedido ${pedido.id}:`, err);
      }
    }
    
    return pedidos;
  } catch (err) {
    console.error('Error in obterTodosPedidos:', err);
    return [];
  }
}

// Alias for backward compatibility
export { obterTodosPedidos as obterPedidos };

// Simplified function to get pedidos by setor
export async function obterPedidosPorSetor(setor: string): Promise<PedidoCompra[]> {
  try {
    const { data, error } = await supabase
      .from('dfds')
      .select(`
        id, 
        descricao, 
        valor_estimado, 
        data_pedido, 
        status, 
        secretaria_id,
        justificativa,
        local_entrega,
        secretarias(nome)
      `)
      .eq('secretarias.nome', setor)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pedidos by setor:', error);
      return [];
    }
    
    // Transform to match PedidoCompra type
    return data.map(item => ({
      id: item.id,
      descricao: item.descricao,
      setor: item.secretarias?.nome as Setor || 'Outro',
      dataCompra: new Date(item.data_pedido),
      status: mapDbStatusToUiStatus(item.status as DbPedidoStatus || 'pendente'),
      valorTotal: item.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(item.data_pedido),
      observacoes: item.justificativa || '',
      localEntrega: item.local_entrega || '',
      fonteRecurso: '',
      responsavel: {
        id: '',
        nome: 'Sistema',
        email: '',
        cargo: '',
      },
      anexos: [],
      workflow: { 
        percentComplete: 0, 
        currentStep: 0, 
        totalSteps: 5,
        steps: [] 
      }
    }));
  } catch (err) {
    console.error('Error in obterPedidosPorSetor:', err);
    return [];
  }
}

// Add fundosMonetarios for compatibility
export const fundosMonetarios = [
  "Recursos Próprios",
  "Convênio Federal",
  "Convênio Estadual",
  "Emenda Parlamentar",
  "Fundo Municipal de Saúde",
  "Fundo Municipal de Educação",
  "Fundo Municipal de Assistência Social"
];

// Simplified function to update pedido status
export async function atualizarStatusPedido(id: string, novoStatus: PedidoStatus): Promise<PedidoCompra | null> {
  try {
    // Convert PedidoStatus to lowercase for database compatibility
    const statusDB = mapUiStatusToDbStatus(novoStatus);
    
    const { data, error } = await supabase
      .from('dfds')
      .update({ status: statusDB })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating pedido status:', error);
      return null;
    }
    
    // Transform to PedidoCompra format
    const pedido: PedidoCompra = {
      id: data.id,
      descricao: data.descricao,
      setor: 'Outro', // Default value, would need to fetch from secretarias
      dataCompra: new Date(data.data_pedido),
      status: mapDbStatusToUiStatus(data.status as DbPedidoStatus),
      valorTotal: data.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(data.created_at),
      observacoes: data.justificativa || '',
      localEntrega: data.local_entrega || '',
      fonteRecurso: '',
      responsavel: {
        id: '',
        nome: 'Sistema',
        email: '',
        cargo: '',
      },
      anexos: [],
      workflow: { 
        percentComplete: 0, 
        currentStep: 0, 
        totalSteps: 5,
        steps: [] 
      }
    };
    
    return pedido;
  } catch (err) {
    console.error('Error in atualizarStatusPedido:', err);
    return null;
  }
}

// Function to update workflow steps
export async function atualizarEtapaWorkflow(
  pedidoId: string, 
  etapaIndex: number, 
  status: WorkflowStepStatus,
  data?: Date,
  responsavel?: string,
  dataConclusao?: Date
): Promise<PedidoCompra | null> {
  try {
    // This is a placeholder function until we properly implement workflow in Supabase
    // In a real implementation, we would update the workflow_etapas_dfd table
    
    // For now, just return a dummy PedidoCompra
    const pedidos = await obterTodosPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
      return null;
    }
    
    // Return the pedido without modifications for now
    return pedido;
  } catch (err) {
    console.error('Error in atualizarEtapaWorkflow:', err);
    return null;
  }
}

// Helper function to format date (kept for convenience)
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(data);
}
