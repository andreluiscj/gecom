
import { EstatisticaCartao } from '@/types';
import { calcularDadosDashboard, gastosPorSetorEMes, pedidosPorSetorEMes } from './dashboardCalculator';

// Função para obter estatísticas dos cartões do dashboard
export function obterEstatisticasCartoes(municipioId?: string | null): EstatisticaCartao[] {
  const dados = calcularDadosDashboard(municipioId);
  
  const orcamentoTotal = Object.values(dados.orcamentoPrevisto).reduce((acc, val) => acc + val, 0);
  const gastoTotal = dados.gastosTotais;
  const totalPedidos = Object.values(dados.pedidosPorSetor).reduce((acc, val) => acc + val, 0);
  
  // Calcular ticket médio global
  const ticketMedio = totalPedidos > 0 ? gastoTotal / totalPedidos : 0;
  
  // Calcular percentuais de mudança com base no mês anterior
  const mesAtual = 2; // Índice do mês atual no array (0-indexed)
  const mesAnterior = 1; // Índice do mês anterior no array (0-indexed)
  
  // Calcular gastos totais do mês anterior
  let gastoTotalAnterior = 0;
  for (const setor in gastosPorSetorEMes) {
    gastoTotalAnterior += gastosPorSetorEMes[setor as keyof typeof gastosPorSetorEMes][mesAnterior];
  }
  
  // Calcular total de pedidos do mês anterior
  let totalPedidosAnterior = 0;
  for (const setor in pedidosPorSetorEMes) {
    totalPedidosAnterior += pedidosPorSetorEMes[setor as keyof typeof pedidosPorSetorEMes][mesAnterior];
  }
  
  const ticketMedioAnterior = totalPedidosAnterior > 0 ? gastoTotalAnterior / totalPedidosAnterior : 0;
  
  // Calcular percentuais de mudança
  const percentualMudancaGasto = gastoTotalAnterior > 0 ? ((gastoTotal - gastoTotalAnterior) / gastoTotalAnterior) * 100 : 0;
  const percentualMudancaPedidos = totalPedidosAnterior > 0 ? ((totalPedidos - totalPedidosAnterior) / totalPedidosAnterior) * 100 : 0;
  const percentualMudancaTicket = ticketMedioAnterior > 0 ? ((ticketMedio - ticketMedioAnterior) / ticketMedioAnterior) * 100 : 0;
  
  return [
    {
      titulo: 'Orçamento Total',
      valor: `R$ ${(orcamentoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: 0, // Orçamento não muda mensalmente neste caso
      icon: 'Building',
      cor: 'bg-administrativo-DEFAULT'
    },
    {
      titulo: 'Total Gasto',
      valor: `R$ ${(gastoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: percentualMudancaGasto,
      icon: 'Wallet',
      cor: 'bg-saude-DEFAULT'
    },
    {
      titulo: 'Pedidos de Compras',
      valor: totalPedidos.toString(),
      percentualMudanca: percentualMudancaPedidos,
      icon: 'ShoppingCart',
      cor: 'bg-educacao-DEFAULT'
    },
    {
      titulo: 'Ticket Médio',
      valor: `R$ ${(ticketMedio).toLocaleString('pt-BR')}`,
      percentualMudanca: percentualMudancaTicket,
      icon: 'Receipt',
      cor: 'bg-transporte-DEFAULT'
    }
  ];
}
