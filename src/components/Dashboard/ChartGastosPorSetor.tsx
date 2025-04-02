
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
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

  // Usando variáveis CSS para as cores
  const COLORS = ['rgb(var(--chart-saude))', 'rgb(var(--chart-educacao))', 'rgb(var(--chart-administrativo))', 'rgb(var(--chart-transporte))'];

  const cardTitle = language === 'pt' ? 'Gastos por Secretária' : 'Expenses by Department';
  const totalGastos = chartData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={2}
                stroke="var(--background)"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="var(--foreground)" 
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      className="text-xs"
                    >
                      {name} ({(percent * 100).toFixed(0)}%)
                    </text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value: any) => formatCurrency(value)}
                  />
                }
              />
              <Legend 
                content={
                  <ChartLegendContent 
                    nameKey="name"
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
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
