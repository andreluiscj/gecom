
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Eye, FileText, Search, Trash2, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { removerPedido } from '@/data/mockData';
import { toast } from 'sonner';

interface PedidosTableProps {
  pedidos: PedidoCompra[];
  titulo?: string;
}

const PedidosTable: React.FC<PedidosTableProps> = ({ 
  pedidos, 
  titulo = 'Pedidos de Compra' 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState<PedidoCompra | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pedidoDetalhes, setPedidoDetalhes] = useState<PedidoCompra | null>(null);

  const filteredPedidos = pedidos.filter(
    (pedido) =>
      (pedido.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.fundoMonetario.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || pedido.status === statusFilter)
  );

  const handleExcluir = (pedido: PedidoCompra) => {
    removerPedido(pedido.id, pedido.setor);
    toast.success('Pedido excluído com sucesso!');
    setPedidoParaExcluir(null);
  };

  const handleVisualizar = (id: string) => {
    navigate(`/pedidos/${id}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'Reprovado':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar pedidos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Reprovado">Reprovado</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/pedidos/novo')}>Nova DFD</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Fundo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Visualizar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPedidos.length > 0 ? (
                filteredPedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{formatDate(pedido.dataCompra)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {pedido.descricao}
                    </TableCell>
                    <TableCell>{formatCurrency(pedido.valorTotal)}</TableCell>
                    <TableCell>{pedido.fundoMonetario}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(pedido.status)}>
                        {pedido.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleVisualizar(pedido.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialog de confirmação para excluir */}
        {pedidoParaExcluir && (
          <Dialog
            open={Boolean(pedidoParaExcluir)}
            onOpenChange={(open) => !open && setPedidoParaExcluir(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPedidoParaExcluir(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => pedidoParaExcluir && handleExcluir(pedidoParaExcluir)}
                >
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default PedidosTable;
