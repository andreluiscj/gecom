
import { supabase } from '@/lib/supabase';
import { Item, PedidoCompra, PedidoStatus, Setor, Workflow, WorkflowStep, mapPedidoStatusToRequestStatus, mapRequestStatusToPedidoStatus } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export async function getPedidos(): Promise<PedidoCompra[]> {
  try {
    // Use the view that joins purchase_requests with other tables
    const { data, error } = await supabase
      .from('vw_purchase_requests')
      .select('*');

    if (error) {
      console.error('Error fetching purchase requests:', error);
      toast.error('Erro ao carregar pedidos de compra.');
      return [];
    }

    const pedidos: PedidoCompra[] = [];
    
    // For each purchase request, fetch its items and workflow
    for (const request of data) {
      // Fetch items for this request
      const { data: itemsData, error: itemsError } = await supabase
        .from('request_items')
        .select('*')
        .eq('purchase_request_id', request.id);

      if (itemsError) {
        console.error(`Error fetching items for request ${request.id}:`, itemsError);
        continue;
      }

      // Fetch workflow steps for this request
      const { data: workflowData, error: workflowError } = await supabase
        .from('vw_request_workflow')
        .select('*')
        .eq('purchase_request_id', request.id)
        .order('order_sequence');

      if (workflowError) {
        console.error(`Error fetching workflow for request ${request.id}:`, workflowError);
      }

      // Map items to our format
      const itens: Item[] = itemsData.map(item => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantity,
        valorUnitario: item.unit_value,
        valorTotal: item.total_value
      }));

      // Map workflow steps to our format
      let workflow: Workflow | undefined;
      
      if (workflowData && workflowData.length > 0) {
        const steps: WorkflowStep[] = workflowData.map(step => ({
          id: step.workflow_step_id,
          title: step.workflow_step_name,
          status: step.status as WorkflowStep['status'],
          date: step.start_date ? new Date(step.start_date) : undefined,
          dataConclusao: step.completion_date ? new Date(step.completion_date) : undefined,
          responsavel: step.responsible_name || undefined
        }));

        const completedSteps = steps.filter(s => s.status === 'Concluído').length;
        const inProgressSteps = steps.filter(s => s.status === 'Em Andamento').length;
        const percentComplete = Math.round(
          ((completedSteps + (inProgressSteps * 0.5)) / steps.length) * 100
        );

        workflow = {
          currentStep: completedSteps + (inProgressSteps > 0 ? 1 : 0),
          totalSteps: steps.length,
          percentComplete,
          steps
        };
      }

      // Create pedido object
      pedidos.push({
        id: request.id,
        descricao: request.description,
        dataCompra: new Date(request.request_date),
        setor: request.secretariat_name as Setor,
        itens,
        valorTotal: request.total_estimated_value,
        status: mapRequestStatusToPedidoStatus(request.status_name),
        fundoMonetario: request.fund_name,
        createdAt: new Date(request.created_at),
        justificativa: request.justification,
        observacoes: request.observations || undefined,
        localEntrega: request.delivery_location || undefined,
        workflow
      });
    }

    return pedidos;
  } catch (error) {
    console.error('Error in getPedidos:', error);
    toast.error('Ocorreu um erro ao buscar os pedidos de compra.');
    return [];
  }
}

export async function getPedidoById(id: string): Promise<PedidoCompra | null> {
  try {
    // Get the purchase request
    const { data: request, error } = await supabase
      .from('vw_purchase_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching purchase request ${id}:`, error);
      toast.error('Erro ao carregar pedido de compra.');
      return null;
    }

    // Fetch items for this request
    const { data: itemsData, error: itemsError } = await supabase
      .from('request_items')
      .select('*')
      .eq('purchase_request_id', id);

    if (itemsError) {
      console.error(`Error fetching items for request ${id}:`, itemsError);
      toast.error('Erro ao carregar itens do pedido.');
      return null;
    }

    // Fetch workflow steps for this request
    const { data: workflowData, error: workflowError } = await supabase
      .from('vw_request_workflow')
      .select('*')
      .eq('purchase_request_id', id)
      .order('order_sequence');

    if (workflowError) {
      console.error(`Error fetching workflow for request ${id}:`, workflowError);
    }

    // Map items to our format
    const itens: Item[] = itemsData.map(item => ({
      id: item.id,
      nome: item.name,
      quantidade: item.quantity,
      valorUnitario: item.unit_value,
      valorTotal: item.total_value
    }));

    // Map workflow steps to our format
    let workflow: Workflow | undefined;
    
    if (workflowData && workflowData.length > 0) {
      const steps: WorkflowStep[] = workflowData.map(step => ({
        id: step.workflow_step_id,
        title: step.workflow_step_name,
        status: step.status as WorkflowStep['status'],
        date: step.start_date ? new Date(step.start_date) : undefined,
        dataConclusao: step.completion_date ? new Date(step.completion_date) : undefined,
        responsavel: step.responsible_name || undefined
      }));

      const completedSteps = steps.filter(s => s.status === 'Concluído').length;
      const inProgressSteps = steps.filter(s => s.status === 'Em Andamento').length;
      const percentComplete = Math.round(
        ((completedSteps + (inProgressSteps * 0.5)) / steps.length) * 100
      );

      workflow = {
        currentStep: completedSteps + (inProgressSteps > 0 ? 1 : 0),
        totalSteps: steps.length,
        percentComplete,
        steps
      };
    }

    // Create pedido object
    return {
      id: request.id,
      descricao: request.description,
      dataCompra: new Date(request.request_date),
      setor: request.secretariat_name as Setor,
      itens,
      valorTotal: request.total_estimated_value,
      status: mapRequestStatusToPedidoStatus(request.status_name),
      fundoMonetario: request.fund_name,
      createdAt: new Date(request.created_at),
      justificativa: request.justification,
      observacoes: request.observations || undefined,
      localEntrega: request.delivery_location || undefined,
      workflow
    };
  } catch (error) {
    console.error('Error in getPedidoById:', error);
    toast.error('Ocorreu um erro ao buscar o pedido de compra.');
    return null;
  }
}

export async function addPedido(pedido: Omit<PedidoCompra, 'id' | 'createdAt'>): Promise<PedidoCompra | null> {
  try {
    // Get the current user
    const userId = localStorage.getItem('user-id');
    if (!userId) {
      toast.error('Usuário não identificado.');
      return null;
    }

    // Get the secretariat ID based on the setor name
    const { data: secretariatData, error: secretariatError } = await supabase
      .from('secretariats')
      .select('id')
      .eq('name', pedido.setor)
      .single();

    if (secretariatError) {
      console.error('Error getting secretariat ID:', secretariatError);
      toast.error('Erro ao identificar a secretaria.');
      return null;
    }

    const secretariatId = secretariatData.id;

    // Get the fund ID based on the fund name
    const { data: fundData, error: fundError } = await supabase
      .from('funds')
      .select('id')
      .eq('name', pedido.fundoMonetario)
      .single();

    if (fundError) {
      console.error('Error getting fund ID:', fundError);
      toast.error('Erro ao identificar o fundo monetário.');
      return null;
    }

    const fundId = fundData.id;

    // Get the status ID for 'Pendente'
    const { data: statusData, error: statusError } = await supabase
      .from('request_statuses')
      .select('id')
      .eq('name', 'Pendente')
      .single();

    if (statusError) {
      console.error('Error getting status ID:', statusError);
      toast.error('Erro ao identificar o status.');
      return null;
    }

    const statusId = statusData.id;

    // Generate a request number
    const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Insert the purchase request
    const { data: requestData, error: requestError } = await supabase
      .from('purchase_requests')
      .insert({
        request_number: requestNumber,
        secretariat_id: secretariatId,
        fund_id: fundId,
        requester_id: userId,
        responsible_id: userId,
        description: pedido.descricao,
        justification: pedido.justificativa || 'Necessidade do serviço',
        request_date: pedido.dataCompra.toISOString().split('T')[0],
        total_estimated_value: pedido.valorTotal,
        status_id: statusId,
        delivery_location: pedido.localEntrega,
        observations: pedido.observacoes
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error inserting purchase request:', requestError);
      toast.error('Erro ao criar pedido de compra.');
      return null;
    }

    const purchaseRequestId = requestData.id;

    // Insert the items
    for (const item of pedido.itens) {
      const { error: itemError } = await supabase
        .from('request_items')
        .insert({
          purchase_request_id: purchaseRequestId,
          name: item.nome,
          quantity: item.quantidade,
          unit_value: item.valorUnitario,
        });

      if (itemError) {
        console.error('Error inserting item:', itemError);
        toast.error('Erro ao adicionar itens ao pedido.');
        // Consider rolling back the purchase request?
        return null;
      }
    }

    // Get all workflow steps
    const { data: workflowSteps, error: workflowError } = await supabase
      .from('workflow_steps')
      .select('*')
      .order('order_sequence');

    if (workflowError) {
      console.error('Error getting workflow steps:', workflowError);
      toast.error('Erro ao configurar fluxo de trabalho do pedido.');
      return null;
    }

    // Initialize workflow for the purchase request
    for (const step of workflowSteps) {
      const { error: workflowStepError } = await supabase
        .from('request_workflows')
        .insert({
          purchase_request_id: purchaseRequestId,
          workflow_step_id: step.id,
          status: 'Pendente',
        });

      if (workflowStepError) {
        console.error('Error initializing workflow step:', workflowStepError);
        toast.error('Erro ao configurar etapas do fluxo de trabalho.');
        return null;
      }
    }

    // Get the newly created pedido with all related data
    return getPedidoById(purchaseRequestId);
  } catch (error) {
    console.error('Error in addPedido:', error);
    toast.error('Ocorreu um erro ao adicionar o pedido de compra.');
    return null;
  }
}

export async function updatePedidoStatus(id: string, novoStatus: PedidoStatus): Promise<PedidoCompra | null> {
  try {
    // Get the status ID based on the status name
    const { data: statusData, error: statusError } = await supabase
      .from('request_statuses')
      .select('id')
      .eq('name', mapPedidoStatusToRequestStatus(novoStatus))
      .single();

    if (statusError) {
      console.error('Error getting status ID:', statusError);
      toast.error('Erro ao identificar o status.');
      return null;
    }

    const statusId = statusData.id;

    // Update the purchase request status
    const { error: updateError } = await supabase
      .from('purchase_requests')
      .update({ status_id: statusId })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating purchase request status:', updateError);
      toast.error('Erro ao atualizar o status do pedido.');
      return null;
    }

    // Update workflow based on status
    if (novoStatus === 'Em Andamento') {
      // Find the first workflow step that is pending and set it to 'Em Andamento'
      const { data: workflowData, error: workflowError } = await supabase
        .from('request_workflows')
        .select('*')
        .eq('purchase_request_id', id)
        .eq('status', 'Pendente')
        .order('id')
        .limit(1);

      if (!workflowError && workflowData && workflowData.length > 0) {
        const { error: updateWorkflowError } = await supabase
          .from('request_workflows')
          .update({ 
            status: 'Em Andamento',
            start_date: new Date().toISOString()
          })
          .eq('id', workflowData[0].id);

        if (updateWorkflowError) {
          console.error('Error updating workflow step:', updateWorkflowError);
        }
      }
    } else if (novoStatus === 'Concluído') {
      // Find all workflow steps that are not completed and set them to 'Concluído'
      const { data: workflowData, error: workflowError } = await supabase
        .from('request_workflows')
        .select('*')
        .eq('purchase_request_id', id)
        .neq('status', 'Concluído');

      if (!workflowError && workflowData && workflowData.length > 0) {
        for (const step of workflowData) {
          const { error: updateWorkflowError } = await supabase
            .from('request_workflows')
            .update({ 
              status: 'Concluído',
              completion_date: new Date().toISOString()
            })
            .eq('id', step.id);

          if (updateWorkflowError) {
            console.error('Error updating workflow step:', updateWorkflowError);
          }
        }
      }
    }

    // Get the updated pedido
    return getPedidoById(id);
  } catch (error) {
    console.error('Error in updatePedidoStatus:', error);
    toast.error('Ocorreu um erro ao atualizar o status do pedido.');
    return null;
  }
}

export async function deletePedido(id: string): Promise<boolean> {
  try {
    // Delete the purchase request (cascade will delete related items and workflow)
    const { error } = await supabase
      .from('purchase_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting purchase request:', error);
      toast.error('Erro ao excluir o pedido de compra.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePedido:', error);
    toast.error('Ocorreu um erro ao excluir o pedido de compra.');
    return false;
  }
}

export async function getPedidosPorSetor(setor: Setor): Promise<PedidoCompra[]> {
  try {
    // Get all pedidos and filter by setor
    const pedidos = await getPedidos();
    return pedidos.filter(p => p.setor === setor);
  } catch (error) {
    console.error('Error in getPedidosPorSetor:', error);
    toast.error('Ocorreu um erro ao buscar os pedidos por setor.');
    return [];
  }
}

export async function updateEtapaWorkflow(
  pedidoId: string, 
  etapaIndex: number, 
  novoStatus: 'Concluído' | 'Em Andamento' | 'Pendente',
  data?: Date,
  responsavel?: string,
  dataConclusao?: Date
): Promise<PedidoCompra | null> {
  try {
    // Get the workflow steps for this purchase request
    const { data: workflowSteps, error: workflowError } = await supabase
      .from('vw_request_workflow')
      .select('*')
      .eq('purchase_request_id', pedidoId)
      .order('order_sequence');

    if (workflowError || !workflowSteps || workflowSteps.length === 0) {
      console.error('Error getting workflow steps:', workflowError);
      toast.error('Erro ao buscar etapas do fluxo de trabalho.');
      return null;
    }

    if (etapaIndex < 0 || etapaIndex >= workflowSteps.length) {
      toast.error('Índice de etapa inválido.');
      return null;
    }

    const stepId = workflowSteps[etapaIndex].id;
    
    // Get the user ID for the responsible person
    let responsibleId = null;
    if (responsavel) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('name', responsavel)
        .single();

      if (!userError && userData) {
        responsibleId = userData.id;
      }
    }

    // Update the workflow step
    const { error: updateError } = await supabase
      .from('request_workflows')
      .update({ 
        status: novoStatus,
        start_date: data ? data.toISOString() : null,
        responsible_id: responsibleId,
        completion_date: (novoStatus === 'Concluído' && !dataConclusao) ? new Date().toISOString() : 
                         dataConclusao ? dataConclusao.toISOString() : null
      })
      .eq('id', stepId);

    if (updateError) {
      console.error('Error updating workflow step:', updateError);
      toast.error('Erro ao atualizar etapa do fluxo de trabalho.');
      return null;
    }

    // Get total steps and completed steps to update the purchase request status
    const completedSteps = workflowSteps.filter((s, i) => 
      i === etapaIndex ? novoStatus === 'Concluído' : s.status === 'Concluído'
    ).length;
    
    const inProgressSteps = workflowSteps.filter((s, i) => 
      i === etapaIndex ? novoStatus === 'Em Andamento' : s.status === 'Em Andamento'
    ).length;
    
    const percentComplete = Math.round(
      ((completedSteps + (inProgressSteps * 0.5)) / workflowSteps.length) * 100
    );
    
    // Update purchase request status based on workflow progress
    let newStatus = 'Pendente';
    if (percentComplete === 100) {
      newStatus = 'Concluído';
    } else if (percentComplete > 50) {
      newStatus = 'Em Andamento';
    } else if (percentComplete > 0) {
      newStatus = 'Aprovado';
    }
    
    // Get the status ID
    const { data: statusData, error: statusError } = await supabase
      .from('request_statuses')
      .select('id')
      .eq('name', newStatus)
      .single();

    if (statusError) {
      console.error('Error getting status ID:', statusError);
    } else {
      // Update the purchase request status
      await supabase
        .from('purchase_requests')
        .update({ status_id: statusData.id })
        .eq('id', pedidoId);
    }

    // Get the updated pedido
    return getPedidoById(pedidoId);
  } catch (error) {
    console.error('Error in updateEtapaWorkflow:', error);
    toast.error('Ocorreu um erro ao atualizar a etapa do fluxo de trabalho.');
    return null;
  }
}
