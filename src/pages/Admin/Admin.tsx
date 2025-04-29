import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2, Users, FileText } from 'lucide-react';
const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const auth = localStorage.getItem('user-authenticated') === 'true';
    const userRole = localStorage.getItem('user-role');
    setIsAuthenticated(auth);
    if (!auth) {
      toast.error('Você precisa estar autenticado para acessar esta página');
      navigate('/login');
      return;
    }
    if (userRole !== 'admin') {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }
  }, [navigate]);
  return <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/16b8bdb2-a18d-4ef2-8b14-ce836cb5bef0.png" alt="GECOM Logo" className="h-12" />
            <div>
              <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
              <CardDescription>
                Gerencie configurações do sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => navigate('/admin/municipios')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Municípios</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Gerencie os municípios cadastrados no sistema
                </p>
              </CardContent>
            </Card>
            
            <Card onClick={() => navigate('/admin/gerentes')} className="transition-colors cursor-pointer bg-zinc-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium mx-0 text-center">Usuários</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
              </p>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => navigate('/gerenciamento/funcionarios')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Funcionários</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Gerencie todos os funcionários cadastrados
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Admin;