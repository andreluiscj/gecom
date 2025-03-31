
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the admin area
    navigate('/admin');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Carregando Sistema</h1>
        <p className="text-xl text-gray-600">Aguarde um momento...</p>
      </div>
    </div>
  );
};

export default Index;
