
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Tipo para as tarefas
interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'nao-iniciada' | 'em-andamento' | 'finalizada';
}

// Função para gerar tarefas iniciais por secretaria
const gerarTarefasIniciais = (secretaria: string): Tarefa[] => {
  const tarefasBase: Record<string, Tarefa[]> = {
    saude: [
      {
        id: 's1',
        titulo: 'Aquisição de medicamentos',
        descricao: 'Comprar medicamentos para posto de saúde central',
        responsavel: 'Maria Silva',
        prioridade: 'alta',
        status: 'em-andamento'
      },
      {
        id: 's2',
        titulo: 'Manutenção de equipamentos',
        descricao: 'Realizar manutenção preventiva em equipamentos hospitalares',
        responsavel: 'João Santos',
        prioridade: 'media',
        status: 'nao-iniciada'
      },
      {
        id: 's3',
        titulo: 'Campanha de vacinação',
        descricao: 'Planejar campanha de vacinação contra gripe',
        responsavel: 'Ana Costa',
        prioridade: 'alta',
        status: 'nao-iniciada'
      }
    ],
    educacao: [
      {
        id: 'e1',
        titulo: 'Aquisição de material escolar',
        descricao: 'Comprar material para o ano letivo',
        responsavel: 'Pedro Almeida',
        prioridade: 'alta',
        status: 'finalizada'
      },
      {
        id: 'e2',
        titulo: 'Reforma de escola',
        descricao: 'Coordenar reforma da Escola Municipal Central',
        responsavel: 'Carla Mendes',
        prioridade: 'media',
        status: 'em-andamento'
      }
    ],
    administrativo: [
      {
        id: 'a1',
        titulo: 'Prestação de contas',
        descricao: 'Preparar relatório anual de prestação de contas',
        responsavel: 'Marcos Lima',
        prioridade: 'alta',
        status: 'nao-iniciada'
      },
      {
        id: 'a2',
        titulo: 'Licitação de serviços',
        descricao: 'Publicar edital para serviços de limpeza',
        responsavel: 'Fernanda Oliveira',
        prioridade: 'media',
        status: 'em-andamento'
      },
      {
        id: 'a3',
        titulo: 'Treinamento',
        descricao: 'Organizar treinamento para novos servidores',
        responsavel: 'Roberto Souza',
        prioridade: 'baixa',
        status: 'nao-iniciada'
      }
    ],
    transporte: [
      {
        id: 't1',
        titulo: 'Manutenção da frota',
        descricao: 'Realizar revisão em veículos da frota municipal',
        responsavel: 'Luiz Ferreira',
        prioridade: 'alta',
        status: 'em-andamento'
      },
      {
        id: 't2',
        titulo: 'Aquisição de combustível',
        descricao: 'Licitar fornecimento de combustível para frota',
        responsavel: 'Amanda Ribeiro',
        prioridade: 'media',
        status: 'finalizada'
      }
    ]
  };

  return tarefasBase[secretaria] || [];
};

const TarefasKanban: React.FC = () => {
  const { secretaria } = useParams<{ secretaria: string }>();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    responsavel: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta',
    status: 'nao-iniciada' as 'nao-iniciada' | 'em-andamento' | 'finalizada'
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [progressoTarefas, setProgressoTarefas] = useState(0);

  const tituloPagina = {
    saude: 'Saúde',
    educacao: 'Educação',
    administrativo: 'Administrativo',
    transporte: 'Transporte'
  }[secretaria as string] || 'Secretária';

  // Carregar tarefas iniciais
  useEffect(() => {
    if (secretaria) {
      const tarefasIniciais = gerarTarefasIniciais(secretaria);
      setTarefas(tarefasIniciais);
    }
  }, [secretaria]);

  // Calcular progresso
  useEffect(() => {
    if (tarefas.length === 0) {
      setProgressoTarefas(0);
      return;
    }
    
    const tarefasFinalizadas = tarefas.filter(t => t.status === 'finalizada').length;
    const porcentagem = (tarefasFinalizadas / tarefas.length) * 100;
    setProgressoTarefas(porcentagem);
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (!novaTarefa.titulo || !novaTarefa.responsavel) {
      toast.error("Por favor, preencha pelo menos o título e o responsável");
      return;
    }

    const id = `${secretaria?.charAt(0)}${tarefas.length + 1}`;
    const tarefa: Tarefa = {
      id,
      ...novaTarefa
    };

    setTarefas([...tarefas, tarefa]);
    setNovaTarefa({
      titulo: '',
      descricao: '',
      responsavel: '',
      prioridade: 'media',
      status: 'nao-iniciada'
    });
    setMostrarFormulario(false);
    toast.success("Tarefa adicionada com sucesso!");
  };

  const alterarStatusTarefa = (id: string, novoStatus: 'nao-iniciada' | 'em-andamento' | 'finalizada') => {
    setTarefas(tarefas.map(tarefa => {
      if (tarefa.id === id) {
        return { ...tarefa, status: novoStatus };
      }
      return tarefa;
    }));
    
    toast.success(`Status da tarefa atualizado para: ${
      novoStatus === 'nao-iniciada' ? 'Não iniciada' : 
      novoStatus === 'em-andamento' ? 'Em andamento' : 
      'Finalizada'
    }`);
  };

  const removerTarefa = (id: string) => {
    setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    toast.success("Tarefa removida com sucesso!");
  };

  const colunas = [
    { id: 'nao-iniciada', titulo: 'Não Iniciada' },
    { id: 'em-andamento', titulo: 'Em Andamento' },
    { id: 'finalizada', titulo: 'Finalizada' }
  ];

  const corPrioridade = {
    baixa: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800'
  };

  const nomePrioridade = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tarefas - {tituloPagina}</h1>
        <p className="text-muted-foreground">
          Gerenciamento de tarefas da secretária
        </p>
      </div>

      {/* Progresso das tarefas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progresso das Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{Math.round(progressoTarefas)}%</span>
            </div>
            <Progress value={progressoTarefas} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Botão para adicionar nova tarefa */}
      <div className="flex justify-end">
        <Button onClick={() => setMostrarFormulario(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Tarefa
        </Button>
      </div>

      {/* Formulário para nova tarefa (condicional) */}
      {mostrarFormulario && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Título</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={novaTarefa.titulo}
                  onChange={(e) => setNovaTarefa({...novaTarefa, titulo: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Descrição</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  value={novaTarefa.descricao}
                  onChange={(e) => setNovaTarefa({...novaTarefa, descricao: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Responsável</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={novaTarefa.responsavel}
                  onChange={(e) => setNovaTarefa({...novaTarefa, responsavel: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Prioridade</label>
                <Select 
                  value={novaTarefa.prioridade} 
                  onValueChange={(value) => setNovaTarefa({...novaTarefa, prioridade: value as 'baixa' | 'media' | 'alta'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setMostrarFormulario(false)}>Cancelar</Button>
                <Button onClick={adicionarTarefa}>Salvar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quadro Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colunas.map((coluna) => (
          <div key={coluna.id} className="space-y-4">
            <div className="bg-gray-100 rounded-md p-3">
              <h3 className="font-medium text-lg">{coluna.titulo}</h3>
              <div className="text-xs text-gray-500">
                {tarefas.filter(t => t.status === coluna.id).length} tarefas
              </div>
            </div>
            <div className="space-y-3">
              {tarefas
                .filter(tarefa => tarefa.status === coluna.id)
                .map(tarefa => (
                  <Card key={tarefa.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{tarefa.titulo}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {coluna.id !== 'nao-iniciada' && (
                              <DropdownMenuItem onClick={() => alterarStatusTarefa(tarefa.id, 'nao-iniciada')}>
                                Mover para Não Iniciada
                              </DropdownMenuItem>
                            )}
                            {coluna.id !== 'em-andamento' && (
                              <DropdownMenuItem onClick={() => alterarStatusTarefa(tarefa.id, 'em-andamento')}>
                                Mover para Em Andamento
                              </DropdownMenuItem>
                            )}
                            {coluna.id !== 'finalizada' && (
                              <DropdownMenuItem onClick={() => alterarStatusTarefa(tarefa.id, 'finalizada')}>
                                Mover para Finalizada
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => removerTarefa(tarefa.id)}
                            >
                              Remover Tarefa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {tarefa.descricao && (
                        <p className="text-sm text-gray-600 mb-3">{tarefa.descricao}</p>
                      )}
                      <div className="text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">Responsável:</span>
                          <span>{tarefa.responsavel}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Prioridade:</span>
                          <Badge className={corPrioridade[tarefa.prioridade]}>
                            {nomePrioridade[tarefa.prioridade]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TarefasKanban;
