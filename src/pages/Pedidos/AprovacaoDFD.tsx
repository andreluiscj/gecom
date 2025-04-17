import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, Clock, AlertTriangle, FileText, User, Calendar, DollarSign, Building, Truck, ClipboardList } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { PedidoCompra } from '@/types';
import { obterTodosPedidos, atualizarStatusPedido } from '@/data/mockData';
import { atualizarEtapaWorkflow } from '@/data/mockData';
import { getUserRoleSync } from '@/utils/auth';
import { canAccessSync } from '@/utils/auth/permissionHelpers';
import WorkflowTimeline from '@/components/Pedidos/WorkflowTimeline';
import PedidoItemsTable from '@/components/Pedidos/PedidoItemsTable';
import PedidoAttachments from '@/components/Pedidos/PedidoAttachments';
import PedidoObservacoes from '@/components/Pedidos/PedidoObservacoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AprovacaoDFD: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [loading, setLoading] = useState(true);
  const [observacao, setObservacao] = useState('');
  const [activeTab, setActiveTab] = useState('detalhes');
  const [submitting, setSubmitting] = useState(false);
  const userRole = getUserRoleSync();

  useEffect(() => {
    const fetchPedido = async () => {
      setLoading(true);
      try {
        const pedidos = obterTodosPedidos();
        const pedidoEncontrado = pedidos.find(p => p.id === id);
        
        if (pedidoEncontrado) {
          setPedido(pedidoEncontrado);
        } else {
          toast.error('Pedido não encontrado');
          navigate('/pedidos');
        }
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        toast.error('Erro ao carregar dados do pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id, navigate]);

  const handleAprovar = async () => {
    if (!pedido) return;
    
    setSubmitting(true);
    try {
      // Verificar permissões
      if (userRole === 'admin' || userRole === 'manager') {
        // Atualizar status do pedido
        const pedidoAtualizado = atualizarStatusPedido(pedido.id, 'Aprovado');
        
        if (pedidoAtualizado) {
          // Atualizar etapa do workflow
          const etapaIndex = pedido.workflow?.steps.findIndex(step => step.status === 'Pendente' || step.status === 'Em Andamento');
          
          if (etapaIndex !== undefined && etapaIndex !== -1 && pedido.workflow) {
            const workflowAtualizado = atualizarEtapaWorkflow(
              pedido.id,
              etapaIndex,
              'Concluído',
              new Date(),
              `${localStorage.getItem('user-name') || 'Usuário'}`,
              new Date()
            );
            
            if (workflowAtualizado) {
              setPedido(workflowAtualizado);
              toast.success('Pedido aprovado com sucesso!');
            }
          }
        } else {
          toast.error('Erro ao aprovar pedido');
        }
      } else {
        toast.error('Você não tem permissão para aprovar este pedido');
      }
    } catch (error) {
      console.error('Erro ao aprovar pedido:', error);
      toast.error('Erro ao processar aprovação');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejeitar = async () => {
    if (!pedido) return;
    
    if (!observacao.trim()) {
      toast.error('Por favor, adicione uma observação explicando o motivo da rejeição');
      return;
    }
    
    setSubmitting(true);
    try {
      // Atualizar status do pedido
      const pedidoAtualizado = atualizarStatusPedido(pedido.id, 'Rejeitado');
      
      if (pedidoAtualizado) {
        // Adicionar observação
        // Em um sistema real, aqui seria adicionada a observação ao banco de dados
        
        toast.success('Pedido rejeitado com sucesso!');
        setPedido({
          ...pedido,
          status: 'Rejeitado',
          observacoes: pedido.observacoes + '\n\n' + observacao
        });
      } else {
        toast.error('Erro ao rejeitar pedido');
      }
    } catch (error) {
      console.error('Erro ao rejeitar pedido:', error);
      toast.error('Erro ao processar rejeição');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvancarEtapa = async (etapaIndex: number) => {
    if (!pedido || !pedido.workflow) return;
    
    setSubmitting(true);
    try {
      // Verificar permissões
      if (userRole === 'manager') {
        // Atualizar etapa do workflow
        const workflowAtualizado = atualizarEtapaWorkflow(
          pedido.id,
          etapaIndex,
          'Em Andamento',
          new Date(),
          `${localStorage.getItem('user-name') || 'Usuário'}`
        );
        
        if (workflowAtualizado) {
          setPedido(workflowAtualizado);
          toast.success('Etapa atualizada com sucesso!');
        } else {
          toast.error('Erro ao atualizar etapa');
        }
      } else {
        toast.error('Você não tem permissão para atualizar esta etapa');
      }
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      toast.error('Erro ao processar atualização');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConcluirEtapa = async (etapaIndex: number) => {
    if (!pedido || !pedido.workflow) return;
    
    setSubmitting(true);
    try {
      // Atualizar etapa do workflow
      const workflowAtualizado = atualizarEtapaWorkflow(
        pedido.id,
        etapaIndex,
        'Concluído',
        undefined,
        undefined,
        new Date()
      );
      
      if (workflowAtualizado) {
        setPedido(workflowAtualizado);
        toast.success('Etapa concluída com sucesso!');
        
        // Se todas as etapas foram concluídas, atualizar status do pedido
        const todasEtapasConcluidas = workflowAtualizado.workflow?.steps.every(step => step.status === 'Concluído');
        if (todasEtapasConcluidas) {
          const pedidoFinalizado = atualizarStatusPedido(pedido.id, 'Concluído');
          if (pedidoFinalizado) {
            setPedido({
              ...workflowAtualizado,
              status: 'Concluído'
            });
            toast.success('Pedido concluído com sucesso!');
          }
        }
      } else {
        toast.error('Erro ao concluir etapa');
      }
    } catch (error) {
      console.error('Erro ao concluir etapa:', error);
      toast.error('Erro ao processar conclusão');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Pedido não encontrado</h2>
        <p className="text-muted-foreground mt-2">O pedido solicitado não existe ou foi removido.</p>
        <Button className="mt-4" onClick={() => navigate('/pedidos')}>
          Voltar para Lista de Pedidos
        </Button>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (pedido.status) {
      case 'Aprovado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pendente':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'Rejeitado':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Em Andamento':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Concluído':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (pedido.status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Pendente':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Concluído':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Detalhes do Pedido</h1>
          <p className="text-muted-foreground">
            Visualize e aprove o pedido de compra
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor()}>
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              {pedido.status}
            </span>
          </Badge>
          
          <Button variant="outline" onClick={() => navigate('/pedidos')}>
            Voltar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{pedido.descricao}</CardTitle>
          <CardDescription>
            Pedido #{pedido.id.substring(0, 8)} • Criado em {format(pedido.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Responsável</p>
                  <p>{pedido.responsavel.nome}</p>
                  <p className="text-sm text-muted-foreground">{pedido.responsavel.cargo}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Data do Pedido</p>
                  <p>{format(pedido.dataCompra, "dd/MM/yyyy")}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Valor Total</p>
                  <p className="text-lg font-semibold">{formatCurrency(pedido.valorTotal)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Setor</p>
                  <p>{pedido.setor}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Fonte de Recurso</p>
                  <p>{pedido.fonteRecurso || pedido.fundoMonetario || 'Não especificado'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Progresso</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${pedido.workflow?.percentComplete || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pedido.workflow?.percentComplete || 0}% concluído
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="anexos">Anexos</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalhes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
              <CardDescription>
                Lista de itens incluídos neste pedido de compra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PedidoItemsTable items={pedido.itens} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Aprovação</CardTitle>
              <CardDescription>
                Acompanhe o progresso do pedido no fluxo de aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pedido.workflow ? (
                <WorkflowTimeline 
                  workflow={pedido.workflow}
                  onAdvanceStep={handleAvancarEtapa}
                  onCompleteStep={handleConcluirEtapa}
                />
              ) : (
                <p className="text-muted-foreground">Este pedido não possui um fluxo de aprovação definido.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="anexos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Anexos</CardTitle>
              <CardDescription>
                Documentos e arquivos relacionados a este pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PedidoAttachments attachments={pedido.anexos} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="observacoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>
                Comentários e observações sobre este pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PedidoObservacoes observacoes={pedido.observacoes} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {pedido.status === 'Pendente' && (
        <Card>
          <CardHeader>
            <CardTitle>Ação</CardTitle>
            <CardDescription>
              Aprove ou rejeite este pedido de compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Adicione uma observação (obrigatório para rejeição)"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleRejeitar}
              disabled={submitting}
            >
              Rejeitar Pedido
            </Button>
            <Button 
              onClick={handleAprovar}
              disabled={submitting}
            >
              Aprovar Pedido
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AprovacaoDFD;
