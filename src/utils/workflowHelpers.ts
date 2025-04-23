import { Workflow, WorkflowStep, PedidoCompra } from '@/types';

export function initializeWorkflow(): Workflow {
  const steps: WorkflowStep[] = [
    {
      id: crypto.randomUUID(),
      titulo: 'Solicitação',
      status: 'Pendente',
      ordem: 1
    },
    {
      id: crypto.randomUUID(),
      titulo: 'Análise',
      status: 'Pendente',
      ordem: 2
    },
    {
      id: crypto.randomUUID(),
      titulo: 'Aprovação',
      status: 'Pendente',
      ordem: 3
    },
    {
      id: crypto.randomUUID(),
      titulo: 'Cotação',
      status: 'Pendente',
      ordem: 4
    },
    {
      id: crypto.randomUUID(),
      titulo: 'Empenho',
      status: 'Pendente',
      ordem: 5
    },
    {
      id: crypto.randomUUID(),
      titulo: 'Entrega',
      status: 'Pendente',
      ordem: 6
    }
  ];

  return {
    id: crypto.randomUUID(),
    pedido_id: '',
    etapa_atual: 1,
    total_etapas: steps.length,
    percentual_completo: 0,
    steps
  };
}

// Array of default workflow step names for reference
export const DEFAULT_WORKFLOW_STEPS = [
  'Solicitação',
  'Análise',
  'Aprovação',
  'Cotação',
  'Empenho',
  'Entrega'
];

// Check if step can be edited
export function canEditStep(workflow: Workflow, stepIndex: number): boolean {
  // First step can always be edited
  if (stepIndex === 0) return true;
  
  // Other steps can only be edited if all previous steps are completed
  for (let i = 0; i < stepIndex; i++) {
    if (workflow.steps[i].status !== 'Concluído') {
      return false;
    }
  }
  
  return true;
}

// Check if user has permission
export function funcionarioTemPermissao(funcionarioId: string, etapa: string): boolean {
  // Simplified permission check
  // In a real app, this would check against actual permissions in the database
  return true;
}

export function updateWorkflowFromPedidoStatus(pedido: PedidoCompra): PedidoCompra {
  if (!pedido.workflow) {
    pedido.workflow = initializeWorkflow();
    pedido.workflow.pedido_id = pedido.id;
  }

  // Update workflow steps based on pedido status
  switch (pedido.status) {
    case 'Pendente':
      // Only first step is in progress
      pedido.workflow.steps[0].status = 'Em Andamento';
      pedido.workflow.etapa_atual = 1;
      pedido.workflow.percentual_completo = 10;
      break;
    case 'Em Análise':
      // First step complete, second in progress
      pedido.workflow.steps[0].status = 'Concluído';
      pedido.workflow.steps[0].data_conclusao = new Date();
      pedido.workflow.steps[1].status = 'Em Andamento';
      pedido.workflow.steps[1].data_inicio = new Date();
      pedido.workflow.etapa_atual = 2;
      pedido.workflow.percentual_completo = 25;
      break;
    case 'Aprovado':
      // First two steps complete, third in progress
      pedido.workflow.steps[0].status = 'Concluído';
      pedido.workflow.steps[0].data_conclusao = new Date();
      pedido.workflow.steps[1].status = 'Concluído';
      pedido.workflow.steps[1].data_conclusao = new Date();
      pedido.workflow.steps[2].status = 'Em Andamento';
      pedido.workflow.steps[2].data_inicio = new Date();
      pedido.workflow.etapa_atual = 3;
      pedido.workflow.percentual_completo = 40;
      break;
    case 'Em Andamento':
      // First three steps complete, fourth in progress
      pedido.workflow.steps[0].status = 'Concluído';
      pedido.workflow.steps[0].data_conclusao = new Date();
      pedido.workflow.steps[1].status = 'Concluído';
      pedido.workflow.steps[1].data_conclusao = new Date();
      pedido.workflow.steps[2].status = 'Concluído';
      pedido.workflow.steps[2].data_conclusao = new Date();
      pedido.workflow.steps[3].status = 'Em Andamento';
      pedido.workflow.steps[3].data_inicio = new Date();
      pedido.workflow.etapa_atual = 4;
      pedido.workflow.percentual_completo = 60;
      break;
    case 'Concluído':
      // All steps complete
      pedido.workflow.steps.forEach((step, index) => {
        step.status = 'Concluído';
        step.data_inicio = new Date(new Date().getTime() - (86400000 * (6 - index)));
        step.data_conclusao = new Date(new Date().getTime() - (43200000 * (6 - index)));
      });
      pedido.workflow.etapa_atual = 6;
      pedido.workflow.percentual_completo = 100;
      break;
    case 'Rejeitado':
      // Failed at some point
      pedido.workflow.steps[0].status = 'Concluído';
      pedido.workflow.steps[0].data_conclusao = new Date();
      pedido.workflow.steps[1].status = 'Concluído';
      pedido.workflow.steps[1].data_conclusao = new Date();
      pedido.workflow.steps[2].status = 'Pendente';
      pedido.workflow.etapa_atual = 2;
      pedido.workflow.percentual_completo = 30;
      break;
  }

  return pedido;
}
