
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
import { Calendar, Eye, FileText, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
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
  const [secretariaFilter, setSecretariaFilter] = useState<string>("todos");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  
  // Extrair secretarias únicas dos pedidos para o dropdown de filtro
  const uniqueSecretarias = Array.from(new Set(pedidos.map(p => p.setor)));
  
  // Ordenar pedidos por data (mais recentes primeiro) antes de filtrar
  const sortedPedidos = [...pedidos].sort((a, b) => {
    // Para garantir que podemos comparar as datas
    const dateA = a.data_compra instanceof Date ? a.data_compra : new Date(a.data_compra);
    const dateB = b.data_compra instanceof Date ? b.data_compra : new Date(b.data_compra);
    return dateB.getTime() - dateA.getTime();
  });
  
  const filteredPedidos = sortedPedidos.filter(
    (pedido) => {
      // Filtro de texto
      const textMatch = 
        pedido.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.fundo_monetario || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de status
      const statusMatch = statusFilter === 'todos' || pedido.status === statusFilter;
      
      // Filtro de secretaria
      const secretariaMatch = secretariaFilter === 'todos' || pedido.setor === secretariaFilter;
      
      // Filtro de intervalo de datas
      const pedidoDate = pedido.data_compra instanceof Date ? pedido.data_compra : new Date(pedido.data_compra);
      
      const dateFromMatch = !dateFrom || pedidoDate >= dateFrom;
      const dateToMatch = !dateTo || pedidoDate <= dateTo;
      
      return textMatch && statusMatch && secretariaMatch && dateFromMatch && dateToMatch;
    }
  );

  const handleVisualizar = (id: string) => {
    // Navegar para a página de detalhes do pedido
    navigate(`/pedidos/${id}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'Rejeitado':
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
    setSecretariaFilter('todos');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <Card className="border shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle className="text-xl text-blue-700">{titulo}</CardTitle>
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
                <SelectItem value="Rejeitado">Reprovado</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={secretariaFilter} onValueChange={setSecretariaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por secretaria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as secretarias</SelectItem>
                {uniqueSecretarias.map((secretaria) => (
                  <SelectItem key={secretaria} value={secretaria || 'Sem Secretaria'}>
                    {secretaria || 'Sem Secretaria'}
                  </SelectItem>
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
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="p-3 pointer-events-auto"
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
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-between">
            <Button variant="secondary" onClick={resetFilters}>
              Limpar Filtros
            </Button>
            <Button 
              onClick={() => navigate('/pedidos/novo')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Nova DFD
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead className="text-blue-800">Data</TableHead>
                <TableHead className="text-blue-800">Descrição</TableHead>
                <TableHead className="text-blue-800">Valor</TableHead>
                <TableHead className="text-blue-800">Fundo</TableHead>
                <TableHead className="text-blue-800">Secretaria</TableHead>
                <TableHead className="text-blue-800">Status</TableHead>
                <TableHead className="text-right text-blue-800">Visualizar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPedidos.length > 0 ? (
                filteredPedidos.map((pedido) => (
                  <TableRow key={pedido.id} className="hover:bg-blue-50/50">
                    <TableCell>
                      {formatDate(pedido.data_compra instanceof Date ? pedido.data_compra : new Date(pedido.data_compra))}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {pedido.descricao}
                    </TableCell>
                    <TableCell>{formatCurrency(pedido.valor_total)}</TableCell>
                    <TableCell>{pedido.fundo_monetario || '-'}</TableCell>
                    <TableCell>{pedido.setor || '-'}</TableCell>
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
                        className="hover:bg-blue-100 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
