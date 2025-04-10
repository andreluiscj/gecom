
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatCard from '@/components/Dashboard/StatCard';
import DashboardSummary from '@/components/Dashboard/DashboardSummary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Receipt, ShoppingCart, Wallet } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import AdvancedAnalytics from '@/components/Dashboard/AdvancedAnalytics';
import { DadosDashboard, Municipio } from '@/types';

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
    orcamentoAnual: 28500000,
    orcamentoUtilizado: 2400000,
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
  gastosTotais: 2400000,
  pedidosPorSetor: {
    'Saúde': 143,
    'Educação': 125,
    'Administrativo': 98,
    'Obras': 87,
    'Transporte': 62,
    'Outros': 72,
  },
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('grafico');
  const [language, setLanguage] = useState('pt'); // Default language is Portuguese
  const [municipio, setMunicipio] = useState<Municipio>(defaultMunicipio);

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

  // Valores para os cards de estatísticas
  const totalPedidos = 587;
  const orcamentoExecutado = municipio.id === 'janauba' ? 12000000 : 2400000;
  const pedidosAprovados = 432;
  const secretarias = 15;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho com informações do município */}
      <DashboardHeader municipio={municipio} language={language} />
      
      {/* Cards de estatísticas */}
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

      {/* Tabs para alternar entre gráficos e resumo */}
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="grafico">Gráficos</TabsTrigger>
          <TabsTrigger value="avancado">Analytics Avançado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grafico" className="space-y-4">
          <DashboardSummary 
            dadosDashboard={dadosDashboard}
            municipio={municipio}
            language={language}
          />
        </TabsContent>
        
        <TabsContent value="avancado">
          <AdvancedAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
