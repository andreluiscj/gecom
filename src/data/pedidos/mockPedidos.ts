import { PedidoCompra, PedidoStatus, Item, Workflow, WorkflowStep } from '@/types';

// Mock data for items
const novoItem: Item = {
  id: crypto.randomUUID(),
  nome: "Item Teste",
  quantidade: 2,
  valor_unitario: 175.375,
  valor_total: 350.75,
  pedido_id: ""
};

// Mock data for workflow steps
const workflowSteps: WorkflowStep[] = [
  {
    id: crypto.randomUUID(),
    titulo: "Solicitação",
    status: "Concluído",
    ordem: 1,
  },
  {
    id: crypto.randomUUID(),
    titulo: "Análise",
    status: "Em Andamento",
    ordem: 2,
  },
  {
    id: crypto.randomUUID(),
    titulo: "Aprovação",
    status: "Pendente",
    ordem: 3,
  },
  {
    id: crypto.randomUUID(),
    titulo: "Execução",
    status: "Pendente",
    ordem: 4,
  },
  {
    id: crypto.randomUUID(),
    titulo: "Conclusão",
    status: "Pendente",
    ordem: 5,
  },
];

// Mock data for workflow
const workflowPedido: Workflow = {
  id: crypto.randomUUID(),
  pedido_id: "",
  etapa_atual: 2,
  total_etapas: 5,
  percentual_completo: 20,
  steps: workflowSteps,
};

// Mock data for a purchase request
const pedido: PedidoCompra = {
  id: crypto.randomUUID(),
  descricao: "Compra de material de escritório",
  setor_id: "1",
  setor: "Administração", 
  data_compra: new Date(),
  status: "Pendente" as PedidoStatus,
  valor_total: 350.75,
  itens: [novoItem],
  fundo_monetario: "Fundo Administrativo",
  created_at: new Date(),
  updated_at: new Date(), // Add missing property
  observacoes: "Observação teste",
  solicitante: "João Silva",
  workflow: workflowPedido,
};

// Mock data for a list of purchase requests
export const listaPedidos: PedidoCompra[] = [
  pedido,
  {
    id: crypto.randomUUID(),
    descricao: "Contratação de serviços de consultoria",
    setor_id: "2",
    setor: "Financeiro",
    data_compra: new Date(),
    status: "Em Análise" as PedidoStatus,
    valor_total: 1200.00,
    itens: [novoItem],
    fundo_monetario: "Fundo de Desenvolvimento",
    created_at: new Date(),
    updated_at: new Date(), // Add missing property
    observacoes: "Urgente",
    solicitante: "Maria Souza",
    workflow: workflowPedido,
  },
  {
    id: crypto.randomUUID(),
    descricao: "Aquisição de equipamentos de informática",
    setor_id: "3",
    setor: "Tecnologia da Informação",
    data_compra: new Date(),
    status: "Aprovado" as PedidoStatus,
    valor_total: 5000.00,
    itens: [novoItem],
    fundo_monetario: "Fundo de Inovação",
    created_at: new Date(),
    updated_at: new Date(), // Add missing property
    observacoes: "Prioridade alta",
    solicitante: "Carlos Ferreira",
    workflow: workflowPedido,
  },
];
