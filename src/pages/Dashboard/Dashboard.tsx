
import React, { useState, useMemo } from 'react';
import { obterDadosDashboard } from '@/data/extended-mockData';
import { formatDate, formatCurrency, formatPercentage } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardStatCards from './components/DashboardStatCards';
import { obterPedidosFicticios } from '@/data/pedidos/mockPedidos';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Setor } from '@/types';

// Palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('resumo');
  const [selectedSecretaria, setSelectedSecretaria] = useState<Setor | null>(null);
  
  const dashboardData = obterDadosDashboard();
  const todosPedidos = obterPedidosFicticios();
  
  // Calcular dados de resumo de forma consistente com outras telas
  const { resumoFinanceiro, gastosPorSetor, orcamentoPrevisto } = dashboardData;
  const percentualUtilizado = resumoFinanceiro.percentualUtilizado;
  
  // Dados reais do sistema
  const pedidosPendentes = useMemo(() => todosPedidos.filter(pedido => pedido.status === 'Pendente').length, [todosPedidos]);
  const pedidosAprovados = useMemo(() => todosPedidos.filter(pedido => pedido.status === 'Aprovado').length, [todosPedidos]);
  const pedidosEmAndamento = useMemo(() => todosPedidos.filter(pedido => pedido.status === 'Em Andamento').length, [todosPedidos]);
  
  // Get all pedidos grouped by department status
  const pedidosPorStatus = useMemo(() => {
    const statusCounts = todosPedidos.reduce((acc, pedido) => {
      acc[pedido.status] = (acc[pedido.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [todosPedidos]);

  // Get all pedidos grouped by department
  const pedidosPorSetor = useMemo(() => {
    const setorCounts = todosPedidos.reduce((acc, pedido) => {
      acc[pedido.setor] = (acc[pedido.setor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(setorCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [todosPedidos]);

  // Create data for department budget comparison
  const dadosOrcamento = useMemo(() => {
    return Object.entries(orcamentoPrevisto)
      .map(([nome, previsto]) => {
        const realizado = gastosPorSetor[nome] || 0;
        const percentual = previsto > 0 ? (realizado / previsto) * 100 : 0;
        return {
          nome,
          previsto,
          realizado,
          percentual
        };
      })
      .sort((a, b) => b.realizado - a.realizado)
      .slice(0, 5);
  }, [orcamentoPrevisto, gastosPorSetor]);

  // Filter orders based on selected department
  const filteredPedidos = useMemo(() => {
    if (!selectedSecretaria) return [];
    return todosPedidos.filter(pedido => pedido.setor === selectedSecretaria);
  }, [todosPedidos, selectedSecretaria]);
  
  // Department budget progress
  const departmentProgress = useMemo(() => {
    if (!selectedSecretaria) return { percentual: 0, previsto: 0, realizado: 0 };
    const previsto = orcamentoPrevisto[selectedSecretaria] || 0;
    const realizado = gastosPorSetor[selectedSecretaria] || 0;
    const percentual = previsto > 0 ? (realizado / previsto) * 100 : 0;
    return { percentual, previsto, realizado };
  }, [selectedSecretaria, orcamentoPrevisto, gastosPorSetor]);

  // List of all departments for tabs
  const secretarias: Setor[] = [
    'Saúde', 'Educação', 'Administrativo', 'Transporte', 
    'Obras', 'Segurança Pública', 'Assistência Social', 
    'Meio Ambiente', 'Fazenda', 'Turismo', 'Cultura', 
    'Esportes e Lazer', 'Planejamento', 'Comunicação', 
    'Ciência e Tecnologia'
  ];

  // Determine if the budget is at risk
  const orcamentoEmRisco = percentualUtilizado > 70;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da gestão municipal e acompanhamento de indicadores
        </p>
      </div>

      {orcamentoEmRisco && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            O orçamento utilizado está em {formatPercentage(percentualUtilizado)}, considere revisar os gastos previstos.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="resumo" className="space-y-4" onValueChange={setSelectedTab}>
        <TabsList className="grid sm:grid-cols-3 md:grid-cols-5 gap-2">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="secretarias">Secretarias</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo" className="space-y-6">
          <DashboardStatCards 
            cartoes={[
              {
                titulo: "Total de Pedidos",
                valor: todosPedidos.length.toString(),
                percentualMudanca: 12.5,
                icon: "ShoppingCart",
                classeCor: "bg-blue-500",
              },
              {
                titulo: "Pedidos Pendentes",
                valor: pedidosPendentes.toString(),
                percentualMudanca: 8.2,
                icon: "Receipt",
                classeCor: "bg-yellow-500",
              },
              {
                titulo: "Pedidos Aprovados",
                valor: pedidosAprovados.toString(),
                percentualMudanca: 5.7,
                icon: "Wallet",
                classeCor: "bg-green-500",
              },
              {
                titulo: "Pedidos em Andamento",
                valor: pedidosEmAndamento.toString(),
                percentualMudanca: -3.4,
                icon: "Building",
                classeCor: "bg-purple-500",
              },
            ]}
          />
          
          {/* Resumo Orçamentário em tela cheia */}
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Resumo Orçamentário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Orçamento Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(resumoFinanceiro.orcamentoAnual)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Utilizado</p>
                  <p className="text-2xl font-bold">{formatCurrency(resumoFinanceiro.orcamentoUtilizado)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Disponível</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(resumoFinanceiro.orcamentoAnual - resumoFinanceiro.orcamentoUtilizado)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold flex items-center">
                    {percentualUtilizado > 90 ? (
                      <>
                        <TrendingUp className="h-6 w-6 text-red-500 mr-2" />
                        <span className="text-red-500">Crítico</span>
                      </>
                    ) : percentualUtilizado > 70 ? (
                      <>
                        <TrendingUp className="h-6 w-6 text-yellow-500 mr-2" />
                        <span className="text-yellow-500">Atenção</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-6 w-6 text-green-500 mr-2" />
                        <span className="text-green-500">Saudável</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Utilização do Orçamento</span>
                  <span className="text-sm font-bold">{formatPercentage(percentualUtilizado)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                  <div 
                    className={`h-4 rounded-full ${
                      percentualUtilizado > 90 
                        ? 'bg-red-500' 
                        : percentualUtilizado > 70 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`} 
                    style={{ width: `${percentualUtilizado}%` }}
                  ></div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Gastos por Categoria</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm">Pessoal</dt>
                          <dd className="text-sm font-medium">{formatCurrency(resumoFinanceiro.orcamentoUtilizado * 0.45)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Custeio</dt>
                          <dd className="text-sm font-medium">{formatCurrency(resumoFinanceiro.orcamentoUtilizado * 0.30)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Investimentos</dt>
                          <dd className="text-sm font-medium">{formatCurrency(resumoFinanceiro.orcamentoUtilizado * 0.25)}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Maiores Despesas</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm">Saúde</dt>
                          <dd className="text-sm font-medium">{formatCurrency(dashboardData.gastosPorSetor['Saúde'] || 0)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Educação</dt>
                          <dd className="text-sm font-medium">{formatCurrency(dashboardData.gastosPorSetor['Educação'] || 0)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Infraestrutura</dt>
                          <dd className="text-sm font-medium">{formatCurrency(dashboardData.gastosPorSetor['Obras'] || 0)}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Previsões</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm">Saldo Final Previsto</dt>
                          <dd className="text-sm font-medium text-green-600">
                            {formatCurrency(resumoFinanceiro.orcamentoAnual * 0.15)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Economia Projetada</dt>
                          <dd className="text-sm font-medium text-blue-600">5%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Orçamento Próximo Ano</dt>
                          <dd className="text-sm font-medium">
                            {formatCurrency(resumoFinanceiro.orcamentoAnual * 1.07)}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graficos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Pedidos por Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pedidosPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pedidosPorStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Secretarias por Pedidos</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={pedidosPorSetor}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Pedidos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top 5 Secretarias por Orçamento Realizado</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={dadosOrcamento}
                    margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, '']} />
                    <Legend />
                    <Bar dataKey="previsto" name="Orçamento Previsto" fill="#82ca9d" />
                    <Bar dataKey="realizado" name="Realizado" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Painel Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Distribuição do Orçamento</CardTitle>
                  </CardHeader>
                  <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(gastosPorSetor)
                            .filter(([_, valor]) => valor > 0)
                            .map(([nome, valor]) => ({ name: nome, value: valor }))
                            .sort((a, b) => b.value - a.value)
                            .slice(0, 7)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name.substring(0, 8)}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pedidosPorStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Valor']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Execução Orçamentária</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total</span>
                          <span className="font-medium">{formatPercentage(percentualUtilizado)}</span>
                        </div>
                        <Progress value={percentualUtilizado} 
                          className="h-2"
                          color={`${percentualUtilizado > 90 ? 'bg-red-500' : percentualUtilizado > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        />
                      </div>
                      {dadosOrcamento.slice(0, 5).map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.nome}</span>
                            <span className="font-medium">{formatPercentage(item.percentual)}</span>
                          </div>
                          <Progress value={item.percentual} 
                            className="h-2"
                            color={`${item.percentual > 90 ? 'bg-red-500' : item.percentual > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatCurrency(item.realizado)}</span>
                            <span>de {formatCurrency(item.previsto)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pedidos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Painel de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Status dos Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pedidosPorStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {pedidosPorStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Últimos Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Setor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {todosPedidos
                            .sort((a, b) => b.dataCompra.getTime() - a.dataCompra.getTime())
                            .slice(0, 5)
                            .map((pedido) => (
                              <TableRow key={pedido.id}>
                                <TableCell className="font-medium">{pedido.descricao}</TableCell>
                                <TableCell>{pedido.setor}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs 
                                    ${pedido.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 
                                      pedido.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                                      pedido.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 
                                      pedido.status === 'Concluído' ? 'bg-purple-100 text-purple-800' : 
                                      'bg-gray-100 text-gray-800'}`}
                                  >
                                    {pedido.status}
                                  </span>
                                </TableCell>
                                <TableCell>{formatCurrency(pedido.valorTotal)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="secretarias" className="space-y-4">
          <Tabs defaultValue="Saúde" className="w-full">
            <div className="mb-4 overflow-x-auto">
              <TabsList className="flex gap-2 pb-2">
                {secretarias.map((secretaria) => (
                  <TabsTrigger 
                    key={secretaria}
                    value={secretaria}
                    onClick={() => setSelectedSecretaria(secretaria)}
                  >
                    {secretaria}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {secretarias.map((secretaria) => (
              <TabsContent key={secretaria} value={secretaria} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{secretaria}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Progresso do orçamento */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Execução Orçamentária</h3>
                        
                        <div className="flex justify-between mb-1 text-sm font-medium">
                          <div>Orçamento Utilizado</div>
                          <div>{formatPercentage(departmentProgress.percentual)}</div>
                        </div>
                        
                        <Progress 
                          value={departmentProgress.percentual} 
                          className="h-3"
                          color={`${departmentProgress.percentual > 90 ? 'bg-red-500' : departmentProgress.percentual > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        />
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Utilizado: {formatCurrency(departmentProgress.realizado)}</span>
                          <span>Orçamento Total: {formatCurrency(departmentProgress.previsto)}</span>
                        </div>
                      </div>

                      {/* Gráficos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Status dos Pedidos</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={filteredPedidos.reduce((acc, pedido) => {
                                    const status = pedido.status;
                                    const existingStatus = acc.find(item => item.name === status);
                                    if (existingStatus) {
                                      existingStatus.value += 1;
                                    } else {
                                      acc.push({ name: status, value: 1 });
                                    }
                                    return acc;
                                  }, [] as { name: string, value: number }[])}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {pedidosPorStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Valor dos Pedidos por Mês</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart 
                                data={
                                  filteredPedidos
                                    .sort((a, b) => a.dataCompra.getTime() - b.dataCompra.getTime())
                                    .reduce((acc, pedido) => {
                                      const month = pedido.dataCompra.toLocaleDateString('pt-BR', { month: 'short' });
                                      const existingMonth = acc.find(item => item.name === month);
                                      if (existingMonth) {
                                        existingMonth.value += pedido.valorTotal;
                                      } else {
                                        acc.push({ name: month, value: pedido.valorTotal });
                                      }
                                      return acc;
                                    }, [] as { name: string, value: number }[])
                                }
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Valor']} />
                                <Bar dataKey="value" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Tabela de pedidos */}
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Pedidos da Secretaria</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Descrição</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Valor</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPedidos.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                  Nenhum pedido encontrado para esta secretaria.
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredPedidos.map((pedido) => (
                                <TableRow key={pedido.id}>
                                  <TableCell className="font-medium">{pedido.descricao}</TableCell>
                                  <TableCell>{pedido.dataCompra.toLocaleDateString('pt-BR')}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs 
                                      ${pedido.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 
                                        pedido.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                                        pedido.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 
                                        pedido.status === 'Concluído' ? 'bg-purple-100 text-purple-800' : 
                                        'bg-gray-100 text-gray-800'}`}
                                    >
                                      {pedido.status}
                                    </span>
                                  </TableCell>
                                  <TableCell>{formatCurrency(pedido.valorTotal)}</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
