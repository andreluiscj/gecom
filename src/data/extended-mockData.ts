
import { Setor } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Function to calculate dashboard data from the database
export async function calcularDadosDashboard() {
  try {
    // Get the total number of DFDs
    const { data: totalPedidos, error: totalError } = await supabase
      .from('dfds')
      .select('count', { count: 'exact' });
    
    // Get the sum of all DFD values
    const { data: valorData, error: valorError } = await supabase
      .from('dfds')
      .select('valor_estimado, secretaria_id, secretarias(nome)')
      .not('valor_estimado', 'is', null);
    
    if (totalError || valorError) {
      console.error('Error fetching dashboard data:', totalError || valorError);
      return getDefaultDashboardData();
    }
    
    // Calculate total value
    const valorTotal = valorData.reduce((sum, pedido) => sum + (pedido.valor_estimado || 0), 0);
    
    // Count pedidos by setor and calculate spending by setor
    const pedidosPorSetor: Record<string, number> = {};
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
    
    // Calculate actual values from database data
    valorData.forEach(pedido => {
      const setorNome = pedido.secretarias?.nome;
      if (setorNome && gastosPorSetor[setorNome] !== undefined) {
        pedidosPorSetor[setorNome]++;
        gastosPorSetor[setorNome] += pedido.valor_estimado || 0;
      }
    });
    
    return {
      totalPedidos: totalPedidos?.[0]?.count || 0,
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
  } catch (error) {
    console.error('Error in calcularDadosDashboard:', error);
    return getDefaultDashboardData();
  }
}

// Helper function to return default empty dashboard data
function getDefaultDashboardData() {
  const todosSetores: Setor[] = [
    'Saúde', 'Educação', 'Administrativo', 'Transporte', 
    'Obras', 'Segurança Pública', 'Assistência Social', 
    'Meio Ambiente', 'Fazenda', 'Turismo', 'Cultura', 
    'Esportes e Lazer', 'Planejamento', 'Comunicação', 
    'Ciência e Tecnologia'
  ];
  
  const pedidosPorSetor: Record<string, number> = {};
  const gastosPorSetor: Record<string, number> = {};
  
  todosSetores.forEach(setor => {
    pedidosPorSetor[setor] = 0;
    gastosPorSetor[setor] = 0;
  });
  
  return {
    totalPedidos: 0,
    valorTotal: 0,
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

// Function to get dashboard data with proper fallbacks
export async function obterDadosDashboard() {
  const calculatedData = await calcularDadosDashboard();
  
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
        valor: calculatedData.totalPedidos,
        percentualMudanca: 0,
        icon: "ShoppingCart",
        classeCor: "bg-blue-500"
      },
      {
        titulo: "Orçamento Restante",
        valor: `R$ ${(2500000.00 - calculatedData.valorTotal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        percentualMudanca: 0,
        icon: "Wallet",
        classeCor: "bg-green-500"
      },
      {
        titulo: "Pedidos Aprovados",
        valor: 0,
        percentualMudanca: 0,
        icon: "CheckCircle",
        classeCor: "bg-emerald-500"
      },
      {
        titulo: "Valor Médio",
        valor: `R$ ${(calculatedData.totalPedidos > 0 ? calculatedData.valorTotal / calculatedData.totalPedidos : 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        percentualMudanca: 0,
        icon: "TrendingUp",
        classeCor: "bg-amber-500"
      }
    ],
    
    // Use the calculated values from actual pedidos
    orcamentoPrevisto: calculatedData.orcamentoPrevisto,
    gastosPorSetor: calculatedData.gastosPorSetor
  };
}
