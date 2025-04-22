
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  Settings,
  Database,
  Server,
  LineChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type AdminCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
};

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  description,
  icon,
  onClick
}) => (
  <Card
    className="cursor-pointer hover:shadow-md transition-shadow"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      setLoading(true);
      if (user?.role !== 'admin') {
        toast.error('Acesso permitido apenas para administradores');
        navigate('/dashboard');
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const adminMenuItems = [
    {
      title: "Municípios",
      description: "Gerenciar municípios e suas configurações",
      icon: <Building2 className="h-5 w-5 text-blue-600" />,
      onClick: () => navigate("/admin/municipios")
    },
    {
      title: "Usuários",
      description: "Gerenciar contas de usuários do sistema",
      icon: <Users className="h-5 w-5 text-green-600" />,
      onClick: () => navigate("/admin/usuarios")
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema",
      icon: <Settings className="h-5 w-5 text-purple-600" />,
      onClick: () => toast.info("Funcionalidade em desenvolvimento")
    },
    {
      title: "Banco de Dados",
      description: "Gerenciamento de dados e backups",
      icon: <Database className="h-5 w-5 text-amber-600" />,
      onClick: () => toast.info("Funcionalidade em desenvolvimento")
    },
    {
      title: "Sistema",
      description: "Informações do servidor e performance",
      icon: <Server className="h-5 w-5 text-red-600" />,
      onClick: () => toast.info("Funcionalidade em desenvolvimento")
    },
    {
      title: "Relatórios",
      description: "Estatísticas e análises gerais",
      icon: <LineChart className="h-5 w-5 text-indigo-600" />,
      onClick: () => toast.info("Funcionalidade em desenvolvimento")
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Administração do Sistema</h1>
          <p className="text-muted-foreground">
            Gerenciamento central da plataforma GECOM
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminMenuItems.map((item, idx) => (
          <AdminCard
            key={idx}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
