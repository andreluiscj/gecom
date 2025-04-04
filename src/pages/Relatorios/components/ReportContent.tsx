
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText } from 'lucide-react';
import ReportCharts from './ReportCharts';
import ReportTables from './ReportTables';

interface ReportContentProps {
  tiposRelatorio: string[];
  dadosDashboard: any;
  translations: Record<string, string>;
}

const ReportContent: React.FC<ReportContentProps> = ({ tiposRelatorio, dadosDashboard, translations }) => {
  return (
    <Tabs defaultValue="graficos">
      <TabsList className="mb-4 tabs-list">
        <TabsTrigger value="graficos" className="tab-item">
          <BarChart3 className="h-4 w-4 mr-2" /> {translations.charts}
        </TabsTrigger>
        <TabsTrigger value="tabelas" className="tab-item">
          <FileText className="h-4 w-4 mr-2" /> {translations.tables}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="graficos" className="space-y-6">
        <ReportCharts 
          tiposRelatorio={tiposRelatorio}
          dadosDashboard={dadosDashboard}
        />
      </TabsContent>
      
      <TabsContent value="tabelas">
        <ReportTables 
          tiposRelatorio={tiposRelatorio}
          dadosDashboard={dadosDashboard}
          translations={translations}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReportContent;
