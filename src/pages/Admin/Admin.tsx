
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const auth = localStorage.getItem('user-authenticated') === 'true';
    const userRole = localStorage.getItem('user-role');
    
    setIsAuthenticated(auth);
    
    if (!auth) {
      toast.error('Você precisa estar autenticado para acessar esta página');
      navigate('/login');
    } else if (userRole === 'admin') {
      navigate('/admin/municipios');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>
            Gerencie configurações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" 
                  onClick={() => navigate('/admin/municipios')}>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Municípios</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie os municípios cadastrados no sistema
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Button 
              variant="destructive" 
              onClick={() => {
                localStorage.removeItem('user-authenticated');
                toast.success('Logout realizado com sucesso');
                navigate('/login');
              }}
            >
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
