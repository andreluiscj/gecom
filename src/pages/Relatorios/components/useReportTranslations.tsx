
import { useState, useEffect } from 'react';

const useReportTranslations = () => {
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    // Verifica idioma
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

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

  return { language, translations };
};

export default useReportTranslations;
