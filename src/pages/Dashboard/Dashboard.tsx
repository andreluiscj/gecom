
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BarChart3, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatters";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    totalPedidos: 0,
    valorTotal: 0,
    orcamentoAnual: 2500000, // Default budget if not set in municipality
    orcamentoRestante: 0,
    gastosPorSetor: {} as Record<string, number>
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get DFDs to calculate total value and count
        const { data: dfdsData, error: dfdsError } = await supabase
          .from("dfds")
          .select(`
            id, 
            total_value,
            sector:sector_id(id, name)
          `);
          
        if (dfdsError) throw dfdsError;

        // Get municipality data for budget info
        const { data: municipalityData, error: municipalityError } = await supabase
          .from("municipalities")
          .select("budget")
          .limit(1);
          
        if (municipalityError) throw municipalityError;

        // Process the data
        const totalPedidos = dfdsData?.length || 0;
        const valorTotal = dfdsData?.reduce((sum, dfd) => sum + (dfd.total_value || 0), 0) || 0;
        const orcamentoAnual = municipalityData?.[0]?.budget || 2500000;
        const orcamentoRestante = orcamentoAnual - valorTotal;
        
        // Calculate expenses by sector
        const gastosPorSetor: Record<string, number> = {};
        dfdsData?.forEach(dfd => {
          const setorName = dfd.sector?.name || "Não especificado";
          if (!gastosPorSetor[setorName]) {
            gastosPorSetor[setorName] = 0;
          }
          gastosPorSetor[setorName] += dfd.total_value || 0;
        });

        setDashboardData({
          totalPedidos,
          valorTotal,
          orcamentoAnual,
          orcamentoRestante,
          gastosPorSetor
        });
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Falha ao carregar dados do painel");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Painel de Gestão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error}. Por favor, recarregue a página ou entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no data or very limited data
  if (dashboardData.totalPedidos === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Painel de Gestão</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sem dados</AlertTitle>
          <AlertDescription>
            Não há pedidos de compras registrados no sistema. O painel será atualizado quando novos pedidos forem criados.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Painel de Gestão</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Orçamento Anual:</span>
                <span className="font-medium">{formatCurrency(dashboardData.orcamentoAnual)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Valor Utilizado:</span>
                <span className="font-medium">{formatCurrency(dashboardData.valorTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Orçamento Restante:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(dashboardData.orcamentoRestante)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ 
                    width: `${Math.min(100, (dashboardData.valorTotal / dashboardData.orcamentoAnual) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Visão Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                  <p className="font-medium">{dashboardData.totalPedidos}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-medium">{formatCurrency(dashboardData.valorTotal)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Gastos por Secretaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(dashboardData.gastosPorSetor).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(dashboardData.gastosPorSetor).map(([setor, valor]) => (
                  <div key={setor} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{setor}:</span>
                    <span className="font-medium">{formatCurrency(valor)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Não há dados de gastos por secretaria disponíveis.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
