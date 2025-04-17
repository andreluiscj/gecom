
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Circle, Clock, AlertCircle, Calendar, User, AlertTriangle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { obterTodosPedidos, atualizarEtapaWorkflow } from '@/data/mockData';
import { toast } from 'sonner';
import { WorkflowStepStatus, PedidoCompra } from '@/types';
import { canEditStep } from '@/utils/workflowHelpers';
import { getUserRoleSync, getUserIdSync } from '@/utils/auth';
import { canEditWorkflowStepSync, getPermittedWorkflowStep } from '@/utils/auth/permissionHelpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WorkflowPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const permittedStep = getPermittedWorkflowStep();
  const userRole = getUserRoleSync();
  const userId = getUserIdSync();

  // Fetch the pedido when the component mounts or when refreshKey changes
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const pedidos = await obterTodosPedidos();
        const found = pedidos.find(p => p.id === id);
        
        if (found) {
          setPedido(found);
        } else {
          toast.error('Pedido não encontrado');
        }
      } catch (error) {
        console.error('Error fetching pedido:', error);
        toast.error('Erro ao buscar dados do pedido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPedido();
  }, [id, refreshKey]);

  const handleUpdateStepStatus = async (stepIndex: number, status: WorkflowStepStatus) => {
    if (!userId || !pedido || !pedido.workflow) return;
    
    const currentStep = pedido.workflow.steps[stepIndex];
    
    // Check if user has permission to edit this specific step
    if (!canEditWorkflowStepSync(currentStep.title)) {
      toast.error(`Você não tem permissão para editar a etapa "${currentStep.title}"`);
      return;
    }
    
    // Verificar se a etapa pode ser editada na sequência correta
    if (!canEditStep(pedido.workflow, stepIndex)) {
      toast.error('Você não pode alterar esta etapa até que as anteriores sejam concluídas');
      return;
    }
    
    try {
      // Verificar se a alteração segue a ordem lógica
      if (status === 'Concluído' && stepIndex < pedido.workflow.steps.length - 1) {
        // Se estamos concluindo uma etapa, precisamos verificar se a próxima etapa existe
        // e atualizá-la para "Em Andamento" se estiver "Pendente"
        if (pedido.workflow.steps[stepIndex + 1].status === 'Pendente') {
          await atualizarEtapaWorkflow(
            pedido.id, 
            stepIndex + 1, 
            'Em Andamento'
          );
        }
      }
      
      await atualizarEtapaWorkflow(pedido.id, stepIndex, status);
      toast.success(`Status da etapa atualizado para ${status}`);
      setRefreshKey(prev => prev + 1); // Force refresh
    } catch (error) {
      console.error('Error updating step status:', error);
      toast.error('Erro ao atualizar status da etapa');
    }
  };

  const handleUpdateResponsavel = async (stepIndex: number, responsavel: string) => {
    if (!userId || !pedido || !pedido.workflow) return;
    
    const currentStep = pedido.workflow.steps[stepIndex];
    
    // Check if user has permission to edit this specific step
    if (!canEditWorkflowStepSync(currentStep.title)) {
      toast.error(`Você não tem permissão para editar a etapa "${currentStep.title}"`);
      return;
    }
    
    if (!canEditStep(pedido.workflow, stepIndex)) {
      toast.error('Você não pode alterar esta etapa até que as anteriores sejam concluídas');
      return;
    }
    
    try {
      await atualizarEtapaWorkflow(
        pedido.id, 
        stepIndex, 
        pedido.workflow.steps[stepIndex].status,
        undefined,
        responsavel
      );
      toast.success('Responsável atualizado com sucesso');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating responsavel:', error);
      toast.error('Erro ao atualizar responsável');
    }
  };

  const handleUpdateDataConclusao = async (stepIndex: number, data: Date | undefined) => {
    if (!userId || !pedido || !pedido.workflow) return;
    
    const currentStep = pedido.workflow.steps[stepIndex];
    
    // Check if user has permission to edit this specific step
    if (!canEditWorkflowStepSync(currentStep.title)) {
      toast.error(`Você não tem permissão para editar a etapa "${currentStep.title}"`);
      return;
    }
    
    if (!canEditStep(pedido.workflow, stepIndex)) {
      toast.error('Você não pode alterar esta etapa até que as anteriores sejam concluídas');
      return;
    }
    
    try {
      await atualizarEtapaWorkflow(
        pedido.id, 
        stepIndex, 
        pedido.workflow.steps[stepIndex].status,
        pedido.workflow.steps[stepIndex].date,
        pedido.workflow.steps[stepIndex].responsavel,
        data
      );
      toast.success('Data de conclusão atualizada com sucesso');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating data conclusao:', error);
      toast.error('Erro ao atualizar data de conclusão');
    }
  };
  
  const getStatusIcon = (status: WorkflowStepStatus) => {
    switch (status) {
      case 'Concluído':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'Em Andamento':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Pendente':
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusClass = (status: WorkflowStepStatus, isEditable: boolean, hasPermission: boolean) => {
    if (!isEditable || !hasPermission) {
      return 'text-gray-400 border-gray-100 bg-gray-50 opacity-70';
    }
    
    switch (status) {
      case 'Concluído':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'Em Andamento':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'Pendente':
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };
  
  const getProgressColor = (percent: number) => {
    if (percent < 30) return 'bg-red-500';
    if (percent < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              O pedido que você está procurando não existe ou foi removido.
            </p>
            <Button className="mt-4" onClick={() => navigate('/pedidos')}>
              Ver todos os pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Fluxo do Processo de Compra</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">{pedido.descricao}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Secretaria: {pedido.setor} • DFD #{pedido.id.substring(0, 8)}
            </p>
          </div>
          {pedido.status && (
            <Badge className={
              pedido.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
              pedido.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 
              'bg-orange-100 text-orange-800'
            }>
              {pedido.status}
            </Badge>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Progresso do Processo: {pedido.workflow?.percentComplete || 0}%
              </span>
              <span className="text-xs text-muted-foreground">
                {pedido.workflow?.currentStep || 0} de {pedido.workflow?.totalSteps || 8} etapas
              </span>
            </div>
            <Progress 
              value={pedido.workflow?.percentComplete || 0} 
              className="h-2" 
            />
          </div>
          
          <div className="space-y-6 mt-8">
            {pedido && pedido.workflow?.steps.map((step, index) => {
              // Verificando se a etapa pode ser editada com base na função canEditStep
              const isEditable = pedido.workflow ? canEditStep(pedido.workflow, index) : false;
              // Verificando se o usuário tem permissão para editar esta etapa específica
              const hasPermission = canEditWorkflowStepSync(step.title);
              
              return (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${getStatusClass(step.status, isEditable, hasPermission)}`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Title and Status Section */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(step.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">{step.title}</h3>
                          {step.title === 'Sessão Licitação' && step.date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" /> 
                              Data marcada: {format(new Date(step.date), 'dd/MM/yyyy')}
                            </div>
                          )}
                        </div>
                        {!isEditable && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="ml-2">
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Etapas anteriores precisam ser concluídas primeiro</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {!hasPermission && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="ml-2">
                                  <Lock className="h-4 w-4 text-red-500" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Você não tem permissão para editar esta etapa</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      
                      {/* Replace dropdown with approval button for the first step, keep dropdown for others */}
                      {step.title === 'Aprovação da DFD' ? (
                        <div>
                          {userRole === 'admin' || userRole === 'manager' ? (
                            <Button 
                              variant="default" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => navigate(`/pedidos/aprovacao/${pedido.id}`)}
                              disabled={!isEditable || !hasPermission}
                            >
                              Aprovar
                            </Button>
                          ) : (
                            <Button 
                              variant="default" 
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={true}
                            >
                              Aprovar
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Select
                          value={step.status}
                          onValueChange={(value) => handleUpdateStepStatus(index, value as WorkflowStepStatus)}
                          disabled={!isEditable || !hasPermission}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                            <SelectItem value="Concluído">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Additional Fields Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                      {/* Responsible Person */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          <User className="h-3 w-3 inline mr-1" /> Responsável
                        </label>
                        <Input 
                          placeholder="Nome do responsável" 
                          value={step.responsavel || ''} 
                          onChange={(e) => handleUpdateResponsavel(index, e.target.value)}
                          className="h-8 text-sm"
                          disabled={!isEditable || !hasPermission || step.title === 'Aprovação da DFD'}
                        />
                      </div>

                      {/* Completion Date */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          <Calendar className="h-3 w-3 inline mr-1" /> Data de Conclusão <span className="text-gray-500">(opcional)</span>
                        </label>
                        <Popover>
                          <PopoverTrigger asChild disabled={!isEditable || !hasPermission || step.title === 'Aprovação da DFD'}>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`w-full justify-start text-left font-normal h-8 text-sm ${!step.dataConclusao ? 'text-muted-foreground' : ''} ${!isEditable || !hasPermission || step.title === 'Aprovação da DFD' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!isEditable || !hasPermission || step.title === 'Aprovação da DFD'}
                            >
                              <Calendar className="mr-2 h-3 w-3" />
                              {step.dataConclusao ? format(new Date(step.dataConclusao), 'dd/MM/yyyy') : 'Selecionar data (opcional)'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={step.dataConclusao instanceof Date ? step.dataConclusao : undefined}
                              onSelect={(isEditable && hasPermission && step.title !== 'Aprovação da DFD') ? handleUpdateDataConclusao.bind(null, index) : undefined}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowPedido;
