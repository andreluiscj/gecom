
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Check,
  ChevronsUpDown
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { calcularDadosDashboard } from '@/data/mockData';
import ChartGastosPorSetor from '@/components/Dashboard/ChartGastosPorSetor';
import ChartPedidosPorSetor from '@/components/Dashboard/ChartPedidosPorSetor';
import ChartPrevisoRealizado from '@/components/Dashboard/ChartPrevisoRealizado';
import ChartTicketMedio from '@/components/Dashboard/ChartTicketMedio';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Relatorios: React.FC = () => {
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [setor, setSetor] = useState<string>("todos");
  const [periodo, setPeriodo] = useState<string>("mes");
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("geral");
  const [dadosDashboard, setDadosDashboard] = useState(calcularDadosDashboard(municipioId));
  const [tiposRelatorio, setTiposRelatorio] = useState<string[]>(['geral']);
  const [periodosAtivos, setPeriodosAtivos] = useState<Record<string, boolean>>({
    mes: true,
    trimestre: false,
    semestre: false,
    ano: false
  });
  const [language, setLanguage] = useState('pt');
  const [openFilter, setOpenFilter] = useState(false);
  
  useEffect(() => {
    // Verifica idioma
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    const selectedMunicipioId = localStorage.getItem('municipio-selecionado');
    if (selectedMunicipioId) {
      setMunicipioId(selectedMunicipioId);
    }
  }, []);
  
  useEffect(() => {
    if (municipioId) {
      const novosDados = calcularDadosDashboard(municipioId);
      setDadosDashboard(novosDados);
    }
  }, [municipioId]);
  
  const aplicarFiltros = () => {
    const dadosOriginais = calcularDadosDashboard(municipioId);
    const novosDados = { ...dadosOriginais };
    
    // Filtro por setor
    if (setor !== "todos") {
      const setorCapitalizado = setor.charAt(0).toUpperCase() + setor.slice(1);
      
      const gastosFiltrados: Record<string, number> = {};
      gastosFiltrados[setorCapitalizado] = dadosOriginais.gastosPorSetor[setorCapitalizado];
      
      const pedidosFiltrados: Record<string, number> = {};
      pedidosFiltrados[setorCapitalizado] = dadosOriginais.pedidosPorSetor[setorCapitalizado];
      
      const ticketMedioFiltrado: Record<string, number> = {};
      ticketMedioFiltrado[setorCapitalizado] = dadosOriginais.ticketMedioPorSetor[setorCapitalizado];
      
      const orcamentoFiltrado: Record<string, number> = {};
      orcamentoFiltrado[setorCapitalizado] = dadosOriginais.orcamentoPrevisto[setorCapitalizado];
      
      novosDados.gastosPorSetor = gastosFiltrados;
      novosDados.pedidosPorSetor = pedidosFiltrados;
      novosDados.ticketMedioPorSetor = ticketMedioFiltrado;
      novosDados.orcamentoPrevisto = orcamentoFiltrado;
      novosDados.gastosTotais = gastosFiltrados[setorCapitalizado];
    }
    
    // Filtro por período
    const periodosSelecionados = Object.entries(periodosAtivos)
      .filter(([_, active]) => active)
      .map(([p]) => p);
    
    if (periodosSelecionados.length > 0) {
      const multiplicador = periodosSelecionados.reduce((total, p) => {
        switch (p) {
          case 'mes': return total + 1;
          case 'trimestre': return total + 3;
          case 'semestre': return total + 6;
          case 'ano': return total + 12;
          default: return total;
        }
      }, 0);
      
      Object.keys(novosDados.gastosPorSetor).forEach(key => {
        novosDados.gastosPorSetor[key] *= multiplicador;
      });
      
      Object.keys(novosDados.pedidosPorSetor).forEach(key => {
        novosDados.pedidosPorSetor[key] = Math.round(novosDados.pedidosPorSetor[key] * multiplicador);
      });
      
      novosDados.gastosTotais = Object.values(novosDados.gastosPorSetor).reduce((sum, val) => sum + val, 0);
    }
    
    setDadosDashboard(novosDados);
    setOpenFilter(false);
    toast.success(language === 'pt' ? "Filtros aplicados com sucesso!" : "Filters applied successfully!");
  };

  const handleExportar = () => {
    const tipoRelatorioTexto = language === 'pt' ? 
      (tipoRelatorio === "geral" ? "Geral" : 
      tipoRelatorio === "gastos" ? "Gastos" :
      tipoRelatorio === "pedidos" ? "DFDs" : "Orçamento") :
      (tipoRelatorio === "geral" ? "General" : 
      tipoRelatorio === "gastos" ? "Expenses" :
      tipoRelatorio === "pedidos" ? "DFDs" : "Budget");
                              
    const periodoTexto = language === 'pt' ?
      (periodo === "mes" ? "Último mês" : 
      periodo === "trimestre" ? "Último trimestre" :
      periodo === "semestre" ? "Último semestre" : "Último ano") :
      (periodo === "mes" ? "Last month" : 
      periodo === "trimestre" ? "Last quarter" :
      periodo === "semestre" ? "Last semester" : "Last year");
                        
    toast.success(language === 'pt' ? 
      `Relatório ${tipoRelatorioTexto} de ${periodoTexto} exportado com sucesso!` :
      `${tipoRelatorioTexto} report for ${periodoTexto} exported successfully!`);
  };

  const toggleTipoRelatorio = (tipo: string) => {
    if (tiposRelatorio.includes(tipo)) {
      setTiposRelatorio(tiposRelatorio.filter(t => t !== tipo));
    } else {
      setTiposRelatorio([...tiposRelatorio, tipo]);
    }
  };

  const togglePeriodo = (p: string) => {
    setPeriodosAtivos(prev => ({
      ...prev,
      [p]: !prev[p]
    }));
  };

  const periodoAtivo = Object.entries(periodosAtivos).find(([_, value]) => value);
  const periodoTexto = periodoAtivo ? periodoAtivo[0] : 'mes';

  // Traduções
  const translations = {
    reportPageTitle: language === 'pt' ? 'Relatórios' : 'Reports',
    reportPageDesc: language === 'pt' 
      ? 'Visualize e exporte relatórios detalhados sobre a gestão municipal'
      : 'View and export detailed reports on municipal management',
    filters: language === 'pt' ? 'Filtros e Exportação' : 'Filters and Export',
    period: language === 'pt' ? 'Período' : 'Period',
    filters_btn: language === 'pt' ? 'Filtros' : 'Filters',
    export: language === 'pt' ? 'Exportar' : 'Export',
    all_departments: language === 'pt' ? 'Todas as secretárias' : 'All departments',
    health: language === 'pt' ? 'Saúde' : 'Health',
    education: language === 'pt' ? 'Educação' : 'Education',
    administrative: language === 'pt' ? 'Administrativo' : 'Administrative',
    transport: language === 'pt' ? 'Transporte' : 'Transport',
    last_month: language === 'pt' ? 'Último mês' : 'Last month',
    last_quarter: language === 'pt' ? 'Último trimestre' : 'Last quarter',
    last_semester: language === 'pt' ? 'Último semestre' : 'Last semester',
    last_year: language === 'pt' ? 'Último ano' : 'Last year',
    report_type: language === 'pt' ? 'Tipo de Relatório' : 'Report Type',
    general: language === 'pt' ? 'Geral' : 'General',
    expenses: language === 'pt' ? 'Gastos' : 'Expenses',
    dfds: language === 'pt' ? 'DFDs' : 'DFDs',
    budget: language === 'pt' ? 'Orçamento' : 'Budget',
    charts: language === 'pt' ? 'Gráficos' : 'Charts',
    tables: language === 'pt' ? 'Tabelas' : 'Tables',
    detailed_report: language === 'pt' ? 'Relatório Detalhado' : 'Detailed Report',
    expenses_by_dept: language === 'pt' ? 'Gastos por Secretária' : 'Expenses by Department',
    department: language === 'pt' ? 'Secretária' : 'Department',
    planned_budget: language === 'pt' ? 'Orçamento Previsto' : 'Planned Budget',
    actual_expenses: language === 'pt' ? 'Gastos Realizados' : 'Actual Expenses',
    used_percentage: language === 'pt' ? '% Utilizado' : '% Used',
    total: language === 'pt' ? 'Total' : 'Total',
    dfds_by_dept: language === 'pt' ? 'DFDs por Secretária' : 'DFDs by Department',
    num_dfds: language === 'pt' ? 'Nº de DFDs' : 'Number of DFDs',
    total_value: language === 'pt' ? 'Valor Total' : 'Total Value',
    avg_ticket: language === 'pt' ? 'Ticket Médio' : 'Average Ticket',
    apply_filters: language === 'pt' ? 'Aplicar Filtros' : 'Apply Filters',
    clear_filters: language === 'pt' ? 'Limpar Filtros' : 'Clear Filters',
    select_period: language === 'pt' ? 'Selecione os períodos' : 'Select periods',
    departments: language === 'pt' ? 'Secretárias' : 'Departments',
    select_dept: language === 'pt' ? 'Selecione a secretária' : 'Select department',
    report_types: language === 'pt' ? 'Tipos de relatório' : 'Report types',
    report_types_desc: language === 'pt' ? 'Selecione quais tipos de relatório mostrar' : 'Select which report types to show',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{translations.reportPageTitle}</h1>
        <p className="text-muted-foreground text-sm">
          {translations.reportPageDesc}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">{translations.filters}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Popover open={openFilter} onOpenChange={setOpenFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" /> {translations.filters_btn}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{translations.period}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['mes', 'trimestre', 'semestre', 'ano'].map((p) => (
                          <div key={p} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`period-${p}`} 
                              checked={periodosAtivos[p]} 
                              onCheckedChange={() => togglePeriodo(p)}
                            />
                            <Label htmlFor={`period-${p}`}>
                              {p === 'mes' ? translations.last_month :
                               p === 'trimestre' ? translations.last_quarter :
                               p === 'semestre' ? translations.last_semester :
                               translations.last_year}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">{translations.departments}</h4>
                      <Select value={setor} onValueChange={setSetor}>
                        <SelectTrigger>
                          <SelectValue placeholder={translations.select_dept} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">{translations.all_departments}</SelectItem>
                          <SelectItem value="saude">{translations.health}</SelectItem>
                          <SelectItem value="educacao">{translations.education}</SelectItem>
                          <SelectItem value="administrativo">{translations.administrative}</SelectItem>
                          <SelectItem value="transporte">{translations.transport}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">{translations.report_types}</h4>
                      <p className="text-xs text-muted-foreground">{translations.report_types_desc}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['geral', 'gastos', 'pedidos', 'orcamento'].map((tipo) => (
                          <div key={tipo} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`tipo-${tipo}`} 
                              checked={tiposRelatorio.includes(tipo)}
                              onCheckedChange={() => toggleTipoRelatorio(tipo)}
                            />
                            <Label htmlFor={`tipo-${tipo}`}>
                              {tipo === 'geral' ? translations.general :
                               tipo === 'gastos' ? translations.expenses :
                               tipo === 'pedidos' ? translations.dfds :
                               translations.budget}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setPeriodosAtivos({ mes: true, trimestre: false, semestre: false, ano: false });
                        setSetor('todos');
                        setTiposRelatorio(['geral']);
                      }}>
                        {translations.clear_filters}
                      </Button>
                      <Button size="sm" onClick={aplicarFiltros}>
                        {translations.apply_filters}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" /> {translations.period}
              </Button>
              
              <Button size="sm" onClick={handleExportar}>
                <Download className="h-4 w-4 mr-2" /> {translations.export}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(periodosAtivos)
                  .filter(([_, active]) => active)
                  .map(([period]) => (
                    <Badge key={period} variant="outline" className="bg-primary/10">
                      {period === 'mes' ? translations.last_month :
                       period === 'trimestre' ? translations.last_quarter :
                       period === 'semestre' ? translations.last_semester :
                       translations.last_year}
                    </Badge>
                  ))}
                {!Object.values(periodosAtivos).some(v => v) && (
                  <Badge variant="outline">{translations.last_month}</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  {setor === 'todos' ? translations.all_departments :
                   setor === 'saude' ? translations.health :
                   setor === 'educacao' ? translations.education :
                   setor === 'administrativo' ? translations.administrative :
                   translations.transport}
                </Badge>
              </div>
            </div>
            <div>
              <div className="flex gap-2 flex-wrap">
                {tiposRelatorio.map(tipo => (
                  <Badge key={tipo} variant="outline" className="bg-primary/10">
                    {tipo === 'geral' ? translations.general :
                     tipo === 'gastos' ? translations.expenses :
                     tipo === 'pedidos' ? translations.dfds :
                     translations.budget}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="graficos">
        <TabsList className="mb-4 tabs-list">
          <TabsTrigger value="graficos" className="tab-item">
            <BarChart3 className="h-4 w-4 mr-2" /> {translations.charts}
          </TabsTrigger>
          <TabsTrigger value="tabelas" className="tab-item">
            <FileText className="h-4 w-4 mr-2" /> {translations.tables}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="graficos" className="space-y-6">
          {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('orcamento')) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPrevisoRealizado dados={dadosDashboard} />
              <ChartGastosPorSetor dados={dadosDashboard} />
            </div>
          )}
          
          {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('pedidos')) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPedidosPorSetor dados={dadosDashboard} />
              <ChartTicketMedio dados={dadosDashboard} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tabelas">
          <Card>
            <CardHeader>
              <CardTitle>{translations.detailed_report}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('gastos') || tiposRelatorio.includes('orcamento')) && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">{translations.expenses_by_dept}</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {translations.department}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {translations.planned_budget}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {translations.actual_expenses}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {translations.used_percentage}
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
                              {translations.total}
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
                )}
                
                {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('pedidos')) && (
                  <>
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">{translations.dfds_by_dept}</h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {translations.department}
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {translations.num_dfds}
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {translations.total_value}
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {translations.avg_ticket}
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
