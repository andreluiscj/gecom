
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DashboardFiltersProps {
  period: string;
  setPeriod: (period: string) => void;
  filters: {
    year: string;
    quarter: string;
    month: string;
    department: string;
  };
  setFilters: (filters: any) => void;
  departments: string[];
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ 
  period, 
  setPeriod, 
  filters, 
  setFilters,
  departments 
}) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = ['2023', '2024', '2025'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Label htmlFor="period-select" className="mb-2 block">Período</Label>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value)}
          >
            <SelectTrigger id="period-select">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anual">Anual</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {period === 'anual' && (
          <div className="flex-1">
            <Label htmlFor="year-select" className="mb-2 block">Ano</Label>
            <Select
              value={filters.year}
              onValueChange={(value) => setFilters({...filters, year: value})}
            >
              <SelectTrigger id="year-select">
                <SelectValue placeholder="Selecionar ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {period === 'trimestral' && (
          <>
            <div className="flex-1">
              <Label htmlFor="year-select" className="mb-2 block">Ano</Label>
              <Select
                value={filters.year}
                onValueChange={(value) => setFilters({...filters, year: value})}
              >
                <SelectTrigger id="year-select">
                  <SelectValue placeholder="Selecionar ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="quarter-select" className="mb-2 block">Trimestre</Label>
              <Select
                value={filters.quarter}
                onValueChange={(value) => setFilters({...filters, quarter: value})}
              >
                <SelectTrigger id="quarter-select">
                  <SelectValue placeholder="Selecionar trimestre" />
                </SelectTrigger>
                <SelectContent>
                  {quarters.map(quarter => (
                    <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {period === 'mensal' && (
          <>
            <div className="flex-1">
              <Label htmlFor="year-select" className="mb-2 block">Ano</Label>
              <Select
                value={filters.year}
                onValueChange={(value) => setFilters({...filters, year: value})}
              >
                <SelectTrigger id="year-select">
                  <SelectValue placeholder="Selecionar ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="month-select" className="mb-2 block">Mês</Label>
              <Select
                value={filters.month}
                onValueChange={(value) => setFilters({...filters, month: value})}
              >
                <SelectTrigger id="month-select">
                  <SelectValue placeholder="Selecionar mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="department-select" className="mb-2 block">Secretaria</Label>
          <Select
            value={filters.department}
            onValueChange={(value) => setFilters({...filters, department: value})}
          >
            <SelectTrigger id="department-select">
              <SelectValue placeholder="Selecionar secretaria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas as Secretarias</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 flex items-end">
          <Button 
            variant="outline" 
            className="w-full md:w-auto" 
            onClick={() => setFilters({
              year: '2024',
              quarter: 'Q2',
              month: 'Junho',
              department: 'Todos'
            })}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
