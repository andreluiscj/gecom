
import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Prefeito {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  mandatoInicio: Date;
  mandatoFim: Date;
  municipio: string;
}

interface PrefeitoTableProps {
  prefeitos: Prefeito[];
  handleEdit: (prefeito: Prefeito) => void;
  setSelectedPrefeito: (prefeito: Prefeito) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
}

export const PrefeitoTable: React.FC<PrefeitoTableProps> = ({
  prefeitos,
  handleEdit,
  setSelectedPrefeito,
  setIsDeleteDialogOpen,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Início Mandato</TableHead>
            <TableHead>Fim Mandato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prefeitos.map((prefeito) => (
            <TableRow key={prefeito.id}>
              <TableCell className="font-medium">{prefeito.nome}</TableCell>
              <TableCell>{prefeito.email}</TableCell>
              <TableCell>{prefeito.cpf}</TableCell>
              <TableCell>{prefeito.telefone}</TableCell>
              <TableCell>{format(prefeito.mandatoInicio, 'dd/MM/yyyy')}</TableCell>
              <TableCell>{format(prefeito.mandatoFim, 'dd/MM/yyyy')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(prefeito)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      setSelectedPrefeito(prefeito);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {prefeitos.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Nenhum prefeito cadastrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
