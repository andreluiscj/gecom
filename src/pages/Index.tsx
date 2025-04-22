
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeSystem } from '@/scripts/initializeSystem';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndInitialize = async () => {
      // Check if system is already initialized
      const systemInitialized = localStorage.getItem('system-initialized') === 'true';
      
      if (!systemInitialized) {
        const result = await initializeSystem();
        if (result) {
          localStorage.setItem('system-initialized', 'true');
        }
      }

      // Always redirect to login page
      navigate('/login');
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
