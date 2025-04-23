
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PedidoCompra } from '@/types';
import { supabase } from '@/lib/supabase';
import { Plus, Filter } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/formatters';

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('pedidos_compra')
          .select(`
            *,
            setores:setor_id (nome)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching pedidos:', error);
        } else if (data) {
          const formattedPedidos = data.map(pedido => ({
            ...pedido,
            setor: pedido.setores?.nome || '',
            created_at: new Date(pedido.created_at),
            data_compra: new Date(pedido.data_compra),
            itens: [] // We'll load items on demand when viewing details
          }));
          
          setPedidos(formattedPedidos);
        }
      } catch (err) {
        console.error('Error in data fetching:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-amber-100 text-amber-800';
      case 'Em Análise':
        return 'bg-blue-100 text-blue-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      case 'Em Andamento':
        return 'bg-purple-100 text-purple-800';
      case 'Concluído':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pedidos de Compra</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe os pedidos de compra do município.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button asChild>
            <Link to="/pedidos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Pedido
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
          <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
                  <Button asChild className="mt-4">
                    <Link to="/pedidos/novo">
                      Criar Novo Pedido
                    </Link>
                  </Button>
                </Card>
              ) : (
                pedidos.map((pedido) => (
                  <Card key={pedido.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <Link to={`/pedidos/${pedido.id}`} className="block">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                        <div>
                          <h3 className="font-medium">{pedido.descricao}</h3>
                          <div className="text-sm text-muted-foreground flex flex-wrap gap-2 mt-1">
                            <span>{pedido.setor}</span>
                            <span>•</span>
                            <span>Data: {formatDate(pedido.data_compra)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(pedido.status)}`}>
                            {pedido.status}
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(pedido.valor_total)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pendentes" className="space-y-4">
          <Card className="p-6">
            <p className="text-muted-foreground text-center">Selecione o filtro de pedidos pendentes para visualização.</p>
          </Card>
        </TabsContent>

        <TabsContent value="aprovados" className="space-y-4">
          <Card className="p-6">
            <p className="text-muted-foreground text-center">Selecione o filtro de pedidos aprovados para visualização.</p>
          </Card>
        </TabsContent>

        <TabsContent value="concluidos" className="space-y-4">
          <Card className="p-6">
            <p className="text-muted-foreground text-center">Selecione o filtro de pedidos concluídos para visualização.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pedidos;
