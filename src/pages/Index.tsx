
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSystem } from '@/scripts/initializeSystem';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addAdminUser } from '@/scripts/addAdminUser';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdminButton, setShowAdminButton] = useState(false);

  useEffect(() => {
    const checkAndInitialize = async () => {
      try {
        setIsInitializing(true);
        
        // Check Supabase connection
        const { data: connectionTest, error: connectionError } = await supabase.from('municipios').select('count').limit(1);
        
        if (connectionError) {
          console.error("Erro de conexão com o Supabase:", connectionError);
          setError("Erro de conexão com o banco de dados. Verifique se o Supabase está configurado corretamente.");
          return;
        }
        
        console.log("Conexão com o Supabase estabelecida com sucesso");
        
        // Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Usuário já autenticado, redirecionando...");
          navigate('/dashboard');
          return;
        }

        // Check if system needs initialization
        const { count } = connectionTest[0] || { count: 0 };
        const systemInitialized = count > 0;
        
        if (!systemInitialized) {
          console.log("Inicializando o sistema...");
          const result = await initializeSystem();
          if (result) {
            console.log("Sistema inicializado com sucesso");
            toast.success("Sistema inicializado com sucesso");
            
            // Show button to create admin user
            setShowAdminButton(true);
          } else {
            console.error("Falha na inicialização do sistema");
            toast.error("Falha na inicialização do sistema");
            setError("Falha na inicialização do sistema");
            return;
          }
        } else {
          console.log("Sistema já inicializado anteriormente");
          
          // Check if admin user exists
          const { data: adminUsers, error: adminError } = await supabase
            .from('usuarios')
            .select('count')
            .eq('role', 'admin')
            .limit(1);
            
          if (adminError) {
            console.error("Erro ao verificar usuários admin:", adminError);
          } else {
            const adminCount = adminUsers[0]?.count || 0;
            setShowAdminButton(adminCount === 0);
          }
          
          // Always redirect to login page after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      } catch (error) {
        console.error("Erro durante inicialização:", error);
        toast.error("Erro durante inicialização do sistema");
        setError("Erro durante inicialização do sistema. Verifique o console para mais detalhes.");
      } finally {
        setIsInitializing(false);
      }
    };

    checkAndInitialize();
  }, [navigate]);
  
  const handleCreateAdminUser = async () => {
    try {
      setIsInitializing(true);
      const result = await addAdminUser();
      if (result) {
        toast.success("Usuário administrador criado com sucesso");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error("Erro ao criar usuário administrador");
      }
    } catch (error) {
      console.error("Erro ao criar usuário admin:", error);
      toast.error("Erro ao criar usuário administrador");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <img 
            src="/lovable-uploads/d6c59aa6-5f8d-498d-92db-f4a917a2f5b3.png" 
            alt="GECOM Logo" 
            className="h-20"
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Sistema GECOM</h1>
        
        {isInitializing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Preparando o sistema...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        ) : showAdminButton ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Sistema inicializado com sucesso!</p>
            <p className="text-gray-600 mb-6">É necessário criar um usuário administrador para continuar.</p>
            <Button onClick={handleCreateAdminUser}>
              Criar Usuário Administrador
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-green-600 mb-4">Sistema inicializado com sucesso!</p>
            <p className="text-gray-600 mb-6">Redirecionando para a página de login...</p>
            <Button onClick={() => navigate('/login')}>
              Ir para Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
