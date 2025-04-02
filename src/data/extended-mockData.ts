
import { 
  DadosDashboard, 
  EstatisticaCartao, 
  Pedido, 
  PedidoStatus, 
  FiltroPedido 
} from '@/types';
import { Heart, BookOpen, Building, Bus } from "lucide-react";

// Dados para 3 meses para cada setor em cada município
export function calcularDadosDashboard(municipioId?: string | null): DadosDashboard {
  let multiplicador = 1;
  
  // Ajustamos o multiplicador com base no município selecionado
  if (municipioId === 'janauba') {
    multiplicador = 1.8;
  } else if (municipioId === 'espinosa') {
    multiplicador = 1.4;
  }
  
  // Geramos dados específicos para cada município ao longo de 3 meses
  const meses = ['Janeiro', 'Fevereiro', 'Março'];
  const dadosMensais = meses.map((mes, index) => {
    // Incremento percentual a cada mês
    const incrementoMensal = 1 + (index * 0.12);
    
    // Dados base
    const baseOrcamentoSaude = 800000 * multiplicador * incrementoMensal;
    const baseOrcamentoEducacao = 650000 * multiplicador * incrementoMensal;
    const baseOrcamentoAdministrativo = 350000 * multiplicador * incrementoMensal;
    const baseOrcamentoTransporte = 250000 * multiplicador * incrementoMensal;
    
    // Variação aleatória para tornar os dados mais realistas
    const variacao = () => 0.85 + Math.random() * 0.3;
    
    return {
      mes,
      orcamentoPrevisto: {
        'Saúde': Math.round(baseOrcamentoSaude),
        'Educação': Math.round(baseOrcamentoEducacao),
        'Administrativo': Math.round(baseOrcamentoAdministrativo),
        'Transporte': Math.round(baseOrcamentoTransporte),
      },
      gastosPorSetor: {
        'Saúde': Math.round(baseOrcamentoSaude * 0.78 * variacao()),
        'Educação': Math.round(baseOrcamentoEducacao * 0.82 * variacao()),
        'Administrativo': Math.round(baseOrcamentoAdministrativo * 0.68 * variacao()),
        'Transporte': Math.round(baseOrcamentoTransporte * 0.75 * variacao()),
      },
      pedidosPorSetor: {
        'Saúde': Math.round(25 * multiplicador * incrementoMensal),
        'Educação': Math.round(32 * multiplicador * incrementoMensal),
        'Administrativo': Math.round(18 * multiplicador * incrementoMensal),
        'Transporte': Math.round(12 * multiplicador * incrementoMensal),
      },
      ticketMedioPorSetor: {
        'Saúde': 0,
        'Educação': 0,
        'Administrativo': 0,
        'Transporte': 0,
      },
      gastosTotais: 0
    };
  });
  
  // Consolidamos os dados somando os 3 meses
  const dadosConsolidados: DadosDashboard = {
    orcamentoPrevisto: {
      'Saúde': dadosMensais.reduce((total, mes) => total + mes.orcamentoPrevisto['Saúde'], 0),
      'Educação': dadosMensais.reduce((total, mes) => total + mes.orcamentoPrevisto['Educação'], 0),
      'Administrativo': dadosMensais.reduce((total, mes) => total + mes.orcamentoPrevisto['Administrativo'], 0),
      'Transporte': dadosMensais.reduce((total, mes) => total + mes.orcamentoPrevisto['Transporte'], 0),
    },
    gastosPorSetor: {
      'Saúde': dadosMensais.reduce((total, mes) => total + mes.gastosPorSetor['Saúde'], 0),
      'Educação': dadosMensais.reduce((total, mes) => total + mes.gastosPorSetor['Educação'], 0),
      'Administrativo': dadosMensais.reduce((total, mes) => total + mes.gastosPorSetor['Administrativo'], 0),
      'Transporte': dadosMensais.reduce((total, mes) => total + mes.gastosPorSetor['Transporte'], 0),
    },
    pedidosPorSetor: {
      'Saúde': dadosMensais.reduce((total, mes) => total + mes.pedidosPorSetor['Saúde'], 0),
      'Educação': dadosMensais.reduce((total, mes) => total + mes.pedidosPorSetor['Educação'], 0),
      'Administrativo': dadosMensais.reduce((total, mes) => total + mes.pedidosPorSetor['Administrativo'], 0),
      'Transporte': dadosMensais.reduce((total, mes) => total + mes.pedidosPorSetor['Transporte'], 0),
    },
    ticketMedioPorSetor: {
      'Saúde': 0,
      'Educação': 0,
      'Administrativo': 0,
      'Transporte': 0,
    },
    gastosTotais: 0
  };
  
  // Calculamos o ticket médio e os gastos totais
  Object.keys(dadosConsolidados.pedidosPorSetor).forEach(setor => {
    const gastos = dadosConsolidados.gastosPorSetor[setor as keyof typeof dadosConsolidados.gastosPorSetor];
    const pedidos = dadosConsolidados.pedidosPorSetor[setor as keyof typeof dadosConsolidados.pedidosPorSetor];
    
    dadosConsolidados.ticketMedioPorSetor[setor as keyof typeof dadosConsolidados.ticketMedioPorSetor] = 
      Math.round(gastos / pedidos);
  });
  
  // Calculamos os gastos totais
  dadosConsolidados.gastosTotais = Object.values(dadosConsolidados.gastosPorSetor)
    .reduce((total, valor) => total + valor, 0);
  
  return dadosConsolidados;
}

// Função para obter estatísticas dos cartões do dashboard
export function obterEstatisticasCartoes(municipioId?: string | null): EstatisticaCartao[] {
  const language = localStorage.getItem('app-language') || 'pt';
  const isDFD = true; // Use "DFD" em vez de "Pedidos"
  
  // Textos multilíngues
  const texts = {
    budgetTitle: language === 'pt' ? 'Orçamento Total' : 'Total Budget',
    expensesTitle: language === 'pt' ? 'Total Gasto' : 'Total Spent',
    dfdTitle: language === 'pt' ? 'Documento de Formalização de Demanda' : 'Formalization of Demand Documents',
    ticketTitle: language === 'pt' ? 'Ticket Médio' : 'Average Ticket'
  };
  
  const dados = calcularDadosDashboard(municipioId);
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
      titulo: texts.budgetTitle,
      valor: `R$ ${(orcamentoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: 0, // Orçamento é fixo, não tem variação mensal
      icon: Building,
      cor: 'bg-administrativo-DEFAULT'
    },
    {
      titulo: texts.expensesTitle,
      valor: `R$ ${gastoTotal.toLocaleString('pt-BR')}`,
      percentualMudanca: percentualVariacao,
      icon: Building,
      cor: 'bg-saude-DEFAULT'
    },
    {
      titulo: isDFD ? texts.dfdTitle : 'Pedidos de Compra',
      valor: totalPedidos.toString(),
      percentualMudanca: variacaoPedidos,
      icon: Building,
      cor: 'bg-educacao-DEFAULT'
    },
    {
      titulo: texts.ticketTitle,
      valor: `R$ ${Math.round(ticketMedioTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: variacaoTicket,
      icon: Building,
      cor: 'bg-transporte-DEFAULT'
    }
  ];
}

// Exporte a função original também para manter compatibilidade
export * from '@/data/mockData';
