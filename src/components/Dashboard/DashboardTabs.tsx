
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText } from 'lucide-react';
import DashboardGraphics from './DashboardGraphics';
import DashboardSummary from './DashboardSummary';
import { DadosDashboard, Municipio } from '@/types';

interface DashboardTabsProps {
  dadosDashboard: DadosDashboard;
  municipio: Municipio;
  language: string;
}

const getTranslation = (key: string, language: string) => {
  const translations: Record<string, Record<string, string>> = {
    graphicsTab: {
      pt: 'Gráficos',
      en: 'Charts'
    },
    summaryTab: {
      pt: 'Resumo',
      en: 'Summary'
    }
  };
  
  return translations[key]?.[language] || translations[key]?.['pt'] || key;
};

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  dadosDashboard, 
  municipio,
  language 
}) => {
  return (
    <Tabs defaultValue="graficos" className="pt-2">
      <TabsList className="mb-4">
        <TabsTrigger value="graficos">
          <LayoutDashboard className="h-4 w-4 mr-2" /> {getTranslation('graphicsTab', language)}
        </TabsTrigger>
        <TabsTrigger value="resumo">
          <FileText className="h-4 w-4 mr-2" /> {getTranslation('summaryTab', language)}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="graficos" className="space-y-5">
        <DashboardGraphics dados={dadosDashboard} />
      </TabsContent>
      
      <TabsContent value="resumo" className="space-y-5">
        <DashboardSummary 
          dadosDashboard={dadosDashboard} 
          municipio={municipio} 
          language={language} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
