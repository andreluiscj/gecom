
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartPrevisoRealizadoProps {
  dados: {
    orcamentoPrevisto: Record<string, number>;
    gastosPorSetor: Record<string, number>;
  };
}

const ChartPrevisoRealizado: React.FC<ChartPrevisoRealizadoProps> = ({ dados }) => {
  const [language, setLanguage] = useState('pt');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  const chartData = Object.keys(dados.orcamentoPrevisto).map(setor => ({
    name: setor,
    previsto: dados.orcamentoPrevisto[setor],
    realizado: dados.gastosPorSetor[setor],
  }));

  const cardTitle = language === 'pt' ? 'Orçamento Previsto vs. Realizado' : 'Planned vs. Actual Budget';
  const legendPrevisto = language === 'pt' ? 'Previsto' : 'Planned';
  const legendRealizado = language === 'pt' ? 'Realizado' : 'Actual';

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
              barGap={8}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={value => formatCurrency(value)}
                width={80}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value: any) => formatCurrency(value)}
                  />
                }
              />
              <Legend 
                align="center" 
                verticalAlign="bottom" 
                fontSize={11}
                formatter={(value: string) => value === 'previsto' ? legendPrevisto : legendRealizado}
              />
              <Bar 
                dataKey="previsto" 
                fill="#64748b" 
                name="previsto"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="realizado" 
                fill="#3b82f6" 
                name="realizado"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartPrevisoRealizado;
