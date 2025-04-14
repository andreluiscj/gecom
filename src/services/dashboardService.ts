
import { supabase } from '@/lib/supabase';
import { DadosDashboard, Setor } from '@/types';
import { toast } from 'sonner';
import { getCurrentMunicipio } from './municipioService';

// Function to calculate dashboard data based on actual purchase requests
export async function calcularDadosDashboard(): Promise<DadosDashboard | null> {
  try {
    // Get the current municipality
    const municipio = await getCurrentMunicipio();
    if (!municipio) {
      toast.error('Erro ao buscar município atual.');
      return null;
    }

    // Get total requests count
    const { count: totalPedidos, error: countError } = await supabase
      .from('purchase_requests')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting purchase requests count:', countError);
      toast.error('Erro ao contar pedidos de compra.');
      return null;
    }

    // Get secretariats for this municipality
    const { data: secretariats, error: secretariatsError } = await supabase
      .from('secretariats')
      .select('id, name, budget')
      .eq('municipality_id', municipio.id);

    if (secretariatsError) {
      console.error('Error getting secretariats:', secretariatsError);
      toast.error('Erro ao buscar secretarias.');
      return null;
    }

    // Initial objects for sector data
    const pedidosPorSetor: Record<string, number> = {};
    const gastosPorSetor: Record<string, number> = {};
    const orcamentoPrevisto: Record<string, number> = {};

    // Initialize with zeros for all sectors
    secretariats.forEach(secretariat => {
      pedidosPorSetor[secretariat.name] = 0;
      gastosPorSetor[secretariat.name] = 0;
      orcamentoPrevisto[secretariat.name] = secretariat.budget || 0;
    });

    // Get purchase requests for each secretariat
    let valorContratadoTotal = 0;

    for (const secretariat of secretariats) {
      // Count requests for this secretariat
      const { count, error: requestsCountError } = await supabase
        .from('purchase_requests')
        .select('*', { count: 'exact', head: true })
        .eq('secretariat_id', secretariat.id);

      if (!requestsCountError) {
        pedidosPorSetor[secretariat.name] = count || 0;
      }

      // Calculate total spent for this secretariat
      const { data: requests, error: requestsError } = await supabase
        .from('purchase_requests')
        .select('total_estimated_value, total_contracted_value')
        .eq('secretariat_id', secretariat.id);

      if (!requestsError && requests) {
        const totalGasto = requests.reduce((sum, request) => {
          // Use contracted value if available, otherwise estimated value
          const value = request.total_contracted_value || request.total_estimated_value;
          valorContratadoTotal += request.total_contracted_value || 0;
          return sum + value;
        }, 0);

        gastosPorSetor[secretariat.name] = totalGasto;
      }
    }

    // Calculate performance indicators
    const tempoMedioConclusao = 14; // Placeholder value
    const percentualEconomia = 8.5; // Placeholder value

    // Create the dashboard data object
    return {
      resumoFinanceiro: {
        estimativaDespesa: municipio.orcamentoAnual,
        valorContratadoTotal,
        percentualUtilizado: (valorContratadoTotal / municipio.orcamentoAnual) * 100,
        totalPedidos: totalPedidos || 0,
        orcamentoAnual: municipio.orcamentoAnual,
      },
      cartoes: [
        {
          titulo: "Pedidos Abertos",
          valor: await getOpenRequestsCount(),
          percentualMudanca: 12.5,
          icon: "ShoppingCart",
          classeCor: "bg-blue-500"
        },
        {
          titulo: "Orçamento Restante",
          valor: `R$ ${(municipio.orcamentoAnual - valorContratadoTotal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          percentualMudanca: -8.3,
          icon: "Wallet",
          classeCor: "bg-green-500"
        },
        {
          titulo: "Pedidos Aprovados",
          valor: await getApprovedRequestsCount(),
          percentualMudanca: 23.7,
          icon: "CheckCircle",
          classeCor: "bg-emerald-500"
        },
        {
          titulo: "Valor Médio",
          valor: `R$ ${((totalPedidos || 0) > 0 ? valorContratadoTotal / (totalPedidos || 1) : 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          percentualMudanca: 5.2,
          icon: "TrendingUp",
          classeCor: "bg-amber-500"
        }
      ],
      orcamentoPrevisto,
      gastosPorSetor,
      valorContratadoTotal,
      pedidosPorSetor,
      indicadoresDesempenho: {
        tempoMedioConclusao,
        percentualEconomia,
      }
    };
  } catch (error) {
    console.error('Error in calcularDadosDashboard:', error);
    toast.error('Ocorreu um erro ao calcular dados do dashboard.');
    return null;
  }
}

async function getOpenRequestsCount(): Promise<number> {
  try {
    // Get status IDs for open requests (Pendente, Em Análise, Aprovado)
    const { data: statusData, error: statusError } = await supabase
      .from('request_statuses')
      .select('id')
      .in('name', ['Pendente', 'Em Análise', 'Aprovado']);

    if (statusError || !statusData) {
      return 0;
    }

    const statusIds = statusData.map(s => s.id);

    // Count requests with these statuses
    const { count, error: countError } = await supabase
      .from('purchase_requests')
      .select('*', { count: 'exact', head: true })
      .in('status_id', statusIds);

    if (countError) {
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getOpenRequestsCount:', error);
    return 0;
  }
}

async function getApprovedRequestsCount(): Promise<number> {
  try {
    // Get status IDs for approved requests (Aprovado, Em Andamento, Concluído)
    const { data: statusData, error: statusError } = await supabase
      .from('request_statuses')
      .select('id')
      .in('name', ['Aprovado', 'Em Andamento', 'Concluído']);

    if (statusError || !statusData) {
      return 0;
    }

    const statusIds = statusData.map(s => s.id);

    // Count requests with these statuses
    const { count, error: countError } = await supabase
      .from('purchase_requests')
      .select('*', { count: 'exact', head: true })
      .in('status_id', statusIds);

    if (countError) {
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getApprovedRequestsCount:', error);
    return 0;
  }
}

// Function to get dashboard data
export async function obterDadosDashboard(): Promise<DadosDashboard | null> {
  return calcularDadosDashboard();
}
