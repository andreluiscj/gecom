
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Pedidos: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('pedidos_compra')
          .select(`
            *,
            setores(nome)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform data to match our type
        const formattedPedidos = data.map(pedido => ({
          ...pedido,
          data_compra: new Date(pedido.data_compra),
          created_at: new Date(pedido.created_at),
          updated_at: new Date(pedido.updated_at),
          setor: pedido.setores?.nome || '',
          itens: []
        }));
        
        setPedidos(formattedPedidos);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPedidos();
  }, []);

  // Filter pedidos based on search term
  const filteredPedidos = pedidos.filter(pedido =>
    pedido.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Pedidos de Compra</h1>
          <p className="text-gray-500">
            Gerencie todos os pedidos de compra do município
          </p>
        </div>
        <Button asChild>
          <Link to="/pedidos/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo Pedido
          </Link>
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader className="h-8 w-8 text-blue-600" />
          </div>
        ) : filteredPedidos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-mono text-xs">{pedido.id.substring(0, 8)}</TableCell>
                  <TableCell className="max-w-xs truncate">{pedido.descricao}</TableCell>
                  <TableCell>{formatDate(pedido.data_compra)}</TableCell>
                  <TableCell>{pedido.setor}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        pedido.status === 'Aprovado' 
                          ? 'bg-green-100 text-green-800' 
                          : pedido.status === 'Rejeitado'
                          ? 'bg-red-100 text-red-800'
                          : pedido.status === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {pedido.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(pedido.valor_total)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/pedidos/${pedido.id}`}>
                        <FileText className="h-4 w-4 mr-1" /> Visualizar
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm 
                ? "Sua busca não retornou resultados. Tente outros termos." 
                : "Ainda não há pedidos cadastrados no sistema."}
            </p>
            {!searchTerm && (
              <Button className="mt-6" asChild>
                <Link to="/pedidos/novo">
                  <Plus className="mr-2 h-4 w-4" /> Criar Pedido
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
