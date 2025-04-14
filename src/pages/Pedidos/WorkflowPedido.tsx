
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PedidoCompra, Funcionario, WorkflowStep } from '@/types';
import { canEditStep } from '@/utils/workflowHelpers';
import { updateEtapaWorkflow, getPedidos } from '@/services/pedidoService';
import { getFuncionarios } from '@/services/funcionarioService';
import { getUserRole, getUserId } from '@/utils/authHelpers';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

const WorkflowPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // Get current user info
  const userRole = getUserRole();
  const userId = getUserId();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        // Load pedido and funcionarios in parallel
        const [pedidosData, funcionariosData] = await Promise.all([
          getPedidos(),
          getFuncionarios()
        ]);
        
        const pedidoEncontrado = pedidosData.find(p => p.id === id);
        
        if (pedidoEncontrado) {
          setPedido(pedidoEncontrado);
          setFuncionarios(funcionariosData);
        } else {
          toast.error('Pedido não encontrado');
          navigate('/pedidos');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar informações do pedido');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate]);

  const handleApproveStep = async (stepId: string) => {
    if (!pedido) return;
    setIsUpdating(true);
    
    try {
      // Update step status locally first
      const updatedSteps = pedido.workflow?.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'Concluído',
            dataConclusao: new Date(),
            responsavel: userId
          };
        }
        return step;
      }) || [];
      
      // Calculate completion percentage
      const totalSteps = updatedSteps.length;
      const completedSteps = updatedSteps.filter(s => s.status === 'Concluído').length;
      const percentComplete = (completedSteps / totalSteps) * 100;
      
      // Update workflow locally
      setPedido({
        ...pedido,
        workflow: {
          ...pedido.workflow!,
          steps: updatedSteps,
          percentComplete,
          currentStep: completedSteps + 1 > totalSteps ? totalSteps : completedSteps + 1
        }
      });
      
      // Update in database
      await updateEtapaWorkflow(pedido.id, stepId, 'Concluído', userId || undefined);
      
      toast.success('Etapa aprovada com sucesso');
    } catch (error) {
      console.error('Erro ao aprovar etapa:', error);
      toast.error('Erro ao atualizar workflow');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectStep = async (stepId: string) => {
    if (!pedido) return;
    setIsUpdating(true);
    
    try {
      // Update step status locally first
      const updatedSteps = pedido.workflow?.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'Pendente',
            responsavel: userId
          };
        }
        return step;
      }) || [];
      
      // Update workflow locally
      setPedido({
        ...pedido,
        status: 'Rejeitado',
        workflow: {
          ...pedido.workflow!,
          steps: updatedSteps,
          percentComplete: 0
        }
      });
      
      // Update in database
      await updateEtapaWorkflow(pedido.id, stepId, 'Pendente', userId || undefined);
      
      toast.warning('Etapa rejeitada');
    } catch (error) {
      console.error('Erro ao rejeitar etapa:', error);
      toast.error('Erro ao atualizar workflow');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartStep = async (stepId: string) => {
    if (!pedido) return;
    setIsUpdating(true);
    
    try {
      // Update step status locally first
      const updatedSteps = pedido.workflow?.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'Em Andamento',
            responsavel: userId
          };
        }
        return step;
      }) || [];
      
      // Update workflow locally
      setPedido({
        ...pedido,
        status: 'Em Andamento',
        workflow: {
          ...pedido.workflow!,
          steps: updatedSteps
        }
      });
      
      // Update in database
      await updateEtapaWorkflow(pedido.id, stepId, 'Em Andamento', userId || undefined);
      
      toast.success('Etapa iniciada');
    } catch (error) {
      console.error('Erro ao iniciar etapa:', error);
      toast.error('Erro ao atualizar workflow');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-500 text-white';
      case 'Em Andamento':
        return 'bg-blue-500 text-white';
      case 'Pendente':
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'Concluído':
        return <CheckCircle className="h-5 w-5" />;
      case 'Em Andamento':
        return <Clock className="h-5 w-5" />;
      case 'Pendente':
      default:
        return null;
    }
  };

  const getResponsavel = (responsavelId: string | undefined) => {
    if (!responsavelId) return 'Não designado';
    
    const funcionario = funcionarios.find(f => f.id === responsavelId);
    return funcionario ? funcionario.nome : 'Usuário desconhecido';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando workflow...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="text-center my-8">
        <h2 className="text-xl font-bold">Pedido não encontrado</h2>
        <p className="text-muted-foreground mt-2">
          O pedido que você está procurando não existe.
        </p>
        <Button 
          onClick={() => navigate('/pedidos')} 
          variant="outline"
          className="mt-4"
        >
          Voltar para lista de pedidos
        </Button>
      </div>
    );
  }

  // Check if workflow is complete or rejected
  const isWorkflowComplete = pedido.workflow?.percentComplete === 100;
  const isRejected = pedido.status === 'Rejeitado';
  
  const renderStepActions = (step: WorkflowStep) => {
    // Check if current user can edit this step
    const isResponsible = step.responsavel === userId;
    const canEdit = canEditStep(userRole, step.status, isResponsible);
    
    if (!canEdit) return null;
    
    // Different actions based on step status
    if (step.status === 'Pendente') {
      return (
        <div className="flex items-center space-x-2 mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            disabled={isUpdating}
            onClick={() => handleStartStep(step.id)}
          >
            Iniciar
          </Button>
        </div>
      );
    } else if (step.status === 'Em Andamento') {
      return (
        <div className="flex items-center space-x-2 mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isUpdating}
            onClick={() => handleRejectStep(step.id)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rejeitar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            disabled={isUpdating}
            onClick={() => handleApproveStep(step.id)}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Aprovar
          </Button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Workflow do Pedido #{pedido.id.substring(0, 8)}
        </h1>
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => navigate(`/pedidos/visualizar/${pedido.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status do Workflow</CardTitle>
          <CardDescription>
            {pedido.descricao} - {pedido.setor}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Workflow status overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-2xl font-bold">{pedido.status}</p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Progresso</p>
              <p className="text-2xl font-bold">
                {pedido.workflow?.percentComplete.toFixed(0)}%
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Etapa Atual</p>
              <p className="text-2xl font-bold">
                {pedido.workflow?.currentStep}/{pedido.workflow?.totalSteps}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Progress indicator */}
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex justify-between">
              {pedido.workflow?.steps.map((step, index) => (
                <div key={step.id} className="relative z-10 text-center">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 mx-auto ${getStepColor(step.status)}`}
                  >
                    {getStepIcon(step.status) || index + 1}
                  </div>
                  <p className="text-xs font-medium truncate max-w-[80px] mx-auto">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Workflow steps in detail */}
          <div className="space-y-4 mt-8">
            <h3 className="font-medium">Detalhe das Etapas</h3>
            
            {(isWorkflowComplete || isRejected) && (
              <div className={`p-3 rounded-md ${isRejected ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'}`}>
                <p className="text-sm font-medium flex items-center gap-2">
                  {isRejected ? (
                    <>
                      <XCircle className="h-5 w-5" />
                      Pedido rejeitado
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Workflow concluído
                    </>
                  )}
                </p>
              </div>
            )}
            
            <div className="divide-y">
              {pedido.workflow?.steps.map((step) => (
                <div key={step.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${getStepColor(step.status)}`}></div>
                        <h4 className="font-medium">{step.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Status: {step.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Responsável: {getResponsavel(step.responsavel)}
                      </p>
                      {step.dataConclusao && (
                        <p className="text-sm text-muted-foreground">
                          Concluído em: {new Date(step.dataConclusao).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {renderStepActions(step)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => navigate(`/pedidos/visualizar/${pedido.id}`)}
          >
            Voltar para Detalhes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WorkflowPedido;
