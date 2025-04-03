
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface ActionButtonsProps {
  isSubmitting?: boolean;
  onPreview?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isSubmitting = false,
  onPreview
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
      
      {onPreview && (
        <Button 
          type="button" 
          variant="secondary"
          onClick={onPreview}
        >
          <Eye className="mr-2 h-4 w-4" />
          Visualizar
        </Button>
      )}
      
      <Button type="submit" disabled={isSubmitting}>
        Salvar Pedido
      </Button>
    </div>
  );
};

export default ActionButtons;
