
import { supabase } from '@/integrations/supabase/client';
import { PedidoCompra, PedidoStatus, Item, WorkflowStepStatus, WorkflowStep, DbPedidoStatus, WorkflowStatus } from '@/types';
import { toast } from 'sonner';

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

// Function to get a specific pedido by ID - implementing the missing function
export const getPedido = async (id: string): Promise<PedidoCompra | null> => {
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
        secretarias(nome),
        solicitante_id
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching pedido details:', error);
      toast.error('Erro ao buscar detalhes do pedido');
      return null;
    }
    
    // Transform data to match PedidoCompra type
    const pedido: PedidoCompra = {
      id: data.id,
      descricao: data.descricao,
      justificativa: data.justificativa || '',
      setor: data.secretarias?.nome || 'Outro',
      items: [],
      valorTotal: data.valor_estimado || 0,
      status: mapDbStatusToUiStatus(data.status as DbPedidoStatus),
      dataCompra: new Date(data.data_pedido || new Date()),
      solicitante: '', // Will be fetched separately
      localEntrega: data.local_entrega || '',
      observacoes: data.justificativa || '',
      workflowSteps: [] // Will be populated below
    };
    
    // Fetch solicitante (user) details
    const { data: userData } = await supabase
      .from('usuarios')
      .select('nome')
      .eq('id', data.solicitante_id)
      .single();
      
    if (userData) {
      pedido.solicitante = userData.nome;
    }
    
    // Fetch workflow information
    const { data: workflowData } = await supabase
      .from('dfd_workflows')
      .select('id')
      .eq('dfd_id', data.id)
      .single();
      
    // Fetch workflow steps if workflow exists
    if (workflowData) {
      const { data: stepsData } = await supabase
        .from('workflow_etapas_dfd')
        .select(`
          id,
          status,
          data_inicio,
          data_conclusao,
          observacoes,
          workflow_etapa_id,
          workflow_etapas(titulo, ordem)
        `)
        .eq('dfd_workflow_id', workflowData.id)
        .order('workflow_etapas.ordem');
      
      if (stepsData && stepsData.length > 0) {
        pedido.workflowSteps = stepsData.map(step => ({
          id: step.id,
          title: step.workflow_etapas.titulo,
          status: mapDbStatusToWorkflowStepStatus(step.status),
          date: step.data_inicio ? new Date(step.data_inicio) : new Date(),
          dataConclusao: step.data_conclusao ? new Date(step.data_conclusao) : undefined,
          observacoes: step.observacoes
        }));
      }
    }
    
    // Fetch items
    const { data: itemsData } = await supabase
      .from('dfd_itens')
      .select('*')
      .eq('dfd_id', data.id);
    
    if (itemsData && itemsData.length > 0) {
      pedido.items = itemsData.map(item => ({
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        valorUnitario: item.valor_unitario,
        valorTotal: item.quantidade * item.valor_unitario
      }));
    }
    
    return pedido;
  } catch (err) {
    console.error('Error in getPedido:', err);
    toast.error('Erro ao buscar pedido');
    return null;
  }
};

// Map between database workflow status and UI workflow step status
const mapDbStatusToWorkflowStepStatus = (dbStatus: WorkflowStatus | string): WorkflowStepStatus => {
  const statusMap: Record<string, WorkflowStepStatus> = {
    'pendente': 'Pendente',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído',
    'aprovado': 'Aprovado',
    'reprovado': 'Reprovado'
  };
  return statusMap[dbStatus] || 'Pendente';
};

// Function to update a pedido
export const updatePedido = async (pedido: PedidoCompra): Promise<PedidoCompra | null> => {
  try {
    // Update the main DFD record
    const { error } = await supabase
      .from('dfds')
      .update({
        descricao: pedido.descricao,
        justificativa: pedido.justificativa || pedido.observacoes,
        status: mapUiStatusToDbStatus(pedido.status),
        valor_estimado: pedido.valorTotal,
        local_entrega: pedido.localEntrega
      })
      .eq('id', pedido.id);
    
    if (error) {
      console.error('Error updating pedido:', error);
      toast.error('Erro ao atualizar pedido');
      return null;
    }
    
    // Update workflow steps if they exist
    if (pedido.workflowSteps && pedido.workflowSteps.length > 0) {
      // Get the workflow ID
      const { data: workflowData } = await supabase
        .from('dfd_workflows')
        .select('id')
        .eq('dfd_id', pedido.id)
        .single();
      
      if (workflowData) {
        // Update each workflow step
        for (const step of pedido.workflowSteps) {
          const { error: stepError } = await supabase
            .from('workflow_etapas_dfd')
            .update({
              status: step.status.toLowerCase() as WorkflowStatus,
              data_conclusao: step.dataConclusao?.toISOString(),
              observacoes: step.observacoes
            })
            .eq('id', step.id);
          
          if (stepError) {
            console.error(`Error updating workflow step ${step.id}:`, stepError);
          }
        }
      }
    }
    
    toast.success('Pedido atualizado com sucesso');
    return pedido;
  } catch (err) {
    console.error('Error in updatePedido:', err);
    toast.error('Erro ao atualizar pedido');
    return null;
  }
};

// Function to add a new pedido
export const adicionarPedido = async (pedido: PedidoCompra): Promise<PedidoCompra> => {
  // For mock implementation, just return the same pedido
  return pedido;
};

// Function to get all DFDs
export const obterTodosPedidos = async (): Promise<PedidoCompra[]> => {
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
      justificativa: item.justificativa || '',
      setor: item.secretarias?.nome || 'Outro',
      items: [],
      valorTotal: item.valor_estimado || 0,
      status: mapDbStatusToUiStatus(item.status as DbPedidoStatus),
      dataCompra: new Date(item.data_pedido || new Date()),
      solicitante: 'Sistema',
      localEntrega: item.local_entrega || ''
    }));
    
    return pedidos;
  } catch (err) {
    console.error('Error in obterTodosPedidos:', err);
    toast.error('Erro ao carregar pedidos');
    return [];
  }
};
