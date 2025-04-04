
// Formatar moeda para real brasileiro
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatar data
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Formatar data e hora
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Calculador de porcentagem
export const calcularPorcentagem = (valor: number, total: number): number => {
  if (total === 0) return 0;
  return (valor / total) * 100;
};

// Formatar porcentagem
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
