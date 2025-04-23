
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { obterTodosPedidos, atualizarWorkflow } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { funcionarios, getFuncionarios, filtrarFuncionariosPorSetor } from '@/data/funcionarios/mockFuncionarios';
import { canEditWorkflowStep } from '@/utils/authHelpers';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { WorkflowStep } from '@/types';

const AprovacaoDFD: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [etapaAtual, setEtapaAtual] = useState<WorkflowStep | null>(null);
  const [nextResponsavel, setNextResponsavel] = useState<string>('');
  const [justificativa, setJustificativa] = useState<string>('');
  const [showApprovalDialog, setShowApprovalDialog] = useState<boolean>(false);
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  const [funcionariosList, setFuncionariosList] = useState<any[]>([]);
  
  // Determine if current user can edit this workflow step
  const [canEdit, setCanEdit] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchPedido = async () => {
      setLoading(true);
      try {
        if (id) {
          const todosPedidos = obterTodosPedidos();
          const fetchedPedido = todosPedidos.find(p => p.id === id);
          
          if (fetchedPedido) {
            setPedido(fetchedPedido);
            
            if (fetchedPedido.workflow && fetchedPedido.workflow.steps) {
              const currentStep = fetchedPedido.workflow.steps[fetchedPedido.workflow.etapa_atual - 1];
              setEtapaAtual(currentStep);
              
              // Check if user can edit this workflow step
              const userRole = localStorage.getItem('user-role');
              if (userRole === 'admin' || userRole === 'manager') {
                setCanEdit(true);
              } else {
                setCanEdit(false);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        toast.error("Não foi possível carregar o pedido. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPedido();
    
    // Load the list of potential responsibles for the next step
    const allFuncionarios = getFuncionarios();
    setFuncionariosList(allFuncionarios);
    
  }, [id]);
  
  const handleApprove = async () => {
    if (!etapaAtual || !pedido) return;
    
    try {
      // Update current step status to completed
      const updatedWorkflow = await atualizarWorkflow(
        pedido.id,
        etapaAtual.id,
        'Concluído',
        justificativa,
        nextResponsavel
      );
      
      if (updatedWorkflow) {
        toast.success("DFD aprovada com sucesso!");
        navigate(`/pedidos/${id}`);
      } else {
        toast.error("Erro ao aprovar DFD.");
      }
    } catch (error) {
      console.error("Erro na aprovação:", error);
      toast.error("Erro ao processar aprovação. Tente novamente.");
    } finally {
      setShowApprovalDialog(false);
    }
  };
  
  const handleReject = async () => {
    if (!etapaAtual || !pedido) return;
    
    try {
      // Update workflow status to rejected
      const updatedWorkflow = await atualizarWorkflow(
        pedido.id,
        etapaAtual.id,
        'Rejeitado',
        justificativa
      );
      
      if (updatedWorkflow) {
        toast.success("DFD rejeitada com sucesso.");
        navigate(`/pedidos/${id}`);
      } else {
        toast.error("Erro ao rejeitar DFD.");
      }
    } catch (error) {
      console.error("Erro na rejeição:", error);
      toast.error("Erro ao processar rejeição. Tente novamente.");
    } finally {
      setShowRejectDialog(false);
    }
  };
  
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }
  
  if (!pedido) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>O pedido que você está procurando não existe ou foi removido.</p>
            <Button className="mt-4" onClick={() => navigate('/pedidos')}>
              Ver todos os pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Fix title access to use titulo instead
  const stepTitle = etapaAtual?.titulo || '';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Aprovação de DFD</h1>
        </div>
        
        <Badge variant={pedido.status === 'Em Análise' ? 'default' : 'outline'}>
          {pedido.status}
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {pedido.descricao}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Solicitado em {formatDate(pedido.data_compra)} • {pedido.setor} • Total: {formatCurrency(pedido.valor_total)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Step Information */}
          <div className="border p-4 rounded-lg bg-muted/30">
            <h3 className="font-medium mb-2">Etapa atual: {stepTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={etapaAtual?.status === 'Em Andamento' ? 'default' : 'outline'}>
                  {etapaAtual?.status}
                </Badge>
              </div>
              {etapaAtual?.responsavel && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Responsável</p>
                  <p>{etapaAtual.responsavel}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Approval Actions */}
          {canEdit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="justificativa">Justificativa</Label>
                  <Textarea
                    id="justificativa"
                    placeholder="Informe sua justificativa para aprovação ou rejeição"
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="proximo-responsavel">Próximo responsável</Label>
                  <Select onValueChange={setNextResponsavel} value={nextResponsavel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o próximo responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionariosList.map((func) => (
                        <SelectItem key={func.id} value={func.id}>
                          {func.nome} ({func.cargo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectDialog(true)} 
                  className="flex gap-2 items-center text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  Reprovar DFD
                </Button>
                <Button 
                  onClick={() => setShowApprovalDialog(true)} 
                  className="flex gap-2 items-center"
                >
                  <CheckCircle className="h-4 w-4" />
                  Aprovar DFD
                </Button>
              </div>
            </div>
          )}
          
          {!canEdit && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                Você não tem permissão para aprovar ou rejeitar esta DFD nesta etapa.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Aprovação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja aprovar esta DFD? Isso avançará para a próxima etapa do workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p><strong>Etapa Atual:</strong> {stepTitle}</p>
            {justificativa && (
              <p className="mt-2"><strong>Justificativa:</strong> {justificativa}</p>
            )}
            {nextResponsavel && (
              <p className="mt-2"><strong>Próximo Responsável:</strong> {
                funcionariosList.find(f => f.id === nextResponsavel)?.nome || 'Não especificado'
              }</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApprove}>
              Confirmar Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Rejeição</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja rejeitar esta DFD? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p><strong>Etapa Atual:</strong> {stepTitle}</p>
            {justificativa && (
              <p className="mt-2"><strong>Motivo da rejeição:</strong> {justificativa}</p>
            )}
            {!justificativa && (
              <p className="mt-2 text-red-600">É recomendado fornecer um motivo para a rejeição.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AprovacaoDFD;
