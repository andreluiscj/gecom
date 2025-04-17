
import { supabase } from '@/integrations/supabase/client';
import { WorkflowStep, WorkflowStepStatus, Workflow } from '@/types';
import { canEditWorkflowStepSync } from './auth/permissionHelpers';
import { getUserRoleSync } from './auth';

// Helper function to fetch workflow steps for a DFD
export const getWorkflowSteps = async (dfdId: string): Promise<WorkflowStep[]> => {
  try {
    // Get workflow ID first
    const { data: workflow, error: workflowError } = await supabase
      .from('dfd_workflows')
      .select('id')
      .eq('dfd_id', dfdId)
      .single();
    
    if (workflowError || !workflow) {
      console.error('Error fetching workflow:', workflowError);
      return [];
    }
    
    // Get all workflow steps with their details
    const { data: steps, error: stepsError } = await supabase
      .from('workflow_etapas_dfd')
      .select(`
        id,
        status,
        data_inicio,
        data_conclusao,
        observacoes,
        workflow_etapa_id,
        workflow_etapas(titulo, ordem),
        responsavel_id,
        usuarios(nome)
      `)
      .eq('dfd_workflow_id', workflow.id)
      .order('workflow_etapas.ordem');
    
    if (stepsError || !steps) {
      console.error('Error fetching workflow steps:', stepsError);
      return [];
    }
    
    // Map to expected format
    return steps.map(step => ({
      id: step.id,
      title: step.workflow_etapas.titulo,
      status: mapDbStatusToUiStatus(step.status),
      date: step.data_inicio ? new Date(step.data_inicio) : undefined,
      responsavel: step.usuarios?.nome || undefined,
      dataConclusao: step.data_conclusao ? new Date(step.data_conclusao) : undefined,
      observacoes: step.observacoes || undefined
    }));
  } catch (error) {
    console.error('Error in getWorkflowSteps:', error);
    return [];
  }
};

// Helper function to check if a user can edit a workflow step
export const canEditStep = (workflow: Workflow, stepIndex: number): boolean => {
  // Check if the workflow exists and has steps
  if (!workflow || !workflow.steps || workflow.steps.length === 0) {
    return false;
  }
  
  // Check if the step index is valid
  if (stepIndex < 0 || stepIndex >= workflow.steps.length) {
    return false;
  }
  
  // Check if previous steps are completed
  for (let i = 0; i < stepIndex; i++) {
    if (workflow.steps[i].status !== 'Concluído') {
      return false;
    }
  }
  
  // Check if the current step is already completed
  if (workflow.steps[stepIndex].status === 'Concluído') {
    return false;
  }
  
  // Check user role permissions
  const userRole = getUserRoleSync();
  
  // Admin and prefeito can edit any step
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // For other roles, check specific permissions
  return canEditWorkflowStepSync(workflow.steps[stepIndex].title);
};

// Initialize a new workflow with default steps
export const initializeWorkflow = (): Workflow => {
  // Generate random IDs for each step
  const generateId = () => crypto.randomUUID();
  
  return {
    currentStep: 0,
    totalSteps: 8,
    percentComplete: 0,
    steps: [
      {
        id: generateId(),
        title: 'Aprovação da DFD',
        status: 'Pendente',
        date: new Date()
      },
      {
        id: generateId(),
        title: 'Cotação',
        status: 'Pendente'
      },
      {
        id: generateId(),
        title: 'Abertura de Processo',
        status: 'Pendente'
      },
      {
        id: generateId(),
        title: 'Empenhamento',
        status: 'Pendente'
      },
      {
        id: generateId(),
        title: 'Licitação',
        status: 'Pendente'
      },
      {
        id: generateId(),
        title: 'Contratação',
        status: 'Pendente'
      },
      {
        id: generateId(),
        title: 'Entrega',
        status: 'Pendente'
      },
      {
        id: generateId(),
        title: 'Pagamento',
        status: 'Pendente'
      }
    ]
  };
};

// Update workflow step status
export const updateWorkflowStep = async (
  workflowStepId: string, 
  status: 'pendente' | 'em_andamento' | 'concluido', 
  observacoes?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('workflow_etapas_dfd')
      .update({
        status,
        data_inicio: status === 'em_andamento' ? new Date().toISOString() : undefined,
        data_conclusao: status === 'concluido' ? new Date().toISOString() : undefined,
        observacoes: observacoes || undefined
      })
      .eq('id', workflowStepId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating workflow step:', error);
    return false;
  }
};

// Helper functions to map between DB and UI status
export const mapDbStatusToUiStatus = (dbStatus: 'pendente' | 'em_andamento' | 'concluido'): WorkflowStepStatus => {
  const statusMap: Record<string, WorkflowStepStatus> = {
    'pendente': 'Pendente',
    'em_andamento': 'Em Andamento',
    'concluido': 'Concluído'
  };
  return statusMap[dbStatus];
};

export const mapUiStatusToDbStatus = (uiStatus: WorkflowStepStatus): 'pendente' | 'em_andamento' | 'concluido' => {
  const statusMap: Record<string, 'pendente' | 'em_andamento' | 'concluido'> = {
    'Pendente': 'pendente',
    'Em Andamento': 'em_andamento',
    'Concluído': 'concluido'
  };
  return statusMap[uiStatus];
};
