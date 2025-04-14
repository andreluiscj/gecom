
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart } from 'lucide-react';
import { PedidoCompra, Setor, DadosDashboard } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { getPedidosPorSetor } from '@/services/pedidoService';
import { obterDadosDashboard } from '@/services/dashboardService';
import { toast } from 'sonner';
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DetalheSetor: React.FC = () => {
  const { setor } = useParams<{ setor: string }>();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [dadosDashboard, setDadosDashboard] = useState<DadosDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const [orcamentoPrevisto, setOrcamentoPrevisto] = useState<Record<string, number>>({});
  const [gastosPorSetor, setGastosPorSetor] = useState<Record<string, number>>({});

  useEffect(() => {
    const carregarDados = async () => {
      if (!setor) return;

      try {
        setIsLoading(true);

        // Load pedidos for this setor
        const pedidosData = await getPedidosPorSetor(setor as Setor);
        setPedidos(pedidosData);
        
        // Load dashboard data
        const dashboardData = await obterDadosDashboard();
        setDadosDashboard(dashboardData);
        
        // Extract specific data
        setOrcamentoPrevisto(dashboardData.orcamentoPrevisto);
        setGastosPorSetor(dashboardData.gastosPorSetor);
      } catch (error) {
        console.error('Erro ao carregar dados do setor:', error);
        toast.error('Erro ao carregar dados do setor');
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [setor]);

  // Calculate total value of pedidos for this setor
  const totalPedidos = pedidos.reduce((total, pedido) => total + pedido.valorTotal, 0);
  
  // Calculate metrics
  const totalGasto = pedidos
    .filter((pedido) => pedido.status === 'Concluído' || pedido.status === 'Aprovado')
    .reduce((total, pedido) => total + pedido.valorTotal, 0);
    
  const totalEmAnalise = pedidos
    .filter((pedido) => pedido.status === 'Em Análise' || pedido.status === 'Em Andamento')
    .reduce((total, pedido) => total + pedido.valorTotal, 0);
    
  const totalPendente = pedidos
    .filter((pedido) => pedido.status === 'Pendente')
    .reduce((total, pedido) => total + pedido.valorTotal, 0);
    
  // Calculate budget usage
  const orcamentoSetor = orcamentoPrevisto[setor || ''] || 0;
  const percentualUtilizado = orcamentoSetor > 0 ? (totalGasto / orcamentoSetor) * 100 : 0;

  // Prepare chart data
  const prepareDataForStatusChart = () => {
    return [
      { name: 'Aprovado/Concluído', valor: totalGasto },
      { name: 'Em Análise', valor: totalEmAnalise },
      { name: 'Pendente', valor: totalPendente },
    ];
  };

  const prepareDataForBudgetChart = () => {
    return [
      { name: 'Orçamento Restante', valor: Math.max(0, orcamentoSetor - totalGasto) },
      { name: 'Utilizado', valor: totalGasto },
    ];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando dados do setor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">{setor}</h1>
        <p className="text-muted-foreground">
          Detalhes, estatísticas e pedidos do setor
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="pedidos" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Pedidos
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Orçamento Total</CardDescription>
                <CardTitle className="text-2xl">
                  {formatCurrency(orcamentoSetor)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Para o ano corrente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Valor Comprometido</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(totalGasto)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Em pedidos aprovados/concluídos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total de Pedidos</CardDescription>
                <CardTitle className="text-2xl">{pedidos.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Em todos os status
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Utilização do Orçamento</CardTitle>
              <CardDescription>
                {percentualUtilizado.toFixed(1)}% do orçamento comprometido
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareDataForBudgetChart()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="valor"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareDataForBudgetChart().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>
                Valor total de pedidos por status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={prepareDataForStatusChart()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        formatCurrency(value).replace('R$', '')
                      }
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Bar dataKey="valor" fill="#3b82f6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pedidos Tab */}
        <TabsContent value="pedidos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos de Compra</CardTitle>
              <CardDescription>
                Listagem de todos os pedidos do setor {setor}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pedidos.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            #{pedido.id.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pedido.descricao}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pedido.dataCompra.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {formatCurrency(pedido.valorTotal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                pedido.status === 'Aprovado' || pedido.status === 'Concluído'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : pedido.status === 'Pendente'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}
                            >
                              {pedido.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              variant="link"
                              onClick={() => navigate(`/pedidos/visualizar/${pedido.id}`)}
                            >
                              Visualizar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum pedido encontrado para este setor.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => navigate('/pedidos/novo')}>
              Novo Pedido de Compra
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalheSetor;
