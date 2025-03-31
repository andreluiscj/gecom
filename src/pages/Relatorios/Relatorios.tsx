
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  Filter 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { calcularDadosDashboard } from '@/data/mockData';
import ChartGastosPorSetor from '@/components/Dashboard/ChartGastosPorSetor';
import ChartPedidosPorSetor from '@/components/Dashboard/ChartPedidosPorSetor';
import ChartPrevisoRealizado from '@/components/Dashboard/ChartPrevisoRealizado';
import ChartTicketMedio from '@/components/Dashboard/ChartTicketMedio';
import { toast } from 'sonner';

const Relatorios: React.FC = () => {
  const [dadosDashboard, setDadosDashboard] = useState(calcularDadosDashboard());
  const [setor, setSetor] = useState<string>("todos");
  const [periodo, setPeriodo] = useState<string>("mes");
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("geral");
  
  // Simula a atualização dos dados com base nos filtros
  useEffect(() => {
    // Em um cenário real, aqui faria uma chamada à API com os filtros
    const novosDados = calcularDadosDashboard();
    
    // Aplica filtros simulados
    if (setor !== "todos") {
      const setorCapitalizado = setor.charAt(0).toUpperCase() + setor.slice(1);
      
      // Filtra apenas o setor selecionado
      const gastosFiltrados: Record<string, number> = {};
      gastosFiltrados[setorCapitalizado] = novosDados.gastosPorSetor[setorCapitalizado];
      
      const pedidosFiltrados: Record<string, number> = {};
      pedidosFiltrados[setorCapitalizado] = novosDados.pedidosPorSetor[setorCapitalizado];
      
      const ticketMedioFiltrado: Record<string, number> = {};
      ticketMedioFiltrado[setorCapitalizado] = novosDados.ticketMedioPorSetor[setorCapitalizado];
      
      const orcamentoFiltrado: Record<string, number> = {};
      orcamentoFiltrado[setorCapitalizado] = novosDados.orcamentoPrevisto[setorCapitalizado];
      
      novosDados.gastosPorSetor = gastosFiltrados;
      novosDados.pedidosPorSetor = pedidosFiltrados;
      novosDados.ticketMedioPorSetor = ticketMedioFiltrado;
      novosDados.orcamentoPrevisto = orcamentoFiltrado;
      novosDados.gastosTotais = gastosFiltrados[setorCapitalizado];
    }
    
    setDadosDashboard(novosDados);
    toast.success("Filtros aplicados com sucesso!");
  }, [setor, periodo, tipoRelatorio]);

  const handleExportar = () => {
    toast.success("Relatório exportado com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize e exporte relatórios detalhados sobre a gestão municipal
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Filtros e Exportação</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" /> Período
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filtros
              </Button>
              <Button size="sm" onClick={handleExportar}>
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Secretária</label>
              <Select value={setor} onValueChange={setSetor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as secretárias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as secretárias</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Último mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Último mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="semestre">Último semestre</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo de Relatório</label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Geral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="gastos">Gastos</SelectItem>
                  <SelectItem value="pedidos">Pedidos</SelectItem>
                  <SelectItem value="orcamento">Orçamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="graficos">
        <TabsList className="mb-4">
          <TabsTrigger value="graficos">
            <BarChart3 className="h-4 w-4 mr-2" /> Gráficos
          </TabsTrigger>
          <TabsTrigger value="tabelas">
            <FileText className="h-4 w-4 mr-2" /> Tabelas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="graficos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPrevisoRealizado dados={dadosDashboard} />
            <ChartGastosPorSetor dados={dadosDashboard} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPedidosPorSetor dados={dadosDashboard} />
            <ChartTicketMedio dados={dadosDashboard} />
          </div>
        </TabsContent>
        
        <TabsContent value="tabelas">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Gastos por Secretária</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Secretária
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Orçamento Previsto
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Gastos Realizados
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            % Utilizado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        {Object.entries(dadosDashboard.gastosPorSetor).map(([setor, valor], index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              {setor}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              R$ {dadosDashboard.orcamentoPrevisto[setor as keyof typeof dadosDashboard.orcamentoPrevisto].toLocaleString('pt-BR')}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              R$ {valor.toLocaleString('pt-BR')}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              {((valor / dadosDashboard.orcamentoPrevisto[setor as keyof typeof dadosDashboard.orcamentoPrevisto]) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Total
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium">
                            R$ {Object.values(dadosDashboard.orcamentoPrevisto).reduce((a, b) => a + b, 0).toLocaleString('pt-BR')}
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium">
                            R$ {dadosDashboard.gastosTotais.toLocaleString('pt-BR')}
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium">
                            {((dadosDashboard.gastosTotais / Object.values(dadosDashboard.orcamentoPrevisto).reduce((a, b) => a + b, 0)) * 100).toFixed(2)}%
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Pedidos por Secretária</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Secretária
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Nº de Pedidos
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Valor Total
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Ticket Médio
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        {Object.entries(dadosDashboard.pedidosPorSetor).map(([setor, quantidade], index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              {setor}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              {quantidade}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              R$ {dadosDashboard.gastosPorSetor[setor as keyof typeof dadosDashboard.gastosPorSetor].toLocaleString('pt-BR')}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              R$ {dadosDashboard.ticketMedioPorSetor[setor as keyof typeof dadosDashboard.ticketMedioPorSetor].toLocaleString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
