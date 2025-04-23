
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  isSubmitting?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isSubmitting = false }) => {
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
        Salvar Pedido
      </Button>
    </div>
  );
};

export default ActionButtons;
