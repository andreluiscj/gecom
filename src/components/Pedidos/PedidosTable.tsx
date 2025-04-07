
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
import { Eye, FileText, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  
  const filteredPedidos = pedidos.filter(
    (pedido) =>
      (pedido.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.fundoMonetario.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'todos' || pedido.status === statusFilter)
  );

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
              <SelectItem value="todos">Todos os status</SelectItem>
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
      </CardContent>
    </Card>
  );
};

export default PedidosTable;
