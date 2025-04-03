
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface TotalSectionProps {
  total: number;
}

const TotalSection: React.FC<TotalSectionProps> = ({ total }) => {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">Valor Total:</span>
        <span className="text-lg font-bold">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
};

export default TotalSection;
