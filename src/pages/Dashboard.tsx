
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/Dashboard/StatCard';
import ChartGastosPorSetor from '@/components/Dashboard/ChartGastosPorSetor';
import ChartPedidosPorSetor from '@/components/Dashboard/ChartPedidosPorSetor';
import ChartPrevisoRealizado from '@/components/Dashboard/ChartPrevisoRealizado';
import ChartTicketMedio from '@/components/Dashboard/ChartTicketMedio';
import { calcularDadosDashboard, obterEstatisticasCartoes } from '@/data/mockData';
import { Municipio } from '@/types';

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  
  useEffect(() => {
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard - {municipio.nome}</h1>
        <p className="text-muted-foreground">
          Visão geral da gestão municipal e dos recursos financeiros.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPrevisoRealizado dados={dadosDashboard} />
        <ChartGastosPorSetor dados={dadosDashboard} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPedidosPorSetor dados={dadosDashboard} />
        <ChartTicketMedio dados={dadosDashboard} />
      </div>
    </div>
  );
};

export default Dashboard;
