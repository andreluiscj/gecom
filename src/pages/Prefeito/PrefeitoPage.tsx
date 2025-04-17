import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, FileText, AlertTriangle, ChevronRight, Activity, BarChart3, Users } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { getUserRoleSync } from '@/utils/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PrefeitoPage = () => {
  const navigate = useNavigate();
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  const [pedidosRecentes, setPedidosRecentes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalPedidos: 0,
    valorTotal: 0,
    pedidosAprovados: 0,
    pedidosPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const userRole = getUserRoleSync();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Verificar permissões
        if (userRole !== 'prefeito' && userRole !== 'admin') {
          toast.error('Você não tem permissão para acessar esta página');
          navigate('/dashboard');
          return;
        }

        // Buscar pedidos pendentes que precisam de aprovação do prefeito
        const { data: pendentes, error: pendentesError } = await supabase
          .from('dfds')
          .select(`
            id, 
            descricao, 
            valor_estimado, 
            data_pedido, 
            status, 
            secretaria_id,
            secretarias(nome),
            dfd_workflows(percentual_completo, current_step)
          `)
          .eq('status', 'Aguardando Aprovação do Prefeito')
          .order('data_pedido', { ascending: false })
          .limit(5);

        if (pendentesError) {
          console.error('Erro ao buscar pedidos pendentes:', pendentesError);
          toast.error('Erro ao carregar pedidos pendentes');
        } else {
          setPedidosPendentes(pendentes || []);
        }

        // Buscar pedidos recentes (últimos 5)
        const { data: recentes, error: recentesError } = await supabase
          .from('dfds')
          .select(`
            id, 
            descricao, 
            valor_estimado, 
            data_pedido, 
            status, 
            secretaria_id,
            secretarias(nome)
          `)
          .order('data_pedido', { ascending: false })
          .limit(5);

        if (recentesError) {
          console.error('Erro ao buscar pedidos recentes:', recentesError);
          toast.error('Erro ao carregar pedidos recentes');
        } else {
          setPedidosRecentes(recentes || []);
        }

        // Buscar estatísticas
        const { data: totalData, error: totalError } = await supabase
          .from('dfds')
          .select('count', { count: 'exact' });

        const { data: valorData, error: valorError } = await supabase
          .from('dfds')
          .select('valor_estimado')
          .not('valor_estimado', 'is', null);

        const { data: aprovadosData, error: aprovadosError } = await supabase
          .from('dfds')
          .select('count', { count: 'exact' })
          .eq('status', 'Aprovado');

        const { data: pendentesCountData, error: pendentesCountError } = await supabase
          .from('dfds')
          .select('count', { count: 'exact' })
          .eq('status', 'Aguardando Aprovação do Prefeito');

        if (totalError || valorError || aprovadosError || pendentesCountError) {
          console.error('Erro ao buscar estatísticas:', totalError || valorError || aprovadosError || pendentesCountError);
          toast.error('Erro ao carregar estatísticas');
        } else {
          const valorTotal = valorData?.reduce((sum, item) => sum + (item.valor_estimado || 0), 0) || 0;
          
          setEstatisticas({
            totalPedidos: totalData?.[0]?.count || 0,
            valorTotal,
            pedidosAprovados: aprovadosData?.[0]?.count || 0,
            pedidosPendentes: pendentesCountData?.[0]?.count || 0
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Ocorreu um erro ao carregar os dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userRole]);

  const handleAprovarPedido = async (id) => {
    try {
      // Atualizar status do pedido
      const { error: updateError } = await supabase
        .from('dfds')
        .update({ status: 'Aprovado' })
        .eq('id', id);

      if (updateError) {
        console.error('Erro ao aprovar pedido:', updateError);
        toast.error('Erro ao aprovar pedido');
        return;
      }

      // Atualizar workflow
      const { data: workflowData, error: workflowError } = await supabase
        .from('dfd_workflows')
        .select('id, steps')
        .eq('dfd_id', id)
        .single();

      if (workflowError) {
        console.error('Erro ao buscar workflow:', workflowError);
        toast.error('Erro ao atualizar workflow do pedido');
        return;
      }

      if (workflowData) {
        // Atualizar a etapa de aprovação do prefeito no workflow
        const steps = workflowData.steps || [];
        const prefeitoStepIndex = steps.findIndex(step => step.title === 'Aprovação do Prefeito');
        
        if (prefeitoStepIndex !== -1) {
          steps[prefeitoStepIndex].status = 'Concluído';
          steps[prefeitoStepIndex].dataConclusao = new Date().toISOString();
          
          // Calcular novo progresso
          const etapasConcluidas = steps.filter(e => e.status === 'Concluído').length;
          const etapasEmAndamento = steps.filter(e => e.status === 'Em Andamento').length;
          const percentualConcluido = Math.round(
            (etapasConcluidas + (etapasEmAndamento * 0.5)) / steps.length * 100
          );

          const { error: updateWorkflowError } = await supabase
            .from('dfd_workflows')
            .update({
              steps,
              current_step: etapasConcluidas + (etapasEmAndamento > 0 ? 1 : 0),
              percentual_completo: percentualConcluido
            })
            .eq('id', workflowData.id);

          if (updateWorkflowError) {
            console.error('Erro ao atualizar workflow:', updateWorkflowError);
            toast.error('Erro ao atualizar workflow do pedido');
            return;
          }
        }
      }

      toast.success('Pedido aprovado com sucesso!');
      
      // Atualizar a lista de pedidos pendentes
      setPedidosPendentes(prev => prev.filter(pedido => pedido.id !== id));
      
      // Atualizar estatísticas
      setEstatisticas(prev => ({
        ...prev,
        pedidosAprovados: prev.pedidosAprovados + 1,
        pedidosPendentes: prev.pedidosPendentes - 1
      }));
    } catch (error) {
      console.error('Erro ao aprovar pedido:', error);
      toast.error('Ocorreu um erro ao aprovar o pedido');
    }
  };

  const handleReprovarPedido = async (id) => {
    try {
      // Atualizar status do pedido
      const { error: updateError } = await supabase
        .from('dfds')
        .update({ status: 'Reprovado' })
        .eq('id', id);

      if (updateError) {
        console.error('Erro ao reprovar pedido:', updateError);
        toast.error('Erro ao reprovar pedido');
        return;
      }

      // Atualizar workflow
      const { data: workflowData, error: workflowError } = await supabase
        .from('dfd_workflows')
        .select('id, steps')
        .eq('dfd_id', id)
        .single();

      if (workflowError) {
        console.error('Erro ao buscar workflow:', workflowError);
        toast.error('Erro ao atualizar workflow do pedido');
        return;
      }

      if (workflowData) {
        // Atualizar a etapa de aprovação do prefeito no workflow
        const steps = workflowData.steps || [];
        const prefeitoStepIndex = steps.findIndex(step => step.title === 'Aprovação do Prefeito');
        
        if (prefeitoStepIndex !== -1) {
          steps[prefeitoStepIndex].status = 'Reprovado';
          steps[prefeitoStepIndex].dataConclusao = new Date().toISOString();
          
          const { error: updateWorkflowError } = await supabase
            .from('dfd_workflows')
            .update({
              steps,
              status: 'Reprovado'
            })
            .eq('id', workflowData.id);

          if (updateWorkflowError) {
            console.error('Erro ao atualizar workflow:', updateWorkflowError);
            toast.error('Erro ao atualizar workflow do pedido');
            return;
          }
        }
      }

      toast.success('Pedido reprovado!');
      
      // Atualizar a lista de pedidos pendentes
      setPedidosPendentes(prev => prev.filter(pedido => pedido.id !== id));
      
      // Atualizar estatísticas
      setEstatisticas(prev => ({
        ...prev,
        pedidosPendentes: prev.pedidosPendentes - 1
      }));
    } catch (error) {
      console.error('Erro ao reprovar pedido:', error);
      toast.error('Ocorreu um erro ao reprovar o pedido');
    }
  };

  const handleVerDetalhesPedido = (id) => {
    navigate(`/pedidos/${id}`);
  };

  const handleVerTodosPedidos = () => {
    navigate('/pedidos');
  };

  const handleVerDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gabinete do Prefeito</h1>
        <p className="text-muted-foreground">
          Gerencie aprovações e acompanhe o andamento dos pedidos de compra
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalPedidos}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos registrados no sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(estatisticas.valorTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Valor total dos pedidos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.pedidosAprovados}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos já aprovados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.pedidosPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos aguardando sua aprovação
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes de Aprovação</TabsTrigger>
          <TabsTrigger value="recentes">Pedidos Recentes</TabsTrigger>
        </TabsList>
        <TabsContent value="pendentes" className="space-y-4">
          {pedidosPendentes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-lg font-medium">Nenhum pedido pendente</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Não há pedidos aguardando sua aprovação no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            pedidosPendentes.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pedido.descricao}</CardTitle>
                      <CardDescription>
                        Secretaria: {pedido.secretarias?.nome || 'Não especificada'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Aguardando Aprovação
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Valor:</span>
                      <span className="font-bold">{formatCurrency(pedido.valor_estimado || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data do Pedido:</span>
                      <span>{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progresso:</span>
                      <span>{pedido.dfd_workflows?.[0]?.percentual_completo || 0}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleVerDetalhesPedido(pedido.id)}>
                    Ver Detalhes
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={() => handleReprovarPedido(pedido.id)}>
                      Reprovar
                    </Button>
                    <Button onClick={() => handleAprovarPedido(pedido.id)}>
                      Aprovar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
          {pedidosPendentes.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleVerTodosPedidos}>
                Ver Todos os Pedidos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="recentes" className="space-y-4">
          {pedidosRecentes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="h-12 w-12 text-yellow-500" />
                </div>
                <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Não há pedidos registrados no sistema.
                </p>
              </CardContent>
            </Card>
          ) : (
            pedidosRecentes.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pedido.descricao}</CardTitle>
                      <CardDescription>
                        Secretaria: {pedido.secretarias?.nome || 'Não especificada'}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        pedido.status === 'Aprovado' ? 'bg-green-50 text-green-700 border-green-200' :
                        pedido.status === 'Reprovado' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }
                    >
                      {pedido.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Valor:</span>
                      <span className="font-bold">{formatCurrency(pedido.valor_estimado || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data do Pedido:</span>
                      <span>{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleVerDetalhesPedido(pedido.id)}>
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
          {pedidosRecentes.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleVerTodosPedidos}>
                Ver Todos os Pedidos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={handleVerDashboard}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleVerTodosPedidos}>
              <FileText className="mr-2 h-4 w-4" />
              Todos os Pedidos
            </Button>
            {userRole === 'admin' && (
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/usuarios')}>
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Usuários
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Prefeito</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>PR</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">Prefeito Municipal</h3>
              <p className="text-sm text-muted-foreground">
                Município de {localStorage.getItem('municipio-selecionado') === 'janauba' ? 'Janaúba' : 'Pai Pedro'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrefeitoPage;
