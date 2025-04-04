
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="40%"
                labelLine={false}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: any, name: string, props: any) => {
                      const item = props.payload;
                      return [
                        formatCurrency(value),
                        `${item.name}: ${item.percentual}% do total`
                      ];
                    }}
                  />
                }
              />
              <ChartLegend 
                content={
                  <div className="flex flex-wrap justify-center mt-32 gap-x-4 gap-y-2 px-4">
                    {chartData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 mr-1" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartGastosPorSetor;
