
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HeartPulse, BookOpen, Building2, Bus, CalendarDays, ClipboardList, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    health: language === 'pt' ? 'Saúde' : 'Health',
    education: language === 'pt' ? 'Educação' : 'Education',
    administrative: language === 'pt' ? 'Administrativo' : 'Administrative',
    transport: language === 'pt' ? 'Transporte' : 'Transport',
    pending: language === 'pt' ? 'Pendentes' : 'Pending',
    highPriority: language === 'pt' ? 'Alta Prioridade' : 'High Priority',
    mediumPriority: language === 'pt' ? 'Média Prioridade' : 'Medium Priority',
    lowPriority: language === 'pt' ? 'Baixa Prioridade' : 'Low Priority',
    taskSummary: language === 'pt' ? 'Resumo de Tarefas' : 'Task Summary',
    pendingTasks: language === 'pt' ? 'Tarefas Pendentes' : 'Pending Tasks',
    completedTasks: language === 'pt' ? 'Tarefas Concluídas' : 'Completed Tasks',
    viewFlow: language === 'pt' ? 'Ver Fluxo' : 'View Flow',
    viewKanban: language === 'pt' ? 'Ver Kanban' : 'View Kanban',
  };

  const departamentos = [
    {
      nome: texts.health,
      key: 'saude',
      icone: <HeartPulse className="h-5 w-5 text-white" />,
      colorClass: 'bg-saude-DEFAULT',
      bgClass: 'bg-saude-light/20 border-saude-DEFAULT/20',
      tarefasPendentes: 8,
      tarefasTotal: 15,
    },
    {
      nome: texts.education,
      key: 'educacao',
      icone: <BookOpen className="h-5 w-5 text-white" />,
      colorClass: 'bg-educacao-DEFAULT',
      bgClass: 'bg-educacao-light/20 border-educacao-DEFAULT/20',
      tarefasPendentes: 12,
      tarefasTotal: 23,
    },
    {
      nome: texts.administrative,
      key: 'administrativo',
      icone: <Building2 className="h-5 w-5 text-white" />,
      colorClass: 'bg-administrativo-DEFAULT',
      bgClass: 'bg-administrativo-light/20 border-administrativo-DEFAULT/20',
      tarefasPendentes: 6,
      tarefasTotal: 19,
    },
    {
      nome: texts.transport,
      key: 'transporte',
      icone: <Bus className="h-5 w-5 text-white" />,
      colorClass: 'bg-transporte-DEFAULT',
      bgClass: 'bg-transporte-light/20 border-transporte-DEFAULT/20',
      tarefasPendentes: 4,
      tarefasTotal: 10,
    },
  ];

  const prioridades = [
    {
      nome: texts.highPriority,
      colorClass: 'bg-destructive text-destructive-foreground',
      tarefasPendentes: 9,
    },
    {
      nome: texts.mediumPriority,
      colorClass: 'bg-amber-500 text-white',
      tarefasPendentes: 14,
    },
    {
      nome: texts.lowPriority,
      colorClass: 'bg-emerald-500 text-white',
      tarefasPendentes: 7,
    },
  ];

  const totalPendentes = departamentos.reduce((sum, dept) => sum + dept.tarefasPendentes, 0);
  const totalTarefas = departamentos.reduce((sum, dept) => sum + dept.tarefasTotal, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{texts.title}</h1>
        <p className="text-muted-foreground text-sm">
          {texts.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{texts.taskSummary}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{texts.pendingTasks}</p>
                <p className="text-2xl font-bold">{totalPendentes}</p>
                <div className="h-2 bg-muted rounded-full mt-2">
                  <div 
                    className="h-2 bg-primary rounded-full" 
                    style={{ width: `${(totalPendentes / totalTarefas) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{texts.completedTasks}</p>
                <p className="text-2xl font-bold">{totalTarefas - totalPendentes}</p>
                <div className="h-2 bg-muted rounded-full mt-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${((totalTarefas - totalPendentes) / totalTarefas) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/tarefas/todos')}
                className="w-full"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                {texts.viewKanban}
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/tarefas/fluxo')}
                className="w-full"
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                {texts.viewFlow}
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <Tabs defaultValue="secretarias">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="secretarias" className="tab-item">
                    {texts.departments}
                  </TabsTrigger>
                  <TabsTrigger value="prioridades" className="tab-item">
                    {texts.priorities}
                  </TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" onClick={() => navigate('/tarefas/todos')}>
                  {texts.viewAll}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="secretarias" className="mt-0">
                <div className="space-y-4">
                  {departamentos.map((dept, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${dept.bgClass}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md ${dept.colorClass}`}>
                            {dept.icone}
                          </div>
                          <div>
                            <h3 className="font-medium">{dept.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              {dept.tarefasPendentes} {texts.pending} / {dept.tarefasTotal} total
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/tarefas/${dept.key}`)}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-2 bg-muted/40 rounded-full mt-4">
                        <div 
                          className={`h-2 rounded-full ${dept.colorClass}`}
                          style={{ width: `${(dept.tarefasPendentes / dept.tarefasTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="prioridades" className="mt-0">
                <div className="space-y-4">
                  {prioridades.map((prioridade, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Badge className={prioridade.colorClass}>
                            {prioridade.nome}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {prioridade.tarefasPendentes} {texts.pending}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/tarefas/todos`)}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default TarefasSelecao;
