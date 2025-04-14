
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { PedidoCompra, Funcionario } from '@/types';
import { toast } from 'sonner';
import { getPedidos } from '@/services/pedidoService';
import { getFuncionarios } from '@/services/funcionarioService';
import { DEFAULT_WORKFLOW_STEPS, funcionarioTemPermissao } from '@/utils/workflowHelpers';

const AprovacaoDFD: React.FC = () => {
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [aprovadores, setAprovadores] = useState<Funcionario[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPendentes = async () => {
      try {
        // Get the current user ID from local storage
        const funcionarioId = localStorage.getItem('funcionario-id');
        if (!funcionarioId) {
          toast.error('Usuário não identificado');
          navigate('/login');
          return;
        }

        // Load pedidos and find one pending approval
        const pedidos = await getPedidos();
        const pendente = pedidos.find(p => 
          p.status === 'Pendente' && 
          p.workflow?.steps.some(s => s.status === 'Pendente')
        );

        if (pendente) {
          setPedido(pendente);
        }

        // Load potential approvers
        const funcionarios = await getFuncionarios();
        const aprovadoresPossiveis = funcionarios.length > 0 ? 
          funcionarios.filter(f => 
            f.cargo?.toLowerCase().includes('gerente') || 
            f.cargo?.toLowerCase().includes('diretor')
          ) : [];

        setAprovadores(aprovadoresPossiveis);
      } catch (error) {
        console.error('Erro ao carregar aprovações:', error);
        toast.error('Erro ao carregar solicitações pendentes');
      } finally {
        setCarregando(false);
      }
    };

    carregarPendentes();
  }, [navigate]);

  const aprovarSolicitacao = () => {
    if (!pedido) return;
    
    try {
      // Update workflow status
      setPedido(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          status: 'Aprovado',
          workflow: {
            ...prev.workflow!,
            steps: prev.workflow!.steps.map(step => ({
              ...step,
              status: 'Concluído'
            })),
            percentComplete: 100,
            currentStep: DEFAULT_WORKFLOW_STEPS.length
          }
        };
      });
      
      toast.success('Solicitação aprovada com sucesso');
      
      // In production, this would update the database
      setTimeout(() => {
        navigate('/pedidos');
      }, 1500);
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      toast.error('Erro ao processar aprovação');
    }
  };
  
  const rejeitarSolicitacao = () => {
    if (!pedido) return;
    
    try {
      // Update workflow status
      setPedido(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          status: 'Rejeitado',
          workflow: {
            ...prev.workflow!,
            steps: prev.workflow!.steps.map(step => ({
              ...step,
              status: step.status === 'Concluído' ? 'Concluído' : 'Pendente'
            })),
            percentComplete: 0
          }
        };
      });
      
      toast.success('Solicitação rejeitada');
      
      // In production, this would update the database
      setTimeout(() => {
        navigate('/pedidos');
      }, 1500);
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      toast.error('Erro ao processar rejeição');
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando solicitações...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sem solicitações pendentes</AlertTitle>
        <AlertDescription>
          Não há documentos de formalização de demanda pendentes de aprovação.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-2">Aprovação de DFD</h1>
        <p className="text-muted-foreground">
          Revise e aprove/rejeite documentos de formalização de demanda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitação #{pedido.id.substring(0, 8)}</CardTitle>
          <CardDescription>
            Criado em {pedido.createdAt.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p>{pedido.descricao}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Setor</Label>
              <p>{pedido.setor}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Valor Total</Label>
              <p className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(pedido.valorTotal)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Justificativa</Label>
              <p>{pedido.justificativa || 'Não informada'}</p>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground mb-2 block">Itens</Label>
            <table className="w-full border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-right">Quantidade</th>
                  <th className="p-2 text-right">Valor Unitário</th>
                  <th className="p-2 text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {pedido.itens.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.nome}</td>
                    <td className="p-2 text-right">{item.quantidade}</td>
                    <td className="p-2 text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.valorUnitario)}
                    </td>
                    <td className="p-2 text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.valorTotal || item.quantidade * item.valorUnitario)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <Label className="text-muted-foreground mb-2 block">Possíveis Aprovadores</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {aprovadores.length > 0 ? (
                aprovadores.map((aprovador) => (
                  <div key={aprovador.id} className="p-2 border rounded">
                    <p className="font-medium">{aprovador.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {aprovador.cargo} - {aprovador.setor}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-muted-foreground">
                  Nenhum aprovador disponível
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/pedidos/visualizar/${pedido.id}`)}
          >
            Ver Detalhes
          </Button>

          <div className="space-x-2">
            <Button
              variant="destructive"
              onClick={rejeitarSolicitacao}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Rejeitar
            </Button>
            <Button 
              onClick={aprovarSolicitacao}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Aprovar
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AprovacaoDFD;
