
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, User, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getMunicipalityById } from "@/services/municipalityService";
import { toast } from "sonner";
import StatCard from "@/components/Dashboard/StatCard";
import { MonthlyBudgetChart, DepartmentPieChart, DepartmentBarChart } from "@/components/Dashboard/ChartComponents";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardFilters from "@/components/Dashboard/DashboardFilters";
import { Municipality } from "@/types";

// Define explicit types for our dashboard stats
interface UserStats {
  total: number;
  active: number;
}

interface DfdStats {
  total: number;
  inProgress: number;
  completed: number;
}

// Sample data for charts when real data is not available
const sampleMonthlyData = [
  { name: "Jan", planejado: 50000, executado: 45000 },
  { name: "Feb", planejado: 60000, executado: 48000 },
  { name: "Mar", planejado: 70000, executado: 65000 },
  { name: "Apr", planejado: 80000, executado: 75000 },
  { name: "May", planejado: 90000, executado: 85000 },
  { name: "Jun", planejado: 100000, executado: 90000 },
];

const sampleDepartmentData = [
  { name: "Saúde", valor: 250000, percent: 0.25 },
  { name: "Educação", valor: 300000, percent: 0.30 },
  { name: "Administração", valor: 150000, percent: 0.15 },
  { name: "Segurança", valor: 200000, percent: 0.20 },
  { name: "Infraestrutura", valor: 100000, percent: 0.10 },
];

const Dashboard: React.FC = () => {
  const { user, userMunicipality } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({ total: 0, active: 0 });
  const [dfdsStats, setDfdsStats] = useState<DfdStats>({ total: 0, inProgress: 0, completed: 0 });
  // Fix by using a more specific type with limited nesting
  const [municipality, setMunicipality] = useState<Municipality | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [period, setPeriod] = useState("mensal");
  const [filters, setFilters] = useState({
    year: "2024",
    quarter: "Q2",
    month: "Junho",
    department: "Todos"
  });
  
  const departments = ["Saúde", "Educação", "Administração", "Segurança", "Infraestrutura"];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load municipality data if available
        if (userMunicipality?.id) {
          const municipalityData = await getMunicipalityById(userMunicipality.id);
          if (municipalityData) {
            // Explicitly cast to Municipality type to avoid deep nesting issues
            setMunicipality(municipalityData as Municipality);
          }
        }

        // Load user statistics if available
        if (userMunicipality?.id) {
          const { count: totalUsers, error: usersError } = await supabase
            .from("profiles")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id);
          
          if (usersError) throw usersError;
          
          const { count: activeUsers, error: activeError } = await supabase
            .from("profiles")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id)
            .eq("active", true);
          
          if (activeError) throw activeError;
          
          setUserStats({
            total: totalUsers || 0,
            active: activeUsers || 0
          });
        }

        // Load DFD statistics if available
        if (userMunicipality?.id) {
          const { count: totalDfds, error: totalError } = await supabase
            .from("dfds")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id);
          
          if (totalError) throw totalError;
          
          const { count: inProgressDfds, error: inProgressError } = await supabase
            .from("dfds")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id)
            .in("status", ["Pendente", "Em Análise", "Em Andamento"]);
          
          if (inProgressError) throw inProgressError;
          
          const { count: completedDfds, error: completedError } = await supabase
            .from("dfds")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id)
            .eq("status", "Concluído");
          
          if (completedError) throw completedError;
          
          setDfdsStats({
            total: totalDfds || 0,
            inProgress: inProgressDfds || 0,
            completed: completedDfds || 0
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        toast.error("Falha ao carregar informações do dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userMunicipality]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader municipio={municipality || {name: "Não definido", state: ""}} />
      
      <DashboardFilters 
        period={period}
        setPeriod={setPeriod}
        filters={filters}
        setFilters={setFilters}
        departments={departments}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total de Usuários"
          value={userStats.total.toString()}
          percentChange={12.5}
          icon="User"
          colorClass="bg-blue-500"
        />
        
        <StatCard 
          title="DFDs em Andamento"
          value={dfdsStats.inProgress.toString()}
          percentChange={5.2}
          icon="FileText"
          colorClass="bg-yellow-500"
        />
        
        <StatCard 
          title="DFDs Concluídas"
          value={dfdsStats.completed.toString()}
          percentChange={-2.3}
          icon="FileText" 
          colorClass="bg-green-500"
        />
      </div>

      {municipality && (
        <Card>
          <CardHeader>
            <CardTitle>Município</CardTitle>
            <CardDescription>Detalhes do município</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{municipality.name}</span>
                <span className="text-sm text-muted-foreground">{municipality.state}</span>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
            {municipality.population && (
              <div className="mt-2 text-sm text-muted-foreground">
                População: {municipality.population.toLocaleString()} habitantes
              </div>
            )}
            {municipality.budget && (
              <div className="mt-1 text-sm text-muted-foreground">
                Orçamento: R$ {municipality.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Orçamento Mensal</CardTitle>
            <CardDescription>Planejado vs. Executado</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyBudgetChart data={sampleMonthlyData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Secretarias</CardTitle>
            <CardDescription>Percentual do orçamento</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentPieChart data={sampleDepartmentData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gastos por Secretarias</CardTitle>
          <CardDescription>Valores em R$</CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentBarChart data={sampleDepartmentData} />
        </CardContent>
      </Card>

      {user?.role === "admin" && (
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <User className="h-10 w-10 text-blue-600" />
            <div>
              <h3 className="text-xl font-medium text-blue-800">Administração do Sistema</h3>
              <p className="text-blue-600">
                Use o painel administrativo para gerenciar municípios, usuários e configurações do sistema.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
