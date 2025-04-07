
import { PedidoCompra, Item, Setor, PedidoStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';
import { initializeWorkflow, updateWorkflowStep } from '@/utils/workflowHelpers';

// Import directly from the source definition file to avoid circular dependencies
const nomesResponsaveis = [
  'Ana Silva',
  'Carlos Santos',
  'Mariana Oliveira',
  'Pedro Almeida',
  'Juliana Costa',
  'Roberto Pereira',
  'Fernanda Lima',
  'Lucas Martins',
  'Patricia Souza',
  'Bruno Rodrigues'
];

// Function to generate IDs (local copy to avoid circular dependency)
const gerarIdLocal = () => uuidv4();

// Helper to get a random name from the list
const getRandomResponsavel = () => {
  const index = Math.floor(Math.random() * nomesResponsaveis.length);
  return nomesResponsaveis[index];
};

const gerarPedidoFicticio = (
  setor: Setor, 
  descricao: string, 
  status: PedidoStatus, 
  valorTotal: number,
  dataCompra: Date,
  itens: Item[]
): PedidoCompra => {
  const pedido = {
    id: gerarIdLocal(),
    descricao,
    setor,
    dataCompra,
    status,
    valorTotal,
    itens,
    fundoMonetario: `Fundo Municipal de ${setor}`,
    createdAt: new Date(),
    observacoes: `Observações sobre o pedido de ${descricao}`,
    fonteRecurso: `Fundo Municipal de ${setor}`,
    responsavel: {
      id: gerarIdLocal(),
      nome: `Responsável ${setor}`,
      email: `responsavel.${setor.toLowerCase()}@prefeitura.gov.br`,
      cargo: `Secretário(a) de ${setor}`,
    },
    anexos: []
  };

  // Initialize workflow based on status
  let workflow = initializeWorkflow();

  // Helper to add responsible person and completion date to completed steps
  const addResponsavelAndConclusao = (workflow: any, stepIndex: number) => {
    const step = workflow.steps[stepIndex];
    if (step && step.status === 'Concluído') {
      workflow.steps[stepIndex] = {
        ...step,
        responsavel: getRandomResponsavel(),
        dataConclusao: subDays(new Date(), Math.floor(Math.random() * 10) + 1)
      };
    }
    return workflow;
  };

  if (status === 'Pendente') {
    workflow = updateWorkflowStep(workflow, 0, 'Em Andamento');
    workflow.steps[0].responsavel = getRandomResponsavel();
  } else if (status === 'Em Análise') {
    workflow = updateWorkflowStep(workflow, 0, 'Concluído');
    workflow = updateWorkflowStep(workflow, 1, 'Em Andamento');
    workflow = addResponsavelAndConclusao(workflow, 0);
    workflow.steps[1].responsavel = getRandomResponsavel();
  } else if (status === 'Aprovado') {
    workflow = updateWorkflowStep(workflow, 0, 'Concluído');
    workflow = updateWorkflowStep(workflow, 1, 'Concluído');
    workflow = updateWorkflowStep(workflow, 2, 'Em Andamento');
    workflow = addResponsavelAndConclusao(workflow, 0);
    workflow = addResponsavelAndConclusao(workflow, 1);
    workflow.steps[2].responsavel = getRandomResponsavel();
  } else if (status === 'Em Andamento') {
    workflow = updateWorkflowStep(workflow, 0, 'Concluído');
    workflow = updateWorkflowStep(workflow, 1, 'Concluído');
    workflow = updateWorkflowStep(workflow, 2, 'Concluído');
    workflow = updateWorkflowStep(workflow, 3, 'Em Andamento');
    workflow = updateWorkflowStep(workflow, 4, 'Pendente');
    workflow = addResponsavelAndConclusao(workflow, 0);
    workflow = addResponsavelAndConclusao(workflow, 1);
    workflow = addResponsavelAndConclusao(workflow, 2);
    workflow.steps[3].responsavel = getRandomResponsavel();
  } else if (status === 'Concluído') {
    for (let i = 0; i < workflow.totalSteps; i++) {
      workflow = updateWorkflowStep(workflow, i, 'Concluído');
      workflow = addResponsavelAndConclusao(workflow, i);
    }
  }

  // For demonstration purposes, set a future date for the "Sessão Licitação" step
  if (status !== 'Concluído' && status !== 'Pendente') {
    const futureDate = addDays(new Date(), Math.floor(Math.random() * 30) + 1);
    const licitacaoStepIndex = 6; // Index for "Sessão Licitação" step
    workflow.steps[licitacaoStepIndex].date = futureDate;
    workflow.steps[licitacaoStepIndex].responsavel = getRandomResponsavel();
  }

  return { ...pedido, workflow };
};

// Gerar pedidos fictícios para cada setor nos últimos 3 meses
export const obterPedidosFicticios = (): PedidoCompra[] => {
  const hoje = new Date();
  
  const itensSaude: Item[] = [
    { id: gerarIdLocal(), nome: 'Medicamentos', quantidade: 5000, valorUnitario: 12.5, valorTotal: 62500 },
    { id: gerarIdLocal(), nome: 'Equipamento Hospitalar', quantidade: 10, valorUnitario: 8500, valorTotal: 85000 },
    { id: gerarIdLocal(), nome: 'Material Cirúrgico', quantidade: 50, valorUnitario: 1200, valorTotal: 60000 },
  ];

  const itensEducacao: Item[] = [
    { id: gerarIdLocal(), nome: 'Livros Didáticos', quantidade: 1000, valorUnitario: 45, valorTotal: 45000 },
    { id: gerarIdLocal(), nome: 'Mobiliário Escolar', quantidade: 100, valorUnitario: 450, valorTotal: 45000 },
    { id: gerarIdLocal(), nome: 'Material Escolar', quantidade: 5000, valorUnitario: 15, valorTotal: 75000 },
  ];

  const itensAdmin: Item[] = [
    { id: gerarIdLocal(), nome: 'Material de Escritório', quantidade: 500, valorUnitario: 20, valorTotal: 10000 },
    { id: gerarIdLocal(), nome: 'Equipamentos de Informática', quantidade: 20, valorUnitario: 2500, valorTotal: 50000 },
    { id: gerarIdLocal(), nome: 'Serviço de Manutenção', quantidade: 1, valorUnitario: 15000, valorTotal: 15000 },
  ];

  const itensTransporte: Item[] = [
    { id: gerarIdLocal(), nome: 'Combustível', quantidade: 5000, valorUnitario: 5, valorTotal: 25000 },
    { id: gerarIdLocal(), nome: 'Peças Automotivas', quantidade: 50, valorUnitario: 500, valorTotal: 25000 },
    { id: gerarIdLocal(), nome: 'Serviço de Manutenção de Veículos', quantidade: 10, valorUnitario: 2000, valorTotal: 20000 },
  ];

  const itensObras: Item[] = [
    { id: gerarIdLocal(), nome: 'Material de Construção', quantidade: 1000, valorUnitario: 100, valorTotal: 100000 },
    { id: gerarIdLocal(), nome: 'Maquinário', quantidade: 2, valorUnitario: 50000, valorTotal: 100000 },
  ];

  const itensSeguranca: Item[] = [
    { id: gerarIdLocal(), nome: 'Equipamento de Monitoramento', quantidade: 20, valorUnitario: 1500, valorTotal: 30000 },
    { id: gerarIdLocal(), nome: 'Uniformes', quantidade: 100, valorUnitario: 250, valorTotal: 25000 },
  ];

  const pedidos: PedidoCompra[] = [
    // Saúde
    gerarPedidoFicticio('Saúde', 'Compra de Medicamentos', 'Aprovado', 62500, subDays(hoje, 5), [itensSaude[0]]),
    gerarPedidoFicticio('Saúde', 'Aquisição de Equipamentos Hospitalares', 'Em Andamento', 85000, subDays(hoje, 10), [itensSaude[1]]),
    gerarPedidoFicticio('Saúde', 'Material Cirúrgico para Hospital Municipal', 'Concluído', 60000, subDays(hoje, 25), [itensSaude[2]]),
    
    // Educação
    gerarPedidoFicticio('Educação', 'Livros para Biblioteca Municipal', 'Aprovado', 45000, subDays(hoje, 7), [itensEducacao[0]]),
    gerarPedidoFicticio('Educação', 'Carteiras para Escola Municipal', 'Em Andamento', 45000, subDays(hoje, 12), [itensEducacao[1]]),
    gerarPedidoFicticio('Educação', 'Material Escolar para Alunos da Rede Municipal', 'Concluído', 75000, subDays(hoje, 30), [itensEducacao[2]]),
    
    // Administrativo
    gerarPedidoFicticio('Administrativo', 'Material de Escritório', 'Aprovado', 10000, subDays(hoje, 6), [itensAdmin[0]]),
    gerarPedidoFicticio('Administrativo', 'Computadores para Setores Administrativos', 'Em Andamento', 50000, subDays(hoje, 15), [itensAdmin[1]]),
    gerarPedidoFicticio('Administrativo', 'Manutenção Predial', 'Pendente', 15000, subDays(hoje, 2), [itensAdmin[2]]),
    
    // Transporte
    gerarPedidoFicticio('Transporte', 'Combustível para Frota Municipal', 'Aprovado', 25000, subDays(hoje, 4), [itensTransporte[0]]),
    gerarPedidoFicticio('Transporte', 'Peças para Manutenção da Frota', 'Em Andamento', 25000, subDays(hoje, 18), [itensTransporte[1]]),
    gerarPedidoFicticio('Transporte', 'Serviço de Manutenção de Veículos', 'Concluído', 20000, subDays(hoje, 28), [itensTransporte[2]]),
    
    // Obras
    gerarPedidoFicticio('Obras', 'Material para Reforma de Praça', 'Aprovado', 100000, subDays(hoje, 8), [itensObras[0]]),
    gerarPedidoFicticio('Obras', 'Aquisição de Retroescavadeira', 'Em Análise', 100000, subDays(hoje, 3), [itensObras[1]]),
    
    // Segurança Pública
    gerarPedidoFicticio('Segurança Pública', 'Câmeras de Monitoramento', 'Aprovado', 30000, subDays(hoje, 9), [itensSeguranca[0]]),
    gerarPedidoFicticio('Segurança Pública', 'Uniformes para Guarda Municipal', 'Concluído', 25000, subDays(hoje, 20), [itensSeguranca[1]]),
  ];

  return pedidos;
};
