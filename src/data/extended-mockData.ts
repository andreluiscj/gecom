
// Re-exporting just the function for the mock orders
export { obterPedidosFicticios } from './pedidos/mockPedidos';
import { obterPedidosFicticios } from './pedidos/mockPedidos';
import { Setor } from '@/types';

// Function to calculate dashboard data based on actual pedidos
export function calcularDadosDashboard() {
  const pedidos = obterPedidosFicticios();
  
  // Calculate total value of all pedidos
  const valorTotal = pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0);
  
  // Count pedidos by setor
  const pedidosPorSetor: Record<string, number> = {};
  // Calculate spending by setor
  const gastosPorSetor: Record<string, number> = {};
  
  // Initialize with zeros for all sectors
  const todosSetores: Setor[] = [
    'Saúde', 'Educação', 'Administrativo', 'Transporte', 
    'Obras', 'Segurança Pública', 'Assistência Social', 
    'Meio Ambiente', 'Fazenda', 'Turismo', 'Cultura', 
    'Esportes e Lazer', 'Planejamento', 'Comunicação', 
    'Ciência e Tecnologia'
  ];
  
  todosSetores.forEach(setor => {
    pedidosPorSetor[setor] = 0;
    gastosPorSetor[setor] = 0;
  });
  
  // Calculate actual values from pedidos
  pedidos.forEach(pedido => {
    if (pedidosPorSetor[pedido.setor] !== undefined) {
      pedidosPorSetor[pedido.setor]++;
      gastosPorSetor[pedido.setor] += pedido.valorTotal;
    }
  });
  
  return {
    totalPedidos: pedidos.length,
    valorTotal,
    pedidosPorSetor,
    gastosPorSetor,
    orcamentoPrevisto: {
      'Saúde': 500000.00,
      'Educação': 400000.00,
      'Administrativo': 300000.00,
      'Transporte': 300000.00,
      'Obras': 250000.00,
      'Segurança Pública': 200000.00,
      'Assistência Social': 180000.00,
      'Meio Ambiente': 150000.00,
      'Fazenda': 120000.00,
      'Turismo': 100000.00,
      'Cultura': 90000.00,
      'Esportes e Lazer': 80000.00,
      'Planejamento': 70000.00,
      'Comunicação': 60000.00,
      'Ciência e Tecnologia': 50000.00
    }
  };
}

// Dashboard mock data - now uses the calculated values
export function obterDadosDashboard() {
  // Get calculated data based on actual pedidos
  const calculatedData = calcularDadosDashboard();
  // Data atual
  const hoje = new Date();
  
  return {
    resumoFinanceiro: {
      orcamentoAnual: 2500000.00,
      orcamentoUtilizado: calculatedData.valorTotal,
      percentualUtilizado: (calculatedData.valorTotal / 2500000.00) * 100,
      totalPedidos: calculatedData.totalPedidos,
    },
    
    cartoes: [
      {
        titulo: "Pedidos Abertos",
        valor: 38,
        percentualMudanca: 12.5,
        icon: "ShoppingCart",
        classeCor: "bg-blue-500"
      },
      {
        titulo: "Orçamento Restante",
        valor: `R$ ${(2500000.00 - calculatedData.valorTotal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        percentualMudanca: -8.3,
        icon: "Wallet",
        classeCor: "bg-green-500"
      },
      {
        titulo: "Pedidos Aprovados",
        valor: 86,
        percentualMudanca: 23.7,
        icon: "CheckCircle",
        classeCor: "bg-emerald-500"
      },
      {
        titulo: "Valor Médio",
        valor: `R$ ${(calculatedData.totalPedidos > 0 ? calculatedData.valorTotal / calculatedData.totalPedidos : 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        percentualMudanca: 5.2,
        icon: "TrendingUp",
        classeCor: "bg-amber-500"
      }
    ],
    
    // Use the calculated values from actual pedidos
    orcamentoPrevisto: calculatedData.orcamentoPrevisto,
    gastosPorSetor: calculatedData.gastosPorSetor
  };
}
