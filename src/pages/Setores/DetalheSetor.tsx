
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency, calcularPorcentagem } from '@/utils/formatters';
import { DadosDashboard, Setor } from '@/types';
import { calcularDadosDashboard, obterPedidosPorSetor } from '@/data/mockData';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { HeartPulse, BookOpen, Building2, Bus } from 'lucide-react';
import StatCard from '@/components/Dashboard/StatCard';

const DetalheSetor: React.FC = () => {
  const { setor } = useParams<{ setor: string }>();
  const dadosDashboard = calcularDadosDashboard();
  
  const setorMapeado = useMemo<Setor | undefined>(() => {
    switch (setor) {
      case 'saude':
        return 'Saúde';
      case 'educacao':
        return 'Educação';
      case 'administrativo':
        return 'Administrativo';
      case 'transporte':
        return 'Transporte';
      default:
        return undefined;
    }
  }, [setor]);

  if (!setorMapeado) {
    return <div>Setor não encontrado</div>;
  }

  const pedidos = obterPedidosPorSetor(setorMapeado);
  const totalPedidos = pedidos.length;
  const totalGasto = dadosDashboard.gastosPorSetor[setorMapeado];
  const orcamentoPrevisto = dadosDashboard.orcamentoPrevisto[setorMapeado];
  const percentualGasto = calcularPorcentagem(totalGasto, orcamentoPrevisto);
  const ticketMedio = dadosDashboard.ticketMedioPorSetor[setorMapeado];

  const getSetorIcone = () => {
    switch (setorMapeado) {
      case 'Saúde':
        return <HeartPulse className="h-6 w-6 text-saude-DEFAULT" />;
      case 'Educação':
        return <BookOpen className="h-6 w-6 text-educacao-DEFAULT" />;
      case 'Administrativo':
        return <Building2 className="h-6 w-6 text-administrativo-DEFAULT" />;
      case 'Transporte':
        return <Bus className="h-6 w-6 text-transporte-DEFAULT" />;
      default:
        return null;
    }
  };

  const getSetorCor = () => {
    switch (setorMapeado) {
      case 'Saúde':
        return 'bg-saude-DEFAULT';
      case 'Educação':
        return 'bg-educacao-DEFAULT';
      case 'Administrativo':
        return 'bg-administrativo-DEFAULT';
      case 'Transporte':
        return 'bg-transporte-DEFAULT';
      default:
        return 'bg-blue-500';
    }
  };

  // Preparar dados para os gráficos
  const dadosGraficoGastos = [
    { name: 'Gasto', value: totalGasto },
    { name: 'Disponível', value: orcamentoPrevisto - totalGasto },
  ];

  const CORES_GRAFICO = ['#0ea5e9', '#d1d5db'];

  // Dados simulados para gráfico de tendência
  const dadosTendencia = [
    { mes: 'Jan', valor: 10000 },
    { mes: 'Fev', valor: 15000 },
    { mes: 'Mar', valor: 12000 },
    { mes: 'Abr', valor: 20000 },
    { mes: 'Mai', valor: 18000 },
    { mes: 'Jun', valor: totalGasto * 0.85 },
    { mes: 'Jul', valor: totalGasto * 0.9 },
    { mes: 'Ago', valor: totalGasto * 0.95 },
    { mes: 'Set', valor: totalGasto },
  ];

  const renderizarLabelGrafico = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADS = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADS);
    const y = cy + radius * Math.sin(-midAngle * RADS);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 shadow-lg border rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${getSetorCor()}`}>
          {getSetorIcone()}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Setor de {setorMapeado}</h1>
          <p className="text-muted-foreground">
            Visão geral dos recursos e pedidos do setor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Orçamento Total"
          value={formatCurrency(orcamentoPrevisto)}
          percentChange={10}
          icon="PiggyBank"
          colorClass={getSetorCor()}
        />
        <StatCard
          title="Total Gasto"
          value={formatCurrency(totalGasto)}
          percentChange={percentualGasto > 100 ? -5 : 8}
          icon="Wallet"
          colorClass={getSetorCor()}
        />
        <StatCard
          title="Pedidos de Compra"
          value={totalPedidos}
          percentChange={15}
          icon="ShoppingCart"
          colorClass={getSetorCor()}
        />
        <StatCard
          title="Ticket Médio"
          value={formatCurrency(ticketMedio)}
          percentChange={-3}
          icon="Receipt"
          colorClass={getSetorCor()}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orçamento Utilizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {formatCurrency(totalGasto)} de {formatCurrency(orcamentoPrevisto)}
            </span>
            <span className="text-sm font-medium">{percentualGasto.toFixed(1)}%</span>
          </div>
          <Progress value={percentualGasto > 100 ? 100 : percentualGasto} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="graficos">
        <TabsList className="mb-4">
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graficos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição do Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosGraficoGastos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderizarLabelGrafico}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosGraficoGastos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dadosTendencia}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line
                        type="monotone"
                        dataKey="valor"
                        stroke={
                          setorMapeado === 'Saúde' ? '#0ea5e9' :
                          setorMapeado === 'Educação' ? '#22c55e' :
                          setorMapeado === 'Administrativo' ? '#8b5cf6' :
                          '#f97316'
                        }
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pedidos">
          <PedidosTable 
            pedidos={pedidos} 
            titulo={`Pedidos do Setor de ${setorMapeado}`} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalheSetor;
