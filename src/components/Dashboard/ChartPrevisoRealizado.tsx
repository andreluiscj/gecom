
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartPrevisoRealizadoProps {
  dados: {
    orcamentoPrevisto: Record<string, number>;
    gastosPorSetor: Record<string, number>;
  };
}

const ChartPrevisoRealizado: React.FC<ChartPrevisoRealizadoProps> = ({ dados }) => {
  // Prepare data for the chart
  const chartData = Object.keys(dados.orcamentoPrevisto)
    .map(setor => ({
      name: setor,
      previsto: dados.orcamentoPrevisto[setor],
      realizado: dados.gastosPorSetor[setor],
      percentual: Math.round((dados.gastosPorSetor[setor] / dados.orcamentoPrevisto[setor]) * 100)
    }))
    .filter(item => item.previsto > 0) // Filter out items with zero budget
    .sort((a, b) => b.previsto - a.previsto); // Sort by budget descending

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg font-semibold">Orçamento Previsto vs. Realizado</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={{}} className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 180, // Increased left margin to ensure department names are fully visible
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
              <XAxis 
                type="number"
                axisLine={false} 
                tickLine={false} 
                tickFormatter={value => formatCurrency(value)}
                tick={{ fontSize: 11 }} 
              />
              <YAxis 
                type="category"
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                width={170} // Increased width for longer department names
                tick={{ 
                  fontSize: 11,
                  width: 160,
                  textAnchor: 'end', // Push text to the right edge of the available space
                }}
                interval={0} // Ensure all labels are shown
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value: any, name: string) => {
                      if (name === 'previsto') return [formatCurrency(value), 'Orçamento Previsto'];
                      if (name === 'realizado') return [formatCurrency(value), 'Valor Realizado'];
                      return value;
                    }}
                  />
                }
                cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
              />
              <Bar 
                dataKey="previsto" 
                stackId="a"
                fill="#64748b" 
                name="previsto"
                radius={[0, 0, 0, 0]}
                fillOpacity={0.8}
                barSize={16}
              />
              <Bar 
                dataKey="realizado" 
                stackId="b"
                fill="#3b82f6" 
                name="realizado"
                radius={[0, 4, 4, 0]}
                barSize={16}
              />
              <Legend 
                formatter={(value) => {
                  if (value === 'previsto') return 'Orçamento Previsto';
                  if (value === 'realizado') return 'Valor Realizado';
                  return value;
                }}
                wrapperStyle={{ paddingTop: 10 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartPrevisoRealizado;
