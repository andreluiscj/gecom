
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-lg text-gray-600 mb-8">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button>
        <Link to="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
};

export default NotFound;
