
import React, { useState, useMemo } from 'react';
import { obterDadosDashboard } from '@/data/extended-mockData';
import { formatDate, formatCurrency, formatPercentage } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardStatCards from './components/DashboardStatCards';
import { obterTodosPedidos } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('resumo');
  const dashboardData = obterDadosDashboard();
  const todosPedidos = obterTodosPedidos();
  
  // Calcular dados de resumo de forma consistente com outras telas
  const { resumoFinanceiro } = dashboardData;
  const percentualUtilizado = resumoFinanceiro.percentualUtilizado;
  
  // Dados reais do sistema
  const pedidosPendentes = useMemo(() => todosPedidos.filter(pedido => pedido.status === 'Pendente').length, [todosPedidos]);
  const pedidosAprovados = useMemo(() => todosPedidos.filter(pedido => pedido.status === 'Aprovado').length, [todosPedidos]);
  const pedidosEmAndamento = useMemo(() => todosPedidos.filter(pedido => pedido.status === 'Em Andamento').length, [todosPedidos]);
  
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
          <DashboardStatCards 
            cartoes={[
              {
                titulo: "Total de Pedidos",
                valor: todosPedidos.length.toString(),
                percentualMudanca: 12.5,
                icone: "ShoppingCart",
                classeCor: "bg-blue-500",
              },
              {
                titulo: "Pedidos Pendentes",
                valor: pedidosPendentes.toString(),
                percentualMudanca: 8.2,
                icone: "Receipt",
                classeCor: "bg-yellow-500",
              },
              {
                titulo: "Pedidos Aprovados",
                valor: pedidosAprovados.toString(),
                percentualMudanca: 5.7,
                icone: "Wallet",
                classeCor: "bg-green-500",
              },
              {
                titulo: "Pedidos em Andamento",
                valor: pedidosEmAndamento.toString(),
                percentualMudanca: -3.4,
                icone: "Building",
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
                          <dd className="text-sm font-medium">{formatCurrency(resumoFinanceiro.orcamentoUtilizado * 0.35)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Educação</dt>
                          <dd className="text-sm font-medium">{formatCurrency(resumoFinanceiro.orcamentoUtilizado * 0.25)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm">Infraestrutura</dt>
                          <dd className="text-sm font-medium">{formatCurrency(resumoFinanceiro.orcamentoUtilizado * 0.15)}</dd>
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
