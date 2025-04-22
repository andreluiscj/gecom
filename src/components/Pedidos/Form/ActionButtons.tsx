
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

export interface ActionButtonsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSubmitting,
  isEditing,
  onCancel
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4 mr-2" />
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
      </Button>
    </div>
  );
};

export default ActionButtons;
