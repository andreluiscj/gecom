
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSystem } from '@/scripts/initializeSystem';
import { addAdminUser } from '@/scripts/addAdminUser';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndInitialize = async () => {
      try {
        // Check if system is already initialized
        const systemInitialized = localStorage.getItem('system-initialized') === 'true';
        
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
          }
        } else {
          console.log("Sistema já inicializado anteriormente");
        }

        // Always redirect to login page
        navigate('/login');
      } catch (error) {
        console.error("Erro durante inicialização:", error);
        toast.error("Erro durante inicialização do sistema");
        navigate('/login');
      }
    };

    checkAndInitialize();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Inicializando GECOM</h1>
        <p className="text-xl text-gray-600">Preparando o sistema...</p>
      </div>
    </div>
  );
};

export default Index;
