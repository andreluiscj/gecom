
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, calcularPorcentagem } from '@/utils/formatters';
import { Setor, PedidoCompra } from '@/types';
import { obterDadosDashboard } from '@/data/extended-mockData';
import { obterPedidosFicticios } from '@/data/pedidos/mockPedidos';
import { formatarData } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HeartPulse, BookOpen, Building2, Bus, Shield, Heart,
  Leaf, Coins, Briefcase, Music, Globe, Award, PieChart as PieChartIcon,
  Radio, MapPin, Eye, BarChart3, List as ListIcon, FileText
} from 'lucide-react';
import { getSetorIcon, getSetorColor } from '@/utils/iconHelpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const DetalheSetor: React.FC = () => {
  const { setor } = useParams<{ setor: string }>();
  const dadosDashboard = obterDadosDashboard();
  const todosPedidos = obterPedidosFicticios();
  
  interface SetorDefinition {
    id: string;
    titulo: Setor;
    icone: React.ReactNode;
    colorClass: string;
  }

  const SETORES_CONFIG: SetorDefinition[] = [
    {
      id: 'saude',
      titulo: 'Saúde',
      icone: <HeartPulse className="h-6 w-6 text-white" />,
      colorClass: 'bg-saude-DEFAULT',
    },
    {
      id: 'educacao',
      titulo: 'Educação',
      icone: <BookOpen className="h-6 w-6 text-white" />,
      colorClass: 'bg-educacao-DEFAULT',
    },
    {
      id: 'administrativo',
      titulo: 'Administrativo',
      icone: <Building2 className="h-6 w-6 text-white" />,
      colorClass: 'bg-administrativo-DEFAULT',
    },
    {
      id: 'transporte',
      titulo: 'Transporte',
      icone: <Bus className="h-6 w-6 text-white" />,
      colorClass: 'bg-transporte-DEFAULT',
    },
    {
      id: 'obras',
      titulo: 'Obras',
      icone: <Briefcase className="h-6 w-6 text-white" />,
      colorClass: 'bg-blue-500',
    },
    {
      id: 'seguranca',
      titulo: 'Segurança Pública',
      icone: <Shield className="h-6 w-6 text-white" />,
      colorClass: 'bg-red-500',
    },
    {
      id: 'social',
      titulo: 'Assistência Social',
      icone: <Heart className="h-6 w-6 text-white" />,
      colorClass: 'bg-purple-500',
    },
    {
      id: 'ambiente',
      titulo: 'Meio Ambiente',
      icone: <Leaf className="h-6 w-6 text-white" />,
      colorClass: 'bg-green-500',
    },
    {
      id: 'fazenda',
      titulo: 'Fazenda',
      icone: <Coins className="h-6 w-6 text-white" />,
      colorClass: 'bg-yellow-600',
    },
    {
      id: 'turismo',
      titulo: 'Turismo',
      icone: <Globe className="h-6 w-6 text-white" />,
      colorClass: 'bg-cyan-500',
    },
    {
      id: 'cultura',
      titulo: 'Cultura',
      icone: <Music className="h-6 w-6 text-white" />,
      colorClass: 'bg-pink-500',
    },
    {
      id: 'esportes',
      titulo: 'Esportes e Lazer',
      icone: <Award className="h-6 w-6 text-white" />,
      colorClass: 'bg-orange-500',
    },
    {
      id: 'planejamento',
      titulo: 'Planejamento',
      icone: <PieChartIcon className="h-6 w-6 text-white" />,
      colorClass: 'bg-indigo-500',
    },
    {
      id: 'comunicacao',
      titulo: 'Comunicação',
      icone: <Radio className="h-6 w-6 text-white" />,
      colorClass: 'bg-blue-400',
    },
    {
      id: 'ciencia',
      titulo: 'Ciência e Tecnologia',
      icone: <MapPin className="h-6 w-6 text-white" />,
      colorClass: 'bg-teal-500',
    },
  ];
  
  const setorConfig = useMemo(() => SETORES_CONFIG.find(s => s.id === setor), [setor]);

  if (!setorConfig) {
    return <div>Setor não encontrado</div>;
  }

  // Get actual pedidos for this setor from the system
  const pedidos = todosPedidos.filter(p => p.setor === setorConfig.titulo);
  const totalPedidos = pedidos.length;

  // Only calculate budget data if there are pedidos for this setor
  const orcamentoPrevisto = dadosDashboard.orcamentoPrevisto?.[setorConfig.titulo] || 0;
  const totalGasto = dadosDashboard.gastosPorSetor?.[setorConfig.titulo] || 0;
  const percentualGasto = calcularPorcentagem(totalGasto, orcamentoPrevisto);
  
  // Calculate status distribution for pedidos
  const pedidosPorStatus = pedidos.reduce((acc, pedido) => {
    acc[pedido.status] = (acc[pedido.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusChartData = Object.entries(pedidosPorStatus).map(([name, value]) => ({ name, value }));
  
  // Generate monthly spending data
  const gastosPortMes = pedidos.reduce((acc, pedido) => {
    const mes = pedido.dataCompra.toLocaleDateString('pt-BR', { month: 'short' });
    acc[mes] = (acc[mes] || 0) + pedido.valorTotal;
    return acc;
  }, {} as Record<string, number>);
  
  const gastosChartData = Object.entries(gastosPortMes).map(([name, value]) => ({ name, value }));
  
  // Generate category distribution data
  const categorias = ['Material Permanente', 'Material de Consumo', 'Serviços', 'Outros'];
  const pedidosPorCategoria = pedidos.reduce((acc, pedido, index) => {
    // This is a simplified example, in a real app you'd have actual categories
    const categoria = categorias[index % categorias.length];
    acc[categoria] = (acc[categoria] || 0) + pedido.valorTotal;
    return acc;
  }, {} as Record<string, number>);
  
  const categoriasChartData = Object.entries(pedidosPorCategoria).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${setorConfig.colorClass}`}>
          {setorConfig.icone}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Secretária de {setorConfig.titulo}</h1>
          <p className="text-muted-foreground">
            Visão geral dos recursos e demandas da secretária
          </p>
        </div>
      </div>

      <Tabs defaultValue="resumo" className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="resumo" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumo
          </TabsTrigger>
          <TabsTrigger value="processos" className="flex items-center gap-2">
            <ListIcon className="h-4 w-4" />
            Processos
          </TabsTrigger>
          <TabsTrigger value="detalhes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Detalhes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo" className="space-y-6">
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
              <Progress 
                value={percentualGasto > 100 ? 100 : percentualGasto} 
                className="h-2" 
                color={percentualGasto > 90 ? "bg-red-500" : percentualGasto > 70 ? "bg-yellow-500" : ""}
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {statusChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Sem dados disponíveis
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gastos por Mês</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {gastosChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={gastosChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Valor']} />
                      <Bar dataKey="value" fill="#8884d8" name="Valor" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Sem dados disponíveis
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {categoriasChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoriasChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Valor']} />
                      <Bar dataKey="value" fill="#82ca9d" name="Valor" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Sem dados disponíveis
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="processos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>DFDs da Secretária de {setorConfig.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              {totalPedidos > 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    {totalPedidos} {totalPedidos === 1 ? 'pedido' : 'pedidos'} de compra registrado(s)
                  </p>
                  <div className="divide-y">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{pedido.descricao}</h3>
                            <div className="flex mt-1 text-sm text-muted-foreground space-x-4">
                              <span>Data: {formatarData(pedido.dataCompra)}</span>
                              <span>Valor: {formatCurrency(pedido.valorTotal)}</span>
                              {pedido.status && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  pedido.status === 'Aprovado' || pedido.status === 'Concluído' 
                                    ? 'bg-green-100 text-green-800' 
                                    : pedido.status === 'Rejeitado' 
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {pedido.status}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link to={`/pedidos/${pedido.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              Visualizar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum pedido de compra registrado para esta secretária
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detalhes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes Orçamentários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-4">Resumo Orçamentário</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orçamento Total</span>
                      <span className="font-medium">{formatCurrency(orcamentoPrevisto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gasto Atual</span>
                      <span className="font-medium">{formatCurrency(totalGasto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo Disponível</span>
                      <span className="font-medium">{formatCurrency(orcamentoPrevisto - totalGasto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Percentual Utilizado</span>
                      <span className="font-medium">{percentualGasto.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-4">Status de Processos</h3>
                  <div className="space-y-4">
                    {Object.entries(pedidosPorStatus).map(([status, count], index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-muted-foreground">{status}</span>
                        <span className="font-medium">{count} pedido(s)</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Total de Processos</span>
                      <span className="font-medium">{totalPedidos}</span>
                    </div>
                  </div>
                </div>
              </div>

              {totalPedidos > 0 && (
                <div className="mt-8">
                  <h3 className="font-medium text-lg mb-4">Tabela de Pedidos</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidos.map((pedido) => (
                        <TableRow key={pedido.id}>
                          <TableCell className="font-medium">{pedido.id.substring(0, 8)}</TableCell>
                          <TableCell>{pedido.descricao}</TableCell>
                          <TableCell>{formatarData(pedido.dataCompra)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              pedido.status === 'Aprovado' || pedido.status === 'Concluído' 
                                ? 'bg-green-100 text-green-800' 
                                : pedido.status === 'Rejeitado' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pedido.status}
                            </span>
                          </TableCell>
                          <TableCell>{formatCurrency(pedido.valorTotal)}</TableCell>
                          <TableCell className="text-right">
                            <Link to={`/pedidos/${pedido.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalheSetor;
