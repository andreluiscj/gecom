
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer, Label } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartGastosPorSetorProps {
  dados: {
    gastosPorSetor: Record<string, number>;
  };
}

const ChartGastosPorSetor: React.FC<ChartGastosPorSetorProps> = ({ dados }) => {
  // Calculate total expenses
  const totalGastos = Object.values(dados.gastosPorSetor).reduce((acc, val) => acc + val, 0);

  // Prepare data for pie chart - show all departments by expense
  const chartData = Object.entries(dados.gastosPorSetor)
    .map(([setor, valor]) => ({
      name: setor,
      value: valor,
      percentual: ((valor / totalGastos) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  // Colors for pie chart segments
  const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#f97316', '#6366f1', '#64748b', '#0ea5e9',
    '#14b8a6', '#a855f7', '#d946ef', '#84cc16', '#eab308'
  ];

  const cardTitle = 'Gastos por Secretária';

  // Format the total value for the center label
  const totalFormattedValue = formatCurrency(totalGastos);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: any, name: string, props: any) => {
                      const item = props.payload;
                      return [
                        formatCurrency(value),
                        `${item.percentual}% do total`
                      ];
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
                <Label
                  value={totalFormattedValue}
                  position="center"
                  fill="#333"
                  style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartGastosPorSetor;
