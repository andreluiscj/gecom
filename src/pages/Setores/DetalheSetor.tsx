
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, calcularPorcentagem } from '@/utils/formatters';
import { Setor } from '@/types';
import { obterDadosDashboard } from '@/data/extended-mockData';
import { obterPedidosFicticios } from '@/data/pedidos/mockPedidos';
import PedidosTable from '@/components/Pedidos/PedidosTable';
import { 
  HeartPulse, BookOpen, Building2, Bus, Shield, Heart,
  Leaf, Coins, Briefcase, Music, Globe, Award, PieChart,
  Radio, MapPin
} from 'lucide-react';

const DetalheSetor: React.FC = () => {
  const { setor } = useParams<{ setor: string }>();
  const dadosDashboard = obterDadosDashboard();
  const todosPedidos = obterPedidosFicticios();
  
  interface SetorDefinition {
    id: string;
    titulo: Setor;
    icone: React.ReactNode;
    colorClass: string;
  }

  const SETORES_CONFIG: SetorDefinition[] = [
    {
      id: 'saude',
      titulo: 'Saúde',
      icone: <HeartPulse className="h-6 w-6 text-white" />,
      colorClass: 'bg-saude-DEFAULT',
    },
    {
      id: 'educacao',
      titulo: 'Educação',
      icone: <BookOpen className="h-6 w-6 text-white" />,
      colorClass: 'bg-educacao-DEFAULT',
    },
    {
      id: 'administrativo',
      titulo: 'Administrativo',
      icone: <Building2 className="h-6 w-6 text-white" />,
      colorClass: 'bg-administrativo-DEFAULT',
    },
    {
      id: 'transporte',
      titulo: 'Transporte',
      icone: <Bus className="h-6 w-6 text-white" />,
      colorClass: 'bg-transporte-DEFAULT',
    },
    {
      id: 'obras',
      titulo: 'Obras',
      icone: <Briefcase className="h-6 w-6 text-white" />,
      colorClass: 'bg-blue-500',
    },
    {
      id: 'seguranca',
      titulo: 'Segurança Pública',
      icone: <Shield className="h-6 w-6 text-white" />,
      colorClass: 'bg-red-500',
    },
    {
      id: 'social',
      titulo: 'Assistência Social',
      icone: <Heart className="h-6 w-6 text-white" />,
      colorClass: 'bg-purple-500',
    },
    {
      id: 'ambiente',
      titulo: 'Meio Ambiente',
      icone: <Leaf className="h-6 w-6 text-white" />,
      colorClass: 'bg-green-500',
    },
    {
      id: 'fazenda',
      titulo: 'Fazenda',
      icone: <Coins className="h-6 w-6 text-white" />,
      colorClass: 'bg-yellow-600',
    },
    {
      id: 'turismo',
      titulo: 'Turismo',
      icone: <Globe className="h-6 w-6 text-white" />,
      colorClass: 'bg-cyan-500',
    },
    {
      id: 'cultura',
      titulo: 'Cultura',
      icone: <Music className="h-6 w-6 text-white" />,
      colorClass: 'bg-pink-500',
    },
    {
      id: 'esportes',
      titulo: 'Esportes e Lazer',
      icone: <Award className="h-6 w-6 text-white" />,
      colorClass: 'bg-orange-500',
    },
    {
      id: 'planejamento',
      titulo: 'Planejamento',
      icone: <PieChart className="h-6 w-6 text-white" />,
      colorClass: 'bg-indigo-500',
    },
    {
      id: 'comunicacao',
      titulo: 'Comunicação',
      icone: <Radio className="h-6 w-6 text-white" />,
      colorClass: 'bg-blue-400',
    },
    {
      id: 'ciencia',
      titulo: 'Ciência e Tecnologia',
      icone: <MapPin className="h-6 w-6 text-white" />,
      colorClass: 'bg-teal-500',
    },
  ];
  
  const setorConfig = useMemo(() => SETORES_CONFIG.find(s => s.id === setor), [setor]);

  if (!setorConfig) {
    return <div>Setor não encontrado</div>;
  }

  // Get actual pedidos for this setor from the system
  const pedidos = todosPedidos.filter(p => p.setor === setorConfig.titulo);
  const totalPedidos = pedidos.length;

  // Only calculate budget data if there are pedidos for this setor
  const orcamentoPrevisto = dadosDashboard.orcamentoPrevisto[setorConfig.titulo as keyof typeof dadosDashboard.orcamentoPrevisto] || 0;
  const totalGasto = dadosDashboard.gastosPorSetor[setorConfig.titulo as keyof typeof dadosDashboard.gastosPorSetor] || 0;
  const percentualGasto = calcularPorcentagem(totalGasto, orcamentoPrevisto);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${setorConfig.colorClass}`}>
          {setorConfig.icone}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Secretária de {setorConfig.titulo}</h1>
          <p className="text-muted-foreground">
            Visão geral dos recursos e demandas da secretária
          </p>
        </div>
      </div>

      {totalPedidos > 0 && totalGasto > 0 && (
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>DFDs da Secretária de {setorConfig.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          {totalPedidos > 0 ? (
            <PedidosTable 
              pedidos={pedidos} 
              titulo={`Documentos de Formalização de Demanda - ${totalPedidos} ${totalPedidos === 1 ? 'pedido' : 'pedidos'}`} 
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pedido de compra registrado para esta secretária
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalheSetor;
