
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Circle, Clock, AlertCircle, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { obterTodosPedidos, atualizarEtapaWorkflow } from '@/data/mockData';
import { toast } from 'sonner';
import { WorkflowStepStatus } from '@/types';
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

const WorkflowPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const allPedidos = obterTodosPedidos();
  const pedido = useMemo(() => allPedidos.find(p => p.id === id), [id, allPedidos, refreshKey]);

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

  const handleUpdateStepStatus = (stepIndex: number, status: WorkflowStepStatus) => {
    if (pedido && pedido.workflow) {
      atualizarEtapaWorkflow(pedido.id, stepIndex, status);
      toast.success(`Status da etapa atualizado para ${status}`);
      setRefreshKey(prev => prev + 1); // Force refresh
    }
  };

  const handleUpdateResponsavel = (stepIndex: number, responsavel: string) => {
    if (pedido && pedido.workflow) {
      atualizarEtapaWorkflow(
        pedido.id, 
        stepIndex, 
        pedido.workflow.steps[stepIndex].status,
        undefined,
        responsavel
      );
      toast.success('Responsável atualizado com sucesso');
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleUpdateDataConclusao = (stepIndex: number, data: Date | undefined) => {
    if (pedido && pedido.workflow) {
      atualizarEtapaWorkflow(
        pedido.id, 
        stepIndex, 
        pedido.workflow.steps[stepIndex].status,
        pedido.workflow.steps[stepIndex].date,
        pedido.workflow.steps[stepIndex].responsavel,
        data
      );
      toast.success('Data de conclusão atualizada com sucesso');
      setRefreshKey(prev => prev + 1);
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

  const getStatusClass = (status: WorkflowStepStatus) => {
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
              color={getProgressColor(pedido.workflow?.percentComplete || 0)}
            />
          </div>
          
          <div className="space-y-6 mt-8">
            {pedido.workflow?.steps.map((step, index) => (
              <div key={step.id} className={`border rounded-lg p-4 ${getStatusClass(step.status)}`}>
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
                    </div>
                    
                    <Select
                      value={step.status}
                      onValueChange={(value) => handleUpdateStepStatus(index, value as WorkflowStepStatus)}
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
                      />
                    </div>

                    {/* Completion Date */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        <Calendar className="h-3 w-3 inline mr-1" /> Data de Conclusão
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`w-full justify-start text-left font-normal h-8 text-sm ${!step.dataConclusao ? 'text-muted-foreground' : ''}`}
                          >
                            <Calendar className="mr-2 h-3 w-3" />
                            {step.dataConclusao ? format(new Date(step.dataConclusao), 'dd/MM/yyyy') : 'Selecionar data'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={step.dataConclusao}
                            onSelect={handleUpdateDataConclusao.bind(null, index)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowPedido;
