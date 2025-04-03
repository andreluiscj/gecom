
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Item } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DfdPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataCompra: string;
  descricao: string;
  fundoMonetario: string;
  setor: string;
  itens: Item[];
  total: number;
  onConfirm: () => void;
}

const DfdPreview: React.FC<DfdPreviewProps> = ({
  open,
  onOpenChange,
  dataCompra,
  descricao,
  fundoMonetario,
  setor,
  itens,
  total,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévia do Documento de Formalização de Demanda</DialogTitle>
          <DialogDescription>
            Revise as informações do seu pedido antes de enviar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-muted-foreground mb-1">Data da Compra</h4>
              <p>{formatDate(new Date(dataCompra))}</p>
            </div>
            <div>
              <h4 className="font-medium text-muted-foreground mb-1">Setor</h4>
              <p>{setor}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-muted-foreground mb-1">Descrição</h4>
            <p className="text-sm">{descricao}</p>
          </div>

          <div>
            <h4 className="font-medium text-muted-foreground mb-1">Fundo Monetário</h4>
            <p>{fundoMonetario}</p>
          </div>

          <div>
            <h4 className="font-medium text-muted-foreground mb-1">Itens</h4>
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
                {itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell className="text-right">{item.quantidade}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.valorTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-lg font-medium">Valor Total:</span>
            <span className="text-lg font-bold">{formatCurrency(total)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Revisar
          </Button>
          <Button onClick={onConfirm}>Confirmar e Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DfdPreview;
