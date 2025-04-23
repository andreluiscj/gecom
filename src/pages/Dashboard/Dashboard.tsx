import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatCard from '@/components/Dashboard/StatCard';
import DashboardSummary from '@/components/Dashboard/DashboardSummary';
import { Building, Printer, Receipt, ShoppingCart, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Municipio, DadosDashboard } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grafico');
  const [language, setLanguage] = useState('pt'); // Default language is Portuguese
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dadosDashboard, setDadosDashboard] = useState<DadosDashboard | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filteredDeptData, setFilteredDeptData] = useState<any[]>([]);
  const [period, setPeriod] = useState('anual');
  const [filters, setFilters] = useState({
    year: '2024',
    quarter: 'Q2',
    month: 'Junho',
    department: 'Todos'
  });

  // Dados para gráficos mensais
  const monthlyData = [
    { name: 'Jan', planejado: 240000, executado: 220000 },
    { name: 'Fev', planejado: 300000, executado: 320000 },
    { name: 'Mar', planejado: 280000, executado: 290000 },
    { name: 'Abr', planejado: 320000, executado: 300000 },
    { name: 'Mai', planejado: 350000, executado: 360000 },
    { name: 'Jun', planejado: 380000, executado: 390000 },
    { name: 'Jul', planejado: 400000, executado: 380000 },
    { name: 'Ago', planejado: 420000, executado: 405000 },
    { name: 'Set', planejado: 390000, executado: 400000 },
    { name: 'Out', planejado: 450000, executado: 430000 },
    { name: 'Nov', planejado: 480000, executado: 460000 },
    { name: 'Dez', planejado: 520000, executado: 500000 },
  ];

  // Dados para análise de departamentos
  const departmentData = [
    { name: 'Saúde', valor: 1850000, percent: 28 },
    { name: 'Educação', valor: 1520000, percent: 23 },
    { name: 'Administração', valor: 950000, percent: 14 },
    { name: 'Obras', valor: 1200000, percent: 18 },
    { name: 'Transporte', valor: 650000, percent: 10 },
    { name: 'Outros', valor: 450000, percent: 7 },
  ];

  // Effect para carregar município selecionado
  useEffect(() => {
    const fetchMunicipio = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('municipios')
          .select('*')
          .limit(1)
          .single();
          
        if (error) throw error;
        
        // Transform dates into Date objects
        const municipioWithDates: Municipio = {
          ...data,
          created_at: new Date(data.created_at),
          updated_at: new Date(data.updated_at)
        };
        
        setMunicipio(municipioWithDates);
      } catch (error) {
        console.error("Erro ao buscar município:", error);
        toast.error("Não foi possível carregar os dados do município");
        
        // Set default municipality in case of error
        const defaultMunicipio: Municipio = {
          id: 'default',
          nome: 'Município Padrão',
          estado: 'MG',
          populacao: 50000,
          orcamento: 25000000,
          orcamento_anual: 25000000,
          prefeito: 'Nome do Prefeito',
          created_at: new Date(),
          updated_at: new Date()
        };
        
        setMunicipio(defaultMunicipio);
      }
    };

    const fetchPedidos = async () => {
      try {
        // Buscar os pedidos para calcular estatísticas
        const { data: pedidosData, error: pedidosError } = await supabase
          .from('pedidos_compra')
          .select('*');
          
        if (pedidosError) throw pedidosError;
        
        // Calculate total value
        const valorTotal = pedidosData ? pedidosData.reduce((sum, pedido) => sum + pedido.valor_total, 0) : 0;
        
        // Create dashboard data
        const dashboardData: DadosDashboard = {
          resumo_financeiro: {
            estimativa_despesa: municipio?.orcamento_anual || 25000000,
            valor_contratado_total: valorTotal,
            percentual_utilizado: municipio?.orcamento_anual ? (valorTotal / municipio.orcamento_anual) * 100 : 0,
            total_pedidos: pedidosData?.length || 0
          },
          cartoes: [
            {
              titulo: 'Total de Pedidos',
              valor: pedidosData?.length || 0,
              percentual_mudanca: 12.5,
              icon: 'Receipt',
              classe_cor: 'bg-blue-500'
            },
            {
              titulo: 'Orçamento Executado',
              valor: formatCurrency(valorTotal),
              percentual_mudanca: 8.2,
              icon: 'Wallet',
              classe_cor: 'bg-green-500'
            }
          ],
          orcamento_previsto: { 'Trimestre 1': 7000000, 'Trimestre 2': 7500000, 'Trimestre 3': 7000000, 'Trimestre 4': 7000000 },
          gastos_por_setor: {},
          valor_contratado_total: valorTotal,
          pedidos_por_setor: {}
        };
        
        setDadosDashboard(dashboardData);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        toast.error("Não foi possível carregar os dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipio().then(() => fetchPedidos());
  }, []);

  // Efeito para aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [period, filters]);

  const applyFilters = () => {
    // Aplicar filtro de período
    let periodFilteredData = [...monthlyData];
    if (period === 'mensal') {
      // Filtrar para mostrar apenas o mês atual (usando o mês selecionado dos filtros)
      const monthIndex = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                        .findIndex(m => m === filters.month);
      
      if (monthIndex !== -1) {
        const monthShortNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        periodFilteredData = monthlyData.filter(data => data.name === monthShortNames[monthIndex]);
      } else {
        periodFilteredData = monthlyData.slice(0, 1); // Padrão para o primeiro mês se não encontrado
      }
    } else if (period === 'trimestral') {
      // Filtrar por trimestre
      let quarterMonths: string[] = [];
      switch(filters.quarter) {
        case 'Q1':
          quarterMonths = ['Jan', 'Fev', 'Mar'];
          break;
        case 'Q2':
          quarterMonths = ['Abr', 'Mai', 'Jun'];
          break;
        case 'Q3':
          quarterMonths = ['Jul', 'Ago', 'Set'];
          break;
        case 'Q4':
          quarterMonths = ['Out', 'Nov', 'Dez'];
          break;
      }
      periodFilteredData = monthlyData.filter(data => quarterMonths.includes(data.name));
    }
    
    // Aplicar filtro de departamento
    let deptFilteredData = [...departmentData];
    if (filters.department !== 'Todos') {
      deptFilteredData = departmentData.filter(dept => dept.name === filters.department);
    }
    
    setFilteredData(periodFilteredData);
    setFilteredDeptData(deptFilteredData);
  };

  // Valores para os cards de estatísticas
  const totalPedidos = dadosDashboard?.resumo_financeiro.total_pedidos || 0;
  const orcamentoExecutado = dadosDashboard?.valor_contratado_total || 0;
  const pedidosAprovados = dadosDashboard ? Math.floor(dadosDashboard.resumo_financeiro.total_pedidos * 0.75) : 0;
  const secretarias = 15;

  // Handle data export from dashboard
  const handleExportDashboard = () => {
    toast.success('Exportando relatório PDF...');
    
    setTimeout(() => {
      const dashboardData = {
        municipio: municipio?.nome || 'Município',
        totalPedidos,
        orcamentoExecutado,
        pedidosAprovados,
        secretarias,
        orcamentoAnual: municipio?.orcamento_anual || 0,
        data: new Date().toLocaleDateString('pt-BR')
      };
      
      // Use the PDF export function with the current active tab
      exportDashboardAsPDF(dashboardData, activeTab === 'grafico' ? 'orcamento' : 'secretarias', filteredData, filteredDeptData);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in dashboard-view">
      {/* Cabeçalho com informações do município */}
      <DashboardHeader municipio={municipio!} language={language} />
      
      {/* Cards de estatísticas */}
      <DashboardStatCards 
        totalPedidos={totalPedidos}
        orcamentoExecutado={orcamentoExecutado}
        pedidosAprovados={pedidosAprovados}
        secretarias={secretarias}
      />

      {/* Tabs para alternar entre gráficos e resumo */}
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleExportDashboard={handleExportDashboard}
        dadosDashboard={dadosDashboard!}
        municipio={municipio!}
        language={language}
        filteredData={filteredData}
        filteredDeptData={filteredDeptData}
        period={period}
        setPeriod={setPeriod}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

interface DashboardStatCardsProps {
  totalPedidos: number;
  orcamentoExecutado: number;
  pedidosAprovados: number;
  secretarias: number;
}

function DashboardStatCards({ 
  totalPedidos, 
  orcamentoExecutado, 
  pedidosAprovados, 
  secretarias 
}: DashboardStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total de Pedidos"
        value={totalPedidos}
        percentChange={12.5}
        icon={Receipt}
        colorClass="bg-blue-500"
      />
      <StatCard 
        title="Orçamento Executado"
        value={formatCurrency(orcamentoExecutado)}
        percentChange={8.2}
        icon={Wallet}
        colorClass="bg-green-500"
      />
      <StatCard 
        title="Pedidos Aprovados"
        value={pedidosAprovados}
        percentChange={4.3}
        icon={ShoppingCart}
        colorClass="bg-yellow-500"
      />
      <StatCard 
        title="Secretarias"
        value={secretarias}
        percentChange={0}
        icon={Building}
        colorClass="bg-purple-500"
      />
    </div>
  );
}

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleExportDashboard: () => void;
  dadosDashboard: DadosDashboard;
  municipio: Municipio;
  language: string;
  filteredData: any[];
  filteredDeptData: any[];
  period: string;
  setPeriod: (period: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
}

function DashboardTabs({
  activeTab,
  setActiveTab,
  handleExportDashboard,
  dadosDashboard,
  municipio,
  language,
  filteredData,
  filteredDeptData,
  period,
  setPeriod,
  filters,
  setFilters
}: DashboardTabsProps) {
  return (
    <Tabs 
      defaultValue={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="grafico">Gráficos</TabsTrigger>
          <TabsTrigger value="avancado">Analytics Avançado</TabsTrigger>
        </TabsList>
        
        <button
          onClick={handleExportDashboard}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Printer className="h-4 w-4 mr-2" />
          Exportar PDF
        </button>
      </div>
      
      <TabsContent value="grafico" className="space-y-4">
        <DashboardSummary 
          dadosDashboard={dadosDashboard}
          municipio={municipio}
          language={language}
        />
      </TabsContent>
      
      <TabsContent value="avancado">
        <AdvancedAnalytics 
          monthlyData={filteredData} 
          departmentData={filteredDeptData}
          period={period}
          setPeriod={setPeriod}
          filters={filters}
          setFilters={setFilters}
        />
      </TabsContent>
    </Tabs>
  );
}

export default Dashboard;
