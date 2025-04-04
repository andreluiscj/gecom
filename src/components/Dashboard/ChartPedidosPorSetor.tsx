
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

interface ChartPedidosPorSetorProps {
  dados: {
    pedidosPorSetor: Record<string, number>;
  };
}

const ChartPedidosPorSetor: React.FC<ChartPedidosPorSetorProps> = ({ dados }) => {
  // Transform the data for the chart and filter out zero values
  const chartData = Object.entries(dados.pedidosPorSetor)
    .filter(([_, quantidade]) => quantidade > 0)
    .map(([setor, quantidade]) => ({
      name: setor,
      quantidade: quantidade,
    }))
    .sort((a, b) => b.quantidade - a.quantidade); // Sort by quantity descending

  const cardTitle = 'DFDs por Secretária';

  // Colors for bars - different shades of blue
  const colors = [
    '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe',
    '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554',
    '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b'
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 140, // Increased left margin for department names
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                width={130} // Increased width for longer department names
                tick={{ 
                  fontSize: 12, 
                  fill: '#333',
                  width: 120,
                  textAnchor: 'end', // Align text to the right side of the available space
                }}
                interval={0} // Force show all labels
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    labelKey="name"
                  />
                }
                cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
              />
              <Bar 
                dataKey="quantidade" 
                name="Quantidade de DFDs" 
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartPedidosPorSetor;
