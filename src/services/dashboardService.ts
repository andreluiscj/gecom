import { supabase } from '@/lib/supabase';
import { DadosDashboard, PedidoCompra, Setor } from '@/types';
import { getPedidos } from './pedidoService';
import { toast } from 'sonner';
import { setores } from '@/data/mockData';

// Calculate dashboard data based on pedidos
export async function calcularDadosDashboard(
  pedidos: PedidoCompra[]
): Promise<DadosDashboard> {
  // Total values
  const valorTotalPedidos = pedidos.reduce((acc, pedido) => acc + pedido.valorTotal, 0);
  const pedidosConcluidos = pedidos.filter(p => p.status === 'Concluído');
  const valorContratadoTotal = pedidosConcluidos.reduce((acc, p) => acc + p.valorTotal, 0);

  // Estimated budget
  const orcamentoAnual = 5000000; // Default value
  const percentualUtilizado = (valorContratadoTotal / orcamentoAnual) * 100;

  // Calculate spending by sector
  const gastosPorSetor: Record<string, number> = {};
  const pedidosPorSetor: Record<string, number> = {};
  const orcamentoPrevisto: Record<string, number> = {};

  // Initialize with all sectors
  setores.forEach(setor => {
    gastosPorSetor[setor] = 0;
    pedidosPorSetor[setor] = 0;
    orcamentoPrevisto[setor] = orcamentoAnual / setores.length; // Equal distribution by default
  });

  // Calculate actual values
  pedidos.forEach(pedido => {
    const setor = pedido.setor;
    
    if (setor) {
      pedidosPorSetor[setor] = (pedidosPorSetor[setor] || 0) + 1;
      
      if (pedido.status === 'Concluído' || pedido.status === 'Aprovado') {
        gastosPorSetor[setor] = (gastosPorSetor[setor] || 0) + pedido.valorTotal;
      }
    }
  });

  // Performance indicators
  const tempoMedioConclusao = pedidosConcluidos.length > 0 ? 14 : 0; // Default 14 days
  const percentualEconomia = 12.5; // Default 12.5% saved

  // Prepare the cards data
  const cartoes = [
    {
      titulo: 'Total de Pedidos',
      valor: pedidos.length,
      percentualMudanca: 5.2,
      icon: 'shopping-cart',
      classeCor: 'text-blue-600'
    },
    {
      titulo: 'Valor Contratado',
      valor: valorContratadoTotal,
      percentualMudanca: 2.5,
      icon: 'dollar-sign',
      classeCor: 'text-green-600'
    },
    {
      titulo: 'Economia',
      valor: `${percentualEconomia}%`,
      percentualMudanca: 1.8,
      icon: 'trending-down',
      classeCor: 'text-purple-600'
    },
    {
      titulo: 'Tempo Médio',
      valor: `${tempoMedioConclusao} dias`,
      percentualMudanca: -3.2,
      icon: 'clock',
      classeCor: 'text-orange-600'
    }
  ];

  return {
    resumoFinanceiro: {
      estimativaDespesa: valorTotalPedidos,
      valorContratadoTotal,
      percentualUtilizado,
      totalPedidos: pedidos.length,
      orcamentoAnual
    },
    cartoes,
    orcamentoPrevisto,
    gastosPorSetor,
    valorContratadoTotal,
    pedidosPorSetor,
    indicadoresDesempenho: {
      tempoMedioConclusao,
      percentualEconomia
    }
  };
}

// Get dashboard data from database or calculate if not available
export async function obterDadosDashboard(): Promise<DadosDashboard> {
  try {
    // Get pedidos first
    const pedidos = await getPedidos();
    
    // Get dashboard data from database or generate new
    const { data: dashboardData, error } = await supabase
      .from('dashboard_data')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    // If we have dashboard data and it's recent enough, use it
    if (dashboardData && !error) {
      const lastUpdate = new Date(dashboardData.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      // Use cached data if less than 24h old
      if (hoursDiff < 24) {
        return dashboardData.data;
      }
    }
    
    // Otherwise, calculate new data
    const newDashboardData = await calcularDadosDashboard(pedidos);
    
    // Store in database for future use
    await supabase
      .from('dashboard_data')
      .insert({
        data: newDashboardData,
        created_at: new Date().toISOString()
      });
      
    return newDashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    toast.error('Erro ao carregar dados do dashboard.');
    
    // Return empty data structure
    return {
      resumoFinanceiro: {
        estimativaDespesa: 0,
        valorContratadoTotal: 0,
        percentualUtilizado: 0,
        totalPedidos: 0,
        orcamentoAnual: 5000000
      },
      cartoes: [],
      orcamentoPrevisto: {},
      gastosPorSetor: {},
      valorContratadoTotal: 0,
      pedidosPorSetor: {},
      indicadoresDesempenho: {
        tempoMedioConclusao: 0,
        percentualEconomia: 0
      }
    };
  }
}

// Export default data structure
export const setores: Setor[] = [
  'Saúde',
  'Educação',
  'Administrativo',
  'Transporte',
  'Assistência Social',
  'Cultura',
  'Meio Ambiente',
  'Obras',
  'Segurança Pública',
  'Fazenda',
  'Turismo',
  'Esportes e Lazer',
  'Planejamento',
  'Comunicação',
  'Ciência e Tecnologia'
];
