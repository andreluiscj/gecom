import { Funcionario, WorkflowStep, PedidoStatus, Workflow, PedidoCompra } from "@/types";

export const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "1",
    title: "Análise Inicial",
    status: "Pendente",
  },
  {
    id: "2",
    title: "Aprovação Financeira",
    status: "Pendente",
  },
  {
    id: "3",
    title: "Cotações",
    status: "Pendente",
  },
  {
    id: "4",
    title: "Análise de Cotações",
    status: "Pendente",
  },
  {
    id: "5",
    title: "Empenho",
    status: "Pendente",
  },
  {
    id: "6",
    title: "Aprovação Final",
    status: "Pendente",
  },
];

export function funcionarioTemPermissao(
  funcionario: Funcionario,
  etapa: string
): boolean {
  if (funcionario.permissaoEtapa === "all") return true;
  return funcionario.permissaoEtapa === etapa;
}

export function canEditStep(
  userRole: string | null,
  stepStatus: string,
  isResponsible: boolean
): boolean {
  // Admin can edit any step
  if (userRole === "admin") return true;

  // Managers can edit pending steps
  if (userRole === "manager" && stepStatus === "Pendente") return true;

  // Responsible users can edit their in-progress steps
  if (isResponsible && stepStatus === "Em Andamento") return true;

  return false;
}

// Initialize workflow with default steps
export function initializeWorkflow(): Workflow {
  return {
    currentStep: 1,
    totalSteps: DEFAULT_WORKFLOW_STEPS.length,
    percentComplete: 0,
    steps: [...DEFAULT_WORKFLOW_STEPS]
  };
}

// Update workflow based on pedido status
export function updateWorkflowFromPedidoStatus(pedido: PedidoCompra): Workflow {
  const workflow = pedido.workflow || initializeWorkflow();
  
  switch (pedido.status) {
    case 'Aprovado':
      // Set all steps to completed
      workflow.steps = workflow.steps.map(step => ({
        ...step,
        status: 'Concluído'
      }));
      workflow.currentStep = workflow.totalSteps;
      workflow.percentComplete = 100;
      break;
    case 'Rejeitado':
      // Keep existing steps but mark workflow as stopped
      workflow.percentComplete = 0;
      break;
    default:
      // Calculate progress based on completed steps
      const completedSteps = workflow.steps.filter(
        step => step.status === 'Concluído'
      ).length;
      workflow.currentStep = completedSteps + 1;
      workflow.percentComplete = (completedSteps / workflow.totalSteps) * 100;
  }
  
  return workflow;
}
