
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Building2, Activity, BarChart3, FileText, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getMunicipalities } from "@/services/municipalityService";
import { Municipality } from "@/types";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { user, userMunicipality } = useAuth();
  const [userStats, setUserStats] = useState({ total: 0, active: 0 });
  const [dfdsStats, setDfdsStats] = useState({ total: 0, inProgress: 0, completed: 0 });
  const [municipality, setMunicipality] = useState<Municipality | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carregar dados do município
        if (userMunicipality?.id) {
          const municipalities = await getMunicipalities();
          const currentMunicipality = municipalities.find(m => m.id === userMunicipality.id);
          if (currentMunicipality) {
            setMunicipality(currentMunicipality);
          }
        }

        // Carregar estatísticas de usuários
        if (userMunicipality?.id) {
          const { count: totalUsers } = await supabase
            .from("profiles")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id);
          
          const { count: activeUsers } = await supabase
            .from("profiles")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id)
            .eq("active", true);
          
          setUserStats({
            total: totalUsers || 0,
            active: activeUsers || 0
          });
        }

        // Carregar estatísticas de DFDs
        if (userMunicipality?.id) {
          const { count: totalDfds } = await supabase
            .from("dfds")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id);
          
          const { count: inProgressDfds } = await supabase
            .from("dfds")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id)
            .in("status", ["Pendente", "Em Análise", "Em Andamento"]);
          
          const { count: completedDfds } = await supabase
            .from("dfds")
            .select("id", { count: "exact" })
            .eq("municipality_id", userMunicipality.id)
            .eq("status", "Concluído");
          
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Painel de Gestão</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {municipality && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Município
              </CardTitle>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{userStats.total}</span>
                <span className="text-sm text-muted-foreground">
                  {userStats.active} ativos
                </span>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              DFDs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{dfdsStats.total}</span>
                <span className="text-sm text-muted-foreground">
                  {dfdsStats.inProgress} em andamento • {dfdsStats.completed} concluídos
                </span>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {user?.role === "admin" && (
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-10 w-10 text-blue-600" />
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
