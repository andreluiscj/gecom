
import React from 'react';
import { getUserRole, getUserId } from '@/utils/authHelpers';
import PrefeitoGestao from './PrefeitoGestao';
import PrefeitoDashboard from './PrefeitoDashboard';
import PrefeitoCadastro from './PrefeitoCadastro';

const PrefeitoPage = () => {
  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';
  const isPrefeito = userRole === 'prefeito';

  // Redirect or show access denied message if not authorized
  if (!isAdmin && !isPrefeito) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold text-red-500">Acesso Negado</h2>
        <p className="text-gray-500 mt-2">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cadastro do Prefeito</h1>
          {isPrefeito && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Acesso Executivo
            </span>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {(isAdmin || isPrefeito) && <PrefeitoDashboard />}
          {isAdmin && <PrefeitoCadastro />}
          {isAdmin && <PrefeitoGestao />}
        </div>
      </div>
    </div>
  );
};

export default PrefeitoPage;
