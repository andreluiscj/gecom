
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HeartPulse, BookOpen, Building2, Bus, ArrowRight, Briefcase, Shield, Heart, Leaf, Coins, Globe, Music, Award, PieChart, Radio, MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { obterPedidosPorSetor } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';

const TarefasSelecao: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('pt');
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    // Force re-render every 5 seconds to reflect any changes in data
    const interval = setInterval(() => {
      setTrigger(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
    workflow: language === 'pt' ? 'Fluxo do Processo' : 'Workflow',
  };

  const secretarias = [
    {
      nome: language === 'pt' ? 'Saúde' : 'Health',
      key: 'saude',
      icone: <HeartPulse className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Saúde').length,
    },
    {
      nome: language === 'pt' ? 'Educação' : 'Education',
      key: 'educacao',
      icone: <BookOpen className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Educação').length,
    },
    {
      nome: language === 'pt' ? 'Administrativo' : 'Administrative',
      key: 'administrativo',
      icone: <Building2 className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Administrativo').length,
    },
    {
      nome: language === 'pt' ? 'Transporte' : 'Transport',
      key: 'transporte',
      icone: <Bus className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Transporte').length,
    },
    {
      nome: language === 'pt' ? 'Obras' : 'Construction',
      key: 'obras',
      icone: <Briefcase className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Obras').length,
    },
    {
      nome: language === 'pt' ? 'Segurança Pública' : 'Public Safety',
      key: 'seguranca',
      icone: <Shield className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Segurança Pública').length,
    },
    {
      nome: language === 'pt' ? 'Assistência Social' : 'Social Assistance',
      key: 'social',
      icone: <Heart className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Assistência Social').length,
    },
    {
      nome: language === 'pt' ? 'Meio Ambiente' : 'Environment',
      key: 'ambiente',
      icone: <Leaf className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Meio Ambiente').length,
    },
    {
      nome: language === 'pt' ? 'Fazenda' : 'Treasury',
      key: 'fazenda',
      icone: <Coins className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Fazenda').length,
    },
    {
      nome: language === 'pt' ? 'Turismo' : 'Tourism',
      key: 'turismo',
      icone: <Globe className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Turismo').length,
    },
    {
      nome: language === 'pt' ? 'Cultura' : 'Culture',
      key: 'cultura',
      icone: <Music className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Cultura').length,
    },
    {
      nome: language === 'pt' ? 'Esportes e Lazer' : 'Sports and Recreation',
      key: 'esportes',
      icone: <Award className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Esportes e Lazer').length,
    },
    {
      nome: language === 'pt' ? 'Planejamento' : 'Planning',
      key: 'planejamento',
      icone: <PieChart className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Planejamento').length,
    },
    {
      nome: language === 'pt' ? 'Comunicação' : 'Communication',
      key: 'comunicacao',
      icone: <Radio className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Comunicação').length,
    },
    {
      nome: language === 'pt' ? 'Ciência e Tecnologia' : 'Science and Technology',
      key: 'ciencia',
      icone: <MapPin className="h-5 w-5 text-black" />,
      colorClass: 'bg-white',
      bgClass: 'bg-white border-gray-200',
      tarefasPendentes: obterPedidosPorSetor('Ciência e Tecnologia').length,
    },
  ];

  const secretariasComTarefas = secretarias.filter(dept => dept.tarefasPendentes > 0);
  
  const totalPendentes = secretarias.reduce((sum, dept) => sum + dept.tarefasPendentes, 0);

  const [secretariaSelecionada, setSecretariaSelecionada] = useState<string | null>(null);

  const handleSecretariaClick = (key: string) => {
    const secretaria = secretarias.find(d => d.key === key)?.nome as any;
    setSecretariaSelecionada(secretaria);
  };

  const pedidosDaSecretaria = secretariaSelecionada 
    ? obterPedidosPorSetor(secretariaSelecionada as any)
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{texts.title}</h1>
        <p className="text-muted-foreground text-sm">
          {texts.description}
        </p>
      </div>

      {secretariaSelecionada ? (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-md bg-white shadow-sm`}>
                  {secretarias.find(d => d.nome === secretariaSelecionada)?.icone}
                </div>
                <CardTitle className="text-lg">{secretariaSelecionada}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSecretariaSelecionada(null)}>
                Voltar
              </Button>
            </div>
            <CardDescription className="mt-2">
              {pedidosDaSecretaria.length} {language === 'pt' ? 'demandas cadastradas' : 'registered demands'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'pt' ? 'Descrição' : 'Description'}</TableHead>
                    <TableHead>{language === 'pt' ? 'Data' : 'Date'}</TableHead>
                    <TableHead>{language === 'pt' ? 'Valor' : 'Value'}</TableHead>
                    <TableHead>{language === 'pt' ? 'Status' : 'Status'}</TableHead>
                    <TableHead>{language === 'pt' ? 'Progresso' : 'Progress'}</TableHead>
                    <TableHead>{language === 'pt' ? 'Ações' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosDaSecretaria.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium">{pedido.descricao}</TableCell>
                      <TableCell>{formatDate(pedido.dataCompra)}</TableCell>
                      <TableCell>{formatCurrency(pedido.valorTotal)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          pedido.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                          pedido.status === 'Em Andamento' || pedido.status === 'Aprovado' ? 'bg-blue-100 text-blue-800' : 
                          'bg-orange-100 text-orange-800'
                        }>
                          {pedido.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <div className="h-2 w-full">
                            <Progress 
                              value={pedido.workflow?.percentComplete || 0} 
                              className="h-2" 
                              color={
                                pedido.workflow?.percentComplete && pedido.workflow.percentComplete > 70 ? 'bg-green-500' : 
                                pedido.workflow?.percentComplete && pedido.workflow.percentComplete > 30 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }
                            />
                          </div>
                          <div className="text-xs text-muted-foreground text-right mt-1">
                            {pedido.workflow?.percentComplete || 0}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => navigate(`/pedidos/workflow/${pedido.id}`)}
                          title={texts.workflow}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
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
            {secretariasComTarefas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {secretariasComTarefas.map((dept, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${dept.bgClass}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md shadow-sm bg-white`}>
                          {dept.icone}
                        </div>
                        <div>
                          <h3 className="font-medium">{dept.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dept.tarefasPendentes} {language === 'pt' ? 'pedidos' : 'orders'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleSecretariaClick(dept.key)}>
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
      )}
    </div>
  );
};

export default TarefasSelecao;
