
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { obterPedidos } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PedidoCompra, Setor } from '@/types';
import { Button } from '@/components/ui/button';
import { getSetorIcon, getSetorColor } from '@/utils/iconHelpers';
import { Progress } from '@/components/ui/progress';
import { Eye } from 'lucide-react';

interface TaskProps {
  pedido: PedidoCompra;
}

const Task: React.FC<TaskProps> = ({ pedido }) => {
  const navigate = useNavigate();

  const handleVisualizar = () => {
    navigate(`/pedidos/${pedido.id}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm mb-3 bg-white">
      <div className="flex justify-between items-start">
        <h3 className="font-medium truncate">{pedido.descricao}</h3>
        <div className={`text-xs rounded-full px-2 py-0.5 ${
          pedido.status === 'Concluído' 
            ? 'bg-green-100 text-green-800' 
            : pedido.status === 'Aprovado' 
            ? 'bg-blue-100 text-blue-800'
            : 'bg-orange-100 text-orange-800'
        }`}>
          {pedido.status}
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
        <div className={`p-1 rounded-full ${getSetorColor(pedido.setor)}`}>{getSetorIcon(pedido.setor)}</div>
        <span>{pedido.setor}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-2">{formatDate(pedido.dataCompra)}</div>
      <div className="text-sm font-semibold mt-2">{formatCurrency(pedido.valorTotal)}</div>
      
      {pedido.workflow && (
        <div className="mt-3 mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Progresso</span>
            <span>{pedido.workflow.percentComplete}%</span>
          </div>
          <Progress 
            value={pedido.workflow.percentComplete} 
            className="h-1" 
            color={pedido.workflow?.percentComplete > 70 ? 'bg-green-500' : 
                  pedido.workflow?.percentComplete > 30 ? 'bg-yellow-500' : 'bg-red-500'}
          />
        </div>
      )}
      
      <div className="mt-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full"
          onClick={handleVisualizar}
        >
          <Eye className="h-4 w-4 mr-1" /> 
          Visualizar
        </Button>
      </div>
    </div>
  );
};

const TarefasKanban = () => {
  const [tab, setTab] = useState('todos');
  const [secretariaSelecionada, setSecretariaSelecionada] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  
  useEffect(() => {
    const todosPedidos = obterPedidos();
    setPedidos(todosPedidos);
  }, []);

  const pedidosFiltrados = pedidos.filter(p => {
    if (secretariaSelecionada && p.setor !== secretariaSelecionada) {
      return false;
    }
    
    if (tab === 'pendentes') {
      return p.status === 'Pendente' || p.status === 'Em Análise';
    } else if (tab === 'andamento') {
      return p.status === 'Em Andamento' || p.status === 'Aprovado';
    } else if (tab === 'concluidos') {
      return p.status === 'Concluído';
    }
    
    return true;
  });

  const secretarias: Setor[] = [
    'Saúde',
    'Educação',
    'Administrativo',
    'Transporte',
    'Obras',
    'Segurança Pública',
    'Assistência Social',
    'Meio Ambiente',
    'Fazenda',
    'Turismo',
    'Cultura',
    'Esportes e Lazer',
    'Planejamento',
    'Comunicação',
    'Ciência e Tecnologia'
  ];

  const handleSecretariaChange = (value: string) => {
    if (value === 'todos') {
      setSecretariaSelecionada(null);
    } else {
      setSecretariaSelecionada(value as Setor);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Demandas das Secretárias</h1>
        <div className="w-64">
          <Select onValueChange={handleSecretariaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por secretária" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as secretárias</SelectItem>
              {secretarias.map((secretaria) => (
                <SelectItem key={secretaria} value={secretaria}>
                  {secretaria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="todos" value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="todos">
            Todos os pedidos
          </TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="andamento">
            Em andamento
          </TabsTrigger>
          <TabsTrigger value="concluidos">
            Concluídos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Todas as DFDs</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                {pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map((pedido) => (
                    <Task key={pedido.id} pedido={pedido} />
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    Nenhuma tarefa encontrada para esta seleção
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pendentes" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>DFDs Pendentes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                {pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map((pedido) => (
                    <Task key={pedido.id} pedido={pedido} />
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    Nenhuma tarefa pendente encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="andamento" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>DFDs Em Andamento</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                {pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map((pedido) => (
                    <Task key={pedido.id} pedido={pedido} />
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    Nenhuma tarefa em andamento encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="concluidos" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>DFDs Concluídas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                {pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map((pedido) => (
                    <Task key={pedido.id} pedido={pedido} />
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    Nenhuma tarefa concluída encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TarefasKanban;
