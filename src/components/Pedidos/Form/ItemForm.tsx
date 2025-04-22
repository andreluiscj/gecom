
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Item } from '@/types';
import { Trash2 } from 'lucide-react';

interface ItemFormProps {
  item: Item;
  index: number;
  canRemove: boolean;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: string | number) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  item,
  index,
  canRemove,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
      <div className="md:col-span-2">
        <Label htmlFor={`item-${index}-nome`}>
          Nome do Item
        </Label>
        <Input
          id={`item-${index}-nome`}
          value={item.nome}
          onChange={(e) =>
            onUpdate(index, 'nome', e.target.value)
          }
          placeholder="Nome do item"
        />
      </div>
      <div>
        <Label htmlFor={`item-${index}-quantidade`}>
          Quantidade
        </Label>
        <Input
          id={`item-${index}-quantidade`}
          type="number"
          min="1"
          value={item.quantidade}
          onChange={(e) =>
            onUpdate(
              index,
              'quantidade',
              parseInt(e.target.value) || 1
            )
          }
        />
      </div>
      <div>
        <Label htmlFor={`item-${index}-valor`}>
          Valor Unitário
        </Label>
        <Input
          id={`item-${index}-valor`}
          type="number"
          min="0.01"
          step="0.01"
          value={item.valorUnitario}
          onChange={(e) =>
            onUpdate(
              index,
              'valorUnitario',
              parseFloat(e.target.value) || 0
            )
          }
        />
      </div>
      <div className="flex items-end">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ItemForm;
