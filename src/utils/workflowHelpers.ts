
import { Workflow, WorkflowStep, PedidoCompra } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function initializeWorkflow(): Workflow {
  const workflowId = uuidv4();
  const steps: WorkflowStep[] = [
    {
      id: uuidv4(),
      titulo: 'Solicitação',
      status: 'Pendente',
      ordem: 1
    },
    {
      id: uuidv4(),
      titulo: 'Análise',
      status: 'Pendente',
      ordem: 2
    },
    {
      id: uuidv4(),
      titulo: 'Aprovação',
      status: 'Pendente',
      ordem: 3
    },
    {
      id: uuidv4(),
      titulo: 'Cotação',
      status: 'Pendente',
      ordem: 4
    },
    {
      id: uuidv4(),
      titulo: 'Empenho',
      status: 'Pendente',
      ordem: 5
    },
    {
      id: uuidv4(),
      titulo: 'Entrega',
      status: 'Pendente',
      ordem: 6
    }
  ];

  return {
    id: workflowId,
    pedido_id: '',
    etapa_atual: 1,
    total_etapas: steps.length,
    percentual_completo: 0,
    steps
  };
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
