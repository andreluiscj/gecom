
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartGastosPorSetorProps {
  dados: {
    gastosPorSetor: Record<string, number>;
  };
}

const ChartGastosPorSetor: React.FC<ChartGastosPorSetorProps> = ({ dados }) => {
  const [language, setLanguage] = useState('pt');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const chartData = Object.entries(dados.gastosPorSetor)
    .filter(([_, valor]) => valor > 0) // Filter out zero values
    .map(([setor, valor]) => ({
      name: setor,
      value: valor,
    }));

  // Custom colors with higher contrast for better accessibility
  const COLORS = {
    'Saúde': 'rgb(220, 38, 38)',       // Stronger red
    'Educação': 'rgb(16, 185, 129)',    // Stronger green
    'Administrativo': 'rgb(245, 158, 11)', // Stronger yellow
    'Transporte': 'rgb(249, 115, 22)'   // Stronger orange
  };

  const cardTitle = language === 'pt' ? 'Gastos por Secretária' : 'Expenses by Department';
  const totalGastos = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip component with improved styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-lg">
          <p className="font-semibold text-base">{payload[0].name}</p>
          <p className="text-sm mb-1">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / totalGastos) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center mt-3 gap-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  // Check if there is data to display
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-center">
            {language === 'pt' ? 'Não há dados disponíveis' : 'No data available'}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="var(--background)"
                strokeWidth={2}
                animationDuration={800}
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.name}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                content={renderLegend}
                layout="vertical"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'pt' ? 'Total de Gastos' : 'Total Expenses'}: 
            <span className="font-semibold ml-1">{formatCurrency(totalGastos)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartGastosPorSetor;
