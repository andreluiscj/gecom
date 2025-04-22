
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PedidoCompra, WorkflowStep } from '@/types';
import { getPedido, updatePedido } from '@/services/dfdService';
import { canEditWorkflowStepSync, getUserNameSync, getUserRoleSync } from '@/utils/authHelpers';
import WorkflowTimeline from '@/components/Pedidos/WorkflowTimeline';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, ChevronsRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AprovacaoDFD: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  
  const userRole = getUserRoleSync();
  const userName = getUserNameSync();

  useEffect(() => {
    if (!id) {
      setError('Pedido ID não fornecido.');
      setLoading(false);
      return;
    }

    const fetchPedido = async () => {
      try {
        setLoading(true);
        const fetchedPedido = await getPedido(id);
        if (fetchedPedido) {
          setPedido(fetchedPedido);
          setWorkflowSteps(fetchedPedido.workflowSteps || []);
          
          // Find the current step where status is 'Pendente'
          const pendingStep = fetchedPedido.workflowSteps?.find(step => step.status === 'Pendente');
          setCurrentStep(pendingStep || null);
        } else {
          setError('Pedido não encontrado.');
        }
      } catch (err: any) {
        setError(`Erro ao buscar pedido: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  const podeAprovar = userRole === 'prefeito' || userRole === 'gestor' || userRole === 'admin';

  const handleAprovar = async () => {
    if (!pedido) return;
    
    try {
      setLoading(true);
      
      // Clone the pedido to avoid mutating the state directly
      const updatedPedido = { ...pedido };
      
      // Find the index of the current pending step
      const currentStepIndex = updatedPedido.workflowSteps?.findIndex(step => step.status === 'Pendente') ?? -1;
      
      if (currentStepIndex !== -1 && updatedPedido.workflowSteps) {
        // Update the current step
        updatedPedido.workflowSteps[currentStepIndex] = {
          ...updatedPedido.workflowSteps[currentStepIndex],
          status: 'Concluído',
          dataConclusao: new Date(),
          observacoes: observacoes,
        };
        
        // If there is a next step, set its status to 'Pendente'
        if (currentStepIndex < updatedPedido.workflowSteps.length - 1) {
          updatedPedido.workflowSteps[currentStepIndex + 1] = {
            ...updatedPedido.workflowSteps[currentStepIndex + 1],
            status: 'Pendente',
          };
        } else {
          // If there is no next step, set the pedido status to 'Aprovado'
          updatedPedido.status = 'Aprovado';
        }
      }
      
      // Update the pedido with the modified workflow steps
      await updatePedido(updatedPedido);
      
      setPedido(updatedPedido);
      setWorkflowSteps(updatedPedido.workflowSteps || []);
      setCurrentStep(updatedPedido.workflowSteps?.[currentStepIndex + 1] || null);
      toast.success('Pedido aprovado com sucesso!');
      setIsDialogOpen(false);
      setObservacoes('');
      
      // Redirect to the next step or to the list of pedidos
      if (currentStepIndex === updatedPedido.workflowSteps?.length - 1) {
        navigate('/pedidos');
      }
    } catch (err: any) {
      console.error('Erro ao aprovar pedido:', err);
      toast.error(`Erro ao aprovar pedido: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReprovar = async () => {
    if (!pedido) return;
    
    try {
      setLoading(true);
      
      // Clone the pedido to avoid mutating the state directly
      const updatedPedido = { ...pedido };
      
      // Set the pedido status to 'Reprovado'
      updatedPedido.status = 'Rejeitado';
      
      // Find the index of the current pending step
      const currentStepIndex = updatedPedido.workflowSteps?.findIndex(step => step.status === 'Pendente') ?? -1;
      
      if (currentStepIndex !== -1 && updatedPedido.workflowSteps) {
        // Update the current step
        updatedPedido.workflowSteps[currentStepIndex] = {
          ...updatedPedido.workflowSteps[currentStepIndex],
          status: 'Reprovado',
          dataConclusao: new Date(),
          observacoes: observacoes,
        };
      }
      
      // Update the pedido with the modified workflow steps
      await updatePedido(updatedPedido);
      
      setPedido(updatedPedido);
      setWorkflowSteps(updatedPedido.workflowSteps || []);
      setCurrentStep(null);
      toast.success('Pedido reprovado com sucesso!');
      setIsDialogOpen(false);
      setObservacoes('');
      navigate('/pedidos');
    } catch (err: any) {
      console.error('Erro ao reprovar pedido:', err);
      toast.error(`Erro ao reprovar pedido: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Carregando informações do pedido...</div>;
  }

  if (error || !pedido) {
    return <div className="text-center text-red-500">Erro: {error || 'Pedido não encontrado.'}</div>;
  }

  const isGestorOrHigher = userRole === 'gestor' || userRole === 'admin' || userRole === 'prefeito';
  const podeEditar = currentStep && canEditWorkflowStepSync(currentStep.title);
  const showActions = podeAprovar && podeEditar;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Aprovação de DFD</CardTitle>
          <CardDescription>
            Visualize e aprove o pedido de compra.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Descrição:</strong> {pedido.descricao}
            </div>
            <div>
              <strong>Setor:</strong> {pedido.setor}
            </div>
            <div>
              <strong>Solicitante:</strong> {pedido.solicitante}
            </div>
            <div>
              <strong>Data da Compra:</strong> {format(new Date(pedido.dataCompra), 'PPP', { locale: ptBR })}
            </div>
            <div>
              <strong>Valor Total:</strong> R$ {pedido.valorTotal.toFixed(2)}
            </div>
            <div>
              <strong>Status:</strong> <Badge>{pedido.status}</Badge>
            </div>
          </div>

          <WorkflowTimeline workflowSteps={workflowSteps} />

          {currentStep && (
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-semibold">Ação Necessária</h3>
              <p>
                Aguardando sua aprovação para a etapa: <strong>{currentStep.title}</strong>
              </p>
              
              {showActions ? (
                <div className="flex justify-end gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Reprovar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Reprovar Pedido</DialogTitle>
                        <DialogDescription>
                          Tem certeza de que deseja reprovar este pedido?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="observacoes" className="text-right">
                            Observações
                          </Label>
                          <div className="col-span-3">
                            <Textarea
                              id="observacoes"
                              placeholder="Adicione suas observações aqui"
                              className="col-span-3"
                              value={observacoes}
                              onChange={(e) => setObservacoes(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-end'>
                        <Button type="submit" onClick={handleReprovar}>
                          Confirmar Reprovação
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Aprovar Pedido</DialogTitle>
                        <DialogDescription>
                          Tem certeza de que deseja aprovar este pedido?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="observacoes" className="text-right">
                            Observações
                          </Label>
                          <div className="col-span-3">
                            <Textarea
                              id="observacoes"
                              placeholder="Adicione suas observações aqui"
                              className="col-span-3"
                              value={observacoes}
                              onChange={(e) => setObservacoes(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-end'>
                        <Button type="submit" onClick={handleAprovar}>
                          Confirmar Aprovação
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <ChevronsRight className="h-4 w-4 mr-2" />
                  Aguardando ação de um gestor...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AprovacaoDFD;
