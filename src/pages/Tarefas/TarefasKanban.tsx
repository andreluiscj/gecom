
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  HelpCircle, 
  MoreHorizontal, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CalendarDays, 
  ClipboardList,
  HeartPulse,
  BookOpen,
  Building2,
  Bus,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'solicitado' | 'em_analise' | 'aprovado' | 'em_processo' | 'concluido' | 'rejeitado';
  responsavel: string;
  departamento: string;
  dataCriacao: string;
  dataVencimento: string;
}

const TarefasKanban: React.FC = () => {
  const navigate = useNavigate();
  const { secretaria } = useParams<{ secretaria: string }>();
  const [language, setLanguage] = useState('pt');
  const [visualizacao, setVisualizacao] = useState<'kanban' | 'fluxo'>('kanban');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const getIcone = (depto: string) => {
    switch (depto.toLowerCase()) {
      case 'saúde':
      case 'saude':
        return <HeartPulse className="h-4 w-4" />;
      case 'educação':
      case 'educacao':
        return <BookOpen className="h-4 w-4" />;
      case 'administrativo':
        return <Building2 className="h-4 w-4" />;
      case 'transporte':
        return <Bus className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCor = (depto: string) => {
    switch (depto.toLowerCase()) {
      case 'saúde':
      case 'saude':
        return 'bg-saude-DEFAULT text-white';
      case 'educação':
      case 'educacao':
        return 'bg-educacao-DEFAULT text-white';
      case 'administrativo':
        return 'bg-administrativo-DEFAULT text-white';
      case 'transporte':
        return 'bg-transporte-DEFAULT text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-destructive text-destructive-foreground';
      case 'media':
        return 'bg-amber-500 text-white';
      case 'baixa':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPrioridadeTexto = (prioridade: string) => {
    if (language === 'pt') {
      switch (prioridade) {
        case 'alta': return 'Alta';
        case 'media': return 'Média';
        case 'baixa': return 'Baixa';
        default: return 'Não definida';
      }
    } else {
      switch (prioridade) {
        case 'alta': return 'High';
        case 'media': return 'Medium';
        case 'baixa': return 'Low';
        default: return 'Not set';
      }
    }
  };

  const getStatusTexto = (status: string) => {
    if (language === 'pt') {
      switch (status) {
        case 'solicitado': return 'Solicitado';
        case 'em_analise': return 'Em Análise';
        case 'aprovado': return 'Aprovado';
        case 'em_processo': return 'Em Processo';
        case 'concluido': return 'Concluído';
        case 'rejeitado': return 'Rejeitado';
        default: return 'Desconhecido';
      }
    } else {
      switch (status) {
        case 'solicitado': return 'Requested';
        case 'em_analise': return 'Under Review';
        case 'aprovado': return 'Approved';
        case 'em_processo': return 'In Process';
        case 'concluido': return 'Completed';
        case 'rejeitado': return 'Rejected';
        default: return 'Unknown';
      }
    }
  };
  
  const getStatusIcone = (status: string) => {
    switch (status) {
      case 'solicitado': 
        return <Clock className="h-4 w-4" />;
      case 'em_analise':
        return <HelpCircle className="h-4 w-4" />;
      case 'aprovado':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'em_processo':
        return <Clock className="h-4 w-4" />;
      case 'concluido':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  // Textos traduzidos
  const texts = {
    title: language === 'pt' ? 'Gerenciamento de Tarefas' : 'Task Management',
    description: language === 'pt' ? 'Visualize e gerencie tarefas por etapa de processamento' : 'View and manage tasks by processing stage',
    back: language === 'pt' ? 'Voltar' : 'Back',
    newTask: language === 'pt' ? 'Nova Tarefa' : 'New Task',
    allDepartments: language === 'pt' ? 'Todos os Departamentos' : 'All Departments',
    requested: language === 'pt' ? 'Solicitado' : 'Requested',
    review: language === 'pt' ? 'Em Análise' : 'Under Review',
    approved: language === 'pt' ? 'Aprovado' : 'Approved',
    inProcess: language === 'pt' ? 'Em Processo' : 'In Process',
    completed: language === 'pt' ? 'Concluído' : 'Completed',
    rejected: language === 'pt' ? 'Rejeitado' : 'Rejected',
    searchPlaceholder: language === 'pt' ? 'Buscar tarefas...' : 'Search tasks...',
    flowView: language === 'pt' ? 'Visualização de Fluxo' : 'Flow View',
    kanbanView: language === 'pt' ? 'Visualização Kanban' : 'Kanban View',
    noTasks: language === 'pt' ? 'Nenhuma tarefa encontrada' : 'No tasks found',
    priority: language === 'pt' ? 'Prioridade' : 'Priority',
    health: language === 'pt' ? 'Saúde' : 'Health',
    education: language === 'pt' ? 'Educação' : 'Education',
    administrative: language === 'pt' ? 'Administrativo' : 'Administrative',
    transport: language === 'pt' ? 'Transporte' : 'Transport',
    dueDate: language === 'pt' ? 'Data de Vencimento' : 'Due Date',
    taskFlowTitle: language === 'pt' ? 'Fluxo de Tarefas' : 'Task Flow',
    taskFlowDesc: language === 'pt' ? 'Visualize o progresso das tarefas através do fluxo de trabalho' : 'View task progress through the workflow',
    dueAt: language === 'pt' ? 'Vence em' : 'Due at',
    createdAt: language === 'pt' ? 'Criado em' : 'Created at',
    responsible: language === 'pt' ? 'Responsável' : 'Responsible',
    department: language === 'pt' ? 'Departamento' : 'Department',
    status: language === 'pt' ? 'Status' : 'Status',
    moveToNextStep: language === 'pt' ? 'Mover para próxima etapa' : 'Move to next step',
    moveToReview: language === 'pt' ? 'Mover para Análise' : 'Move to Review',
    moveToApproved: language === 'pt' ? 'Aprovar' : 'Approve',
    moveToProcess: language === 'pt' ? 'Iniciar Processo' : 'Start Process',
    moveToCompleted: language === 'pt' ? 'Marcar como Concluído' : 'Mark as Completed',
    moveToRejected: language === 'pt' ? 'Rejeitar' : 'Reject',
  };

  const departamentoNome = secretaria === 'saude' ? texts.health :
                         secretaria === 'educacao' ? texts.education :
                         secretaria === 'administrativo' ? texts.administrative :
                         secretaria === 'transporte' ? texts.transport :
                         secretaria === 'todos' || !secretaria ? texts.allDepartments :
                         secretaria === 'fluxo' ? texts.flowView : texts.allDepartments;

  // Coleção de tarefas simuladas
  const mockTasks: Tarefa[] = [
    {
      id: 1,
      titulo: language === 'pt' ? 'Revisão do DFD de Medicamentos' : 'Review of Medicine DFD',
      descricao: language === 'pt' ? 'Revisar o DFD para compra de medicamentos para o posto de saúde central' : 'Review the DFD for medicine purchase for the central health post',
      prioridade: 'alta',
      status: 'solicitado',
      responsavel: 'Ana Silva',
      departamento: texts.health,
      dataCriacao: '2023-10-15',
      dataVencimento: '2023-10-25',
    },
    {
      id: 2,
      titulo: language === 'pt' ? 'Aprovação do DFD de Material Escolar' : 'School Supplies DFD Approval',
      descricao: language === 'pt' ? 'Aprovar DFD para compra de material escolar para o próximo semestre' : 'Approve DFD for school supplies purchase for next semester',
      prioridade: 'media',
      status: 'em_analise',
      responsavel: 'Carlos Oliveira',
      departamento: texts.education,
      dataCriacao: '2023-10-12',
      dataVencimento: '2023-10-28',
    },
    {
      id: 3,
      titulo: language === 'pt' ? 'Compra de Combustível' : 'Fuel Purchase',
      descricao: language === 'pt' ? 'DFD para aquisição de combustível para a frota municipal' : 'DFD for fuel acquisition for the municipal fleet',
      prioridade: 'baixa',
      status: 'aprovado',
      responsavel: 'Roberto Souza',
      departamento: texts.transport,
      dataCriacao: '2023-10-10',
      dataVencimento: '2023-11-05',
    },
    {
      id: 4,
      titulo: language === 'pt' ? 'Contratação de Serviços de Limpeza' : 'Cleaning Services Hiring',
      descricao: language === 'pt' ? 'DFD para contratação de empresa de limpeza para prédios administrativos' : 'DFD for hiring a cleaning company for administrative buildings',
      prioridade: 'media',
      status: 'em_processo',
      responsavel: 'Fernanda Lima',
      departamento: texts.administrative,
      dataCriacao: '2023-10-05',
      dataVencimento: '2023-10-30',
    },
    {
      id: 5,
      titulo: language === 'pt' ? 'Manutenção de Equipamentos Médicos' : 'Medical Equipment Maintenance',
      descricao: language === 'pt' ? 'DFD para contratação de serviço de manutenção para equipamentos do hospital municipal' : 'DFD for hiring maintenance service for municipal hospital equipment',
      prioridade: 'alta',
      status: 'concluido',
      responsavel: 'Juliana Santos',
      departamento: texts.health,
      dataCriacao: '2023-09-28',
      dataVencimento: '2023-10-15',
    },
    {
      id: 6,
      titulo: language === 'pt' ? 'Compra de Carteiras Escolares' : 'School Desks Purchase',
      descricao: language === 'pt' ? 'DFD para aquisição de carteiras para a escola municipal' : 'DFD for purchasing desks for the municipal school',
      prioridade: 'alta',
      status: 'rejeitado',
      responsavel: 'Paulo Mendes',
      departamento: texts.education,
      dataCriacao: '2023-10-01',
      dataVencimento: '2023-10-20',
    },
    {
      id: 7,
      titulo: language === 'pt' ? 'Contratação de Motoristas' : 'Drivers Hiring',
      descricao: language === 'pt' ? 'DFD para contratação de motoristas para a frota municipal' : 'DFD for hiring drivers for the municipal fleet',
      prioridade: 'media',
      status: 'solicitado',
      responsavel: 'Marcos Pereira',
      departamento: texts.transport,
      dataCriacao: '2023-10-14',
      dataVencimento: '2023-11-10',
    },
    {
      id: 8,
      titulo: language === 'pt' ? 'Aquisição de Software' : 'Software Acquisition',
      descricao: language === 'pt' ? 'DFD para compra de licenças de software para o departamento administrativo' : 'DFD for purchasing software licenses for the administrative department',
      prioridade: 'baixa',
      status: 'em_analise',
      responsavel: 'Amanda Costa',
      departamento: texts.administrative,
      dataCriacao: '2023-10-08',
      dataVencimento: '2023-11-01',
    },
    {
      id: 9,
      titulo: language === 'pt' ? 'Compra de Vacinas' : 'Vaccine Purchase',
      descricao: language === 'pt' ? 'DFD para aquisição de vacinas para campanha de imunização' : 'DFD for purchasing vaccines for immunization campaign',
      prioridade: 'alta',
      status: 'aprovado',
      responsavel: 'Luciana Martins',
      departamento: texts.health,
      dataCriacao: '2023-10-07',
      dataVencimento: '2023-10-27',
    },
    {
      id: 10,
      titulo: language === 'pt' ? 'Material Didático' : 'Teaching Materials',
      descricao: language === 'pt' ? 'DFD para compra de material didático para professores' : 'DFD for purchasing teaching materials for teachers',
      prioridade: 'media',
      status: 'em_processo',
      responsavel: 'Ricardo Alves',
      departamento: texts.education,
      dataCriacao: '2023-10-03',
      dataVencimento: '2023-10-23',
    },
  ];

  // Filtrar tarefas com base no departamento selecionado
  const tarefasFiltradas = !secretaria || secretaria === 'todos' || secretaria === 'fluxo'
    ? mockTasks
    : mockTasks.filter(tarefa => 
        tarefa.departamento.toLowerCase() === departamentoNome.toLowerCase()
      );

  // Agrupar tarefas por status
  const tarefasPorStatus = {
    solicitado: tarefasFiltradas.filter(t => t.status === 'solicitado'),
    em_analise: tarefasFiltradas.filter(t => t.status === 'em_analise'),
    aprovado: tarefasFiltradas.filter(t => t.status === 'aprovado'),
    em_processo: tarefasFiltradas.filter(t => t.status === 'em_processo'),
    concluido: tarefasFiltradas.filter(t => t.status === 'concluido'),
    rejeitado: tarefasFiltradas.filter(t => t.status === 'rejeitado'),
  };

  // Mover tarefa para o próximo status
  const moverParaProximoStatus = (tarefa: Tarefa, novoStatus: string) => {
    toast.success(language === 'pt' 
      ? `Tarefa "${tarefa.titulo}" movida para "${getStatusTexto(novoStatus)}"` 
      : `Task "${tarefa.titulo}" moved to "${getStatusTexto(novoStatus)}"`);
  };

  // Verificar se devemos mostrar a visualização de fluxo
  useEffect(() => {
    if (secretaria === 'fluxo') {
      setVisualizacao('fluxo');
    } else {
      setVisualizacao('kanban');
    }
  }, [secretaria]);

  // Componente para renderizar um item de tarefa no Kanban
  const TarefaItem = ({ tarefa }: { tarefa: Tarefa }) => (
    <Card className="mb-3 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getPrioridadeCor(tarefa.prioridade)}>
            {getPrioridadeTexto(tarefa.prioridade)}
          </Badge>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    let novoStatus = '';
                    switch (tarefa.status) {
                      case 'solicitado': novoStatus = 'em_analise'; break;
                      case 'em_analise': novoStatus = 'aprovado'; break;
                      case 'aprovado': novoStatus = 'em_processo'; break;
                      case 'em_processo': novoStatus = 'concluido'; break;
                      default: novoStatus = tarefa.status;
                    }
                    moverParaProximoStatus(tarefa, novoStatus);
                  }}
                >
                  {tarefa.status === 'solicitado' && texts.moveToReview}
                  {tarefa.status === 'em_analise' && texts.moveToApproved}
                  {tarefa.status === 'aprovado' && texts.moveToProcess}
                  {tarefa.status === 'em_processo' && texts.moveToCompleted}
                  {(tarefa.status === 'concluido' || tarefa.status === 'rejeitado') && texts.moveToNextStep}
                </Button>
                {(tarefa.status === 'solicitado' || tarefa.status === 'em_analise' || tarefa.status === 'aprovado') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive"
                    onClick={() => moverParaProximoStatus(tarefa, 'rejeitado')}
                  >
                    {texts.moveToRejected}
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <h3 className="font-medium mb-1 line-clamp-2">{tarefa.titulo}</h3>
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <CalendarDays className="h-3 w-3 mr-1" />
          <span>{texts.dueAt} {new Date(tarefa.dataVencimento).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getIcone(tarefa.departamento)}
            <span>{tarefa.departamento}</span>
          </Badge>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {tarefa.responsavel.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );

  // Componente para renderizar uma coluna do Kanban
  const KanbanColuna = ({ status, tarefas, titulo }: { status: string, tarefas: Tarefa[], titulo: string }) => (
    <div className="min-w-[18rem] shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-sm">{titulo}</h3>
          <Badge variant="outline">{tarefas.length}</Badge>
        </div>
        {(status === 'solicitado' || status === 'aprovado') && (
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {tarefas.length === 0 ? (
          <div className="flex items-center justify-center h-24 border border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">{texts.noTasks}</p>
          </div>
        ) : (
          tarefas.map(tarefa => <TarefaItem key={tarefa.id} tarefa={tarefa} />)
        )}
      </div>
    </div>
  );

  // Componente para a visualização de fluxo
  const FluxoVisualizacao = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{texts.taskFlowTitle}</CardTitle>
          <CardDescription>{texts.taskFlowDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tarefasFiltradas.map(tarefa => (
              <Card key={tarefa.id} className="overflow-hidden">
                <div className={`h-1 ${getPrioridadeCor(tarefa.prioridade)}`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">{tarefa.titulo}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getIcone(tarefa.departamento)}
                      <span>{tarefa.departamento}</span>
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{tarefa.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{texts.createdAt}</p>
                      <p className="text-sm">{new Date(tarefa.dataCriacao).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{texts.dueDate}</p>
                      <p className="text-sm">{new Date(tarefa.dataVencimento).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{texts.responsible}</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {tarefa.responsavel.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{tarefa.responsavel}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />
                    
                    <div className="relative z-10 flex items-center gap-4 mb-4">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${tarefa.status === 'solicitado' || tarefa.status === 'em_analise' || tarefa.status === 'aprovado' || tarefa.status === 'em_processo' || tarefa.status === 'concluido' ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {getStatusIcone('solicitado')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{texts.requested}</p>
                        <p className="text-xs text-muted-foreground">15/10/2023</p>
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-4 mb-4">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${tarefa.status === 'em_analise' || tarefa.status === 'aprovado' || tarefa.status === 'em_processo' || tarefa.status === 'concluido' ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {getStatusIcone('em_analise')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{texts.review}</p>
                        <p className="text-xs text-muted-foreground">17/10/2023</p>
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-4 mb-4">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${tarefa.status === 'aprovado' || tarefa.status === 'em_processo' || tarefa.status === 'concluido' ? 'bg-primary text-white' : tarefa.status === 'rejeitado' ? 'bg-destructive text-white' : 'bg-muted'}`}>
                        {tarefa.status === 'rejeitado' ? getStatusIcone('rejeitado') : getStatusIcone('aprovado')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tarefa.status === 'rejeitado' ? texts.rejected : texts.approved}</p>
                        <p className="text-xs text-muted-foreground">19/10/2023</p>
                      </div>
                    </div>
                    
                    {tarefa.status !== 'rejeitado' && (
                      <>
                        <div className="relative z-10 flex items-center gap-4 mb-4">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${tarefa.status === 'em_processo' || tarefa.status === 'concluido' ? 'bg-primary text-white' : 'bg-muted'}`}>
                            {getStatusIcone('em_processo')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{texts.inProcess}</p>
                            <p className="text-xs text-muted-foreground">{tarefa.status === 'em_processo' || tarefa.status === 'concluido' ? '22/10/2023' : '-'}</p>
                          </div>
                        </div>
                        
                        <div className="relative z-10 flex items-center gap-4">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${tarefa.status === 'concluido' ? 'bg-primary text-white' : 'bg-muted'}`}>
                            {getStatusIcone('concluido')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{texts.completed}</p>
                            <p className="text-xs text-muted-foreground">{tarefa.status === 'concluido' ? '25/10/2023' : '-'}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/tarefas')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{texts.title}</h1>
            <p className="text-muted-foreground text-sm">
              {departamentoNome}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setVisualizacao(visualizacao === 'kanban' ? 'fluxo' : 'kanban')}>
            {visualizacao === 'kanban' 
              ? <><CalendarDays className="h-4 w-4 mr-2" /> {texts.flowView}</>
              : <><ClipboardList className="h-4 w-4 mr-2" /> {texts.kanbanView}</>
            }
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> {texts.newTask}
          </Button>
        </div>
      </div>

      {visualizacao === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[80rem]">
            <KanbanColuna 
              status="solicitado" 
              tarefas={tarefasPorStatus.solicitado} 
              titulo={texts.requested} 
            />
            <KanbanColuna 
              status="em_analise" 
              tarefas={tarefasPorStatus.em_analise} 
              titulo={texts.review} 
            />
            <KanbanColuna 
              status="aprovado" 
              tarefas={tarefasPorStatus.aprovado} 
              titulo={texts.approved} 
            />
            <KanbanColuna 
              status="em_processo" 
              tarefas={tarefasPorStatus.em_processo} 
              titulo={texts.inProcess} 
            />
            <KanbanColuna 
              status="concluido" 
              tarefas={tarefasPorStatus.concluido} 
              titulo={texts.completed} 
            />
            <KanbanColuna 
              status="rejeitado" 
              tarefas={tarefasPorStatus.rejeitado} 
              titulo={texts.rejected} 
            />
          </div>
        </div>
      ) : (
        <FluxoVisualizacao />
      )}
    </div>
  );
};

export default TarefasKanban;
