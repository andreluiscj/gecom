import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatCard from '@/components/Dashboard/StatCard';
import DashboardSummary from '@/components/Dashboard/DashboardSummary';
import { Building, Printer, Receipt, ShoppingCart, Wallet } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import AdvancedAnalytics from '@/components/Dashboard/AdvancedAnalytics';
import { DadosDashboard, Municipio } from '@/types';
import { toast } from 'sonner';
import { exportDashboardAsPDF } from '@/utils/pdfGenerator';
import { getUserRole, getUserSetor, shouldFilterByUserSetor } from '@/utils/authHelpers';

// Default municipality object
const defaultMunicipio: Municipio = {
  id: 'pai-pedro',
  nome: 'Pai Pedro',
  estado: 'MG',
  populacao: 6083,
  orcamento: 28500000,
  orcamentoAnual: 28500000,
  prefeito: 'Maria Silva',
};

// Sample dashboard data
const dadosDashboard: DadosDashboard = {
  resumoFinanceiro: {
    estimativaDespesa: 28500000,
    valorContratadoTotal: 2400000,
    percentualUtilizado: 8.42,
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
      valor: formatCurrency(2400000),
      percentualMudanca: 8.2,
      icon: 'Wallet',
      classeCor: 'bg-green-500',
    },
  ],
  orcamentoPrevisto: { 'Trimestre 1': 7000000, 'Trimestre 2': 7500000, 'Trimestre 3': 7000000, 'Trimestre 4': 7000000 },
  gastosPorSetor: {
    'Saúde': 800000,
    'Educação': 650000,
    'Administrativo': 350000,
    'Obras': 430000,
    'Transporte': 170000,
  },
  valorContratadoTotal: 2400000,
  pedidosPorSetor: {
    'Saúde': 143,
    'Educação': 125,
    'Administrativo': 98,
    'Obras': 87,
    'Transporte': 62,
    'Outros': 72,
  },
  indicadoresDesempenho: {
    tempoMedioConclusao: 45,
    percentualEconomia: 12.5,
  },
};

// Data for monthly charts
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

// Data for department analysis
const departmentData = [
  { name: 'Saúde', valor: 1850000, percent: 28 },
  { name: 'Educação', valor: 1520000, percent: 23 },
  { name: 'Administração', valor: 950000, percent: 14 },
  { name: 'Obras', valor: 1200000, percent: 18 },
  { name: 'Transporte', valor: 650000, percent: 10 },
  { name: 'Outros', valor: 450000, percent: 7 },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grafico');
  const [language, setLanguage] = useState('pt'); // Default language is Portuguese
  const [municipio, setMunicipio] = useState<Municipio>(defaultMunicipio);
  const [filteredData, setFilteredData] = useState(monthlyData);
  const [filteredDeptData, setFilteredDeptData] = useState(departmentData);
  const [period, setPeriod] = useState('anual');
  const [filters, setFilters] = useState({
    year: '2024',
    quarter: 'Q2',
    month: 'Junho',
    department: 'Todos'
  });
  
  // Get user information for filtering
  const userRole = getUserRole();
  const userSetor = getUserSetor();
  const shouldFilter = shouldFilterByUserSetor();
  
  // Filtered dashboard data based on user's secretaria
  const [filteredDashboardData, setFilteredDashboardData] = useState(dadosDashboard);

  // Effect to load selected municipality
  useEffect(() => {
    const municipioId = localStorage.getItem('municipio-selecionado');
    if (municipioId === 'janauba') {
      setMunicipio({
        id: 'janauba',
        nome: 'Janaúba',
        estado: 'MG',
        populacao: 72018,
        orcamento: 145300000,
        orcamentoAnual: 145300000,
        prefeito: 'José Santos',
      });
    }
  }, []);

  // Effect to apply filters
  useEffect(() => {
    applyFilters();
  }, [period, filters, userSetor, shouldFilter]);
  
  // Effect to filter dashboard data by user's department
  useEffect(() => {
    if (shouldFilter && userSetor) {
      // If user should only see their department data
      const filteredData = filterDashboardDataBySetor(dadosDashboard, userSetor);
      setFilteredDashboardData(filteredData);
      
      // Force department filter to user's department
      setFilters(prev => ({...prev, department: userSetor}));
    } else {
      // Admin and prefeito see all data
      setFilteredDashboardData(dadosDashboard);
    }
  }, [userSetor, shouldFilter]);

  // Function to filter dashboard data by secretaria/department
  const filterDashboardDataBySetor = (data: DadosDashboard, setor: string): DadosDashboard => {
    // Create a copy to not modify the original
    const filtered = {...data};
    
    // Filter gastosPorSetor to only include user's department
    const filteredGastos: Record<string, number> = {};
    if (data.gastosPorSetor[setor]) {
      filteredGastos[setor] = data.gastosPorSetor[setor];
    }
    
    // Filter pedidosPorSetor to only include user's department
    const filteredPedidos: Record<string, number> = {};
    if (data.pedidosPorSetor[setor]) {
      filteredPedidos[setor] = data.pedidosPorSetor[setor];
    }
    
    // Update the data
    filtered.gastosPorSetor = filteredGastos;
    filtered.pedidosPorSetor = filteredPedidos;
    
    // Also update total contracted value to reflect only this department
    filtered.valorContratadoTotal = filteredGastos[setor] || 0;
    
    return filtered;
  };

  const applyFilters = () => {
    // Apply period filter
    let periodFilteredData = [...monthlyData];
    if (period === 'mensal') {
      // Filter to show only current month (using the selected month from filters)
      const monthIndex = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                        .findIndex(m => m === filters.month);
      
      if (monthIndex !== -1) {
        const monthShortNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        periodFilteredData = monthlyData.filter(data => data.name === monthShortNames[monthIndex]);
      } else {
        periodFilteredData = monthlyData.slice(0, 1); // Default to first month if not found
      }
    } else if (period === 'trimestral') {
      // Filter by quarter
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
    
    // Apply department filter (if regular user, force to their department)
    let deptFilteredData = [...departmentData];
    const selectedDepartment = shouldFilter && userSetor ? userSetor : filters.department;
    
    if (selectedDepartment !== 'Todos') {
      deptFilteredData = departmentData.filter(dept => dept.name === selectedDepartment);
    }
    
    setFilteredData(periodFilteredData);
    setFilteredDeptData(deptFilteredData);
  };

  // Calculate values for the stats cards based on filtered data if needed
  const calculateTotalPedidos = () => {
    if (shouldFilter && userSetor) {
      return filteredDashboardData.pedidosPorSetor[userSetor] || 0;
    }
    return 587; // Default total
  };

  const calculateOrcamentoExecutado = () => {
    if (shouldFilter && userSetor) {
      return filteredDashboardData.gastosPorSetor[userSetor] || 0;
    }
    return municipio.id === 'janauba' ? 12000000 : 2400000;
  };

  // Values for the stats cards
  const totalPedidos = calculateTotalPedidos();
  const orcamentoExecutado = calculateOrcamentoExecutado();
  const pedidosAprovados = shouldFilter && userSetor ? Math.floor(totalPedidos * 0.75) : 432; // approx 75% of total
  const secretarias = shouldFilter ? 1 : 15;

  // Handle data export from dashboard
  const handleExportDashboard = () => {
    toast.success('Exportando relatório PDF...');
    
    const dashboardData = {
      municipio: municipio.nome,
      totalPedidos,
      orcamentoExecutado,
      pedidosAprovados,
      secretarias,
      orcamentoAnual: municipio.orcamentoAnual,
      data: new Date().toLocaleDateString('pt-BR')
    };
    
    // Use the PDF export function with the current active tab
    exportDashboardAsPDF(dashboardData, activeTab, filteredData, filteredDeptData);
  };

  return (
    <div className="space-y-6 animate-fade-in dashboard-view">
      {/* Cabeçalho com informações do município */}
      <DashboardHeader municipio={municipio} language={language} />
      
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
        dadosDashboard={filteredDashboardData}
        municipio={municipio}
        language={language}
        filteredData={filteredData}
        filteredDeptData={filteredDeptData}
        period={period}
        setPeriod={setPeriod}
        filters={filters}
        setFilters={setFilters}
        shouldFilter={shouldFilter}
        userSetor={userSetor}
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
  shouldFilter?: boolean;
  userSetor?: string | null;
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
  setFilters,
  shouldFilter,
  userSetor
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
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
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
