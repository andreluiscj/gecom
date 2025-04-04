
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DadosMensais {
  meses: string[];
  gastos: number[];
  pedidos: number[];
}

interface DistribuicaoSetor {
  nome: string;
  valor: number;
  cor: string;
}

interface DashboardChartsProps {
  dadosMensais: DadosMensais;
  distribuicaoSetor: DistribuicaoSetor[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  dadosMensais,
  distribuicaoSetor
}) => {
  // Preparar dados para o gráfico de barras
  const dadosGraficoBarras = dadosMensais.meses.map((mes, index) => ({
    name: mes,
    Gastos: dadosMensais.gastos[index],
    Pedidos: dadosMensais.pedidos[index] * 10000 // Multiplicar para visualização adequada
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Gastos Mensais */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Gastos Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="aspect-[4/3]">
            <BarChart data={dadosGraficoBarras}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" tickFormatter={(value) => {
                if (value === 0) return '0';
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                return `${(value / 1000).toFixed(0)}K`;
              }} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => {
                return `${(value / 10000).toFixed(0)}`;
              }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Gastos
                            </span>
                            <span className="font-bold text-xs">
                              {formatCurrency(payload[0].value as number)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Pedidos
                            </span>
                            <span className="font-bold text-xs">
                              {((payload[1].value as number) / 10000).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Bar
                dataKey="Gastos"
                fill="#8884d8"
                yAxisId="left"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Pedidos"
                fill="#82ca9d"
                yAxisId="right"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Distribuição por Setor */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Distribuição por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="aspect-[4/3]">
            <PieChart>
              <Pie
                data={distribuicaoSetor}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
                nameKey="nome"
                label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
              >
                {distribuicaoSetor.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="font-bold">
                            {payload[0].name}
                          </span>
                          <span className="text-xs">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
