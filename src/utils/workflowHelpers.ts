
import { Workflow, WorkflowStep, PedidoCompra } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function initializeWorkflow(): Workflow {
  const steps: WorkflowStep[] = [
    {
      id: uuidv4(),
      title: 'Aprovação da DFD',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Criação da ETP',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Criação do TR',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Pesquisa de Preços',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Parecer Jurídico',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Edital',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Sessão Licitação',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Recursos',
      status: 'Pendente',
    },
    {
      id: uuidv4(),
      title: 'Homologação',
      status: 'Pendente',
    },
  ];
  
  return {
    currentStep: 0,
    totalSteps: steps.length,
    percentComplete: 0,
    steps,
  };
}

export function updateWorkflowFromPedidoStatus(pedido: PedidoCompra): PedidoCompra {
  // If no workflow exists, initialize it
  if (!pedido.workflow) {
    pedido.workflow = initializeWorkflow();
    return pedido;
  }
  
  // Make a deep copy of the pedido to avoid mutating the original
  const updatedPedido = { ...pedido, workflow: { ...pedido.workflow, steps: [...pedido.workflow.steps] } };
  
  // Update workflow steps based on pedido status
  switch (pedido.status) {
    case 'Pendente':
      // All steps stay as 'Pendente'
      break;
      
    case 'Em Análise':
      // First step is 'Em Andamento', rest are 'Pendente'
      updatedPedido.workflow.steps[0] = {
        ...updatedPedido.workflow.steps[0],
        status: 'Em Andamento',
        date: new Date()
      };
      updatedPedido.workflow.currentStep = 1;
      updatedPedido.workflow.percentComplete = Math.round((0.5 / updatedPedido.workflow.totalSteps) * 100);
      break;
      
    case 'Aprovado':
      // First step is 'Concluído', second is 'Em Andamento', rest are 'Pendente'
      updatedPedido.workflow.steps[0] = {
        ...updatedPedido.workflow.steps[0],
        status: 'Concluído',
        date: new Date(new Date().getTime() - 86400000), // Yesterday
        dataConclusao: new Date()
      };
      updatedPedido.workflow.steps[1] = {
        ...updatedPedido.workflow.steps[1],
        status: 'Em Andamento',
        date: new Date()
      };
      updatedPedido.workflow.currentStep = 2;
      updatedPedido.workflow.percentComplete = Math.round(((1 + 0.5) / updatedPedido.workflow.totalSteps) * 100);
      break;
      
    case 'Em Andamento':
      // First three steps are 'Concluído', fourth is 'Em Andamento', rest are 'Pendente'
      for (let i = 0; i < 3; i++) {
        updatedPedido.workflow.steps[i] = {
          ...updatedPedido.workflow.steps[i],
          status: 'Concluído',
          date: new Date(new Date().getTime() - (86400000 * (3-i))), // Days ago
          dataConclusao: new Date(new Date().getTime() - (43200000 * (3-i))) // Half days ago
        };
      }
      updatedPedido.workflow.steps[3] = {
        ...updatedPedido.workflow.steps[3],
        status: 'Em Andamento',
        date: new Date()
      };
      updatedPedido.workflow.currentStep = 4;
      updatedPedido.workflow.percentComplete = Math.round(((3 + 0.5) / updatedPedido.workflow.totalSteps) * 100);
      break;
      
    case 'Concluído':
      // All steps are 'Concluído'
      for (let i = 0; i < updatedPedido.workflow.steps.length; i++) {
        updatedPedido.workflow.steps[i] = {
          ...updatedPedido.workflow.steps[i],
          status: 'Concluído',
          date: new Date(new Date().getTime() - (86400000 * (updatedPedido.workflow.steps.length - i))),
          dataConclusao: new Date(new Date().getTime() - (43200000 * (updatedPedido.workflow.steps.length - i - 1)))
        };
      }
      updatedPedido.workflow.currentStep = updatedPedido.workflow.totalSteps;
      updatedPedido.workflow.percentComplete = 100;
      break;
      
    case 'Rejeitado':
      // First step is 'Em Andamento', rest are 'Pendente'
      updatedPedido.workflow.steps[0] = {
        ...updatedPedido.workflow.steps[0],
        status: 'Em Andamento',
        date: new Date()
      };
      updatedPedido.workflow.currentStep = 1;
      updatedPedido.workflow.percentComplete = Math.round((0.5 / updatedPedido.workflow.totalSteps) * 100);
      break;
      
    default:
      // No changes
      break;
  }
  
  return updatedPedido;
}
