
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="text-center max-w-lg space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Página não encontrada</h1>
          <p className="text-gray-500 text-lg">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="py-10">
          <div className="text-9xl font-bold text-blue-600">404</div>
        </div>
        
        <div>
          <Link to="/">
            <Button className="px-8 py-6 text-md">
              Voltar para o início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
