
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Municipio } from '@/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';

const Dashboard: React.FC = () => {
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipioData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('municipios')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching municipio data:', error);
        } else if (data) {
          setMunicipio({
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at)
          });
        }
      } catch (err) {
        console.error('Error in data fetching:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipioData();
  }, []);

  const cardData = [
    {
      title: 'Total de Compras',
      value: 'R$ 1.250.000,00',
      change: '+12%',
      description: 'Comparado ao último trimestre',
      icon: <DollarSign className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Pedidos Ativos',
      value: '47',
      change: '+8%',
      description: 'Pedidos em análise',
      icon: <ShoppingBag className="h-5 w-5 text-green-500" />
    },
    {
      title: 'Orçamento Utilizado',
      value: '67%',
      change: '+5%',
      description: 'Executado até o momento',
      icon: <TrendingUp className="h-5 w-5 text-amber-500" />
    },
    {
      title: 'Setores Ativos',
      value: '12',
      change: '+2',
      description: 'Participando de compras',
      icon: <Users className="h-5 w-5 text-purple-500" />
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Informações e estatísticas sobre processos de compras e gestão orçamentária.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-32 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-36 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {municipio && (
            <div className="flex flex-col gap-1 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{municipio.nome}</h2>
                <span className="text-sm text-muted-foreground">({municipio.estado})</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{formatNumber(municipio.populacao)}</span> habitantes | 
                Orçamento anual: <span className="font-medium">{formatCurrency(municipio.orcamento_anual)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardData.map((card, index) => (
              <Card key={index}>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-full">
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className={`mr-1 font-medium ${card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {card.change}
                    </span>
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="analytics">Analíticos</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Orçamento por Setor</CardTitle>
                    <CardDescription>
                      Distribuição do orçamento entre os departamentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['Saúde', 'Educação', 'Administração', 'Infraestrutura'].map((setor, index) => {
                      const percent = [85, 65, 45, 30][index];
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div>{setor}</div>
                            <div className="font-medium">{formatPercentage(percent)}</div>
                          </div>
                          <Progress value={percent} className="h-2" />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Compras Recentes</CardTitle>
                    <CardDescription>
                      Últimos pedidos de compra realizados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { descricao: 'Material de escritório', valor: 'R$ 5.200,00', status: 'Aprovado' },
                        { descricao: 'Equipamentos de informática', valor: 'R$ 12.400,00', status: 'Em análise' },
                        { descricao: 'Materiais de limpeza', valor: 'R$ 3.600,00', status: 'Concluído' },
                        { descricao: 'Mobiliário', valor: 'R$ 8.750,00', status: 'Pendente' }
                      ].map((compra, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{compra.descricao}</div>
                            <div className="text-sm text-muted-foreground">{compra.valor}</div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              compra.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                              compra.status === 'Em análise' ? 'bg-blue-100 text-blue-800' :
                              compra.status === 'Concluído' ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {compra.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análise Detalhada</CardTitle>
                  <CardDescription>Dados detalhados por período e categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Análise detalhada disponível após seleção de período e indicadores.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>Relatórios consolidados do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Selecione o tipo de relatório para geração.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
