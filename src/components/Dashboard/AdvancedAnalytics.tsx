
import React, { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Download, FileBarChart, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';

// Dados simulados para os gráficos
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

const departmentData = [
  { name: 'Saúde', valor: 1850000, percent: 28 },
  { name: 'Educação', valor: 1520000, percent: 23 },
  { name: 'Administração', valor: 950000, percent: 14 },
  { name: 'Obras', valor: 1200000, percent: 18 },
  { name: 'Transporte', valor: 650000, percent: 10 },
  { name: 'Outros', valor: 450000, percent: 7 },
];

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d',
  '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

const AdvancedAnalytics: React.FC = () => {
  const [period, setPeriod] = useState('anual');
  const [chartType, setChartType] = useState('area');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Análise Orçamentária Avançada</h2>
          <p className="text-muted-foreground">
            Comparativo entre valores planejados e executados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orcamento" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
          <TabsTrigger value="secretarias">Por Secretarias</TabsTrigger>
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orcamento" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Planejado
                </CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(4530000)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação ao ano anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Executado
                </CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(4455000)}
                </div>
                <p className="text-xs text-muted-foreground">
                  98.3% do orçamento planejado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Economia
                </CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(75000)}
                </div>
                <p className="text-xs text-muted-foreground">
                  1.7% abaixo do orçamento planejado
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Comparativo: Planejado vs Executado</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={chartType === 'area' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('area')}
                  >
                    Área
                  </Button>
                  <Button 
                    variant={chartType === 'bar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    Barras
                  </Button>
                  <Button 
                    variant={chartType === 'line' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    Linha
                  </Button>
                </div>
              </div>
              <CardDescription>
                Visualize a diferença entre valores orçados e executados ao longo do período
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        value >= 1000000 
                          ? `${(value / 1000000).toFixed(1)}M` 
                          : `${(value / 1000).toFixed(0)}K`
                      } 
                    />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="planejado" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                      name="Planejado"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="executado" 
                      stroke="#82ca9d" 
                      fill="#82ca9d"
                      fillOpacity={0.3}
                      name="Executado"
                    />
                  </AreaChart>
                ) : chartType === 'bar' ? (
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        value >= 1000000 
                          ? `${(value / 1000000).toFixed(1)}M` 
                          : `${(value / 1000).toFixed(0)}K`
                      } 
                    />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="planejado" fill="#8884d8" name="Planejado" />
                    <Bar dataKey="executado" fill="#82ca9d" name="Executado" />
                  </BarChart>
                ) : (
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        value >= 1000000 
                          ? `${(value / 1000000).toFixed(1)}M` 
                          : `${(value / 1000).toFixed(0)}K`
                      } 
                    />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="planejado" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Planejado"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="executado" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Executado"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="secretarias" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Secretaria</CardTitle>
                <CardDescription>
                  Percentual do orçamento por secretaria
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="valor"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Gastos por Secretaria</CardTitle>
                <CardDescription>
                  Comparativo de valores executados
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={departmentData}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => 
                        value >= 1000000 
                          ? `${(value / 1000000).toFixed(1)}M` 
                          : `${(value / 1000).toFixed(0)}K`
                      } 
                    />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="valor" fill="#9b87f5">
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detalhamento por Secretaria</CardTitle>
                <CardDescription>
                  Valores planejados e executados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <Badge variant="outline" className="bg-white">
                          {formatCurrency(dept.valor)}
                        </Badge>
                      </div>
                      <div className="sm:col-span-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${dept.percent}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="sm:col-span-2 text-right">
                        <Badge>{dept.percent}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tendencias">
          <Card>
            <CardHeader>
              <CardTitle>Tendências e Projeções</CardTitle>
              <CardDescription>
                Análise de tendências e projeção para próximos períodos
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData.map((item, index) => {
                    // Adiciona projeções para os próximos meses
                    if (index < monthlyData.length - 3) {
                      return item;
                    } else {
                      return {
                        ...item,
                        projecao: item.executado * 1.05
                      };
                    }
                  })}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => 
                      value >= 1000000 
                        ? `${(value / 1000000).toFixed(1)}M` 
                        : `${(value / 1000).toFixed(0)}K`
                    } 
                  />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="executado" 
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Executado"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projecao" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Projeção"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Indicadores de Desempenho</CardTitle>
            <Button variant="outline" size="sm">
              Ver todos <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <CardDescription>
            Principais indicadores de desempenho financeiro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Eficiência Orçamentária</span>
              <span className="text-2xl font-bold">98.3%</span>
              <span className="text-emerald-600 text-sm flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 2.1%
              </span>
            </div>
            <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Velocidade de Execução</span>
              <span className="text-2xl font-bold">82.5%</span>
              <span className="text-emerald-600 text-sm flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 4.3%
              </span>
            </div>
            <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Economia em Licitações</span>
              <span className="text-2xl font-bold">8.7%</span>
              <span className="text-emerald-600 text-sm flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 1.5%
              </span>
            </div>
            <div className="flex flex-col p-4 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground text-sm">Índice de Conformidade</span>
              <span className="text-2xl font-bold">96.2%</span>
              <span className="text-red-600 text-sm flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 rotate-90" /> 0.8%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
