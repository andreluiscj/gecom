import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SetorCardProps {
  id: string;
  nome: string;
  descricao?: string;
  orcamentoUtilizado?: number;
  orcamentoTotal?: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SetorCard: React.FC<SetorCardProps> = ({
  id,
  nome,
  descricao,
  orcamentoUtilizado = 0,
  orcamentoTotal = 100,
  onEdit,
  onDelete,
}) => {
  const percentage = orcamentoTotal ? (orcamentoUtilizado / orcamentoTotal) * 100 : 0;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{nome}</CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{nome.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              Orçamento Utilizado: R$ {orcamentoUtilizado}
            </p>
            <p className="text-sm text-muted-foreground">
              {percentage.toFixed(2)}% do orçamento total
            </p>
          </div>
        </div>
      </CardContent>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(id)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500" onClick={() => onDelete(id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </Card>
  );
};

export default SetorCard;
