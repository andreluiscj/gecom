
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartTicketMedioProps {
  dados: {
    ticketMedioPorSetor: Record<string, number>;
  };
}

const ChartTicketMedio: React.FC<ChartTicketMedioProps> = ({ dados }) => {
  // Transform data for the area chart
  const chartData = Object.entries(dados.ticketMedioPorSetor)
    .filter(([_, valor]) => valor > 0)
    .map(([setor, valor], index) => ({
      name: setor,
      valor: valor,
      idx: index // Add index for X-axis
    }));

  // Sort data by value for better visualization
  chartData.sort((a, b) => a.valor - b.valor);
  
  // Card title
  const cardTitle = 'Ticket Médio por Secretaria';
  
  // Show empty state when there's no data with values
  const hasData = chartData.some(item => item.valor > 0);
  
  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-center">
            Não há dados disponíveis
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get gradients for area fill
  const getGradient = () => {
    return (
      <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
      </linearGradient>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <defs>
                {getGradient()}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="idx" 
                axisLine={false} 
                tickLine={false}
                tick={false} // Hide X-axis ticks
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value: any, name: string, props: any) => {
                      const item = props.payload;
                      return [
                        formatCurrency(value),
                        `${item.name}`
                      ];
                    }}
                  />
                }
                cursor={{stroke: '#f3f4f6', strokeWidth: 1}}
              />
              <Area 
                type="monotone" 
                dataKey="valor" 
                name="Valor Médio"
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorValor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartTicketMedio;
