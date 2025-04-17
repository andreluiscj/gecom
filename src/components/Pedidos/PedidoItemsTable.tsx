
import React from 'react';
import { Item } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PedidoItemsTableProps {
  items: Item[];
}

const PedidoItemsTable: React.FC<PedidoItemsTableProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-muted-foreground">Nenhum item encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Valor Unitário</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nome}</TableCell>
              <TableCell className="text-right">{item.quantidade}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.valorTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PedidoItemsTable;
