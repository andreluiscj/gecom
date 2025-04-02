
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HeartPulse, BookOpen, Building2, Bus } from 'lucide-react';
import { calcularDadosDashboard } from '@/data/extended-mockData';
import { formatCurrency, calcularPorcentagem } from '@/utils/formatters';
import { Link } from 'react-router-dom';

const ListaSetores: React.FC = () => {
  const dadosDashboard = calcularDadosDashboard();

  const setores = [
    {
      id: 'saude',
      titulo: 'Saúde',
      icone: <HeartPulse className="h-5 w-5 text-white" />,
      colorClass: 'bg-saude-DEFAULT',
      href: '/setores/saude',
    },
    {
      id: 'educacao',
      titulo: 'Educação',
      icone: <BookOpen className="h-5 w-5 text-white" />,
      colorClass: 'bg-educacao-DEFAULT',
      href: '/setores/educacao',
    },
    {
      id: 'administrativo',
      titulo: 'Administrativo',
      icone: <Building2 className="h-5 w-5 text-white" />,
      colorClass: 'bg-administrativo-DEFAULT',
      href: '/setores/administrativo',
    },
    {
      id: 'transporte',
      titulo: 'Transporte',
      icone: <Bus className="h-5 w-5 text-white" />,
      colorClass: 'bg-transporte-DEFAULT',
      href: '/setores/transporte',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Secretárias</h1>
        <p className="text-muted-foreground">
          Gerenciamento das secretárias municipais e seus recursos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {setores.map((setor) => {
          const orcamentoPrevisto = dadosDashboard.orcamentoPrevisto[setor.titulo as keyof typeof dadosDashboard.orcamentoPrevisto];
          const gastosRealizados = dadosDashboard.gastosPorSetor[setor.titulo as keyof typeof dadosDashboard.gastosPorSetor];
          const percentualGasto = calcularPorcentagem(gastosRealizados, orcamentoPrevisto);
          const totalDFDs = dadosDashboard.pedidosPorSetor[setor.titulo as keyof typeof dadosDashboard.pedidosPorSetor];
          
          return (
            <Link to={setor.href} key={setor.id} className="block">
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2 flex flex-row items-center space-x-4 border-b">
                  <div className={`p-2 rounded-full ${setor.colorClass}`}>
                    {setor.icone}
                  </div>
                  <CardTitle className="text-xl font-semibold">Secretária de {setor.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">DFDs Totais</span>
                      <span className="font-bold">{totalDFDs}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Orçamento Utilizado</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(gastosRealizados)} de {formatCurrency(orcamentoPrevisto)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{percentualGasto.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={percentualGasto > 100 ? 100 : percentualGasto} 
                      className="h-2" 
                      color={percentualGasto > 90 ? "bg-red-500" : percentualGasto > 70 ? "bg-yellow-500" : ""}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ListaSetores;
