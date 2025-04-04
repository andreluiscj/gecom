
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import DashboardTabs from '@/components/Dashboard/DashboardTabs';
import { calcularDadosDashboard, obterEstatisticasCartoes } from '@/data/extended-mockData';
import { Municipio } from '@/types';

const municipios: Record<string, Municipio> = {
  'pai-pedro': {
    id: 'pai-pedro',
    nome: 'Pai Pedro',
    estado: 'MG',
    populacao: 6083,
    orcamentoAnual: 15000000,
    prefeito: 'Maria Silva',
  },
  'janauba': {
    id: 'janauba',
    nome: 'Janaúba',
    estado: 'MG',
    populacao: 72018,
    orcamentoAnual: 120000000,
    prefeito: 'José Santos',
  },
  'espinosa': {
    id: 'espinosa',
    nome: 'Espinosa',
    estado: 'MG',
    populacao: 31113,
    orcamentoAnual: 60000000,
    prefeito: 'Carlos Oliveira',
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulates loading
    setIsLoading(true);
    
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
    
    // Simulates data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Calcula os dados específicos do município
  const dadosDashboard = calcularDadosDashboard(municipioId);
  // Get estatisticas cartoes with municipioId
  const estatisticasCartoes = obterEstatisticasCartoes(municipioId);

  if (isLoading || !municipio) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Carregando dados do município...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader municipio={municipio} />
      
      <DashboardStats estatisticasCartoes={estatisticasCartoes} />
      
      <DashboardTabs 
        dadosDashboard={dadosDashboard}
        municipio={municipio}
      />
    </div>
  );
};

export default Dashboard;
