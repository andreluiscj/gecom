
import { Workflow, WorkflowStepStatus } from '@/types';
import { getUserRoleSync } from './auth';
import { canEditWorkflowStepSync } from './auth/permissionHelpers';

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
