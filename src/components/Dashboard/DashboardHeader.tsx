
import React, { useEffect, useState } from 'react';
import { Municipio } from '@/types';
import { getCurrentMunicipio } from '@/services/municipioService';

interface DashboardHeaderProps {
  municipio?: Municipio;
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

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ municipio: propMunicipio, language = 'pt' }) => {
  const [municipio, setMunicipio] = useState<Municipio | null>(propMunicipio || null);

  useEffect(() => {
    if (!propMunicipio) {
      const loadMunicipio = async () => {
        const data = await getCurrentMunicipio();
        if (data) {
          setMunicipio(data);
        }
      };
      
      loadMunicipio();
    }
  }, [propMunicipio]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        {getTranslation('dashboardTitle', language)}
        {municipio && ` - ${municipio.nome}`}
      </h1>
      <p className="text-muted-foreground text-sm">
        {getTranslation('overview', language)}
      </p>
    </div>
  );
};

export default DashboardHeader;
