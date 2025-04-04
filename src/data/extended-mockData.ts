
// Re-exporting just the function for the mock orders
export { obterPedidosFicticios } from './pedidos/mockPedidos';

// Simple mock data for setores dashboard
export function calcularDadosDashboard() {
  return {
    totalPedidos: 124,
    valorTotal: 1345678.90,
    pedidosPorSetor: {
      'Saúde': 45,
      'Educação': 32,
      'Administrativo': 29,
      'Transporte': 18
    },
    gastosPorSetor: {
      'Saúde': 450000.00,
      'Educação': 325000.00,
      'Administrativo': 290000.00,
      'Transporte': 280678.90
    },
    orcamentoPrevisto: {
      'Saúde': 500000.00,
      'Educação': 400000.00,
      'Administrativo': 300000.00,
      'Transporte': 300000.00
    }
  };
}
