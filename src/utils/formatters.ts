
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateTime(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function calcularPorcentagem(valor: number, total: number): number {
  if (total === 0) return 0;
  return (valor / total) * 100;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
