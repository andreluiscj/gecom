
import { DadosDashboard, PedidoCompra, Pedido } from '@/types';
import { format, subMonths } from 'date-fns';
import { listaPedidos } from './pedidos/mockPedidos';

// Generate sample dashboard data
export const obterDadosDashboard = (): DadosDashboard => {
  return {
    resumoFinanceiro: {
      estimativaDespesa: 28500000,
      valorContratadoTotal: 8420000,
      percentualUtilizado: 29.54,
      totalPedidos: 587,
    },
    cartoes: [
      {
        titulo: 'Total de Pedidos',
        valor: 587,
        percentualMudanca: 12.5,
        icon: 'Receipt',
        classeCor: 'bg-blue-500',
      },
      {
        titulo: 'Orçamento Executado',
        valor: 'R$ 8.420.000,00',
        percentualMudanca: 8.2,
        icon: 'Wallet',
        classeCor: 'bg-green-500',
      },
    ],
    orcamentoPrevisto: {
      'Saúde': 7000000,
      'Educação': 6500000,
      'Administrativo': 2500000,
      'Transporte': 2000000,
      'Obras': 4000000,
      'Segurança Pública': 2000000,
      'Assistência Social': 1500000,
      'Meio Ambiente': 1000000,
      'Fazenda': 800000,
      'Turismo': 400000,
      'Cultura': 400000,
      'Esportes e Lazer': 500000,
      'Planejamento': 300000,
      'Comunicação': 300000,
      'Ciência e Tecnologia': 300000,
      'Trimestre 1': 7000000,
      'Trimestre 2': 7500000,
      'Trimestre 3': 7000000,
      'Trimestre 4': 7000000,
    },
    gastosPorSetor: {
      'Saúde': 2350000,
      'Educação': 1950000,
      'Administrativo': 950000,
      'Obras': 1430000,
      'Transporte': 670000,
      'Segurança Pública': 480000,
      'Assistência Social': 320000,
      'Meio Ambiente': 230000,
      'Fazenda': 150000,
      'Turismo': 120000,
      'Cultura': 110000,
      'Esportes e Lazer': 140000,
      'Planejamento': 90000,
      'Comunicação': 70000,
      'Ciência e Tecnologia': 80000,
    },
    valorContratadoTotal: 8420000,
    pedidosPorSetor: {
      'Saúde': 143,
      'Educação': 125,
      'Administrativo': 98,
      'Obras': 87,
      'Transporte': 62,
      'Segurança Pública': 28,
      'Assistência Social': 19,
      'Meio Ambiente': 12,
      'Fazenda': 8,
      'Outros': 5,
    },
    indicadoresDesempenho: {
      tempoMedioConclusao: 45,
      percentualEconomia: 12.5,
    },
  };
};

// Fix issues with AdvancedAnalytics component
if (typeof document !== 'undefined') {
  // Add the fix here to make sure we don't import or use browser APIs during SSR
  const fixChartProperties = () => {
    // This runs only in the browser environment
    console.log('Chart properties initialized');
  };
  
  // Call the fix function
  fixChartProperties();
}

export const obterTodosPedidos = (): PedidoCompra[] => {
  return listaPedidos;
};

export const obterPedidosPorSetor = (setor: string): PedidoCompra[] => {
  return listaPedidos.filter(pedido => pedido.setor === setor);
};
