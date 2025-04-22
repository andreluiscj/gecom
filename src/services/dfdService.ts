
import { supabase } from '@/integrations/supabase/client';
import { PedidoCompra, PedidoStatus, Item, WorkflowStepStatus, WorkflowStep } from '@/types';
import { toast } from 'sonner';
import { DbPedidoStatus } from '@/types/supabase';

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
          status: mapDbStatusToUiStatus(step.status as DbPedidoStatus) as WorkflowStepStatus,
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

// Function to update a pedido
export const updatePedido = async (pedido: PedidoCompra): Promise<PedidoCompra | null> => {
  try {
    // Update the main DFD record
    const { error } = await supabase
      .from('dfds')
      .update({
        descricao: pedido.descricao,
        justificativa: pedido.justificativa || pedido.observacoes,
        status: mapUiStatusToDbStatus(pedido.status as PedidoStatus),
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
              status: mapUiStatusToDbStatus(step.status as PedidoStatus),
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
      setor: item.secretarias?.nome || 'Outro',
      dataCompra: new Date(item.data_pedido || new Date()),
      status: mapDbStatusToUiStatus(item.status as DbPedidoStatus),
      valorTotal: item.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(item.data_pedido || new Date()),
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
          
          // Fetch workflow steps
          const { data: stepsData } = await supabase
            .from('workflow_etapas_dfd')
            .select(`
              id,
              status,
              data_inicio,
              data_conclusao,
              workflow_etapas(titulo, ordem)
            `)
            .eq('dfd_workflow_id', workflowData.id)
            .order('workflow_etapas.ordem');
          
          if (stepsData && stepsData.length > 0) {
            pedido.workflow.steps = stepsData.map(step => ({
              id: step.id,
              title: step.workflow_etapas.titulo,
              status: mapDbStatusToUiStatus(step.status as WorkflowStepStatus),
              date: step.data_inicio ? new Date(step.data_inicio) : undefined,
              dataConclusao: step.data_conclusao ? new Date(step.data_conclusao) : undefined
            }));
            pedido.workflow.totalSteps = stepsData.length;
          }
        }
        
        // Fetch items for this pedido
        const { data: itemsData } = await supabase
          .from('dfd_itens')
          .select('*')
          .eq('dfd_id', pedido.id);
        
        if (itemsData && itemsData.length > 0) {
          pedido.itens = itemsData.map(item => ({
            id: item.id,
            nome: item.nome,
            quantidade: item.quantidade,
            valorUnitario: item.valor_unitario,
            valorTotal: item.quantidade * item.valor_unitario
          }));
        }
      } catch (err) {
        console.error(`Error fetching details for pedido ${pedido.id}:`, err);
      }
    }
    
    return pedidos;
  } catch (err) {
    console.error('Error in obterTodosPedidos:', err);
    return [];
  }
};

// Alias for backward compatibility
export const obterPedidos = obterTodosPedidos;

// Function to get pedidos by setor
export const obterPedidosPorSetor = async (setor: string): Promise<PedidoCompra[]> => {
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
    const pedidos: PedidoCompra[] = data.map(item => ({
      id: item.id,
      descricao: item.descricao,
      setor: item.secretarias?.nome || 'Outro',
      dataCompra: new Date(item.data_pedido || new Date()),
      status: mapDbStatusToUiStatus(item.status as DbPedidoStatus),
      valorTotal: item.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(item.data_pedido || new Date()),
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
    
    // Fetch items for each pedido
    for (const pedido of pedidos) {
      const { data: itemsData } = await supabase
        .from('dfd_itens')
        .select('*')
        .eq('dfd_id', pedido.id);
      
      if (itemsData && itemsData.length > 0) {
        pedido.itens = itemsData.map(item => ({
          id: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          valorUnitario: item.valor_unitario,
          valorTotal: item.quantidade * item.valor_unitario
        }));
      }
    }
    
    return pedidos;
  } catch (err) {
    console.error('Error in obterPedidosPorSetor:', err);
    return [];
  }
};

// Function to add a new pedido
export const adicionarPedido = async (pedido: PedidoCompra): Promise<PedidoCompra | null> => {
  try {
    // Insert the main DFD record
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
        solicitante_id: (await supabase.auth.getSession()).data.session?.user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding pedido:', error);
      toast.error('Erro ao cadastrar pedido');
      return null;
    }
    
    // Add items
    if (pedido.itens && pedido.itens.length > 0) {
      for (const item of pedido.itens) {
        const { error: itemError } = await supabase
          .from('dfd_itens')
          .insert({
            dfd_id: data.id,
            nome: item.nome,
            quantidade: item.quantidade,
            valor_unitario: item.valorUnitario
          });
        
        if (itemError) {
          console.error('Error adding item:', itemError);
        }
      }
    }
    
    // Workflow will be created automatically by the trigger
    
    toast.success('Pedido cadastrado com sucesso!');
    return {
      ...pedido,
      id: data.id
    };
  } catch (err) {
    console.error('Error in adicionarPedido:', err);
    toast.error('Erro ao cadastrar pedido');
    return null;
  }
};

// Function to remove a pedido
export const removerPedido = async (id: string): Promise<boolean> => {
  try {
    // Delete items first (due to foreign key constraints)
    const { error: itemsError } = await supabase
      .from('dfd_itens')
      .delete()
      .eq('dfd_id', id);
    
    if (itemsError) {
      console.error('Error deleting pedido items:', itemsError);
    }
    
    // Delete the DFD (cascades to workflow)
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
    toast.error('Erro ao excluir pedido');
    return false;
  }
};

// Function to update pedido status
export const atualizarStatusPedido = async (id: string, novoStatus: PedidoStatus): Promise<PedidoCompra | null> => {
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
      toast.error('Erro ao atualizar status do pedido');
      return null;
    }
    
    // Transform to PedidoCompra format
    const pedido: PedidoCompra = {
      id: data.id,
      descricao: data.descricao,
      setor: 'Outro', // Will be updated later
      dataCompra: new Date(data.data_pedido || new Date()),
      status: mapDbStatusToUiStatus(data.status as DbPedidoStatus),
      valorTotal: data.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(data.created_at || new Date()),
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
    
    // Get secretaria name
    const { data: secretariaData } = await supabase
      .from('secretarias')
      .select('nome')
      .eq('id', data.secretaria_id)
      .single();
    
    if (secretariaData) {
      pedido.setor = secretariaData.nome;
    }
    
    // Get workflow data
    const { data: workflowData } = await supabase
      .from('dfd_workflows')
      .select('*')
      .eq('dfd_id', id)
      .single();
    
    if (workflowData) {
      pedido.workflow = {
        percentComplete: workflowData.percentual_completo || 0,
        currentStep: workflowData.etapa_atual || 0,
        totalSteps: 5,
        steps: []
      };
    }
    
    // Get items
    const { data: itemsData } = await supabase
      .from('dfd_itens')
      .select('*')
      .eq('dfd_id', id);
    
    if (itemsData) {
      pedido.itens = itemsData.map(item => ({
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        valorUnitario: item.valor_unitario,
        valorTotal: item.quantidade * item.valor_unitario
      }));
    }
    
    toast.success(`Status atualizado para: ${novoStatus}`);
    return pedido;
  } catch (err) {
    console.error('Error in atualizarStatusPedido:', err);
    toast.error('Erro ao atualizar status do pedido');
    return null;
  }
};

// Function to update workflow step
export const atualizarEtapaWorkflow = async (
  pedidoId: string, 
  etapaIndex: number, 
  status: WorkflowStepStatus,
  data?: Date,
  responsavel?: string,
  dataConclusao?: Date
): Promise<PedidoCompra | null> => {
  try {
    // Get the workflow for this DFD
    const { data: workflowData, error: workflowError } = await supabase
      .from('dfd_workflows')
      .select('id')
      .eq('dfd_id', pedidoId)
      .single();
    
    if (workflowError || !workflowData) {
      console.error('Error getting workflow:', workflowError);
      return null;
    }
    
    // Get all steps for this workflow
    const { data: stepsData, error: stepsError } = await supabase
      .from('workflow_etapas_dfd')
      .select('id, workflow_etapas(ordem)')
      .eq('dfd_workflow_id', workflowData.id)
      .order('workflow_etapas.ordem');
    
    if (stepsError || !stepsData || stepsData.length === 0) {
      console.error('Error getting workflow steps:', stepsError);
      return null;
    }
    
    // Find the step with the given index
    const targetStep = stepsData[etapaIndex];
    if (!targetStep) {
      console.error('Step index out of bounds:', etapaIndex);
      return null;
    }
    
    // Update the step status
    const { error: updateError } = await supabase
      .from('workflow_etapas_dfd')
      .update({
        status: mapUiStatusToDbStatus(status),
        data_inicio: data?.toISOString(),
        data_conclusao: dataConclusao?.toISOString(),
        responsavel_id: undefined // Would need to look up the user ID
      })
      .eq('id', targetStep.id);
    
    if (updateError) {
      console.error('Error updating workflow step:', updateError);
      return null;
    }
    
    // Get updated pedido
    const pedidos = await obterTodosPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
      console.error('Could not find updated pedido');
      return null;
    }
    
    toast.success(`Etapa atualizada para: ${status}`);
    return pedido;
  } catch (err) {
    console.error('Error in atualizarEtapaWorkflow:', err);
    return null;
  }
};

// Get available funds
export const obterFundosMonetarios = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('fundos')
      .select('nome');
    
    if (error) {
      console.error('Error fetching fundos:', error);
      return [
        "Recursos Próprios",
        "Convênio Federal",
        "Convênio Estadual",
        "Emenda Parlamentar",
        "Fundo Municipal de Saúde",
        "Fundo Municipal de Educação",
        "Fundo Municipal de Assistência Social"
      ];
    }
    
    return data.map(f => f.nome);
  } catch (err) {
    console.error('Error in obterFundosMonetarios:', err);
    return [
      "Recursos Próprios",
      "Convênio Federal",
      "Convênio Estadual",
      "Emenda Parlamentar",
      "Fundo Municipal de Saúde",
      "Fundo Municipal de Educação",
      "Fundo Municipal de Assistência Social"
    ];
  }
};

// Constant for backward compatibility
export const fundosMonetarios = [
  "Recursos Próprios",
  "Convênio Federal",
  "Convênio Estadual",
  "Emenda Parlamentar",
  "Fundo Municipal de Saúde",
  "Fundo Municipal de Educação",
  "Fundo Municipal de Assistência Social"
];

// Helper function to format date
export const formatarData = (data: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(data);
};
