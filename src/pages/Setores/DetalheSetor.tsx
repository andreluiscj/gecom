
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, calcularPorcentagem } from '@/utils/formatters';
import { Setor } from '@/types';
import { calcularDadosDashboard } from '@/data/extended-mockData';
import { obterPedidosPorSetor } from '@/data/mockData';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { HeartPulse, BookOpen, Building2, Bus } from 'lucide-react';
import StatCard from '@/components/Dashboard/StatCard';

const DetalheSetor: React.FC = () => {
  const { setor } = useParams<{ setor: string }>();
  const dadosDashboard = calcularDadosDashboard();
  
  const setorMapeado = useMemo<Setor | undefined>(() => {
    switch (setor) {
      case 'saude':
        return 'Saúde';
      case 'educacao':
        return 'Educação';
      case 'administrativo':
        return 'Administrativo';
      case 'transporte':
        return 'Transporte';
      default:
        return undefined;
    }
  }, [setor]);

  if (!setorMapeado) {
    return <div>Setor não encontrado</div>;
  }

  const pedidos = obterPedidosPorSetor(setorMapeado);
  const totalPedidos = pedidos.length;
  const totalGasto = dadosDashboard.gastosPorSetor[setorMapeado];
  const orcamentoPrevisto = dadosDashboard.orcamentoPrevisto[setorMapeado];
  const percentualGasto = calcularPorcentagem(totalGasto, orcamentoPrevisto);

  const getSetorIcone = () => {
    switch (setorMapeado) {
      case 'Saúde':
        return <HeartPulse className="h-6 w-6 text-white" />;
      case 'Educação':
        return <BookOpen className="h-6 w-6 text-white" />;
      case 'Administrativo':
        return <Building2 className="h-6 w-6 text-white" />;
      case 'Transporte':
        return <Bus className="h-6 w-6 text-white" />;
      default:
        return null;
    }
  };

  const getSetorCor = () => {
    switch (setorMapeado) {
      case 'Saúde':
        return 'bg-saude-DEFAULT';
      case 'Educação':
        return 'bg-educacao-DEFAULT';
      case 'Administrativo':
        return 'bg-administrativo-DEFAULT';
      case 'Transporte':
        return 'bg-transporte-DEFAULT';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${getSetorCor()}`}>
          {getSetorIcone()}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Secretária de {setorMapeado}</h1>
          <p className="text-muted-foreground">
            Visão geral dos recursos e demandas da secretária
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orçamento Utilizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {formatCurrency(totalGasto)} de {formatCurrency(orcamentoPrevisto)}
            </span>
            <span className="text-sm font-medium">{percentualGasto.toFixed(1)}%</span>
          </div>
          <Progress 
            value={percentualGasto > 100 ? 100 : percentualGasto} 
            className="h-2" 
            color={percentualGasto > 90 ? "bg-red-500" : percentualGasto > 70 ? "bg-yellow-500" : ""}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>DFDs da Secretária de {setorMapeado}</CardTitle>
        </CardHeader>
        <CardContent>
          <PedidosTable 
            pedidos={pedidos} 
            titulo={`Documentos de Formalização de Demanda`} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalheSetor;
