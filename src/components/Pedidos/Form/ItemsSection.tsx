
import React from 'react';
import { Button } from '@/components/ui/button';
import { Item } from '@/types';
import { Plus } from 'lucide-react';
import ItemForm from './ItemForm';

interface ItemsSectionProps {
  items: Item[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: string, value: string | number) => void;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Itens</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddItem}
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar Item
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <ItemForm
            key={item.id}
            item={item}
            index={index}
            canRemove={items.length > 1}
            onRemove={onRemoveItem}
            onUpdate={onUpdateItem}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemsSection;
