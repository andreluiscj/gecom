
import React from 'react';
import { Card } from '@/components/ui/card';
import { getUserRole, getUserId } from '@/utils/authHelpers';
import PrefeitoGestao from './PrefeitoGestao';
import PrefeitoDashboard from './PrefeitoDashboard';

const PrefeitoPage = () => {
  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';
  const isPrefeito = userRole === 'prefeito';

  if (!isAdmin && !isPrefeito) {
    return null;
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Área do Prefeito</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <PrefeitoDashboard />
          {isAdmin && <PrefeitoGestao />}
        </div>
      </div>
    </div>
  );
};

export default PrefeitoPage;
