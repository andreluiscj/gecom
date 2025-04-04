
import { EstatisticaCartao } from '@/types';
import { calcularDadosDashboard, gastosPorSetorEMes, pedidosPorSetorEMes } from './dashboardCalculator';

// Função para obter estatísticas dos cartões do dashboard
export function obterEstatisticasCartoes(municipioId?: string | null): EstatisticaCartao[] {
  const language = localStorage.getItem('app-language') || 'pt';
  const dados = calcularDadosDashboard(municipioId);
  
  const orcamentoTotal = Object.values(dados.orcamentoPrevisto).reduce((acc, val) => acc + val, 0);
  const gastoTotal = dados.gastosTotais;
  const totalPedidos = Object.values(dados.pedidosPorSetor).reduce((acc, val) => acc + val, 0);
  
  // Calcular ticket médio global
  const ticketMedio = totalPedidos > 0 ? gastoTotal / totalPedidos : 0;
  
  // Calcular percentuais de mudança com base no mês anterior
  const mesAtual = 2; // Índice do mês atual no array (0-indexed)
  const mesAnterior = 1; // Índice do mês anterior no array (0-indexed)
  
  const gastoTotalAnterior = 
    gastosPorSetorEMes['Saúde'][mesAnterior] + 
    gastosPorSetorEMes['Educação'][mesAnterior] + 
    gastosPorSetorEMes['Administrativo'][mesAnterior] + 
    gastosPorSetorEMes['Transporte'][mesAnterior];
  
  const totalPedidosAnterior = 
    pedidosPorSetorEMes['Saúde'][mesAnterior] + 
    pedidosPorSetorEMes['Educação'][mesAnterior] + 
    pedidosPorSetorEMes['Administrativo'][mesAnterior] + 
    pedidosPorSetorEMes['Transporte'][mesAnterior];
  
  const ticketMedioAnterior = totalPedidosAnterior > 0 ? gastoTotalAnterior / totalPedidosAnterior : 0;
  
  // Calcular percentuais de mudança
  const percentualMudancaGasto = gastoTotalAnterior > 0 ? ((gastoTotal - gastoTotalAnterior) / gastoTotalAnterior) * 100 : 0;
  const percentualMudancaPedidos = totalPedidosAnterior > 0 ? ((totalPedidos - totalPedidosAnterior) / totalPedidosAnterior) * 100 : 0;
  const percentualMudancaTicket = ticketMedioAnterior > 0 ? ((ticketMedio - ticketMedioAnterior) / ticketMedioAnterior) * 100 : 0;
  
  // Textos multilíngues
  const texts = {
    budgetTitle: language === 'pt' ? 'Orçamento Total' : 'Total Budget',
    expensesTitle: language === 'pt' ? 'Total Gasto' : 'Total Spent',
    dfdTitle: language === 'pt' ? 'Pedidos de Compras' : 'Purchase Orders',
    ticketTitle: language === 'pt' ? 'Ticket Médio' : 'Average Ticket'
  };
  
  return [
    {
      titulo: texts.budgetTitle,
      valor: `R$ ${(orcamentoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: 0, // Orçamento não muda mensalmente neste caso
      icon: 'Building',
      cor: 'bg-administrativo-DEFAULT'
    },
    {
      titulo: texts.expensesTitle,
      valor: `R$ ${(gastoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: percentualMudancaGasto,
      icon: 'Wallet',
      cor: 'bg-saude-DEFAULT'
    },
    {
      titulo: texts.dfdTitle,
      valor: totalPedidos.toString(),
      percentualMudanca: percentualMudancaPedidos,
      icon: 'ShoppingCart',
      cor: 'bg-educacao-DEFAULT'
    },
    {
      titulo: texts.ticketTitle,
      valor: `R$ ${(ticketMedio).toLocaleString('pt-BR')}`,
      percentualMudanca: percentualMudancaTicket,
      icon: 'Receipt',
      cor: 'bg-transporte-DEFAULT'
    }
  ];
}
