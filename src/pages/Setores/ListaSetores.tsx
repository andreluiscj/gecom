
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  HeartPulse, BookOpen, Building2, Bus, Shield, Heart, 
  Leaf, Coins, Briefcase, Music, Globe, Award, PieChart, 
  Radio, MapPin 
} from 'lucide-react';
import { obterDadosDashboard } from '@/data/extended-mockData';
import { formatCurrency, calcularPorcentagem } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { obterTodosPedidos } from '@/data/mockData';

const ListaSetores: React.FC = () => {
  const dadosDashboard = obterDadosDashboard();
  const todosPedidos = obterTodosPedidos();

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
    {
      id: 'obras',
      titulo: 'Obras',
      icone: <Briefcase className="h-5 w-5 text-white" />,
      colorClass: 'bg-blue-500',
      href: '/setores/obras',
    },
    {
      id: 'seguranca',
      titulo: 'Segurança Pública',
      icone: <Shield className="h-5 w-5 text-white" />,
      colorClass: 'bg-red-500',
      href: '/setores/seguranca',
    },
    {
      id: 'social',
      titulo: 'Assistência Social',
      icone: <Heart className="h-5 w-5 text-white" />,
      colorClass: 'bg-purple-500',
      href: '/setores/social',
    },
    {
      id: 'ambiente',
      titulo: 'Meio Ambiente',
      icone: <Leaf className="h-5 w-5 text-white" />,
      colorClass: 'bg-green-500',
      href: '/setores/ambiente',
    },
    {
      id: 'fazenda',
      titulo: 'Fazenda',
      icone: <Coins className="h-5 w-5 text-white" />,
      colorClass: 'bg-yellow-600',
      href: '/setores/fazenda',
    },
    {
      id: 'turismo',
      titulo: 'Turismo',
      icone: <Globe className="h-5 w-5 text-white" />,
      colorClass: 'bg-cyan-500',
      href: '/setores/turismo',
    },
    {
      id: 'cultura',
      titulo: 'Cultura',
      icone: <Music className="h-5 w-5 text-white" />,
      colorClass: 'bg-pink-500',
      href: '/setores/cultura',
    },
    {
      id: 'esportes',
      titulo: 'Esportes e Lazer',
      icone: <Award className="h-5 w-5 text-white" />,
      colorClass: 'bg-orange-500',
      href: '/setores/esportes',
    },
    {
      id: 'planejamento',
      titulo: 'Planejamento',
      icone: <PieChart className="h-5 w-5 text-white" />,
      colorClass: 'bg-indigo-500',
      href: '/setores/planejamento',
    },
    {
      id: 'comunicacao',
      titulo: 'Comunicação',
      icone: <Radio className="h-5 w-5 text-white" />,
      colorClass: 'bg-blue-400',
      href: '/setores/comunicacao',
    },
    {
      id: 'ciencia',
      titulo: 'Ciência e Tecnologia',
      icone: <MapPin className="h-5 w-5 text-white" />,
      colorClass: 'bg-teal-500',
      href: '/setores/ciencia',
    },
  ];

  const getPedidosForSetor = (titulo: string) => {
    return todosPedidos.filter(pedido => pedido.setor === titulo).length;
  };

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
          const orcamentoPrevisto = dadosDashboard.orcamentoPrevisto[setor.titulo as keyof typeof dadosDashboard.orcamentoPrevisto] || 1000000;
          const gastosRealizados = dadosDashboard.gastosPorSetor[setor.titulo as keyof typeof dadosDashboard.gastosPorSetor] || 450000;
          const percentualGasto = calcularPorcentagem(gastosRealizados, orcamentoPrevisto);
          const totalDFDs = getPedidosForSetor(setor.titulo);
          
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
                      <span className="font-medium">Pedidos de Compras</span>
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
