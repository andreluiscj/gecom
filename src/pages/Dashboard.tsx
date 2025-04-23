
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Municipio } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { BarChart, Building2, Users, Wallet } from 'lucide-react';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [countPedidos, setCountPedidos] = useState<number>(0);
  const [countSetores, setCountSetores] = useState<number>(0);
  const [countFuncionarios, setCountFuncionarios] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch first municipio (in real app, you'd fetch the selected one)
        const { data: municipioData, error: municipioError } = await supabase
          .from('municipios')
          .select('*')
          .limit(1)
          .single();
          
        if (municipioError) throw municipioError;
        
        // Cast dates to Date objects
        const municipioWithDates = {
          ...municipioData,
          created_at: new Date(municipioData.created_at),
          updated_at: new Date(municipioData.updated_at)
        };
        
        setMunicipio(municipioWithDates);
        
        // Count pedidos
        const { count: pedidosCount, error: pedidosError } = await supabase
          .from('pedidos_compra')
          .select('*', { count: 'exact', head: true });
          
        if (pedidosError) throw pedidosError;
        setCountPedidos(pedidosCount || 0);
        
        // Count setores
        const { count: setoresCount, error: setoresError } = await supabase
          .from('setores')
          .select('*', { count: 'exact', head: true });
          
        if (setoresError) throw setoresError;
        setCountSetores(setoresCount || 0);
        
        // Count funcionarios
        const { count: funcionariosCount, error: funcionariosError } = await supabase
          .from('funcionarios')
          .select('*', { count: 'exact', head: true });
          
        if (funcionariosError) throw funcionariosError;
        setCountFuncionarios(funcionariosCount || 0);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // Set default municipality if error occurs
        const defaultMunicipio: Municipio = {
          id: 'default',
          nome: 'Município Padrão',
          estado: 'MG',
          populacao: 50000,
          orcamento: 25000000,
          orcamento_anual: 25000000,
          prefeito: 'Nome do Prefeito',
          created_at: new Date(),
          updated_at: new Date()
        };
        
        setMunicipio(defaultMunicipio);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500">
          Visão geral da gestão municipal e dos recursos financeiros.
        </p>
      </div>

      {municipio && (
        <DashboardHeader municipio={municipio} language="pt" />
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <BarChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countPedidos}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos de compra registrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Setores</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countSetores}</div>
            <p className="text-xs text-muted-foreground">
              Setores cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countFuncionarios}</div>
            <p className="text-xs text-muted-foreground">
              Funcionários ativos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          {municipio && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Orçamento Total</span>
                  <span className="font-bold">{formatCurrency(municipio.orcamento)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Aproximadamente 25% do orçamento foi utilizado até o momento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
