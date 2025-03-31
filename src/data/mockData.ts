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

// Dados simulados de pedidos por município e setor
const pedidosPorMunicipio: Record<string, {
  saude: PedidoCompra[],
  educacao: PedidoCompra[],
  administrativo: PedidoCompra[],
  transporte: PedidoCompra[]
}> = {
  'pai-pedro': {
    saude: [],
    educacao: [],
    administrativo: [],
    transporte: []
  },
  'janauba': {
    saude: [],
    educacao: [],
    administrativo: [],
    transporte: []
  },
  'espinosa': {
    saude: [],
    educacao: [],
    administrativo: [],
    transporte: []
  }
};

// Obter referência aos dados do município selecionado
const obterDadosMunicipio = (municipioId: string | null) => {
  // Se não tiver município, usa Pai Pedro como padrão
  const id = municipioId || 'pai-pedro';
  return pedidosPorMunicipio[id] || pedidosPorMunicipio['pai-pedro'];
};

// Função para obter todos os pedidos de um município
export const obterTodosPedidos = (municipioId: string | null = null): PedidoCompra[] => {
  const { saude, educacao, administrativo, transporte } = obterDadosMunicipio(municipioId);
  return [
    ...saude,
    ...educacao,
    ...administrativo,
    ...transporte,
  ];
};

// Função para obter pedidos por setor de um município
export const obterPedidosPorSetor = (setor: Setor, municipioId: string | null = null): PedidoCompra[] => {
  const dadosMunicipio = obterDadosMunicipio(municipioId);
  
  switch(setor) {
    case 'Saúde':
      return dadosMunicipio.saude;
    case 'Educação':
      return dadosMunicipio.educacao;
    case 'Administrativo':
      return dadosMunicipio.administrativo;
    case 'Transporte':
      return dadosMunicipio.transporte;
    default:
      return [];
  }
};

// Função para adicionar um pedido
export const adicionarPedido = (pedido: PedidoCompra, municipioId: string | null = null): void => {
  const dadosMunicipio = obterDadosMunicipio(municipioId);
  const novoPedido = {
    ...pedido,
    id: gerarId(),
    createdAt: new Date()
  };

  switch(pedido.setor) {
    case 'Saúde':
      dadosMunicipio.saude.push(novoPedido);
      break;
    case 'Educação':
      dadosMunicipio.educacao.push(novoPedido);
      break;
    case 'Administrativo':
      dadosMunicipio.administrativo.push(novoPedido);
      break;
    case 'Transporte':
      dadosMunicipio.transporte.push(novoPedido);
      break;
  }
};

// Função para remover um pedido
export const removerPedido = (id: string, setor: Setor, municipioId: string | null = null): void => {
  const dadosMunicipio = obterDadosMunicipio(municipioId);
  
  switch(setor) {
    case 'Saúde':
      dadosMunicipio.saude = dadosMunicipio.saude.filter(pedido => pedido.id !== id);
      break;
    case 'Educação':
      dadosMunicipio.educacao = dadosMunicipio.educacao.filter(pedido => pedido.id !== id);
      break;
    case 'Administrativo':
      dadosMunicipio.administrativo = dadosMunicipio.administrativo.filter(pedido => pedido.id !== id);
      break;
    case 'Transporte':
      dadosMunicipio.transporte = dadosMunicipio.transporte.filter(pedido => pedido.id !== id);
      break;
  }
};

// Função para atualizar um pedido
export const atualizarPedido = (pedidoAtualizado: PedidoCompra, municipioId: string | null = null): void => {
  const dadosMunicipio = obterDadosMunicipio(municipioId);
  
  switch(pedidoAtualizado.setor) {
    case 'Saúde':
      dadosMunicipio.saude = dadosMunicipio.saude.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
    case 'Educação':
      dadosMunicipio.educacao = dadosMunicipio.educacao.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
    case 'Administrativo':
      dadosMunicipio.administrativo = dadosMunicipio.administrativo.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
    case 'Transporte':
      dadosMunicipio.transporte = dadosMunicipio.transporte.map(pedido => 
        pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
      );
      break;
  }
};

// Dados para o dashboard
export const calcularDadosDashboard = (municipioId: string | null = null): DadosDashboard => {
  const dadosMunicipio = obterDadosMunicipio(municipioId);
  const todosPedidos = obterTodosPedidos(municipioId);
  
  // Define orçamentos diferentes por município
  const orcamentos = {
    'pai-pedro': {
      'Saúde': 12000000,
      'Educação': 8000000,
      'Administrativo': 4500000,
      'Transporte': 4000000
    },
    'janauba': {
      'Saúde': 50000000,
      'Educação': 45000000,
      'Administrativo': 30000000,
      'Transporte': 20300000
    },
    'espinosa': {
      'Saúde': 25000000,
      'Educação': 22000000,
      'Administrativo': 18000000,
      'Transporte': 22600000
    }
  };
  
  // Orçamento previsto por setor (baseado no município selecionado)
  const orcamentoPrevisto: Record<Setor, number> = orcamentos[municipioId || 'pai-pedro'] || orcamentos['pai-pedro'];
  
  // Gastos por setor
  const gastosPorSetor: Record<Setor, number> = {
    'Saúde': dadosMunicipio.saude.reduce((sum, pedido) => sum + pedido.valorTotal, 0),
    'Educação': dadosMunicipio.educacao.reduce((sum, pedido) => sum + pedido.valorTotal, 0),
    'Administrativo': dadosMunicipio.administrativo.reduce((sum, pedido) => sum + pedido.valorTotal, 0),
    'Transporte': dadosMunicipio.transporte.reduce((sum, pedido) => sum + pedido.valorTotal, 0)
  };
  
  // Total de gastos
  const gastosTotais = Object.values(gastosPorSetor).reduce((sum, gasto) => sum + gasto, 0);
  
  // Número de pedidos por setor
  const pedidosPorSetor: Record<Setor, number> = {
    'Saúde': dadosMunicipio.saude.length,
    'Educação': dadosMunicipio.educacao.length,
    'Administrativo': dadosMunicipio.administrativo.length,
    'Transporte': dadosMunicipio.transporte.length
  };
  
  // Cálculo do ticket médio por setor
  const ticketMedioPorSetor: Record<Setor, number> = {
    'Saúde': dadosMunicipio.saude.length > 0 ? gastosPorSetor['Saúde'] / dadosMunicipio.saude.length : 0,
    'Educação': dadosMunicipio.educacao.length > 0 ? gastosPorSetor['Educação'] / dadosMunicipio.educacao.length : 0,
    'Administrativo': dadosMunicipio.administrativo.length > 0 ? gastosPorSetor['Administrativo'] / dadosMunicipio.administrativo.length : 0,
    'Transporte': dadosMunicipio.transporte.length > 0 ? gastosPorSetor['Transporte'] / dadosMunicipio.transporte.length : 0
  };
  
  return {
    gastosTotais,
    gastosPorSetor,
    orcamentoPrevisto,
    pedidosPorSetor,
    ticketMedioPorSetor
  };
};

// Gerar dados iniciais de exemplo para cada município
const gerarDadosIniciais = () => {
  // Pedidos para Pai Pedro
  const pedidosPaiPedro = [
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
      setor: 'Saúde' as Setor,
      status: 'Aprovado',
      createdAt: new Date('2023-05-10')
    },
    {
      id: gerarId(),
      dataCompra: new Date('2023-06-15'),
      descricao: 'Material escolar para escola municipal',
      itens: [
        { id: gerarId(), nome: 'Caderno universitário', quantidade: 50, valorUnitario: 15, valorTotal: 750 },
        { id: gerarId(), nome: 'Kit lápis e caneta', quantidade: 50, valorUnitario: 10, valorTotal: 500 }
      ],
      valorTotal: 1250,
      fundoMonetario: 'Fundo Municipal de Educação',
      setor: 'Educação' as Setor,
      status: 'Aprovado',
      createdAt: new Date('2023-06-15')
    }
  ];
  
  // Pedidos para Janaúba
  const pedidosJanauba = [
    {
      id: gerarId(),
      dataCompra: new Date('2023-07-05'),
      descricao: 'Equipamentos para hospital municipal',
      itens: [
        { id: gerarId(), nome: 'Monitor cardíaco', quantidade: 4, valorUnitario: 5000, valorTotal: 20000 },
        { id: gerarId(), nome: 'Oxímetro', quantidade: 10, valorUnitario: 200, valorTotal: 2000 }
      ],
      valorTotal: 22000,
      fundoMonetario: 'Fundo Municipal de Saúde',
      setor: 'Saúde' as Setor,
      status: 'Aprovado',
      createdAt: new Date('2023-07-05')
    },
    {
      id: gerarId(),
      dataCompra: new Date('2023-08-12'),
      descricao: 'Computadores para laboratório de informática',
      itens: [
        { id: gerarId(), nome: 'Computador desktop', quantidade: 20, valorUnitario: 3000, valorTotal: 60000 },
        { id: gerarId(), nome: 'Monitor 22 polegadas', quantidade: 20, valorUnitario: 800, valorTotal: 16000 }
      ],
      valorTotal: 76000,
      fundoMonetario: 'Fundo Municipal de Educação',
      setor: 'Educação' as Setor,
      status: 'Pendente',
      createdAt: new Date('2023-08-12')
    }
  ];
  
  // Pedidos para Espinosa
  const pedidosEspinosa = [
    {
      id: gerarId(),
      dataCompra: new Date('2023-09-08'),
      descricao: 'Material de escritório para prefeitura',
      itens: [
        { id: gerarId(), nome: 'Resma de papel A4', quantidade: 200, valorUnitario: 20, valorTotal: 4000 },
        { id: gerarId(), nome: 'Cartucho de impressora', quantidade: 30, valorUnitario: 80, valorTotal: 2400 }
      ],
      valorTotal: 6400,
      fundoMonetario: 'Fundo Municipal de Administração',
      setor: 'Administrativo' as Setor,
      status: 'Aprovado',
      createdAt: new Date('2023-09-08')
    },
    {
      id: gerarId(),
      dataCompra: new Date('2023-10-20'),
      descricao: 'Aquisição de novo ônibus escolar',
      itens: [
        { id: gerarId(), nome: 'Ônibus escolar 44 lugares', quantidade: 2, valorUnitario: 280000, valorTotal: 560000 }
      ],
      valorTotal: 560000,
      fundoMonetario: 'Fundo Municipal de Transporte',
      setor: 'Transporte' as Setor,
      status: 'Pendente',
      createdAt: new Date('2023-10-20')
    }
  ];
  
  // Distribui os pedidos para as cidades corretas
  pedidosPaiPedro.forEach(pedido => {
    adicionarPedido(pedido as PedidoCompra, 'pai-pedro');
  });
  
  pedidosJanauba.forEach(pedido => {
    adicionarPedido(pedido as PedidoCompra, 'janauba');
  });
  
  pedidosEspinosa.forEach(pedido => {
    adicionarPedido(pedido as PedidoCompra, 'espinosa');
  });
};

// Inicializar dados
gerarDadosIniciais();

// Função para obter estatísticas para cartões do dashboard
export const obterEstatisticasCartoes = (municipioId: string | null = null) => {
  const dados = calcularDadosDashboard(municipioId);
  
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
      valor: obterTodosPedidos(municipioId).length,
      percentualMudanca: 8.2,
      icon: 'ShoppingCart',
      cor: 'bg-green-500'
    },
    {
      titulo: 'Ticket Médio',
      valor: formatCurrency(
        dados.gastosTotais / (obterTodosPedidos(municipioId).length || 1)
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
