
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
    status: 'Pendente' as WorkflowStepStatus,
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
  date?: Date,
  responsavel?: string,
  dataConclusao?: Date
): PedidoCompra['workflow'] {
  if (!workflow) return initializeWorkflow();
  
  const updatedSteps = [...workflow.steps];
  
  if (updatedSteps[stepIndex]) {
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      status,
      date: date || (status === 'Concluído' ? new Date() : undefined),
      responsavel: responsavel || updatedSteps[stepIndex].responsavel,
      dataConclusao: dataConclusao || (status === 'Concluído' ? new Date() : updatedSteps[stepIndex].dataConclusao),
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
  
  // Reset all steps to "Pendente" state to ensure DFD approval isn't completed
  workflow.steps = workflow.steps.map((step) => ({
    ...step,
    status: 'Pendente' as WorkflowStepStatus
  }));
  
  // Set the percentComplete to 0 and currentStep to 0
  workflow.currentStep = 0;
  workflow.percentComplete = 0;
  
  return { ...pedido, workflow };
}

/**
 * Check if a given workflow step can be edited based on the status of previous steps
 * @param workflow The workflow object
 * @param stepIndex The index of the step being checked
 * @returns boolean indicating if the step can be edited
 */
export function canEditStep(workflow: PedidoCompra['workflow'], stepIndex: number): boolean {
  if (!workflow || stepIndex < 0 || stepIndex >= workflow.steps.length) {
    return false;
  }
  
  // First step can always be edited
  if (stepIndex === 0) {
    return true;
  }
  
  // For other steps, the previous step must be "Concluído"
  const previousStep = workflow.steps[stepIndex - 1];
  return previousStep.status === 'Concluído';
}

/**
 * Check if an employee has permission to work on a specific workflow step
 * @param stepTitle The title of the workflow step
 * @param funcionarioPermissao The employee's permission
 * @param funcionarioSetor The employee's sector/department
 * @returns boolean indicating if the employee has permission
 */
export function funcionarioTemPermissao(
  stepTitle: string, 
  funcionarioPermissao?: string,
  funcionarioSetor?: string
): boolean {
  // Special case: Health sector employees can work on any step
  if (funcionarioSetor === 'Saúde') {
    return true;
  }
  
  // Allow employees with manager/admin roles to work on any step
  if (funcionarioPermissao === 'admin' || funcionarioPermissao?.toLowerCase().includes('gerente')) {
    return true;
  }
  
  // Check if the employee is assigned to this specific step
  if (funcionarioPermissao === stepTitle) {
    return true;
  }
  
  // Check if the employee has "all" permissions
  if (funcionarioPermissao === "all") {
    return true;
  }
  
  // Check if the step title matches the employee's permission (for direct step assignments)
  return false;
}

