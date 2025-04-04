
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText } from 'lucide-react';
import DashboardGraphics from './DashboardGraphics';
import DashboardSummary from './DashboardSummary';
import { DadosDashboard, Municipio } from '@/types';

interface DashboardTabsProps {
  dadosDashboard: DadosDashboard;
  municipio: Municipio;
  language?: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  dadosDashboard, 
  municipio,
  language = 'pt'
}) => {
  return (
    <Tabs defaultValue="graficos" className="pt-4">
      <TabsList className="mb-6 bg-muted/50 p-1">
        <TabsTrigger value="graficos" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <LayoutDashboard className="h-4 w-4 mr-2" /> Gráficos
        </TabsTrigger>
        <TabsTrigger value="resumo" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <FileText className="h-4 w-4 mr-2" /> Resumo
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="graficos" className="space-y-6">
        <DashboardGraphics dados={dadosDashboard} />
      </TabsContent>
      
      <TabsContent value="resumo" className="space-y-6">
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
