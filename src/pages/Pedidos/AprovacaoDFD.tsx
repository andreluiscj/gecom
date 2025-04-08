import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, CheckCircle2 } from 'lucide-react';
import { obterTodosPedidos, atualizarEtapaWorkflow } from '@/data/mockData';
import { getFuncionarios, filtrarFuncionariosPorSetor } from '@/data/funcionarios/mockFuncionarios';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Funcionario, WorkflowStepStatus } from '@/types';
import { getUserRole } from '@/utils/authHelpers';
import { DEFAULT_WORKFLOW_STEPS, funcionarioTemPermissao } from '@/utils/workflowHelpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ResponsavelData {
  stepIndex: number;
  stepTitle: string;
  responsavelId: string;
  dataLimite: Date | undefined;
}

const AprovacaoDFD: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userRole = getUserRole();
  
  const allPedidos = obterTodosPedidos();
  const pedido = useMemo(() => allPedidos.find(p => p.id === id), [id, allPedidos]);
  
  // Filtrar funcionários pelo setor do pedido
  const funcionarios = useMemo(() => {
    if (pedido) {
      return filtrarFuncionariosPorSetor(pedido.setor);
    }
    return [];
  }, [pedido]);
  
  const [responsaveis, setResponsaveis] = useState<ResponsavelData[]>([]);
  const [todosAtribuidos, setTodosAtribuidos] = useState<boolean>(false);

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'manager') {
      toast.error("Você não tem permissão para acessar esta página");
      navigate(-1);
    }
  }, [userRole, navigate]);

  useEffect(() => {
    if (pedido?.workflow?.steps) {
      const initialResponsaveis = pedido.workflow.steps.map((step, index) => ({
        stepIndex: index,
        stepTitle: step.title,
        responsavelId: '',
        dataLimite: undefined
      }));
      setResponsaveis(initialResponsaveis);
    }
  }, [pedido]);

  useEffect(() => {
    if (responsaveis.length === 0) return;
    
    const todosPreenchidos = responsaveis.every(
      r => r.responsavelId && r.dataLimite
    );
    
    setTodosAtribuidos(todosPreenchidos);
  }, [responsaveis]);

  if (!pedido) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
        </div>
      </div>
    );
  }

  const handleSelectResponsavel = (stepIndex: number, funcionarioId: string) => {
    setResponsaveis(prev => prev.map(item => 
      item.stepIndex === stepIndex 
        ? { ...item, responsavelId: funcionarioId } 
        : item
    ));
  };

  const handleSelectData = (stepIndex: number, data: Date | undefined) => {
    setResponsaveis(prev => prev.map(item => 
      item.stepIndex === stepIndex 
        ? { ...item, dataLimite: data } 
        : item
    ));
  };

  const handleAprovarDFD = () => {
    if (!pedido || !pedido.workflow) return;
    
    atualizarEtapaWorkflow(
      pedido.id, 
      0, 
      'Concluído',
      new Date(),
      getUserRole() === 'manager' ? 'Amanda Amarante' : 'Administrador',
      new Date()
    );

    atualizarEtapaWorkflow(
      pedido.id, 
      1, 
      'Em Andamento'
    );

    responsaveis.forEach(resp => {
      if (resp.responsavelId && resp.dataLimite) {
        const funcionario = funcionarios.find(f => f.id === resp.responsavelId);
        if (funcionario) {
          atualizarEtapaWorkflow(
            pedido.id,
            resp.stepIndex,
            pedido.workflow.steps[resp.stepIndex].status,
            undefined,
            funcionario.nome,
            resp.dataLimite
          );
        }
      }
    });

    toast.success("DFD aprovada com sucesso! O processo seguirá para as próximas etapas.");
    navigate(`/pedidos/workflow/${pedido.id}`);
  };

  const getFuncionariosByStep = (stepTitle: string): Funcionario[] => {
    return funcionarios.filter(
      funcionario => {
        if (funcionario.setor === 'Saúde' || 
            (funcionario.setoresAdicionais && funcionario.setoresAdicionais.includes('Saúde'))) {
          return true;
        }
        
        if (funcionario.cargo.includes('Admin') || funcionario.cargo.includes('Gerente')) {
          return true;
        }
        
        return funcionarioTemPermissao(stepTitle, funcionario.permissaoEtapa);
      }
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Aprovação da DFD</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Detalhes do Pedido</CardTitle>
          <CardDescription>
            {pedido.descricao} • Setor: {pedido.setor} • DFD #{pedido.id.substring(0, 8)}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Instruções</h3>
              <p className="text-sm text-blue-700">
                Como gestor(a), você precisa aprovar esta DFD e atribuir responsáveis e datas limite para cada etapa do processo.
                Todos os campos devem ser preenchidos para prosseguir com a aprovação.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Apenas funcionários do setor "{pedido.setor}" ou que atuam neste setor estão disponíveis para atribuição.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Funcionários do setor de Saúde podem trabalhar em qualquer etapa do processo.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b pb-2">Atribuição de Responsabilidades</h3>
              
              {DEFAULT_WORKFLOW_STEPS.map((step, index) => (
                <div key={`step-${index}`} className="border rounded-lg p-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Etapa {index + 1} de {DEFAULT_WORKFLOW_STEPS.length}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          <User className="h-3 w-3 inline mr-1" /> Responsável
                        </label>
                        <Select
                          value={responsaveis[index]?.responsavelId || ''}
                          onValueChange={(value) => handleSelectResponsavel(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um responsável" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFuncionariosByStep(step.title).map(funcionario => (
                              <SelectItem key={funcionario.id} value={funcionario.id}>
                                {funcionario.nome} - {funcionario.cargo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">
                          <Calendar className="h-3 w-3 inline mr-1" /> Data Limite
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {responsaveis[index]?.dataLimite 
                                ? format(responsaveis[index].dataLimite, 'dd/MM/yyyy') 
                                : 'Selecionar data'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={responsaveis[index]?.dataLimite}
                              onSelect={(date) => handleSelectData(index, date)}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={!todosAtribuidos}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aprovar DFD
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar aprovação da DFD</AlertDialogTitle>
                <AlertDialogDescription>
                  Você está prestes a aprovar esta DFD e iniciar o processo de compra.
                  Esta ação não pode ser desfeita e notificará todos os responsáveis atribuídos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleAprovarDFD}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AprovacaoDFD;
