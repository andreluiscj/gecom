
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format currency to BRL
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Format date to dd/MM/yyyy
export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
}

// Format date and time
export function formatDateTime(date: Date | string): string {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

// Format number to percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Format number with thousands separator
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}
