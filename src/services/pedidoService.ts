
import { supabase } from '@/lib/supabase';
import { PedidoCompra, PedidoStatus, mapRequestStatusToPedidoStatus, mapPedidoStatusToRequestStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Fetch all purchase requests
export async function getPedidos(): Promise<PedidoCompra[]> {
  try {
    const { data: requests, error } = await supabase
      .from('vw_purchase_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      return [];
    }

    // Map database result to our frontend type
    return requests.map(req => ({
      id: req.id,
      descricao: req.description,
      dataCompra: new Date(req.request_date),
      setor: req.secretariat_name,
      valorTotal: req.total_estimated_value || 0,
      status: mapRequestStatusToPedidoStatus(req.status_name),
      fundoMonetario: req.fund_name,
      createdAt: new Date(req.created_at),
      justificativa: req.justification,
      solicitante: req.requester_name,
      observacoes: req.observations || undefined,
      localEntrega: req.delivery_location || undefined,
      // Itens will be fetched separately if needed
      itens: [],
      workflow: undefined, // Will be populated separately if needed
    }));
  } catch (error) {
    console.error('Error in getPedidos:', error);
    return [];
  }
}

// Get details for a specific pedido, including items
export async function getPedidoById(id: string): Promise<PedidoCompra | null> {
  try {
    // Get the pedido main data
    const { data: requests, error } = await supabase
      .from('vw_purchase_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !requests) {
      console.error('Error fetching request:', error);
      return null;
    }

    // Get the pedido items
    const { data: items, error: itemsError } = await supabase
      .from('request_items')
      .select('*')
      .eq('purchase_request_id', id);

    if (itemsError) {
      console.error('Error fetching request items:', itemsError);
      return null;
    }

    // Get workflow data
    const { data: workflow, error: workflowError } = await supabase
      .from('vw_request_workflow')
      .select('*')
      .eq('purchase_request_id', id)
      .order('order_sequence', { ascending: true });

    if (workflowError) {
      console.error('Error fetching workflow:', workflowError);
    }

    // Map items to our frontend type
    const mappedItems = items.map(item => ({
      id: item.id,
      nome: item.name,
      quantidade: item.quantity,
      valorUnitario: item.unit_value,
      valorTotal: item.total_value,
    }));

    // Construct workflow if available
    let workflowData;
    if (workflow && workflow.length > 0) {
      // Find the current step
      let currentStepIndex = 0;
      const steps = workflow.map((step, index) => {
        if (step.status === 'Em Andamento') {
          currentStepIndex = index;
        }
        return {
          id: step.id,
          title: step.workflow_step_name,
          status: step.status as any,
          date: step.start_date ? new Date(step.start_date) : undefined,
          dataConclusao: step.completion_date ? new Date(step.completion_date) : undefined,
          responsavel: step.responsible_name || undefined,
        };
      });

      // Calculate progress as percentage
      const percentComplete = ((currentStepIndex + (steps[currentStepIndex]?.status === 'Concluído' ? 1 : 0.5)) / steps.length) * 100;

      workflowData = {
        currentStep: currentStepIndex,
        totalSteps: steps.length,
        percentComplete,
        steps,
      };
    }

    // Construct the complete pedido
    return {
      id: requests.id,
      descricao: requests.description,
      dataCompra: new Date(requests.request_date),
      setor: requests.secretariat_name,
      valorTotal: requests.total_estimated_value,
      status: mapRequestStatusToPedidoStatus(requests.status_name),
      fundoMonetario: requests.fund_name,
      createdAt: new Date(requests.created_at),
      justificativa: requests.justification,
      solicitante: requests.requester_name,
      observacoes: requests.observations || undefined,
      localEntrega: requests.delivery_location || undefined,
      itens: mappedItems,
      workflow: workflowData,
    };
  } catch (error) {
    console.error('Error in getPedidoById:', error);
    return null;
  }
}

// Add a new purchase request
export async function addPedido(pedido: Omit<PedidoCompra, 'id' | 'createdAt'>): Promise<PedidoCompra | null> {
  try {
    const { data: statusData } = await supabase
      .from('request_statuses')
      .select('id')
      .eq('name', mapPedidoStatusToRequestStatus(pedido.status))
      .single();

    if (!statusData) {
      throw new Error('Status not found');
    }

    // Get user info
    const userId = localStorage.getItem('user-id');
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Get secretariat id
    const { data: secretariats } = await supabase
      .from('secretariats')
      .select('id')
      .eq('name', pedido.setor)
      .single();

    if (!secretariats) {
      throw new Error('Secretariat not found');
    }

    // Get fund id
    const { data: funds } = await supabase
      .from('funds')
      .select('id')
      .eq('name', pedido.fundoMonetario)
      .eq('secretariat_id', secretariats.id)
      .single();

    if (!funds) {
      throw new Error('Fund not found');
    }

    // Generate a request number
    const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Insert the request
    const { data: request, error: requestError } = await supabase
      .from('purchase_requests')
      .insert({
        request_number: requestNumber,
        description: pedido.descricao,
        justification: pedido.justificativa || 'Necessidade operacional',
        request_date: new Date(pedido.dataCompra).toISOString(),
        total_estimated_value: pedido.valorTotal,
        secretariat_id: secretariats.id,
        fund_id: funds.id,
        requester_id: userId,
        status_id: statusData.id,
        delivery_location: pedido.localEntrega,
        observations: pedido.observacoes,
      })
      .select()
      .single();

    if (requestError || !request) {
      console.error('Error creating request:', requestError);
      return null;
    }

    // Insert the items
    const itemsToInsert = pedido.itens.map(item => ({
      purchase_request_id: request.id,
      name: item.nome,
      quantity: item.quantidade,
      unit_value: item.valorUnitario,
      total_value: item.valorTotal || (item.quantidade * item.valorUnitario),
    }));

    const { error: itemsError } = await supabase
      .from('request_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating items:', itemsError);
      // Consider rolling back the request here
    }

    // Initialize workflow steps
    const { data: workflowSteps } = await supabase
      .from('workflow_steps')
      .select('id, name, order_sequence')
      .order('order_sequence', { ascending: true });

    if (workflowSteps && workflowSteps.length > 0) {
      const workflowToInsert = workflowSteps.map((step, index) => ({
        purchase_request_id: request.id,
        workflow_step_id: step.id,
        status: index === 0 ? 'Pendente' : 'Pendente',
      }));

      const { error: workflowError } = await supabase
        .from('request_workflows')
        .insert(workflowToInsert);

      if (workflowError) {
        console.error('Error creating workflow:', workflowError);
      }
    }

    // Return the created pedido with its id
    return await getPedidoById(request.id);
  } catch (error) {
    console.error('Error in addPedido:', error);
    return null;
  }
}

export async function removePedido(id: string): Promise<boolean> {
  try {
    // First remove related records (items, workflow)
    await supabase.from('request_items').delete().eq('purchase_request_id', id);
    await supabase.from('request_workflows').delete().eq('purchase_request_id', id);
    
    // Then remove the main record
    const { error } = await supabase.from('purchase_requests').delete().eq('id', id);
    
    if (error) {
      console.error('Error deleting request:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removePedido:', error);
    return false;
  }
}

export async function updatePedidoStatus(id: string, status: PedidoStatus): Promise<boolean> {
  try {
    // Get status id
    const { data: statusData } = await supabase
      .from('request_statuses')
      .select('id')
      .eq('name', mapPedidoStatusToRequestStatus(status))
      .single();
    
    if (!statusData) {
      throw new Error('Status not found');
    }
    
    const { error } = await supabase
      .from('purchase_requests')
      .update({ status_id: statusData.id, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updatePedidoStatus:', error);
    return false;
  }
}
