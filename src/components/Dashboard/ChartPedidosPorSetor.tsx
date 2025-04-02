
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface ChartPedidosPorSetorProps {
  dados: {
    pedidosPorSetor: Record<string, number>;
  };
}

const ChartPedidosPorSetor: React.FC<ChartPedidosPorSetorProps> = ({ dados }) => {
  const [language, setLanguage] = useState('pt');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const chartData = Object.entries(dados.pedidosPorSetor).map(([setor, quantidade]) => ({
    name: setor,
    quantidade: quantidade,
  }));

  const cardTitle = language === 'pt' ? 'DFDs por Secretária' : 'DFDs by Department';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                width={30}
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
              />
              <Legend 
                formatter={(value: string) => language === 'pt' ? 'Quantidade de DFDs' : 'Number of DFDs'}
              />
              <Bar 
                dataKey="quantidade" 
                name={language === 'pt' ? 'Quantidade de DFDs' : 'Number of DFDs'} 
                fill="rgba(59, 130, 246, 0.8)" 
                radius={[4, 4, 0, 0]} 
                label={{
                  position: 'top',
                  fill: '#333',
                  fontSize: 12,
                  fontWeight: '500'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartPedidosPorSetor;
