
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
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CalendarDays, 
  ClipboardList,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { obterPedidosPorSetor } from '@/data/mockData';
import { formatarData } from '@/data/mockData';
import { PedidoCompra } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { getSetorIcon } from '@/utils/iconHelpers';

const TarefasKanban: React.FC = () => {
  const navigate = useNavigate();
  const { secretaria } = useParams<{ secretaria: string }>();
  const [language, setLanguage] = useState('pt');
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Carregar pedidos da secretaria selecionada
    if (secretaria) {
      // Converter o parâmetro da URL para o formato esperado pelo tipo Setor
      const setorMapeado = mapUrlParaSetor(secretaria);
      if (setorMapeado) {
        const pedidosSetor = obterPedidosPorSetor(setorMapeado);
        setPedidos(pedidosSetor);
      }
    }
  }, [secretaria]);

  // Função para mapear a URL para o tipo Setor
  const mapUrlParaSetor = (urlParam: string): string | null => {
    const mapeamento: Record<string, string> = {
      'saude': 'Saúde',
      'educacao': 'Educação',
      'administrativo': 'Administrativo',
      'transporte': 'Transporte',
      'obras': 'Obras',
      'seguranca': 'Segurança Pública',
      'social': 'Assistência Social',
      'ambiente': 'Meio Ambiente',
      'fazenda': 'Fazenda',
      'turismo': 'Turismo',
      'cultura': 'Cultura',
      'esportes': 'Esportes e Lazer',
      'planejamento': 'Planejamento',
      'comunicacao': 'Comunicação',
      'ciencia': 'Ciência e Tecnologia'
    };
    
    return mapeamento[urlParam] || null;
  };

  const getStatusTexto = (status: string) => {
    if (language === 'pt') {
      switch (status) {
        case 'pendente': return 'Pendente';
        case 'em_analise': return 'Em Análise';
        case 'aprovado': return 'Aprovado';
        case 'em_processo': return 'Em Processo';
        case 'concluido': return 'Concluído';
        case 'rejeitado': return 'Rejeitado';
        default: return 'Pendente';
      }
    } else {
      switch (status) {
        case 'pendente': return 'Pending';
        case 'em_analise': return 'Under Review';
        case 'aprovado': return 'Approved';
        case 'em_processo': return 'In Process';
        case 'concluido': return 'Completed';
        case 'rejeitado': return 'Rejected';
        default: return 'Pending';
      }
    }
  };
  
  const getStatusIcone = (status: string) => {
    switch (status) {
      case 'pendente': 
        return <Clock className="h-4 w-4" />;
      case 'em_analise':
        return <Clock className="h-4 w-4" />;
      case 'aprovado':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'em_processo':
        return <Clock className="h-4 w-4" />;
      case 'concluido':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Agrupar pedidos por status
  const pedidosPorStatus = {
    pendente: pedidos.filter(p => p.status === 'pendente' || !p.status),
    em_analise: pedidos.filter(p => p.status === 'em_analise'),
    aprovado: pedidos.filter(p => p.status === 'aprovado'),
    em_processo: pedidos.filter(p => p.status === 'em_processo'),
    concluido: pedidos.filter(p => p.status === 'concluido'),
    rejeitado: pedidos.filter(p => p.status === 'rejeitado'),
  };

  // Textos traduzidos
  const texts = {
    title: language === 'pt' ? 'Tarefas da Secretaria' : 'Department Tasks',
    description: language === 'pt' ? 'Visualize e gerencie tarefas relacionadas aos pedidos de compra' : 'View and manage tasks related to purchase orders',
    back: language === 'pt' ? 'Voltar' : 'Back',
    newTask: language === 'pt' ? 'Nova Tarefa' : 'New Task',
    allDepartments: language === 'pt' ? 'Todos os Departamentos' : 'All Departments',
    pendente: language === 'pt' ? 'Pendente' : 'Pending',
    review: language === 'pt' ? 'Em Análise' : 'Under Review',
    approved: language === 'pt' ? 'Aprovado' : 'Approved',
    inProcess: language === 'pt' ? 'Em Processo' : 'In Process',
    completed: language === 'pt' ? 'Concluído' : 'Completed',
    rejected: language === 'pt' ? 'Rejeitado' : 'Rejected',
    viewOrder: language === 'pt' ? 'Visualizar Pedido' : 'View Order',
    noPendingTasks: language === 'pt' ? 'Nenhum pedido pendente' : 'No pending orders',
    noTasks: language === 'pt' ? 'Nenhum pedido encontrado' : 'No orders found',
    dueAt: language === 'pt' ? 'Data' : 'Date',
    total: language === 'pt' ? 'Total' : 'Total',
  };

  const departamentoNome = mapUrlParaSetor(secretaria || '') || texts.allDepartments;

  // Componente para renderizar um item de pedido no Kanban
  const PedidoItem = ({ pedido }: { pedido: PedidoCompra }) => (
    <Card className="mb-3 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{getStatusTexto(pedido.status || 'pendente')}</Badge>
        </div>
        <h3 className="font-medium mb-1 line-clamp-2">{pedido.descricao}</h3>
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <CalendarDays className="h-3 w-3 mr-1" />
          <span>{texts.dueAt}: {formatarData(pedido.dataCompra)}</span>
        </div>
        <div className="font-semibold mb-3">
          {texts.total}: {formatCurrency(pedido.valorTotal)}
        </div>
        <div className="flex justify-end mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => navigate(`/pedidos/visualizar/${pedido.id}`)}
          >
            <Eye className="h-3 w-3" />
            {texts.viewOrder}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Componente para renderizar uma coluna do Kanban
  const KanbanColuna = ({ status, pedidos, titulo }: { status: string, pedidos: PedidoCompra[], titulo: string }) => (
    <div className="min-w-[18rem] shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-sm">{titulo}</h3>
          <Badge variant="outline">{pedidos.length}</Badge>
        </div>
      </div>
      <div className="space-y-3">
        {pedidos.length === 0 ? (
          <div className="flex items-center justify-center h-24 border border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              {status === 'pendente' ? texts.noPendingTasks : texts.noTasks}
            </p>
          </div>
        ) : (
          pedidos.map(pedido => <PedidoItem key={pedido.id} pedido={pedido} />)
        )}
      </div>
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
          <Button size="sm" onClick={() => navigate('/pedidos/novo')}>
            <Plus className="h-4 w-4 mr-2" /> {texts.newTask}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[80rem]">
          <KanbanColuna 
            status="pendente" 
            pedidos={pedidosPorStatus.pendente} 
            titulo={texts.pendente} 
          />
          <KanbanColuna 
            status="em_analise" 
            pedidos={pedidosPorStatus.em_analise} 
            titulo={texts.review} 
          />
          <KanbanColuna 
            status="aprovado" 
            pedidos={pedidosPorStatus.aprovado} 
            titulo={texts.approved} 
          />
          <KanbanColuna 
            status="em_processo" 
            pedidos={pedidosPorStatus.em_processo} 
            titulo={texts.inProcess} 
          />
          <KanbanColuna 
            status="concluido" 
            pedidos={pedidosPorStatus.concluido} 
            titulo={texts.completed} 
          />
          <KanbanColuna 
            status="rejeitado" 
            pedidos={pedidosPorStatus.rejeitado} 
            titulo={texts.rejected} 
          />
        </div>
      </div>
    </div>
  );
};

export default TarefasKanban;
