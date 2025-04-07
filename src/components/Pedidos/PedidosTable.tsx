
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
import { Calendar as CalendarIcon, Eye, FileText, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fundosMonetarios } from '@/data/mockData';
import { cn } from '@/lib/utils';

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
  const [setorFilter, setSetorFilter] = useState<string>("todos");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  
  // Extract unique setores from pedidos for the filter dropdown
  const uniqueSetores = Array.from(new Set(pedidos.map(p => p.setor)));
  
  // Sort pedidos by date (newest first) before filtering
  const sortedPedidos = [...pedidos].sort((a, b) => b.dataCompra.getTime() - a.dataCompra.getTime());
  
  const filteredPedidos = sortedPedidos.filter(
    (pedido) => {
      // Text search filter
      const textMatch = 
        pedido.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.fundoMonetario.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = statusFilter === 'todos' || pedido.status === statusFilter;
      
      // Setor filter
      const setorMatch = setorFilter === 'todos' || pedido.setor === setorFilter;
      
      // Date range filter
      const dateFromMatch = !dateFrom || pedido.dataCompra >= dateFrom;
      const dateToMatch = !dateTo || pedido.dataCompra <= dateTo;
      
      return textMatch && statusMatch && setorMatch && dateFromMatch && dateToMatch;
    }
  );

  const handleVisualizar = (id: string) => {
    // Navigate to the pedido detail page
    navigate(`/pedidos/${id}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'Reprovado':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'Em Andamento':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setSetorFilter('todos');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <div className="flex flex-col gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar pedidos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Reprovado">Reprovado</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={setorFilter} onValueChange={setSetorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os setores</SelectItem>
                {uniqueSetores.map((setor) => (
                  <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-between">
            <Button variant="secondary" onClick={resetFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={() => navigate('/pedidos/novo')}>Nova DFD</Button>
          </div>
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
                <TableHead>Setor</TableHead>
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
                    <TableCell>{pedido.setor}</TableCell>
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
                  <TableCell colSpan={7} className="text-center py-8">
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
