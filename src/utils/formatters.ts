
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format currency to BRL
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

// Format date to dd/mm/yyyy
export function formatDate(date: string | Date) {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'dd/MM/yyyy');
}

// Format date and time
export function formatDateTime(date: string | Date) {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'dd/MM/yyyy HH:mm');
}

// Format number to percentage
export function formatPercentage(value: number) {
  return `${value.toFixed(1)}%`;
}

// Format number with thousands separator
export function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

// Format date to simple format (for Kanban cards)
export function formatarDataSimples(date: Date) {
  return format(date, 'dd/MM/yyyy');
}

// Calculate percentage
export function calcularPorcentagem(valor: number, total: number): number {
  if (total === 0) return 0;
  return (valor / total) * 100;
}
