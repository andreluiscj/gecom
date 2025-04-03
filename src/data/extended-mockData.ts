
import { 
  DadosDashboard, 
  EstatisticaCartao, 
  Pedido, 
  PedidoStatus, 
  FiltroPedido 
} from '@/types';

// Dados vazios para o dashboard
export function calcularDadosDashboard(municipioId?: string | null): DadosDashboard {
  // Estrutura vazia para os dados do dashboard
  const gastosPorSetor = {
    'Saúde': 0,
    'Educação': 0,
    'Administrativo': 0,
    'Transporte': 0,
  };

  const pedidosPorSetor = {
    'Saúde': 0,
    'Educação': 0,
    'Administrativo': 0,
    'Transporte': 0,
  };

  const orcamentoPrevisto = {
    'Saúde': 0,
    'Educação': 0,
    'Administrativo': 0,
    'Transporte': 0,
  };

  const ticketMedioPorSetor = {
    'Saúde': 0,
    'Educação': 0,
    'Administrativo': 0,
    'Transporte': 0,
  };

  return {
    gastosTotais: 0,
    gastosPorSetor,
    orcamentoPrevisto,
    pedidosPorSetor,
    ticketMedioPorSetor,
  };
}

// Função para obter estatísticas dos cartões do dashboard
export function obterEstatisticasCartoes(municipioId?: string | null): EstatisticaCartao[] {
  const language = localStorage.getItem('app-language') || 'pt';
  
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
      valor: `R$ 0,00`,
      percentualMudanca: 0,
      icon: 'Building',
      cor: 'bg-administrativo-DEFAULT'
    },
    {
      titulo: texts.expensesTitle,
      valor: `R$ 0,00`,
      percentualMudanca: 0,
      icon: 'Wallet',
      cor: 'bg-saude-DEFAULT'
    },
    {
      titulo: texts.dfdTitle,
      valor: '0',
      percentualMudanca: 0,
      icon: 'ShoppingCart',
      cor: 'bg-educacao-DEFAULT'
    },
    {
      titulo: texts.ticketTitle,
      valor: `R$ 0,00`,
      percentualMudanca: 0,
      icon: 'Receipt',
      cor: 'bg-transporte-DEFAULT'
    }
  ];
}

// Exporte a função original também para manter compatibilidade
export * from '@/data/mockData';
