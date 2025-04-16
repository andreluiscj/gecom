
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSystem } from '@/scripts/initializeSystem';
import { addAdminUser } from '@/scripts/addAdminUser';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAndInitialize = async () => {
      try {
        setIsInitializing(true);
        
        // Verificar conexão com o Supabase
        const { data: connectionTest, error: connectionError } = await supabase.from('municipios').select('count').limit(1);
        
        if (connectionError) {
          console.error("Erro de conexão com o Supabase:", connectionError);
          setError("Erro de conexão com o banco de dados. Verifique se o Supabase está configurado corretamente.");
          return;
        }
        
        console.log("Conexão com o Supabase estabelecida com sucesso");
        
        // Verificar usuário autenticado
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Usuário já autenticado, redirecionando...");
          navigate('/dashboard');
          return;
        }

        // Check if system is already initialized
        const { data: municipios } = await supabase
          .from('municipios')
          .select('count')
          .limit(1);
        
        const systemInitialized = municipios && municipios.length > 0;
        
        if (!systemInitialized) {
          console.log("Inicializando o sistema...");
          const result = await initializeSystem();
          if (result) {
            localStorage.setItem('system-initialized', 'true');
            console.log("Sistema inicializado com sucesso, criando usuário administrador...");
            
            // After system initialization, add the admin user
            const adminResult = await addAdminUser();
            if (adminResult) {
              toast.success("Usuário administrador criado com sucesso");
              console.log("Usuário administrador criado com sucesso");
            } else {
              toast.error("Erro ao criar usuário administrador");
              console.error("Erro ao criar usuário administrador");
            }
          } else {
            console.error("Falha na inicialização do sistema");
            toast.error("Falha na inicialização do sistema");
            setError("Falha na inicialização do sistema");
            return;
          }
        } else {
          console.log("Sistema já inicializado anteriormente");
          
          // Always try to add admin user
          await addAdminUser();
        }

        // Always redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 1500);
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
