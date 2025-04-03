
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface TotalSectionProps {
  total: number;
  onPreview?: () => void;
}

const TotalSection: React.FC<TotalSectionProps> = ({ total, onPreview }) => {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">Valor Total:</span>
        <div className="flex items-center gap-4">
          {onPreview && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={onPreview}
              className="md:hidden"
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
          )}
          <span className="text-lg font-bold">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalSection;
