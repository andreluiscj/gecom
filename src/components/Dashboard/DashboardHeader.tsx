
import React from 'react';
import { Municipio } from '@/types';

interface DashboardHeaderProps {
  municipio: Municipio;
  language?: string;
}

const getTranslation = (key: string, language: string = 'pt') => {
  const translations: Record<string, Record<string, string>> = {
    dashboardTitle: {
      pt: 'Dashboard',
      en: 'Dashboard'
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
    <div>
      <h1 className="text-2xl font-bold mb-1">{getTranslation('dashboardTitle', language)}</h1>
      <p className="text-muted-foreground text-sm">
        {getTranslation('overview', language)}
      </p>
    </div>
  );
};

export default DashboardHeader;
