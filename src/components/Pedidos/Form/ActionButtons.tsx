
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  isSubmitting?: boolean;
  isEditing?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isSubmitting = false,
  isEditing = false 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/pedidos')}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? 'Atualizar' : 'Salvar'} Pedido
      </Button>
    </div>
  );
};

export default ActionButtons;
