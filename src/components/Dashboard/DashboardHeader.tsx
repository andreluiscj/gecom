
import React from 'react';
import { Municipio } from '@/types';
import GecomLogo from '@/assets/GecomLogo';

interface DashboardHeaderProps {
  municipio: Municipio;
  language?: string;
}

const getTranslation = (key: string, language: string = 'pt') => {
  const translations: Record<string, Record<string, string>> = {
    dashboardTitle: {
      pt: 'Painel de Gestão',
      en: 'Management Panel'
    },
    overview: {
      pt: 'Visão geral da gestão municipal e dos recursos financeiros.',
      en: 'Overview of municipal management and financial resources.'
    }
  };
  
  return translations[key]?.[language] || translations[key]?.['pt'] || key;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ municipio, language = 'pt' }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <GecomLogo size={120} className="w-auto" />
      </div>
      <h1 className="text-2xl font-bold mb-1">{getTranslation('dashboardTitle', language)}</h1>
      <p className="text-muted-foreground text-sm">
        {getTranslation('overview', language)}
      </p>
    </div>
  );
};

export default DashboardHeader;
