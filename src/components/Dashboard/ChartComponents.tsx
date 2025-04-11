
import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface MonthlyChartProps {
  data: Array<{
    name: string;
    planejado: number;
    executado: number;
  }>;
}

export const MonthlyBudgetChart: React.FC<MonthlyChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300} className="mt-4">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPlanejado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExecutado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `${value / 1000}K`} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Area
          type="monotone"
          dataKey="planejado"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorPlanejado)"
          name="Planejado"
        />
        <Area
          type="monotone"
          dataKey="executado"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorExecutado)"
          name="Executado"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface DepartmentChartProps {
  data: Array<{
    name: string;
    valor: number;
    percent: number;
  }>;
}

export const DepartmentPieChart: React.FC<DepartmentChartProps> = ({ data }) => {
  // Colors for departments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <ResponsiveContainer width="100%" height={300} className="mt-4">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="valor"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const DepartmentBarChart: React.FC<DepartmentChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300} className="mt-4">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `${value / 1000}K`} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="valor" fill="#8884d8" name="Valor" />
      </BarChart>
    </ResponsiveContainer>
  );
};
