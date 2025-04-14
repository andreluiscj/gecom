
import { supabase } from '@/lib/supabase';
import { PedidoCompra, Item, Setor, Workflow, WorkflowStep } from '@/types';
import { toast } from 'sonner';
import { initializeWorkflow, updateWorkflowFromPedidoStatus } from '@/utils/workflowHelpers';

// Get all pedidos
export async function getPedidos(): Promise<PedidoCompra[]> {
  try {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select(`
        id, description, request_date, value, status, 
        observations, justification, delivery_location, 
        created_at, monetary_fund, requester_id,
        secretariats (id, name),
        workflow_data
      `);

    if (error) {
      console.error('Error fetching pedidos:', error);
      toast.error('Erro ao carregar pedidos.');
      return [];
    }

    // Get items for each pedido
    const pedidos = await Promise.all(data.map(async (pedido) => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('request_items')
        .select('id, name, quantity, unit_value')
        .eq('request_id', pedido.id);

      if (itemsError) {
        console.error('Error fetching items for pedido:', itemsError);
        return null;
      }

      // Map DB item to frontend Item
      const items: Item[] = itemsData.map(item => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantity,
        valorUnitario: item.unit_value,
        valorTotal: item.quantity * item.unit_value
      }));

      // Calculate total based on items
      const valorTotal = items.reduce((acc, item) => acc + (item.valorTotal || 0), 0);

      // Get workflow data or create default
      let workflow = pedido.workflow_data;
      if (!workflow) {
        workflow = initializeWorkflow();
      }

      // Convert to frontend PedidoCompra type
      return {
        id: pedido.id,
        descricao: pedido.description,
        dataCompra: new Date(pedido.request_date),
        setor: pedido.secretariats?.name as Setor,
        itens: items,
        valorTotal: valorTotal,
        status: pedido.status,
        fundoMonetario: pedido.monetary_fund,
        createdAt: new Date(pedido.created_at),
        justificativa: pedido.justification,
        observacoes: pedido.observations,
        workflow: workflow,
        localEntrega: pedido.delivery_location,
        solicitante: pedido.requester_id
      };
    }));

    // Filter out nulls from failed pedido fetches
    return pedidos.filter(Boolean) as PedidoCompra[];
  } catch (error) {
    console.error('Error in getPedidos:', error);
    toast.error('Ocorreu um erro ao buscar os pedidos.');
    return [];
  }
}

// Get pedidos by setor
export async function getPedidosPorSetor(setor: Setor): Promise<PedidoCompra[]> {
  try {
    const { data: secretariat, error: secretariatError } = await supabase
      .from('secretariats')
      .select('id')
      .eq('name', setor)
      .single();

    if (secretariatError) {
      console.error('Error fetching secretariat:', secretariatError);
      return [];
    }

    const secretariatId = secretariat.id;

    const { data, error } = await supabase
      .from('purchase_requests')
      .select(`
        id, description, request_date, value, status, 
        observations, justification, delivery_location, 
        created_at, monetary_fund, requester_id,
        secretariats (id, name),
        workflow_data
      `)
      .eq('secretariat_id', secretariatId);

    if (error) {
      console.error('Error fetching pedidos por setor:', error);
      toast.error('Erro ao carregar pedidos por setor.');
      return [];
    }

    // Get items for each pedido (same as in getPedidos)
    const pedidos = await Promise.all(data.map(async (pedido) => {
      const { data: itemsData, error: itemsError } = await supabase
        .from('request_items')
        .select('id, name, quantity, unit_value')
        .eq('request_id', pedido.id);

      if (itemsError) {
        console.error('Error fetching items for pedido:', itemsError);
        return null;
      }

      const items: Item[] = itemsData.map(item => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantity,
        valorUnitario: item.unit_value,
        valorTotal: item.quantity * item.unit_value
      }));

      const valorTotal = items.reduce((acc, item) => acc + (item.valorTotal || 0), 0);

      let workflow = pedido.workflow_data;
      if (!workflow) {
        workflow = initializeWorkflow();
      }

      return {
        id: pedido.id,
        descricao: pedido.description,
        dataCompra: new Date(pedido.request_date),
        setor: pedido.secretariats?.name as Setor,
        itens: items,
        valorTotal: valorTotal,
        status: pedido.status,
        fundoMonetario: pedido.monetary_fund,
        createdAt: new Date(pedido.created_at),
        justificativa: pedido.justification,
        observacoes: pedido.observations,
        workflow: workflow,
        localEntrega: pedido.delivery_location,
        solicitante: pedido.requester_id
      };
    }));

    return pedidos.filter(Boolean) as PedidoCompra[];
  } catch (error) {
    console.error('Error in getPedidosPorSetor:', error);
    toast.error('Ocorreu um erro ao buscar os pedidos por setor.');
    return [];
  }
}

// Update workflow step
export async function updateEtapaWorkflow(
  pedidoId: string, 
  etapaId: string, 
  status: string,
  responsavel?: string
): Promise<boolean> {
  try {
    // First get the current workflow data
    const { data: pedidoData, error: pedidoError } = await supabase
      .from('purchase_requests')
      .select('workflow_data')
      .eq('id', pedidoId)
      .single();

    if (pedidoError) {
      console.error('Error fetching pedido workflow:', pedidoError);
      toast.error('Erro ao buscar informações do pedido.');
      return false;
    }

    const workflow = pedidoData.workflow_data || initializeWorkflow();

    // Update the specific step
    const updatedSteps = workflow.steps.map((step: WorkflowStep) => {
      if (step.id === etapaId) {
        return {
          ...step,
          status: status,
          responsavel: responsavel || step.responsavel,
          dataConclusao: status === 'Concluído' ? new Date() : undefined
        };
      }
      return step;
    });

    // Calculate new completion percentage
    const completedSteps = updatedSteps.filter((step: WorkflowStep) => step.status === 'Concluído').length;
    const newPercentComplete = (completedSteps / workflow.totalSteps) * 100;

    const updatedWorkflow = {
      ...workflow,
      steps: updatedSteps,
      percentComplete: newPercentComplete,
      currentStep: completedSteps + 1 > workflow.totalSteps ? workflow.totalSteps : completedSteps + 1
    };

    // Update purchase request with new workflow data
    const { error } = await supabase
      .from('purchase_requests')
      .update({ workflow_data: updatedWorkflow })
      .eq('id', pedidoId);

    if (error) {
      console.error('Error updating workflow:', error);
      toast.error('Erro ao atualizar etapa do pedido.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateEtapaWorkflow:', error);
    toast.error('Ocorreu um erro ao atualizar a etapa do workflow.');
    return false;
  }
}

// Delete pedido
export async function deletePedido(id: string): Promise<boolean> {
  try {
    // First delete associated items
    const { error: itemsError } = await supabase
      .from('request_items')
      .delete()
      .eq('request_id', id);

    if (itemsError) {
      console.error('Error deleting pedido items:', itemsError);
      toast.error('Erro ao excluir itens do pedido.');
      return false;
    }

    // Then delete the pedido itself
    const { error } = await supabase
      .from('purchase_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pedido:', error);
      toast.error('Erro ao excluir pedido.');
      return false;
    }

    toast.success('Pedido excluído com sucesso.');
    return true;
  } catch (error) {
    console.error('Error in deletePedido:', error);
    toast.error('Ocorreu um erro ao excluir o pedido.');
    return false;
  }
}

// Add new pedido
export async function addPedido(pedido: Omit<PedidoCompra, 'id'>): Promise<PedidoCompra> {
  try {
    // Get secretariat ID
    const { data: secretariatData, error: secretariatError } = await supabase
      .from('secretariats')
      .select('id')
      .eq('name', pedido.setor)
      .single();

    if (secretariatError) {
      console.error('Error getting secretariat ID:', secretariatError);
      throw new Error('Erro ao obter ID do setor.');
    }

    // Initialize workflow
    const workflow = initializeWorkflow();

    // Insert the purchase request
    const { data, error } = await supabase
      .from('purchase_requests')
      .insert({
        description: pedido.descricao,
        request_date: pedido.dataCompra.toISOString(),
        secretariat_id: secretariatData.id,
        value: pedido.valorTotal,
        status: pedido.status,
        monetary_fund: pedido.fundoMonetario,
        observations: pedido.observacoes || '',
        justification: pedido.justificativa || '',
        delivery_location: pedido.localEntrega || '',
        requester_id: pedido.solicitante || null,
        workflow_data: workflow
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error adding pedido:', error);
      throw new Error('Erro ao adicionar pedido.');
    }

    const pedidoId = data.id;

    // Insert all items
    for (const item of pedido.itens) {
      const { error: itemError } = await supabase
        .from('request_items')
        .insert({
          request_id: pedidoId,
          name: item.nome,
          quantity: item.quantidade,
          unit_value: item.valorUnitario
        });

      if (itemError) {
        console.error('Error adding item:', itemError);
        // Continue with other items even if one fails
      }
    }

    // Return the created pedido
    const createdPedido: PedidoCompra = {
      id: pedidoId,
      ...pedido,
      workflow
    };

    return createdPedido;
  } catch (error) {
    console.error('Error in addPedido:', error);
    toast.error('Ocorreu um erro ao adicionar o pedido.');
    throw error;
  }
}
