
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

// Dashboard mock data
export function obterDadosDashboard() {
  // Data atual
  const hoje = new Date();
  
  return {
    resumoFinanceiro: {
      orcamentoAnual: 2500000.00,
      orcamentoUtilizado: 1345678.90,
      percentualUtilizado: 53.83,
      totalPedidos: 124,
    },
    
    cartoes: [
      {
        titulo: "Pedidos Abertos",
        valor: 38,
        percentualMudanca: 12.5,
        icon: "ShoppingCart",
        cor: "bg-blue-500"
      },
      {
        titulo: "Orçamento Restante",
        valor: "R$ 1.154.321,10",
        percentualMudanca: -8.3,
        icon: "Wallet",
        cor: "bg-green-500"
      },
      {
        titulo: "Pedidos Aprovados",
        valor: 86,
        percentualMudanca: 23.7,
        icon: "CheckCircle",
        cor: "bg-emerald-500"
      },
      {
        titulo: "Valor Médio",
        valor: "R$ 10.852,25",
        percentualMudanca: 5.2,
        icon: "TrendingUp",
        cor: "bg-amber-500"
      }
    ],
    
    pedidosRecentes: [
      {
        id: "PED-2023-0124",
        data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2),
        setor: "Saúde",
        valor: 28567.90,
        status: "Aprovado"
      },
      {
        id: "PED-2023-0123",
        data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3),
        setor: "Educação",
        valor: 15789.30,
        status: "Pendente"
      },
      {
        id: "PED-2023-0122",
        data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5),
        setor: "Administrativo",
        valor: 8950.75,
        status: "Aprovado"
      },
      {
        id: "PED-2023-0121",
        data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7),
        setor: "Transporte",
        valor: 32450.00,
        status: "Reprovado"
      }
    ],
    
    dadosMensais: {
      meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      gastos: [
        120000, 145000, 155000, 132000, 148000, 165000, 178000, 189000, 156000, 122000, 0, 0
      ],
      pedidos: [
        12, 15, 18, 14, 16, 19, 20, 22, 17, 15, 0, 0
      ]
    },
    
    distribuicaoSetor: [
      { nome: "Saúde", valor: 450000.00, cor: "#10b981" },
      { nome: "Educação", valor: 325000.00, cor: "#3b82f6" },
      { nome: "Administrativo", valor: 290000.00, cor: "#8b5cf6" },
      { nome: "Transporte", valor: 280678.90, cor: "#f59e0b" }
    ]
  };
}
