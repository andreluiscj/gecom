
import { PedidoCompra, Item, Setor, PedidoStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';
import { initializeWorkflow } from '@/utils/workflowHelpers';

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
  const pedido: PedidoCompra = {
    id: gerarIdLocal(),
    descricao,
    setor_id: setor,
    setor,
    data_compra: dataCompra,
    status: 'Pendente' as PedidoStatus, // Always start as "Pendente"
    valor_total: valorTotal,
    itens,
    fundo_monetario: `Fundo Municipal de ${setor}`,
    created_at: new Date(),
    observacoes: `Observações sobre o pedido de ${descricao}`,
    solicitante: `Responsável ${setor}`,
    workflow: initializeWorkflow()
  };

  // No custom workflow modifications - all steps stay as "Pendente"

  return pedido;
};

// Gerar pedidos fictícios para cada setor nos últimos 3 meses
export const obterPedidosFicticios = (): PedidoCompra[] => {
  const hoje = new Date();
  
  const itensSaude: Item[] = [
    { id: gerarIdLocal(), nome: 'Medicamentos', quantidade: 5000, valor_unitario: 12.5, valor_total: 62500, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Equipamento Hospitalar', quantidade: 10, valor_unitario: 8500, valor_total: 85000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Material Cirúrgico', quantidade: 50, valor_unitario: 1200, valor_total: 60000, pedido_id: '' },
  ];

  const itensEducacao: Item[] = [
    { id: gerarIdLocal(), nome: 'Livros Didáticos', quantidade: 1000, valor_unitario: 45, valor_total: 45000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Mobiliário Escolar', quantidade: 100, valor_unitario: 450, valor_total: 45000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Material Escolar', quantidade: 5000, valor_unitario: 15, valor_total: 75000, pedido_id: '' },
  ];

  const itensAdmin: Item[] = [
    { id: gerarIdLocal(), nome: 'Material de Escritório', quantidade: 500, valor_unitario: 20, valor_total: 10000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Equipamentos de Informática', quantidade: 20, valor_unitario: 2500, valor_total: 50000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Serviço de Manutenção', quantidade: 1, valor_unitario: 15000, valor_total: 15000, pedido_id: '' },
  ];

  const itensTransporte: Item[] = [
    { id: gerarIdLocal(), nome: 'Combustível', quantidade: 5000, valor_unitario: 5, valor_total: 25000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Peças Automotivas', quantidade: 50, valor_unitario: 500, valor_total: 25000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Serviço de Manutenção de Veículos', quantidade: 10, valor_unitario: 2000, valor_total: 20000, pedido_id: '' },
  ];

  const itensObras: Item[] = [
    { id: gerarIdLocal(), nome: 'Material de Construção', quantidade: 1000, valor_unitario: 100, valor_total: 100000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Maquinário', quantidade: 2, valor_unitario: 50000, valor_total: 100000, pedido_id: '' },
  ];

  const itensSeguranca: Item[] = [
    { id: gerarIdLocal(), nome: 'Equipamento de Monitoramento', quantidade: 20, valor_unitario: 1500, valor_total: 30000, pedido_id: '' },
    { id: gerarIdLocal(), nome: 'Uniformes', quantidade: 100, valor_unitario: 250, valor_total: 25000, pedido_id: '' },
  ];

  const pedidos: PedidoCompra[] = [
    // Saúde
    gerarPedidoFicticio('Saúde', 'Compra de Medicamentos', 'Pendente', 62500, subDays(hoje, 5), [itensSaude[0]]),
    gerarPedidoFicticio('Saúde', 'Aquisição de Equipamentos Hospitalares', 'Pendente', 85000, subDays(hoje, 10), [itensSaude[1]]),
    gerarPedidoFicticio('Saúde', 'Material Cirúrgico para Hospital Municipal', 'Pendente', 60000, subDays(hoje, 25), [itensSaude[2]]),
    
    // Educação
    gerarPedidoFicticio('Educação', 'Livros para Biblioteca Municipal', 'Pendente', 45000, subDays(hoje, 7), [itensEducacao[0]]),
    gerarPedidoFicticio('Educação', 'Carteiras para Escola Municipal', 'Pendente', 45000, subDays(hoje, 12), [itensEducacao[1]]),
    gerarPedidoFicticio('Educação', 'Material Escolar para Alunos da Rede Municipal', 'Pendente', 75000, subDays(hoje, 30), [itensEducacao[2]]),
    
    // Administrativo
    gerarPedidoFicticio('Administrativo', 'Material de Escritório', 'Pendente', 10000, subDays(hoje, 6), [itensAdmin[0]]),
    gerarPedidoFicticio('Administrativo', 'Computadores para Setores Administrativos', 'Pendente', 50000, subDays(hoje, 15), [itensAdmin[1]]),
    gerarPedidoFicticio('Administrativo', 'Manutenção Predial', 'Pendente', 15000, subDays(hoje, 2), [itensAdmin[2]]),
    
    // Transporte
    gerarPedidoFicticio('Transporte', 'Combustível para Frota Municipal', 'Pendente', 25000, subDays(hoje, 4), [itensTransporte[0]]),
    gerarPedidoFicticio('Transporte', 'Peças para Manutenção da Frota', 'Pendente', 25000, subDays(hoje, 18), [itensTransporte[1]]),
    gerarPedidoFicticio('Transporte', 'Serviço de Manutenção de Veículos', 'Pendente', 20000, subDays(hoje, 28), [itensTransporte[2]]),
    
    // Obras
    gerarPedidoFicticio('Obras', 'Material para Reforma de Praça', 'Pendente', 100000, subDays(hoje, 8), [itensObras[0]]),
    gerarPedidoFicticio('Obras', 'Aquisição de Retroescavadeira', 'Pendente', 100000, subDays(hoje, 3), [itensObras[1]]),
    
    // Segurança Pública
    gerarPedidoFicticio('Segurança Pública', 'Câmeras de Monitoramento', 'Pendente', 30000, subDays(hoje, 9), [itensSeguranca[0]]),
    gerarPedidoFicticio('Segurança Pública', 'Uniformes para Guarda Municipal', 'Pendente', 25000, subDays(hoje, 20), [itensSeguranca[1]]),
  ];

  return pedidos;
};
