import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { obterDadosDashboard } from '@/data/extended-mockData';
import { formatCurrency } from '@/utils/formatters';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  ShoppingCart,
  Wallet,
  CheckCircle,
  TrendingUp,
  Filter
} from 'lucide-react';
import { DadosDashboard, Municipio } from '@/types';

// Mock data for the municipality
const municipio: Municipio = {
  id: '1',
  nome: 'São Paulo',
  estado: 'SP',
  populacao: 12325232,
  logo: '/logo-municipio.png',
  orcamento: 25000000,
  orcamento_anual: 300000000,
  prefeito: 'João Silva',
  created_at: new Date('2023-01-01'),
  updated_at: new Date('2023-06-15')
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Dashboard: React.FC = () => {
  const [dadosDashboard, setDadosDashboard] = useState<DadosDashboard | null>(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mensal');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('pt-BR');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const data = obterDadosDashboard();
        setDadosDashboard(data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periodoSelecionado]);

  const handleExportPDF = () => {
    if (!dadosDashboard) return;
    
    try {
      // This would call a PDF export function in a real implementation
      alert('Exportação de PDF não implementada nesta versão de demonstração');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  };

  if (loading || !dadosDashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Prepare data for charts
  const gastosSetorData = Object.entries(dadosDashboard.gastos_por_setor)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const orcamentoGastosData = Object.keys(dadosDashboard.orcamento_previsto).map(setor => ({
    name: setor,
    Orçado: dadosDashboard.orcamento_previsto[setor],
    Gasto: dadosDashboard.gastos_por_setor[setor] || 0
  })).slice(0, 6);

  const pedidosSetorData = Object.entries(dadosDashboard.pedidos_por_setor)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart className="h-5 w-5" />;
      case 'Wallet':
        return <Wallet className="h-5 w-5" />;
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5" />;
      case 'TrendingUp':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <ShoppingCart className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das compras e orçamentos do município
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={periodoSelecionado}
            onValueChange={setPeriodoSelecionado}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semanal">Últimos 7 dias</SelectItem>
              <SelectItem value="mensal">Últimos 30 dias</SelectItem>
              <SelectItem value="trimestral">Último trimestre</SelectItem>
              <SelectItem value="anual">Último ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dadosDashboard.cartoes.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${card.classe_cor}`}>
                    {getIcon(card.icon)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground leading-none">
                      {card.titulo}
                    </p>
                    <h2 className="text-2xl font-bold mt-1">{card.valor}</h2>
                  </div>
                </div>
                <div className={`flex items-center ${
                  card.percentual_mudanca > 0 
                    ? 'text-green-600' 
                    : card.percentual_mudanca < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {card.percentual_mudanca > 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(card.percentual_mudanca)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo financeiro */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Orçamento Total</span>
              <span className="font-medium">
                {formatCurrency(dadosDashboard.resumo_financeiro.estimativa_despesa)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor Contratado</span>
              <span className="font-medium">
                {formatCurrency(dadosDashboard.resumo_financeiro.valor_contratado_total)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">
                {dadosDashboard.resumo_financeiro.percentual_utilizado.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={dadosDashboard.resumo_financeiro.percentual_utilizado} 
              className="h-2"
              color={
                dadosDashboard.resumo_financeiro.percentual_utilizado > 90 
                  ? "bg-red-500" 
                  : dadosDashboard.resumo_financeiro.percentual_utilizado > 70 
                  ? "bg-yellow-500" 
                  : ""
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="orcamento" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orcamento">Orçamento vs Gastos</TabsTrigger>
          <TabsTrigger value="setores">Gastos por Setor</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos por Setor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orcamento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orçamento vs Gastos por Setor</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orcamentoGastosData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat(language, {
                        notation: 'compact',
                        compactDisplay: 'short',
                        style: 'currency',
                        currency: 'BRL'
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value) => 
                      new Intl.NumberFormat(language, {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(Number(value))
                    }
                  />
                  <Legend />
                  <Bar dataKey="Orçado" fill="#8884d8" />
                  <Bar dataKey="Gasto" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Setor</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gastosSetorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {gastosSetorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => 
                      new Intl.NumberFormat(language, {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(Number(value))
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pedidos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos por Setor</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pedidosSetorData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Quantidade de Pedidos" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dashboard Summary */}
      <DashboardSummary 
        dadosDashboard={dadosDashboard} 
        municipio={municipio} 
        language={language} 
      />
    </div>
  );
};

interface DashboardSummaryProps {
  dadosDashboard: DadosDashboard;
  municipio: Municipio;
  language: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ 
  dadosDashboard, 
  municipio, 
  language 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Município</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Informações Gerais</h3>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Município:</span>
                <span>{municipio.nome} - {municipio.estado}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">População:</span>
                <span>{municipio.populacao.toLocaleString(language)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Prefeito:</span>
                <span>{municipio.prefeito}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Orçamento Anual:</span>
                <span>{formatCurrency(municipio.orcamento_anual)}</span>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Estatísticas de Compras</h3>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Total de Pedidos:</span>
                <span>{dadosDashboard.resumo_financeiro.total_pedidos}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Valor Contratado:</span>
                <span>{formatCurrency(dadosDashboard.valor_contratado_total)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Percentual do Orçamento:</span>
                <span>{dadosDashboard.resumo_financeiro.percentual_utilizado.toFixed(1)}%</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Valor Médio por Pedido:</span>
                <span>{formatCurrency(
                  dadosDashboard.resumo_financeiro.total_pedidos > 0 
                    ? dadosDashboard.valor_contratado_total / dadosDashboard.resumo_financeiro.total_pedidos 
                    : 0
                )}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
