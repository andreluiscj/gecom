
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { obterTodosPedidos } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getSetorIcon } from '@/utils/iconHelpers';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PedidoCompra } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { gerarPDF } from '@/utils/pdfGenerator';

const VisualizarPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pedido, setPedido] = useState<PedidoCompra | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPedido() {
      if (!id) return;
      setLoading(true);
      
      try {
        const pedidos = await obterTodosPedidos();
        const foundPedido = pedidos.find(p => p.id === id);
        
        if (foundPedido) {
          setPedido(foundPedido);
        } else {
          toast.error('Pedido não encontrado');
        }
      } catch (error) {
        console.error('Error fetching pedido details:', error);
        toast.error('Erro ao carregar detalhes do pedido');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPedido();
  }, [id]);

  const handleDelete = async () => {
    if (pedido) {
      try {
        // const success = await removerPedido(pedido.id, pedido.setor);
        const success = true; // Mocked for now
        if (success) {
          toast.success('DFD excluída com sucesso!');
          navigate('/pedidos');
        }
      } catch (error) {
        console.error('Error deleting pedido:', error);
        toast.error('Erro ao excluir pedido');
      }
    }
    setConfirmDelete(false);
  };

  const handleDownloadPDF = () => {
    if (pedido) {
      gerarPDF(pedido);
      toast.success('PDF gerado com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
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
  
  const statusColor = {
    'Pendente': 'bg-orange-100 text-orange-800',
    'Em Análise': 'bg-blue-100 text-blue-800',
    'Aprovado': 'bg-green-100 text-green-800',
    'Em Andamento': 'bg-purple-100 text-purple-800',
    'Concluído': 'bg-green-100 text-green-800',
    'Rejeitado': 'bg-red-100 text-red-800',
  };
  
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
            <Badge variant="outline" className={statusColor[pedido.status] || 'bg-gray-100 text-gray-800'}>
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
                {pedido.responsavel && (
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Responsável:</span>
                    <span>{pedido.responsavel.nome}</span>
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
            
            {pedido.observacoes && (
              <div>
                <h3 className="font-semibold mb-2">Justificativa</h3>
                <p className="text-sm">{pedido.observacoes}</p>
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
                  {pedido.items && pedido.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm">{item.nome}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantidade}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.valorUnitario)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(item.valorTotal || (item.quantidade * item.valorUnitario))}</td>
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
