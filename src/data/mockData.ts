
import { PedidoCompra, Setor, DadosDashboard } from '../types';
import { formatCurrency } from '../utils/formatters';

// Função para gerar um ID único
export const gerarId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Lista de fundos monetários disponíveis
export const fundosMonetarios = [
  'Fundo Municipal de Saúde',
  'Fundo Municipal de Educação',
  'Fundo Municipal de Administração',
  'Fundo Municipal de Transporte',
  'Fundo Municipal de Desenvolvimento',
];

// Dados simulados de pedidos por setor
export let pedidosSaude: PedidoCompra[] = [];
export let pedidosEducacao: PedidoCompra[] = [];
export let pedidosAdministrativo: PedidoCompra[] = [];
export let pedidosTransporte: PedidoCompra[] = [];

// Função para obter todos os pedidos
export const obterTodosPedidos = (): PedidoCompra[] => {
  return [
    ...pedidosSaude,
    ...pedidosEducacao,
    ...pedidosAdministrativo,
    ...pedidosTransporte,
  ];
};

// Função para obter pedidos por setor
export const obterPedidosPorSetor = (setor: Setor): PedidoCompra[] => {
  switch(setor) {
    case 'Saúde':
      return pedidosSaude;
    case 'Educação':
      return pedidosEducacao;
    case 'Administrativo':
      return pedidosAdministrativo;
    case 'Transporte':
      return pedidosTransporte;
    default:
      return [];
  }
};

// Função para adicionar um pedido
export const adicionarPedido = (pedido: PedidoCompra): void => {
  const novoPedido = {
    ...pedido,
    id: gerarId(),
    createdAt: new Date()
  };

  switch(pedido.setor) {
    case 'Saúde':
      pedidosSaude = [...pedidosSaude, novoPedido];
      break;
    case 'Educação':
      pedidosEducacao = [...pedidosEducacao, novoPedido];
      break;
    case 'Administrativo':
      pedidosAdministrativo = [...pedidosAdministrativo, novoPedido];
      break;
    case 'Transporte':
      pedidosTransporte = [...pedidosTransporte, novoPedido];
      break;
  }
};

// Função para remover um pedido
export const removerPedido = (id: string, setor: Setor): void => {
  switch(setor) {
    case 'Saúde':
      pedidosSaude = pedidosSaude.filter(pedido => pedido.id !== id);
      break;
    case 'Educação':
      pedidosEducacao = pedidosEducacao.filter(pedido => pedido.id !== id);
      break;
    case 'Administrativo':
      pedidosAdministrativo = pedidosAdministrativo.filter(pedido => pedido.id !== id);
      break;
    case 'Transporte':
      pedidosTransporte = pedidosTransporte.filter(pedido => pedido.id !== id);
      break;
  }
};

// Função para atualizar um pedido
export const atualizarPedido = (pedidoAtualizado: PedidoCompra): void => {
  switch(pedidoAtualizado.setor) {
    case 'Saúde':
      pedidosSaude = pedidosSaude.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
    case 'Educação':
      pedidosEducacao = pedidosEducacao.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
    case 'Administrativo':
      pedidosAdministrativo = pedidosAdministrativo.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
    case 'Transporte':
      pedidosTransporte = pedidosTransporte.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
  }
};

// Dados para o dashboard
export const calcularDadosDashboard = (): DadosDashboard => {
  const todosPedidos = obterTodosPedidos();
  
  // Orçamento previsto por setor (valores fictícios)
  const orcamentoPrevisto: Record<Setor, number> = {
    'Saúde': 1000000,
    'Educação': 800000,
    'Administrativo': 500000,
    'Transporte': 700000
  };
  
  // Gastos por setor
  const gastosPorSetor: Record<Setor, number> = {
    'Saúde': pedidosSaude.reduce((sum, pedido) => sum + pedido.valorTotal, 0),
    'Educação': pedidosEducacao.reduce((sum, pedido) => sum + pedido.valorTotal, 0),
    'Administrativo': pedidosAdministrativo.reduce((sum, pedido) => sum + pedido.valorTotal, 0),
    'Transporte': pedidosTransporte.reduce((sum, pedido) => sum + pedido.valorTotal, 0)
  };
  
  // Total de gastos
  const gastosTotais = Object.values(gastosPorSetor).reduce((sum, gasto) => sum + gasto, 0);
  
  // Número de pedidos por setor
  const pedidosPorSetor: Record<Setor, number> = {
    'Saúde': pedidosSaude.length,
    'Educação': pedidosEducacao.length,
    'Administrativo': pedidosAdministrativo.length,
    'Transporte': pedidosTransporte.length
  };
  
  // Cálculo do ticket médio por setor
  const ticketMedioPorSetor: Record<Setor, number> = {
    'Saúde': pedidosSaude.length > 0 ? gastosPorSetor['Saúde'] / pedidosSaude.length : 0,
    'Educação': pedidosEducacao.length > 0 ? gastosPorSetor['Educação'] / pedidosEducacao.length : 0,
    'Administrativo': pedidosAdministrativo.length > 0 ? gastosPorSetor['Administrativo'] / pedidosAdministrativo.length : 0,
    'Transporte': pedidosTransporte.length > 0 ? gastosPorSetor['Transporte'] / pedidosTransporte.length : 0
  };
  
  return {
    gastosTotais,
    gastosPorSetor,
    orcamentoPrevisto,
    pedidosPorSetor,
    ticketMedioPorSetor
  };
};

// Gerar dados iniciais de exemplo
const gerarDadosIniciais = () => {
  // Pedidos para Saúde
  const pedidosSaudeIniciais: PedidoCompra[] = [
    {
      id: gerarId(),
      dataCompra: new Date('2023-05-10'),
      descricao: 'Compra de medicamentos para o posto de saúde central',
      itens: [
        { id: gerarId(), nome: 'Paracetamol 500mg', quantidade: 500, valorUnitario: 0.20, valorTotal: 100 },
        { id: gerarId(), nome: 'Dipirona 1g', quantidade: 300, valorUnitario: 0.30, valorTotal: 90 }
      ],
      valorTotal: 190,
      fundoMonetario: 'Fundo Municipal de Saúde',
      setor: 'Saúde',
      status: 'Aprovado',
      createdAt: new Date('2023-05-10')
    },
    {
      id: gerarId(),
      dataCompra: new Date('2023-06-15'),
      descricao: 'Equipamentos para hospital municipal',
      itens: [
        { id: gerarId(), nome: 'Monitor cardíaco', quantidade: 2, valorUnitario: 5000, valorTotal: 10000 },
        { id: gerarId(), nome: 'Oxímetro', quantidade: 5, valorUnitario: 200, valorTotal: 1000 }
      ],
      valorTotal: 11000,
      fundoMonetario: 'Fundo Municipal de Saúde',
      setor: 'Saúde',
      status: 'Aprovado',
      createdAt: new Date('2023-06-15')
    }
  ];
  
  // Pedidos para Educação
  const pedidosEducacaoIniciais: PedidoCompra[] = [
    {
      id: gerarId(),
      dataCompra: new Date('2023-07-05'),
      descricao: 'Material escolar para escola municipal',
      itens: [
        { id: gerarId(), nome: 'Caderno universitário', quantidade: 100, valorUnitario: 15, valorTotal: 1500 },
        { id: gerarId(), nome: 'Kit lápis e caneta', quantidade: 100, valorUnitario: 10, valorTotal: 1000 }
      ],
      valorTotal: 2500,
      fundoMonetario: 'Fundo Municipal de Educação',
      setor: 'Educação',
      status: 'Aprovado',
      createdAt: new Date('2023-07-05')
    },
    {
      id: gerarId(),
      dataCompra: new Date('2023-08-12'),
      descricao: 'Computadores para laboratório de informática',
      itens: [
        { id: gerarId(), nome: 'Computador desktop', quantidade: 10, valorUnitario: 3000, valorTotal: 30000 },
        { id: gerarId(), nome: 'Monitor 22 polegadas', quantidade: 10, valorUnitario: 800, valorTotal: 8000 }
      ],
      valorTotal: 38000,
      fundoMonetario: 'Fundo Municipal de Educação',
      setor: 'Educação',
      status: 'Pendente',
      createdAt: new Date('2023-08-12')
    }
  ];
  
  // Pedidos para Administrativo
  const pedidosAdministrativoIniciais: PedidoCompra[] = [
    {
      id: gerarId(),
      dataCompra: new Date('2023-09-08'),
      descricao: 'Material de escritório para prefeitura',
      itens: [
        { id: gerarId(), nome: 'Resma de papel A4', quantidade: 50, valorUnitario: 20, valorTotal: 1000 },
        { id: gerarId(), nome: 'Cartucho de impressora', quantidade: 10, valorUnitario: 80, valorTotal: 800 }
      ],
      valorTotal: 1800,
      fundoMonetario: 'Fundo Municipal de Administração',
      setor: 'Administrativo',
      status: 'Aprovado',
      createdAt: new Date('2023-09-08')
    },
    {
      id: gerarId(),
      dataCompra: new Date('2023-10-20'),
      descricao: 'Móveis para secretaria municipal',
      itens: [
        { id: gerarId(), nome: 'Mesa de escritório', quantidade: 5, valorUnitario: 500, valorTotal: 2500 },
        { id: gerarId(), nome: 'Cadeira ergonômica', quantidade: 5, valorUnitario: 400, valorTotal: 2000 }
      ],
      valorTotal: 4500,
      fundoMonetario: 'Fundo Municipal de Administração',
      setor: 'Administrativo',
      status: 'Reprovado',
      createdAt: new Date('2023-10-20')
    }
  ];
  
  // Pedidos para Transporte
  const pedidosTransporteIniciais: PedidoCompra[] = [
    {
      id: gerarId(),
      dataCompra: new Date('2023-11-10'),
      descricao: 'Manutenção da frota de ônibus escolares',
      itens: [
        { id: gerarId(), nome: 'Troca de óleo', quantidade: 10, valorUnitario: 300, valorTotal: 3000 },
        { id: gerarId(), nome: 'Filtros diversos', quantidade: 20, valorUnitario: 100, valorTotal: 2000 }
      ],
      valorTotal: 5000,
      fundoMonetario: 'Fundo Municipal de Transporte',
      setor: 'Transporte',
      status: 'Aprovado',
      createdAt: new Date('2023-11-10')
    },
    {
      id: gerarId(),
      dataCompra: new Date('2023-12-05'),
      descricao: 'Aquisição de novo ônibus escolar',
      itens: [
        { id: gerarId(), nome: 'Ônibus escolar 44 lugares', quantidade: 1, valorUnitario: 280000, valorTotal: 280000 }
      ],
      valorTotal: 280000,
      fundoMonetario: 'Fundo Municipal de Transporte',
      setor: 'Transporte',
      status: 'Pendente',
      createdAt: new Date('2023-12-05')
    }
  ];
  
  pedidosSaude = pedidosSaudeIniciais;
  pedidosEducacao = pedidosEducacaoIniciais;
  pedidosAdministrativo = pedidosAdministrativoIniciais;
  pedidosTransporte = pedidosTransporteIniciais;
};

// Inicializar dados
gerarDadosIniciais();

// Função para obter estatísticas para cartões do dashboard
export const obterEstatisticasCartoes = () => {
  const dados = calcularDadosDashboard();
  
  return [
    {
      titulo: 'Total de Gastos',
      valor: formatCurrency(dados.gastosTotais),
      percentualMudanca: 12.5,
      icon: 'Wallet',
      cor: 'bg-blue-500'
    },
    {
      titulo: 'Pedidos de Compra',
      valor: obterTodosPedidos().length,
      percentualMudanca: 8.2,
      icon: 'ShoppingCart',
      cor: 'bg-green-500'
    },
    {
      titulo: 'Ticket Médio',
      valor: formatCurrency(
        dados.gastosTotais / (obterTodosPedidos().length || 1)
      ),
      percentualMudanca: -2.4,
      icon: 'Receipt',
      cor: 'bg-amber-500'
    },
    {
      titulo: 'Orçamento Disponível',
      valor: formatCurrency(
        Object.values(dados.orcamentoPrevisto).reduce((sum, val) => sum + val, 0) - 
        dados.gastosTotais
      ),
      percentualMudanca: -5.1,
      icon: 'PiggyBank',
      cor: 'bg-purple-500'
    }
  ];
};
