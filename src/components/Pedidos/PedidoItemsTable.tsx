
import React from 'react';
import { Item } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters';

interface PedidoItemsTableProps {
  items: Item[];
}

const PedidoItemsTable: React.FC<PedidoItemsTableProps> = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground">Nenhum item encontrado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Valor Unitário</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nome}</TableCell>
              <TableCell className="text-right">{item.quantidade}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.valorTotal || (item.quantidade * item.valorUnitario))}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(items.reduce((total, item) => total + (item.valorTotal || (item.quantidade * item.valorUnitario)), 0))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PedidoItemsTable;
