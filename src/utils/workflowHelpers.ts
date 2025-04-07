
import { v4 as uuidv4 } from 'uuid';
import { PedidoCompra, WorkflowStep, WorkflowStepStatus } from '@/types';

// Define the default workflow steps for a purchase process
export const DEFAULT_WORKFLOW_STEPS = [
  { title: 'Aprovação da DFD', status: 'Pendente' as WorkflowStepStatus },
  { title: 'Criação da ETP', status: 'Pendente' as WorkflowStepStatus },
  { title: 'Criação do TR', status: 'Pendente' as WorkflowStepStatus },
  { title: 'Pesquisa de Preços', status: 'Pendente' as WorkflowStepStatus },
  { title: 'Parecer Jurídico', status: 'Pendente' as WorkflowStepStatus },
  { title: 'Edital', status: 'Pendente' as WorkflowStepStatus },
  { title: 'Sessão Licitação', status: 'Pendente' as WorkflowStepStatus },
  { title: 'Homologação', status: 'Pendente' as WorkflowStepStatus },
];

// Initialize a new workflow for a pedido
export function initializeWorkflow(): PedidoCompra['workflow'] {
  const steps = DEFAULT_WORKFLOW_STEPS.map(step => ({
    ...step,
    id: uuidv4(),
    status: step.status,
  }));

  return {
    currentStep: 0,
    totalSteps: steps.length,
    percentComplete: 0,
    steps,
  };
}

// Update the status of a specific workflow step
export function updateWorkflowStep(
  workflow: PedidoCompra['workflow'], 
  stepIndex: number, 
  status: WorkflowStepStatus,
  date?: Date
): PedidoCompra['workflow'] {
  if (!workflow) return initializeWorkflow();
  
  const updatedSteps = [...workflow.steps];
  
  if (updatedSteps[stepIndex]) {
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      status,
      date: date || (status === 'Concluído' ? new Date() : undefined),
    };
  }

  // Calculate the current step and progress percentage
  const completedSteps = updatedSteps.filter(step => step.status === 'Concluído').length;
  const inProgressSteps = updatedSteps.filter(step => step.status === 'Em Andamento').length;
  
  // Current step is the number of completed steps + 1 (if there are steps in progress)
  const currentStep = inProgressSteps > 0 ? completedSteps + 1 : completedSteps;
  
  // Calculate percentage with weighted value for in-progress steps
  const percentComplete = Math.round((completedSteps + (inProgressSteps * 0.5)) / updatedSteps.length * 100);
  
  return {
    currentStep,
    totalSteps: workflow.totalSteps,
    percentComplete,
    steps: updatedSteps,
  };
}

// Automatically update workflow based on pedido status
export function updateWorkflowFromPedidoStatus(pedido: PedidoCompra): PedidoCompra {
  let workflow = pedido.workflow || initializeWorkflow();
  
  if (pedido.status === 'Pendente') {
    // In Pendente status, the first step is in progress
    workflow = updateWorkflowStep(workflow, 0, 'Em Andamento');
  } else if (pedido.status === 'Em Análise' || pedido.status === 'Aprovado') {
    // When in analysis or approved, the first step is completed and the second step is in progress
    workflow = updateWorkflowStep(workflow, 0, 'Concluído');
    workflow = updateWorkflowStep(workflow, 1, 'Em Andamento');
  } else if (pedido.status === 'Em Andamento') {
    // For in progress status, more steps are completed
    workflow = updateWorkflowStep(workflow, 0, 'Concluído');
    workflow = updateWorkflowStep(workflow, 1, 'Concluído');
    workflow = updateWorkflowStep(workflow, 2, 'Em Andamento');
  } else if (pedido.status === 'Concluído') {
    // When concluded, all steps are completed
    for (let i = 0; i < workflow.totalSteps; i++) {
      workflow = updateWorkflowStep(workflow, i, 'Concluído');
    }
  }
  
  return { ...pedido, workflow };
}
