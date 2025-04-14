
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import WorkflowIndicator from '@/components/Pedidos/WorkflowIndicator';
import { deletePedido, getPedidos } from '@/services/pedidoService';
import { toast } from 'sonner';

const VisualizarPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const carregarPedido = async () => {
      if (!id) return;
      
      try {
        const pedidos = await getPedidos();
        const pedidoEncontrado = pedidos.find(p => p.id === id);
        
        if (pedidoEncontrado) {
          setPedido(pedidoEncontrado);
        } else {
          toast.error('Pedido não encontrado');
          navigate('/pedidos');
        }
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        toast.error('Erro ao carregar detalhes do pedido');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarPedido();
  }, [id, navigate]);
  
  const handleExcluir = async () => {
    if (!pedido || !window.confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }
    
    try {
      await deletePedido(pedido.id);
      toast.success('Pedido excluído com sucesso');
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      toast.error('Erro ao excluir pedido');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando detalhes do pedido...</p>
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

  // Formatar a data
  const dataFormatada = formatDate(pedido.dataCompra);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pedido #{pedido.id.substring(0, 8)}</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => navigate('/pedidos')}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => navigate(`/pedidos/editar/${pedido.id}`)}
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleExcluir}
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Pedido</CardTitle>
          <CardDescription>
            Criado em {formatDate(pedido.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pedido.workflow && (
            <div className="mb-6">
              <Label className="text-muted-foreground">Status do Pedido</Label>
              <WorkflowIndicator workflow={pedido.workflow} currentStatus={pedido.status} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p className="font-medium">{pedido.descricao}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data do Pedido</Label>
              <p className="font-medium">{dataFormatada}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Setor</Label>
              <p className="font-medium">{pedido.setor}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fundo Monetário</Label>
              <p className="font-medium">{pedido.fundoMonetario}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="font-medium">{pedido.status}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Valor Total</Label>
              <p className="font-medium">{formatCurrency(pedido.valorTotal)}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <Label className="text-muted-foreground block mb-3">Itens do Pedido</Label>
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Nome</th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Quantidade</th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Valor Unitário</th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.itens.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3">{item.nome}</td>
                      <td className="px-4 py-3 text-right">{item.quantidade}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.valorUnitario)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.valorTotal || (item.quantidade * item.valorUnitario))}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td colSpan={3} className="px-4 py-3 text-right">Total:</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(pedido.valorTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            {pedido.justificativa && (
              <div>
                <Label className="text-muted-foreground">Justificativa</Label>
                <p className="text-sm mt-1">{pedido.justificativa}</p>
              </div>
            )}
            
            {pedido.localEntrega && (
              <div>
                <Label className="text-muted-foreground">Local de Entrega</Label>
                <p className="text-sm mt-1">{pedido.localEntrega}</p>
              </div>
            )}
            
            {pedido.observacoes && (
              <div>
                <Label className="text-muted-foreground">Observações</Label>
                <p className="text-sm mt-1">{pedido.observacoes}</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/pedidos')}
          >
            Voltar para Lista
          </Button>
          <Button
            onClick={() => navigate(`/pedidos/workflow/${pedido.id}`)}
          >
            Gerenciar Workflow
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VisualizarPedido;
