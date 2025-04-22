
import React from 'react';

interface DashboardHeaderProps {
  municipio: {
    name?: string;
    state?: string;
  };
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
    <div>
      <h1 className="text-2xl font-bold mb-1">{getTranslation('dashboardTitle', language)}</h1>
      <p className="text-muted-foreground text-sm">
        {getTranslation('overview', language)}
      </p>
      {municipio?.name && municipio.name !== "Não definido" && (
        <div className="mt-2">
          <span className="text-blue-600 font-medium">{municipio.name}</span>
          {municipio.state && <span className="text-muted-foreground"> - {municipio.state}</span>}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
