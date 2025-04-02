
import { addDays, addHours, format, subMonths } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { DadosDashboard, PedidoCompra, Item, Setor } from '@/types';

// Array com os fundos monetários disponíveis
export const fundosMonetarios = [
  'Fundo Municipal de Saúde',
  'Fundo Municipal de Educação',
  'Fundo Municipal de Administração',
  'Fundo Municipal de Transporte',
  'Fundo Municipal de Assistência Social',
  'Fundo Municipal de Cultura',
  'Fundo Municipal de Meio Ambiente',
];

// Função para gerar IDs únicos
export function gerarId() {
  return uuidv4();
}

// Dados simulados
const pedidosCompra: PedidoCompra[] = [
  {
    id: '1',
    dataCompra: new Date(2023, 8, 15),
    descricao: 'Compra de medicamentos para o posto de saúde',
    itens: [
      {
        id: '1-1',
        nome: 'Paracetamol 500mg (caixa)',
        quantidade: 50,
        valorUnitario: 15.0,
        valorTotal: 750.0,
      },
      {
        id: '1-2',
        nome: 'Dipirona 500mg (caixa)',
        quantidade: 40,
        valorUnitario: 12.5,
        valorTotal: 500.0,
      },
    ],
    valorTotal: 1250.0,
    fundoMonetario: 'Fundo Municipal de Saúde',
    setor: 'Saúde',
    status: 'Aprovado',
    createdAt: new Date(2023, 8, 14),
  },
  {
    id: '2',
    dataCompra: new Date(2023, 8, 10),
    descricao: 'Material escolar para a escola municipal',
    itens: [
      {
        id: '2-1',
        nome: 'Cadernos (pacote)',
        quantidade: 100,
        valorUnitario: 10.0,
        valorTotal: 1000.0,
      },
      {
        id: '2-2',
        nome: 'Lápis (caixa)',
        quantidade: 50,
        valorUnitario: 5.0,
        valorTotal: 250.0,
      },
      {
        id: '2-3',
        nome: 'Borrachas (pacote)',
        quantidade: 50,
        valorUnitario: 2.0,
        valorTotal: 100.0,
      },
    ],
    valorTotal: 1350.0,
    fundoMonetario: 'Fundo Municipal de Educação',
    setor: 'Educação',
    status: 'Aprovado',
    createdAt: new Date(2023, 8, 8),
  },
  {
    id: '3',
    dataCompra: new Date(2023, 8, 5),
    descricao: 'Material de escritório para a prefeitura',
    itens: [
      {
        id: '3-1',
        nome: 'Papel A4 (caixa)',
        quantidade: 20,
        valorUnitario: 25.0,
        valorTotal: 500.0,
      },
      {
        id: '3-2',
        nome: 'Canetas (caixa)',
        quantidade: 10,
        valorUnitario: 15.0,
        valorTotal: 150.0,
      },
    ],
    valorTotal: 650.0,
    fundoMonetario: 'Fundo Municipal de Administração',
    setor: 'Administrativo',
    status: 'Aprovado',
    createdAt: new Date(2023, 8, 4),
  },
  {
    id: '4',
    dataCompra: new Date(2023, 8, 1),
    descricao: 'Peças para manutenção de veículos',
    itens: [
      {
        id: '4-1',
        nome: 'Pneus para ônibus escolar',
        quantidade: 4,
        valorUnitario: 500.0,
        valorTotal: 2000.0,
      },
      {
        id: '4-2',
        nome: 'Óleo lubrificante (litro)',
        quantidade: 10,
        valorUnitario: 30.0,
        valorTotal: 300.0,
      },
    ],
    valorTotal: 2300.0,
    fundoMonetario: 'Fundo Municipal de Transporte',
    setor: 'Transporte',
    status: 'Pendente',
    createdAt: new Date(2023, 7, 30),
  },
  {
    id: '5',
    dataCompra: new Date(2023, 7, 25),
    descricao: 'Equipamentos para o posto de saúde',
    itens: [
      {
        id: '5-1',
        nome: 'Estetoscópio',
        quantidade: 5,
        valorUnitario: 120.0,
        valorTotal: 600.0,
      },
      {
        id: '5-2',
        nome: 'Termômetro digital',
        quantidade: 10,
        valorUnitario: 35.0,
        valorTotal: 350.0,
      },
    ],
    valorTotal: 950.0,
    fundoMonetario: 'Fundo Municipal de Saúde',
    setor: 'Saúde',
    status: 'Aprovado',
    createdAt: new Date(2023, 7, 24),
  },
];

// Dados de Pai Pedro (3 meses para cada setor)
const pedidosPaiPedro: PedidoCompra[] = [
  // Setor Saúde - Janeiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 3),
    descricao: 'Medicamentos para UBS Pai Pedro',
    itens: [
      {
        id: uuidv4(),
        nome: 'Amoxicilina 500mg (caixa)',
        quantidade: 30,
        valorUnitario: 25.0,
        valorTotal: 750.0,
      },
      {
        id: uuidv4(),
        nome: 'Dipirona injetável (ampolas)',
        quantidade: 100,
        valorUnitario: 2.5,
        valorTotal: 250.0,
      }
    ],
    valorTotal: 1000.0,
    fundoMonetario: 'Fundo Municipal de Saúde',
    setor: 'Saúde',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 3),
  },
  // Setor Saúde - Fevereiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 2),
    descricao: 'Materiais para Posto Central',
    itens: [
      {
        id: uuidv4(),
        nome: 'Seringas descartáveis (cx)',
        quantidade: 20,
        valorUnitario: 30.0,
        valorTotal: 600.0,
      },
      {
        id: uuidv4(),
        nome: 'Luvas de procedimento (cx)',
        quantidade: 30,
        valorUnitario: 40.0,
        valorTotal: 1200.0,
      }
    ],
    valorTotal: 1800.0,
    fundoMonetario: 'Fundo Municipal de Saúde',
    setor: 'Saúde',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 2),
  },
  // Setor Saúde - Março
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 1),
    descricao: 'Equipamentos para laboratório',
    itens: [
      {
        id: uuidv4(),
        nome: 'Microscópio',
        quantidade: 1,
        valorUnitario: 3000.0,
        valorTotal: 3000.0,
      },
      {
        id: uuidv4(),
        nome: 'Centrífuga',
        quantidade: 1,
        valorUnitario: 2500.0,
        valorTotal: 2500.0,
      }
    ],
    valorTotal: 5500.0,
    fundoMonetario: 'Fundo Municipal de Saúde',
    setor: 'Saúde',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 1),
  },
  
  // Setor Educação - Janeiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 3),
    descricao: 'Material didático escolas municipais',
    itens: [
      {
        id: uuidv4(),
        nome: 'Livros didáticos',
        quantidade: 200,
        valorUnitario: 40.0,
        valorTotal: 8000.0,
      },
      {
        id: uuidv4(),
        nome: 'Cadernos de caligrafia',
        quantidade: 150,
        valorUnitario: 5.0,
        valorTotal: 750.0,
      }
    ],
    valorTotal: 8750.0,
    fundoMonetario: 'Fundo Municipal de Educação',
    setor: 'Educação',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 3),
  },
  // Setor Educação - Fevereiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 2),
    descricao: 'Computadores para laboratório de informática',
    itens: [
      {
        id: uuidv4(),
        nome: 'Computadores desktop',
        quantidade: 10,
        valorUnitario: 2500.0,
        valorTotal: 25000.0,
      },
      {
        id: uuidv4(),
        nome: 'Monitores',
        quantidade: 10,
        valorUnitario: 500.0,
        valorTotal: 5000.0,
      }
    ],
    valorTotal: 30000.0,
    fundoMonetario: 'Fundo Municipal de Educação',
    setor: 'Educação',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 2),
  },
  // Setor Educação - Março
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 1),
    descricao: 'Mobiliário escolar',
    itens: [
      {
        id: uuidv4(),
        nome: 'Conjuntos de carteiras escolares',
        quantidade: 50,
        valorUnitario: 400.0,
        valorTotal: 20000.0,
      },
      {
        id: uuidv4(),
        nome: 'Quadros brancos',
        quantidade: 8,
        valorUnitario: 300.0,
        valorTotal: 2400.0,
      }
    ],
    valorTotal: 22400.0,
    fundoMonetario: 'Fundo Municipal de Educação',
    setor: 'Educação',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 1),
  },
  
  // Setor Administrativo - Janeiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 3),
    descricao: 'Material de escritório para prefeitura',
    itens: [
      {
        id: uuidv4(),
        nome: 'Resmas de papel A4',
        quantidade: 100,
        valorUnitario: 25.0,
        valorTotal: 2500.0,
      },
      {
        id: uuidv4(),
        nome: 'Cartuchos de impressora',
        quantidade: 20,
        valorUnitario: 80.0,
        valorTotal: 1600.0,
      }
    ],
    valorTotal: 4100.0,
    fundoMonetario: 'Fundo Municipal de Administração',
    setor: 'Administrativo',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 3),
  },
  // Setor Administrativo - Fevereiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 2),
    descricao: 'Equipamentos para sala de reuniões',
    itens: [
      {
        id: uuidv4(),
        nome: 'Projetor multimídia',
        quantidade: 1,
        valorUnitario: 3000.0,
        valorTotal: 3000.0,
      },
      {
        id: uuidv4(),
        nome: 'Tela de projeção',
        quantidade: 1,
        valorUnitario: 500.0,
        valorTotal: 500.0,
      }
    ],
    valorTotal: 3500.0,
    fundoMonetario: 'Fundo Municipal de Administração',
    setor: 'Administrativo',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 2),
  },
  // Setor Administrativo - Março
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 1),
    descricao: 'Mobiliário para prefeitura',
    itens: [
      {
        id: uuidv4(),
        nome: 'Cadeiras ergonômicas',
        quantidade: 15,
        valorUnitario: 450.0,
        valorTotal: 6750.0,
      },
      {
        id: uuidv4(),
        nome: 'Mesas de escritório',
        quantidade: 8,
        valorUnitario: 600.0,
        valorTotal: 4800.0,
      }
    ],
    valorTotal: 11550.0,
    fundoMonetario: 'Fundo Municipal de Administração',
    setor: 'Administrativo',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 1),
  },
  
  // Setor Transporte - Janeiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 3),
    descricao: 'Combustível para frota municipal',
    itens: [
      {
        id: uuidv4(),
        nome: 'Diesel (litros)',
        quantidade: 5000,
        valorUnitario: 5.0,
        valorTotal: 25000.0,
      }
    ],
    valorTotal: 25000.0,
    fundoMonetario: 'Fundo Municipal de Transporte',
    setor: 'Transporte',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 3),
  },
  // Setor Transporte - Fevereiro
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 2),
    descricao: 'Manutenção da frota de ônibus escolares',
    itens: [
      {
        id: uuidv4(),
        nome: 'Pneus',
        quantidade: 12,
        valorUnitario: 1200.0,
        valorTotal: 14400.0,
      },
      {
        id: uuidv4(),
        nome: 'Óleo lubrificante',
        quantidade: 80,
        valorUnitario: 30.0,
        valorTotal: 2400.0,
      }
    ],
    valorTotal: 16800.0,
    fundoMonetario: 'Fundo Municipal de Transporte',
    setor: 'Transporte',
    status: 'Aprovado',
    createdAt: subMonths(new Date(), 2),
  },
  // Setor Transporte - Março
  {
    id: uuidv4(),
    dataCompra: subMonths(new Date(), 1),
    descricao: 'Aquisição de novo veículo',
    itens: [
      {
        id: uuidv4(),
        nome: 'Caminhonete para serviços municipais',
        quantidade: 1,
        valorUnitario: 120000.0,
        valorTotal: 120000.0,
      }
    ],
    valorTotal: 120000.0,
    fundoMonetario: 'Fundo Municipal de Transporte',
    setor: 'Transporte',
    status: 'Pendente',
    createdAt: subMonths(new Date(), 1),
  }
];

// Combina todos os pedidos
const todosPedidos = [...pedidosCompra, ...pedidosPaiPedro];

// Função para adicionar um novo pedido
export function adicionarPedido(pedido: PedidoCompra) {
  todosPedidos.push(pedido);
  return pedido;
}

// Função para remover um pedido
export function removerPedido(id: string, setor?: Setor) {
  const index = todosPedidos.findIndex(p => p.id === id);
  if (index !== -1) {
    todosPedidos.splice(index, 1);
    return true;
  }
  return false;
}

// Função para calcular dados para o dashboard
export function calcularDadosDashboard(municipioId?: string | null): DadosDashboard {
  // Filtra pedidos com base no município selecionado
  const pedidosFiltrados = municipioId ? 
    todosPedidos.filter(pedido => pedido.id.includes(municipioId)) : 
    todosPedidos;
  
  // Calcular gastos por setor
  const gastosPorSetor: Record<Setor, number> = {
    'Saúde': 0,
    'Educação': 0,
    'Administrativo': 0,
    'Transporte': 0,
  };

  // Calcular quantidade de pedidos por setor
  const pedidosPorSetor: Record<Setor, number> = {
    'Saúde': 0,
    'Educação': 0,
    'Administrativo': 0,
    'Transporte': 0,
  };

  // Adiciona valores dos pedidos aos totais
  pedidosFiltrados.forEach(pedido => {
    if (pedido.status === 'Aprovado') {
      gastosPorSetor[pedido.setor as Setor] += pedido.valorTotal;
    }
    pedidosPorSetor[pedido.setor as Setor] += 1;
  });

  // Define orçamento previsto por setor (valores fictícios)
  const orcamentoPrevisto: Record<Setor, number> = {
    'Saúde': 8000000,
    'Educação': 6500000,
    'Administrativo': 3500000,
    'Transporte': 2500000,
  };

  // Calcula ticket médio por setor
  const ticketMedioPorSetor: Record<Setor, number> = {
    'Saúde': pedidosPorSetor['Saúde'] ? gastosPorSetor['Saúde'] / pedidosPorSetor['Saúde'] : 0,
    'Educação': pedidosPorSetor['Educação'] ? gastosPorSetor['Educação'] / pedidosPorSetor['Educação'] : 0,
    'Administrativo': pedidosPorSetor['Administrativo'] ? gastosPorSetor['Administrativo'] / pedidosPorSetor['Administrativo'] : 0,
    'Transporte': pedidosPorSetor['Transporte'] ? gastosPorSetor['Transporte'] / pedidosPorSetor['Transporte'] : 0,
  };

  // Calcula o gasto total
  const gastosTotais = Object.values(gastosPorSetor).reduce((total, gasto) => total + gasto, 0);

  return {
    gastosTotais,
    gastosPorSetor,
    orcamentoPrevisto,
    pedidosPorSetor,
    ticketMedioPorSetor,
  };
}

// Função para obter todos os pedidos
export function obterPedidos(): PedidoCompra[] {
  return todosPedidos;
}

// Função para obter todos os pedidos (alias para compatibilidade)
export const obterTodosPedidos = obterPedidos;

// Função para obter pedidos por setor
export function obterPedidosPorSetor(setor: Setor): PedidoCompra[] {
  return todosPedidos.filter(pedido => pedido.setor === setor);
}

// Função auxiliar para formatar data
export function formatarData(data: Date): string {
  return format(data, 'dd/MM/yyyy');
}

// Função para obter estatísticas dos cartões
export function obterEstatisticasCartoes() {
  const isDFD = true; // Use "DFD" em vez de "Pedidos"
  const dados = calcularDadosDashboard();
  const orcamentoTotal = Object.values(dados.orcamentoPrevisto).reduce((a, b) => a + b, 0);
  const gastoTotal = dados.gastosTotais;
  const percentualGasto = (gastoTotal / orcamentoTotal) * 100;
  const percentualVariacao = percentualGasto - 75; // Base comparativa
  
  const totalPedidos = Object.values(dados.pedidosPorSetor).reduce((a, b) => a + b, 0);
  const mediaPedidosMesAnterior = totalPedidos * 0.92; // Simulação do mês anterior
  const variacaoPedidos = ((totalPedidos - mediaPedidosMesAnterior) / mediaPedidosMesAnterior) * 100;
  
  const ticketMedioTotal = gastoTotal / totalPedidos;
  const ticketMedioAnterior = ticketMedioTotal * 0.95; // Simulação do mês anterior
  const variacaoTicket = ((ticketMedioTotal - ticketMedioAnterior) / ticketMedioAnterior) * 100;
  
  return [
    {
      titulo: 'Orçamento Total',
      valor: `R$ ${(orcamentoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: 0, // Orçamento é fixo, não tem variação mensal
      icon: 'Building',
      cor: 'bg-administrativo-DEFAULT'
    },
    {
      titulo: 'Total Gasto',
      valor: `R$ ${gastoTotal.toLocaleString('pt-BR')}`,
      percentualMudanca: percentualVariacao,
      icon: 'Building',
      cor: 'bg-saude-DEFAULT'
    },
    {
      titulo: isDFD ? 'Documento de Formalização de Demanda' : 'Pedidos de Compra',
      valor: totalPedidos.toString(),
      percentualMudanca: variacaoPedidos,
      icon: 'Building',
      cor: 'bg-educacao-DEFAULT'
    },
    {
      titulo: 'Ticket Médio',
      valor: `R$ ${Math.round(ticketMedioTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: variacaoTicket,
      icon: 'Building',
      cor: 'bg-transporte-DEFAULT'
    }
  ];
}

// Função para filtrar pedidos com base em critérios
export function filtrarPedidos(pedidos: PedidoCompra[], filtros: any) {
  return pedidos.filter(pedido => {
    // Filtra por setor
    if (filtros.setor && pedido.setor !== filtros.setor) {
      return false;
    }
    
    // Filtra por status
    if (filtros.status && pedido.status !== filtros.status) {
      return false;
    }
    
    // Filtra por data
    if (filtros.dataInicio && new Date(filtros.dataInicio) > pedido.dataCompra) {
      return false;
    }
    
    if (filtros.dataFim && new Date(filtros.dataFim) < pedido.dataCompra) {
      return false;
    }
    
    // Filtra por valor
    if (filtros.valorMinimo && pedido.valorTotal < filtros.valorMinimo) {
      return false;
    }
    
    if (filtros.valorMaximo && pedido.valorTotal > filtros.valorMaximo) {
      return false;
    }
    
    // Filtra por termo de busca
    if (filtros.termo) {
      const termo = filtros.termo.toLowerCase();
      const descricaoMatch = pedido.descricao.toLowerCase().includes(termo);
      const itensMatch = pedido.itens.some(item => 
        item.nome.toLowerCase().includes(termo)
      );
      
      if (!descricaoMatch && !itensMatch) {
        return false;
      }
    }
    
    return true;
  });
}
