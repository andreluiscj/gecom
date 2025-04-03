
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

  const chartData = Object.entries(dados.gastosPorSetor).map(([setor, valor]) => ({
    name: setor,
    value: valor,
  }));

  // Colors with higher contrast and better visibility
  const COLORS = [
    'rgb(225, 29, 72)',   // Saúde - vibrant red
    'rgb(5, 150, 105)',   // Educação - vivid green
    'rgb(234, 179, 8)',   // Administrativo - rich yellow
    'rgb(249, 115, 22)'   // Transporte - bright orange
  ];

  const cardTitle = language === 'pt' ? 'Gastos por Secretária' : 'Expenses by Department';
  const totalGastos = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip component with improved styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
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
      <ul className="flex flex-wrap justify-center mt-2 gap-3">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };
  
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
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="var(--background)"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
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
        
        <div className="mt-2 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'pt' ? 'Total de Gastos' : 'Total Expenses'}: <span className="font-semibold">{formatCurrency(totalGastos)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartGastosPorSetor;
