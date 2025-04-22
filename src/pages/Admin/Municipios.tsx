
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Municipios = () => {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarMunicipios();
  }, []);

  const carregarMunicipios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('municipalities').select('*').order('name');
    if (!error) setMunicipios(data || []);
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Municípios</CardTitle>
          <CardDescription>Administre os municípios cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button className="bg-blue-600 text-white" onClick={() => navigate('/admin/municipios/novo')}>
              <Plus className="mr-2 h-5 w-5"/> Cadastrar novo Município
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-blue-100">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left font-semibold">Estado</th>
                  <th className="px-4 py-2 text-left font-semibold">População</th>
                  <th className="px-4 py-2 text-left font-semibold">Orçamento</th>
                </tr>
              </thead>
              <tbody>
                {municipios.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2">{m.name}</td>
                    <td className="px-4 py-2">{m.state}</td>
                    <td className="px-4 py-2">{m.population?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-2">{m.budget ? "R$ "+Number(m.budget).toLocaleString() : '-'}</td>
                  </tr>
                ))}
                {municipios.length === 0 && 
                  <tr><td colSpan={4} className="text-center p-6">Nenhum município encontrado.</td></tr>
                }
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Municipios;
