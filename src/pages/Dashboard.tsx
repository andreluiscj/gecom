
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/Dashboard/StatCard';
import ChartGastosPorSetor from '@/components/Dashboard/ChartGastosPorSetor';
import ChartPedidosPorSetor from '@/components/Dashboard/ChartPedidosPorSetor';
import ChartPrevisoRealizado from '@/components/Dashboard/ChartPrevisoRealizado';
import ChartTicketMedio from '@/components/Dashboard/ChartTicketMedio';
import { calcularDadosDashboard, obterEstatisticasCartoes } from '@/data/mockData';
import SetorCard from '@/components/Setores/SetorCard';
import { HeartPulse, BookOpen, Building2, Bus } from 'lucide-react';
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

  const setores = [
    {
      titulo: 'Saúde',
      descricao: 'Gestão dos recursos e pedidos do setor de saúde municipal.',
      icone: <HeartPulse className="h-5 w-5 text-white" />,
      colorClass: 'bg-saude-DEFAULT',
      bgClass: 'bg-saude-light/20',
      href: '/setores/saude',
    },
    {
      titulo: 'Educação',
      descricao: 'Administração das compras e recursos para escolas e instituições de ensino.',
      icone: <BookOpen className="h-5 w-5 text-white" />,
      colorClass: 'bg-educacao-DEFAULT',
      bgClass: 'bg-educacao-light/20',
      href: '/setores/educacao',
    },
    {
      titulo: 'Administrativo',
      descricao: 'Gerenciamento administrativo e burocrático da prefeitura.',
      icone: <Building2 className="h-5 w-5 text-white" />,
      colorClass: 'bg-administrativo-DEFAULT',
      bgClass: 'bg-administrativo-light/20',
      href: '/setores/administrativo',
    },
    {
      titulo: 'Transporte',
      descricao: 'Controle da frota e logística de transporte municipal.',
      icone: <Bus className="h-5 w-5 text-white" />,
      colorClass: 'bg-transporte-DEFAULT',
      bgClass: 'bg-transporte-light/20',
      href: '/setores/transporte',
    },
  ];

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
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Secretárias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {setores.map((setor, index) => (
            <SetorCard key={index} {...setor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
