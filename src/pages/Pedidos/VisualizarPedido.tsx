
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getSetorIcon } from '@/utils/iconHelpers';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { gerarPDF } from '@/utils/pdfGenerator';
import { getPedidoById, deletePedido } from '@/integrations/supabase/pedidos';
import { PedidoCompra } from '@/types';

const VisualizarPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPedido() {
      if (!id) return;
      
      try {
        const data = await getPedidoById(id);
        setPedido(data);
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        toast.error('Erro ao carregar pedido');
        
        // Fallback to local storage
        const pedidosStorage = localStorage.getItem('pedidos');
        if (pedidosStorage) {
          const storedPedidos = JSON.parse(pedidosStorage);
          const storedPedido = storedPedidos.find((p: PedidoCompra) => p.id === id);
          if (storedPedido) {
            setPedido(storedPedido);
          } else {
            toast.error('Pedido não encontrado');
            navigate('/pedidos');
          }
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchPedido();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!pedido) return;
    
    try {
      await deletePedido(pedido.id);
      
      // Also remove from localStorage if it exists there
      const pedidosStorage = localStorage.getItem('pedidos');
      if (pedidosStorage) {
        const storedPedidos = JSON.parse(pedidosStorage);
        const updatedPedidos = storedPedidos.filter((p: PedidoCompra) => p.id !== pedido.id);
        localStorage.setItem('pedidos', JSON.stringify(updatedPedidos));
      }
      
      toast.success('DFD excluída com sucesso!');
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      toast.error('Erro ao excluir pedido');
    } finally {
      setConfirmDelete(false);
    }
  };

  const handleDownloadPDF = () => {
    if (pedido) {
      gerarPDF(pedido);
      toast.success('PDF gerado com sucesso!');
    }
  };

  const statusColor = {
    'Pendente': 'bg-orange-100 text-orange-800',
    'Em Análise': 'bg-blue-100 text-blue-800',
    'Aprovado': 'bg-green-100 text-green-800',
    'Em Andamento': 'bg-purple-100 text-purple-800',
    'Concluído': 'bg-green-100 text-green-800',
    'Rejeitado': 'bg-red-100 text-red-800',
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!pedido) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-xl">Pedido não encontrado</p>
        <Button onClick={() => navigate('/pedidos')}>Voltar para a lista</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Visualização da DFD</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir DFD
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              {getSetorIcon(pedido.setor)}
            </span>
            <span>{pedido.descricao}</span>
          </CardTitle>
          {pedido.status && (
            <Badge variant="outline" className={statusColor[pedido.status as keyof typeof statusColor]}>
              {pedido.status}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Informações Gerais</h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Data do Pedido:</span>
                  <span>{formatDate(pedido.dataCompra)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Secretaria:</span>
                  <span>{pedido.setor}</span>
                </p>
                {pedido.solicitante && (
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Responsável:</span>
                    <span>{pedido.solicitante}</span>
                  </p>
                )}
                {pedido.fundoMonetario && (
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Fundo Monetário:</span>
                    <span>{pedido.fundoMonetario}</span>
                  </p>
                )}
                {pedido.localEntrega && (
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Local de Entrega:</span>
                    <span>{pedido.localEntrega}</span>
                  </p>
                )}
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Valor Total:</span>
                  <span className="font-semibold">{formatCurrency(pedido.valorTotal)}</span>
                </p>
              </div>
            </div>
            
            {pedido.justificativa && (
              <div>
                <h3 className="font-semibold mb-2">Justificativa</h3>
                <p className="text-sm">{pedido.justificativa}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Itens</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Nome</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Quantidade</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Valor Unitário</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pedido.itens.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm">{item.nome}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantidade}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.valorUnitario)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(item.valorTotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50">
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Total</td>
                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(pedido.valorTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {pedido.observacoes && (
            <div>
              <h3 className="font-semibold mb-2">Observações</h3>
              <p className="text-sm text-muted-foreground">{pedido.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm delete dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta DFD? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisualizarPedido;
