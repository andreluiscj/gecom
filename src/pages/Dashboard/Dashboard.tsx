
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatCard from '@/components/Dashboard/StatCard';
import DashboardSummary from '@/components/Dashboard/DashboardSummary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Receipt, ShoppingCart, Wallet } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import AdvancedAnalytics from '@/components/Dashboard/AdvancedAnalytics';

const municipio = {
  id: 1,
  nome: 'Novo Horizonte',
  estado: 'SP',
  populacao: 36593,
  logo: '/logo-municipio.png',
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('grafico');

  // Valores para os cards de estatísticas
  const totalPedidos = 587;
  const orcamentoExecutado = 4450000;
  const pedidosAprovados = 432;
  const secretarias = 15;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho com informações do município */}
      <DashboardHeader municipio={municipio} />
      
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
          <DashboardSummary />
        </TabsContent>
        
        <TabsContent value="avancado">
          <AdvancedAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
