
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Funcionario } from '@/types';

interface GerentesListProps {
  gerentes: Funcionario[];
  onEdit: (gerente: Funcionario) => void;
  onDelete: (gerente: Funcionario) => void;
}

export function GerentesList({ gerentes, onEdit, onDelete }: GerentesListProps) {
  if (gerentes.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <p className="text-muted-foreground">Nenhum gerente encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Secretaria</TableHead>
            <TableHead>Data Contratação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gerentes.map((gerente) => (
            <TableRow key={gerente.id}>
              <TableCell className="font-medium">{gerente.nome}</TableCell>
              <TableCell>{gerente.cpf || '-'}</TableCell>
              <TableCell>{gerente.email}</TableCell>
              <TableCell>{gerente.cargo}</TableCell>
              <TableCell>{gerente.setor}</TableCell>
              <TableCell>
                {gerente.dataContratacao ? format(new Date(gerente.dataContratacao), 'dd/MM/yyyy') : '-'}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    gerente.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {gerente.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(gerente)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete(gerente)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
