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
import { Edit, FileText, Search, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  const handleVerDetalhes = (pedido: PedidoCompra) => {
    setPedidoDetalhes(pedido);
    setIsDialogOpen(true);
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
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Reprovado">Reprovado</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/pedidos/novo')}>Novo Pedido</Button>
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
                <TableHead className="text-right">Ações</TableHead>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerDetalhes(pedido)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/pedidos/editar/${pedido.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => setPedidoParaExcluir(pedido)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

        {/* Dialog de detalhes do pedido */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            {pedidoDetalhes && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Pedido</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data da Compra</p>
                    <p>{formatDate(pedidoDetalhes.dataCompra)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Setor</p>
                    <p>{pedidoDetalhes.setor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fundo Monetário</p>
                    <p>{pedidoDetalhes.fundoMonetario}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className={getStatusBadgeClass(pedidoDetalhes.status)}>
                      {pedidoDetalhes.status}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                    <p>{pedidoDetalhes.descricao}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Itens</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Valor Unit.</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidoDetalhes.itens.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.nome}</TableCell>
                          <TableCell className="text-right">{item.quantidade}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.valorUnitario)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.valorTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <p className="text-lg font-medium">Valor Total:</p>
                  <p className="text-lg font-bold">{formatCurrency(pedidoDetalhes.valorTotal)}</p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PedidosTable;
