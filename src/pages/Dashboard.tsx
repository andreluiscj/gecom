
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/Dashboard/StatCard';
import ChartGastosPorSetor from '@/components/Dashboard/ChartGastosPorSetor';
import ChartPedidosPorSetor from '@/components/Dashboard/ChartPedidosPorSetor';
import ChartPrevisoRealizado from '@/components/Dashboard/ChartPrevisoRealizado';
import ChartTicketMedio from '@/components/Dashboard/ChartTicketMedio';
import { calcularDadosDashboard, obterEstatisticasCartoes } from '@/data/mockData';
import { Municipio } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Calendar, FileText } from 'lucide-react';
import { useEffect as useEffectOriginal } from 'react';

const municipios: Record<string, Municipio> = {
  'pai-pedro': {
    id: 'pai-pedro',
    nome: 'Pai Pedro',
    estado: 'MG',
    populacao: 6083,
    orcamentoAnual: 28500000,
    prefeito: 'Maria Silva',
  },
  'janauba': {
    id: 'janauba',
    nome: 'Janaúba',
    estado: 'MG',
    populacao: 72018,
    orcamentoAnual: 145300000,
    prefeito: 'José Santos',
  },
  'espinosa': {
    id: 'espinosa',
    nome: 'Espinosa',
    estado: 'MG',
    populacao: 31113,
    orcamentoAnual: 87600000,
    prefeito: 'Carlos Oliveira',
  }
};

// Constantes para tradução
const getTranslation = (key: string) => {
  const language = localStorage.getItem('app-language') || 'pt';
  
  const translations: Record<string, Record<string, string>> = {
    dashboardTitle: {
      pt: 'Dashboard',
      en: 'Dashboard'
    },
    overview: {
      pt: 'Visão geral da gestão municipal e dos recursos financeiros.',
      en: 'Overview of municipal management and financial resources.'
    },
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [language, setLanguage] = useState('pt'); // Estado para o idioma
  
  useEffect(() => {
    // Verifica idioma
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Recupera o município selecionado do localStorage
    const selectedMunicipioId = localStorage.getItem('municipio-selecionado');
    
    if (!selectedMunicipioId) {
      // Se não houver município selecionado, redireciona para a página admin
      navigate('/admin');
      return;
    }
    
    setMunicipioId(selectedMunicipioId);
    // Busca os dados do município selecionado
    setMunicipio(municipios[selectedMunicipioId]);
  }, [navigate]);

  // Calcula os dados específicos do município
  const dadosDashboard = calcularDadosDashboard(municipioId);
  const estatisticasCartoes = obterEstatisticasCartoes(municipioId);

  if (!municipio) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{getTranslation('dashboardTitle')} - {municipio.nome}</h1>
        <p className="text-muted-foreground text-sm">
          {getTranslation('overview')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticasCartoes.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.titulo}
            value={stat.valor}
            percentChange={stat.percentualMudanca}
            icon={stat.icon}
            colorClass={stat.cor}
          />
        ))}
      </div>

      <Tabs defaultValue="graficos" className="pt-2">
        <TabsList className="mb-4">
          <TabsTrigger value="graficos">
            <LayoutDashboard className="h-4 w-4 mr-2" /> {getTranslation('graphicsTab')}
          </TabsTrigger>
          <TabsTrigger value="resumo">
            <FileText className="h-4 w-4 mr-2" /> {getTranslation('summaryTab')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="graficos" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartPrevisoRealizado dados={dadosDashboard} />
            <ChartGastosPorSetor dados={dadosDashboard} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartPedidosPorSetor dados={dadosDashboard} />
            <ChartTicketMedio dados={dadosDashboard} />
          </div>
        </TabsContent>
        
        <TabsContent value="resumo" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === 'pt' ? 'Resumo Financeiro' : 'Financial Summary'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {language === 'pt' ? 'Métrica' : 'Metric'}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {language === 'pt' ? 'Valor' : 'Value'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {language === 'pt' ? 'Orçamento Anual' : 'Annual Budget'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                          R$ {municipio.orcamentoAnual.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {language === 'pt' ? 'Gastos Totais' : 'Total Expenses'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                          R$ {dadosDashboard.gastosTotais.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {language === 'pt' ? 'Percentual do Orçamento Utilizado' : 'Budget Usage Percentage'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                          {((dadosDashboard.gastosTotais / municipio.orcamentoAnual) * 100).toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {language === 'pt' ? 'Total de DFDs' : 'Total Purchase Orders'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                          {Object.values(dadosDashboard.pedidosPorSetor).reduce((sum, count) => sum + count, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === 'pt' ? 'Informações do Município' : 'Municipality Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Nome' : 'Name'}</p>
                  <p className="font-medium">{municipio.nome}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Estado' : 'State'}</p>
                  <p className="font-medium">{municipio.estado}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{language === 'pt' ? 'População' : 'Population'}</p>
                  <p className="font-medium">{municipio.populacao.toLocaleString('pt-BR')}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Prefeito' : 'Mayor'}</p>
                  <p className="font-medium">{municipio.prefeito}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
