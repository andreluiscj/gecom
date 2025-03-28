
import React from 'react';
import SetorCard from '@/components/Setores/SetorCard';
import { HeartPulse, BookOpen, Building2, Bus } from 'lucide-react';
import { calcularDadosDashboard } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

const ListaSetores: React.FC = () => {
  const dadosDashboard = calcularDadosDashboard();

  const setores = [
    {
      titulo: 'Saúde',
      descricao: `Gestão dos recursos e pedidos de saúde. Orçamento: ${formatCurrency(dadosDashboard.orcamentoPrevisto['Saúde'])}`,
      icone: <HeartPulse className="h-5 w-5 text-white" />,
      colorClass: 'bg-saude-DEFAULT',
      bgClass: 'bg-saude-light/20 border-saude-DEFAULT/20',
      href: '/setores/saude',
    },
    {
      titulo: 'Educação',
      descricao: `Administração de recursos educacionais. Orçamento: ${formatCurrency(dadosDashboard.orcamentoPrevisto['Educação'])}`,
      icone: <BookOpen className="h-5 w-5 text-white" />,
      colorClass: 'bg-educacao-DEFAULT',
      bgClass: 'bg-educacao-light/20 border-educacao-DEFAULT/20',
      href: '/setores/educacao',
    },
    {
      titulo: 'Administrativo',
      descricao: `Gerenciamento administrativo. Orçamento: ${formatCurrency(dadosDashboard.orcamentoPrevisto['Administrativo'])}`,
      icone: <Building2 className="h-5 w-5 text-white" />,
      colorClass: 'bg-administrativo-DEFAULT',
      bgClass: 'bg-administrativo-light/20 border-administrativo-DEFAULT/20',
      href: '/setores/administrativo',
    },
    {
      titulo: 'Transporte',
      descricao: `Controle da frota e logística. Orçamento: ${formatCurrency(dadosDashboard.orcamentoPrevisto['Transporte'])}`,
      icone: <Bus className="h-5 w-5 text-white" />,
      colorClass: 'bg-transporte-DEFAULT',
      bgClass: 'bg-transporte-light/20 border-transporte-DEFAULT/20',
      href: '/setores/transporte',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Setores</h1>
        <p className="text-muted-foreground">
          Gerenciamento dos setores municipais e seus recursos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {setores.map((setor, index) => (
          <SetorCard key={index} {...setor} />
        ))}
      </div>
    </div>
  );
};

export default ListaSetores;
