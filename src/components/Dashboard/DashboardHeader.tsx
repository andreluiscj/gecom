
import React from 'react';
import { Municipio } from '@/types';

interface DashboardHeaderProps {
  municipio: Municipio;
  language: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ municipio, language }) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{municipio.nome}</h2>
          <div className="text-sm text-muted-foreground">
            {municipio.estado} | {municipio.populacao.toLocaleString()} habitantes
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm">
            {language === 'pt' ? 'Prefeito' : 'Mayor'}
          </div>
          <div className="font-medium">
            {municipio.prefeito}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
