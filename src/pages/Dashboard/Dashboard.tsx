
import React, { useState } from 'react';
import { obterDadosDashboard } from '@/data/extended-mockData';
import { formatDate, formatCurrency, formatPercentage } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardStatCards from './components/DashboardStatCards';
import DashboardCharts from './components/DashboardCharts';

const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('resumo');
  const dashboardData = obterDadosDashboard();
  
  // Calcular dados de resumo
  const { resumoFinanceiro, pedidosRecentes } = dashboardData;
  const percentualUtilizado = resumoFinanceiro.percentualUtilizado;
  
  // Determinar se o orçamento está em risco
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
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo" className="space-y-6">
          <DashboardStatCards cartoes={dashboardData.cartoes} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Setor</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidosRecentes.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-medium">{pedido.id}</TableCell>
                        <TableCell>{formatDate(pedido.data)}</TableCell>
                        <TableCell>{pedido.setor}</TableCell>
                        <TableCell className="text-right">{formatCurrency(pedido.valor)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${
                              pedido.status === 'Aprovado' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : pedido.status === 'Reprovado' 
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}
                          >
                            {pedido.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Resumo Orçamentário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Orçamento Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(resumoFinanceiro.orcamentoAnual)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Utilizado</p>
                    <p className="text-2xl font-bold">{formatCurrency(resumoFinanceiro.orcamentoUtilizado)}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{formatPercentage(percentualUtilizado)}</span>
                    <span className="flex items-center text-sm">
                      {percentualUtilizado > 90 ? (
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                      ) : percentualUtilizado > 70 ? (
                        <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      {percentualUtilizado > 90 ? 'Crítico' : percentualUtilizado > 70 ? 'Atenção' : 'Saudável'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`h-2.5 rounded-full ${
                        percentualUtilizado > 90 
                          ? 'bg-red-500' 
                          : percentualUtilizado > 70 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`} 
                      style={{ width: `${percentualUtilizado}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DashboardCharts 
            dadosMensais={dashboardData.dadosMensais} 
            distribuicaoSetor={dashboardData.distribuicaoSetor}
          />
        </TabsContent>
        
        <TabsContent value="financeiro" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Painel Financeiro</h3>
            <p className="text-muted-foreground">
              Visualização detalhada de informações financeiras estará disponível em breve.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="pedidos" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Painel de Pedidos</h3>
            <p className="text-muted-foreground">
              Visualização detalhada de pedidos estará disponível em breve.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
