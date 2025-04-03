
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
    orcamentoAnual: 0,
    prefeito: 'Maria Silva',
  },
  'janauba': {
    id: 'janauba',
    nome: 'Janaúba',
    estado: 'MG',
    populacao: 72018,
    orcamentoAnual: 0,
    prefeito: 'José Santos',
  },
  'espinosa': {
    id: 'espinosa',
    nome: 'Espinosa',
    estado: 'MG',
    populacao: 31113,
    orcamentoAnual: 0,
    prefeito: 'Carlos Oliveira',
  }
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
  // Get estatisticas cartoes with municipioId
  const estatisticasCartoes = obterEstatisticasCartoes(municipioId);

  if (!municipio) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <DashboardHeader municipio={municipio} language={language} />
      
      <DashboardStats estatisticasCartoes={estatisticasCartoes} />
      
      <DashboardTabs 
        dadosDashboard={dadosDashboard}
        municipio={municipio}
        language={language}
      />
    </div>
  );
};

export default Dashboard;
