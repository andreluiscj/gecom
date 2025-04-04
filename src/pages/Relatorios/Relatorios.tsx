
import React, { useState, useEffect } from 'react';
import { calcularDadosDashboard } from '@/data/mockData';
import ReportFilters from './components/ReportFilters';
import ReportContent from './components/ReportContent';
import useReportTranslations from './components/useReportTranslations';

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
  const { language, translations } = useReportTranslations();
  const [openFilter, setOpenFilter] = useState(false);
  
  useEffect(() => {
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
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">{translations.reportPageTitle}</h1>
        <p className="text-muted-foreground text-sm">
          {translations.reportPageDesc}
        </p>
      </div>

      <ReportFilters 
        municipioId={municipioId}
        setor={setor}
        setSetor={setSetor}
        periodosAtivos={periodosAtivos}
        setPeriodosAtivos={setPeriodosAtivos}
        tiposRelatorio={tiposRelatorio}
        setTiposRelatorio={setTiposRelatorio}
        language={language}
        aplicarFiltros={aplicarFiltros}
        translations={translations}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
      />

      <ReportContent 
        tiposRelatorio={tiposRelatorio}
        dadosDashboard={dadosDashboard}
        translations={translations}
      />
    </div>
  );
};

export default Relatorios;
