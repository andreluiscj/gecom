
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Calendar, 
  Download,
  Check,
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ReportFiltersProps {
  municipioId: string | null;
  setor: string;
  setSetor: (setor: string) => void;
  periodosAtivos: Record<string, boolean>;
  setPeriodosAtivos: (periodos: Record<string, boolean>) => void;
  tiposRelatorio: string[];
  setTiposRelatorio: (tipos: string[]) => void;
  language: string;
  aplicarFiltros: () => void;
  translations: Record<string, string>;
  openFilter: boolean;
  setOpenFilter: (open: boolean) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  setor,
  setSetor,
  periodosAtivos,
  setPeriodosAtivos,
  tiposRelatorio,
  setTiposRelatorio,
  language,
  aplicarFiltros,
  translations,
  openFilter,
  setOpenFilter
}) => {
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

  const handleExportar = () => {
    const tipoRelatorioTexto = language === 'pt' ? 
      (tiposRelatorio[0] === "geral" ? "Geral" : 
      tiposRelatorio[0] === "gastos" ? "Gastos" :
      tiposRelatorio[0] === "pedidos" ? "DFDs" : "Orçamento") :
      (tiposRelatorio[0] === "geral" ? "General" : 
      tiposRelatorio[0] === "gastos" ? "Expenses" :
      tiposRelatorio[0] === "pedidos" ? "DFDs" : "Budget");
                              
    const periodoAtivo = Object.entries(periodosAtivos).find(([_, value]) => value);
    const periodoTexto = language === 'pt' ?
      (periodoAtivo && periodoAtivo[0] === "mes" ? "Último mês" : 
      periodoAtivo && periodoAtivo[0] === "trimestre" ? "Último trimestre" :
      periodoAtivo && periodoAtivo[0] === "semestre" ? "Último semestre" : "Último ano") :
      (periodoAtivo && periodoAtivo[0] === "mes" ? "Last month" : 
      periodoAtivo && periodoAtivo[0] === "trimestre" ? "Last quarter" :
      periodoAtivo && periodoAtivo[0] === "semestre" ? "Last semester" : "Last year");
                        
    toast.success(language === 'pt' ? 
      `Relatório ${tipoRelatorioTexto} de ${periodoTexto} exportado com sucesso!` :
      `${tipoRelatorioTexto} report for ${periodoTexto} exported successfully!`);
  };

  return (
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
  );
};

export default ReportFilters;
