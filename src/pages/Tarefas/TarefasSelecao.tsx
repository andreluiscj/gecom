
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HeartPulse, BookOpen, Building2, Bus, ArrowRight, Briefcase, Shield, Heart, Leaf, Coins, Globe, Music, Award, PieChart, Radio, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { obterPedidosPorSetor } from '@/data/mockData';

const TarefasSelecao: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    // Verifica idioma
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const texts = {
    title: language === 'pt' ? 'Gerenciamento de Tarefas' : 'Task Management',
    description: language === 'pt' 
      ? 'Visualize e gerencie tarefas por secretaria ou prioridade'
      : 'View and manage tasks by department or priority',
    viewAll: language === 'pt' ? 'Ver Todas' : 'View All',
    departments: language === 'pt' ? 'Secretarias' : 'Departments',
    priorities: language === 'pt' ? 'Prioridades' : 'Priorities',
    pendingTasks: language === 'pt' ? 'Tarefas Pendentes' : 'Pending Tasks',
    noTasks: language === 'pt' ? 'Sem tarefas' : 'No tasks',
  };

  const departamentos = [
    {
      nome: language === 'pt' ? 'Saúde' : 'Health',
      key: 'saude',
      icone: <HeartPulse className="h-5 w-5 text-white" />,
      colorClass: 'bg-saude-DEFAULT',
      bgClass: 'bg-saude-light/20 border-saude-DEFAULT/20',
      tarefasPendentes: obterPedidosPorSetor('Saúde').length,
    },
    {
      nome: language === 'pt' ? 'Educação' : 'Education',
      key: 'educacao',
      icone: <BookOpen className="h-5 w-5 text-white" />,
      colorClass: 'bg-educacao-DEFAULT',
      bgClass: 'bg-educacao-light/20 border-educacao-DEFAULT/20',
      tarefasPendentes: obterPedidosPorSetor('Educação').length,
    },
    {
      nome: language === 'pt' ? 'Administrativo' : 'Administrative',
      key: 'administrativo',
      icone: <Building2 className="h-5 w-5 text-white" />,
      colorClass: 'bg-administrativo-DEFAULT',
      bgClass: 'bg-administrativo-light/20 border-administrativo-DEFAULT/20',
      tarefasPendentes: obterPedidosPorSetor('Administrativo').length,
    },
    {
      nome: language === 'pt' ? 'Transporte' : 'Transport',
      key: 'transporte',
      icone: <Bus className="h-5 w-5 text-white" />,
      colorClass: 'bg-transporte-DEFAULT',
      bgClass: 'bg-transporte-light/20 border-transporte-DEFAULT/20',
      tarefasPendentes: obterPedidosPorSetor('Transporte').length,
    },
    {
      nome: language === 'pt' ? 'Obras' : 'Construction',
      key: 'obras',
      icone: <Briefcase className="h-5 w-5 text-white" />,
      colorClass: 'bg-blue-500',
      bgClass: 'bg-blue-100/20 border-blue-500/20',
      tarefasPendentes: obterPedidosPorSetor('Obras').length,
    },
    {
      nome: language === 'pt' ? 'Segurança Pública' : 'Public Safety',
      key: 'seguranca',
      icone: <Shield className="h-5 w-5 text-white" />,
      colorClass: 'bg-red-500',
      bgClass: 'bg-red-100/20 border-red-500/20',
      tarefasPendentes: obterPedidosPorSetor('Segurança Pública').length,
    },
    {
      nome: language === 'pt' ? 'Assistência Social' : 'Social Assistance',
      key: 'social',
      icone: <Heart className="h-5 w-5 text-white" />,
      colorClass: 'bg-purple-500',
      bgClass: 'bg-purple-100/20 border-purple-500/20',
      tarefasPendentes: obterPedidosPorSetor('Assistência Social').length,
    },
    {
      nome: language === 'pt' ? 'Meio Ambiente' : 'Environment',
      key: 'ambiente',
      icone: <Leaf className="h-5 w-5 text-white" />,
      colorClass: 'bg-green-500',
      bgClass: 'bg-green-100/20 border-green-500/20',
      tarefasPendentes: obterPedidosPorSetor('Meio Ambiente').length,
    },
    {
      nome: language === 'pt' ? 'Fazenda' : 'Treasury',
      key: 'fazenda',
      icone: <Coins className="h-5 w-5 text-white" />,
      colorClass: 'bg-yellow-600',
      bgClass: 'bg-yellow-100/20 border-yellow-600/20',
      tarefasPendentes: obterPedidosPorSetor('Fazenda').length,
    },
    {
      nome: language === 'pt' ? 'Turismo' : 'Tourism',
      key: 'turismo',
      icone: <Globe className="h-5 w-5 text-white" />,
      colorClass: 'bg-cyan-500',
      bgClass: 'bg-cyan-100/20 border-cyan-500/20',
      tarefasPendentes: obterPedidosPorSetor('Turismo').length,
    },
    {
      nome: language === 'pt' ? 'Cultura' : 'Culture',
      key: 'cultura',
      icone: <Music className="h-5 w-5 text-white" />,
      colorClass: 'bg-pink-500',
      bgClass: 'bg-pink-100/20 border-pink-500/20',
      tarefasPendentes: obterPedidosPorSetor('Cultura').length,
    },
    {
      nome: language === 'pt' ? 'Esportes e Lazer' : 'Sports and Recreation',
      key: 'esportes',
      icone: <Award className="h-5 w-5 text-white" />,
      colorClass: 'bg-orange-500',
      bgClass: 'bg-orange-100/20 border-orange-500/20',
      tarefasPendentes: obterPedidosPorSetor('Esportes e Lazer').length,
    },
    {
      nome: language === 'pt' ? 'Planejamento' : 'Planning',
      key: 'planejamento',
      icone: <PieChart className="h-5 w-5 text-white" />,
      colorClass: 'bg-indigo-500',
      bgClass: 'bg-indigo-100/20 border-indigo-500/20',
      tarefasPendentes: obterPedidosPorSetor('Planejamento').length,
    },
    {
      nome: language === 'pt' ? 'Comunicação' : 'Communication',
      key: 'comunicacao',
      icone: <Radio className="h-5 w-5 text-white" />,
      colorClass: 'bg-blue-400',
      bgClass: 'bg-blue-100/20 border-blue-400/20',
      tarefasPendentes: obterPedidosPorSetor('Comunicação').length,
    },
    {
      nome: language === 'pt' ? 'Ciência e Tecnologia' : 'Science and Technology',
      key: 'ciencia',
      icone: <MapPin className="h-5 w-5 text-white" />,
      colorClass: 'bg-teal-500',
      bgClass: 'bg-teal-100/20 border-teal-500/20',
      tarefasPendentes: obterPedidosPorSetor('Ciência e Tecnologia').length,
    },
  ];

  // Filtrar apenas departamentos com tarefas pendentes
  const departamentosComTarefas = departamentos.filter(dept => dept.tarefasPendentes > 0);
  
  // Total de tarefas pendentes
  const totalPendentes = departamentos.reduce((sum, dept) => sum + dept.tarefasPendentes, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{texts.title}</h1>
        <p className="text-muted-foreground text-sm">
          {texts.description}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">{texts.departments}</CardTitle>
          <CardDescription>
            {language === 'pt' ? 
              `${totalPendentes} pedidos pendentes distribuídos entre as secretarias` : 
              `${totalPendentes} pending orders distributed among departments`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {departamentosComTarefas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departamentosComTarefas.map((dept, index) => (
                <div key={index} className={`p-4 rounded-lg border ${dept.bgClass}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${dept.colorClass}`}>
                        {dept.icone}
                      </div>
                      <div>
                        <h3 className="font-medium">{dept.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dept.tarefasPendentes} {language === 'pt' ? 'pedidos' : 'orders'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/tarefas/${dept.key}`)}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">{texts.noTasks}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TarefasSelecao;
