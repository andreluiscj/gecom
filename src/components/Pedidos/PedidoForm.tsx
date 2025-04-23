
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, Save, ArrowLeft } from 'lucide-react';
import { Item } from '@/types';

interface Setor {
  id: string;
  nome: string;
}

const PedidoForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [setores, setSetores] = useState<Setor[]>([]);
  
  // Form state
  const [descricao, setDescricao] = useState('');
  const [dataCompra, setDataCompra] = useState(new Date().toISOString().split('T')[0]);
  const [setorId, setSetorId] = useState('');
  const [fundoMonetario, setFundoMonetario] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [localEntrega, setLocalEntrega] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  // Item state
  const [itens, setItens] = useState<Item[]>([
    { 
      id: crypto.randomUUID(),
      nome: '', 
      quantidade: 1, 
      valor_unitario: 0, 
      valor_total: 0,
      pedido_id: '' 
    }
  ]);

  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const { data, error } = await supabase
          .from('setores')
          .select('id, nome')
          .order('nome');
          
        if (error) throw error;
        
        setSetores(data || []);
        if (data && data.length > 0) {
          setSetorId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching setores:', error);
        toast.error('Erro ao carregar setores');
      }
    };
    
    fetchSetores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!descricao || !dataCompra || !setorId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (itens.length === 0 || itens.some(item => !item.nome || item.quantidade <= 0)) {
      toast.error('Adicione pelo menos um item válido ao pedido');
      return;
    }

    try {
      setLoading(true);

      // Calculate total value
      const valorTotal = calcularValorTotal();
      
      // Create pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos_compra')
        .insert({
          descricao,
          data_compra: dataCompra,
          setor_id: setorId,
          fundo_monetario: fundoMonetario,
          justificativa,
          local_entrega: localEntrega,
          observacoes,
          valor_total: valorTotal,
          status: 'Pendente',
        })
        .select('id')
        .single();
      
      if (pedidoError) throw pedidoError;
      
      // Create itens
      const itemsToInsert = itens.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total,
        pedido_id: pedido.id
      }));
      
      const { error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itemsToInsert);
      
      if (itensError) throw itensError;
      
      toast.success('Pedido cadastrado com sucesso!');
      navigate('/pedidos');
      
    } catch (error) {
      console.error('Error creating pedido:', error);
      toast.error('Erro ao cadastrar pedido');
    } finally {
      setLoading(false);
    }
  };
  
  const adicionarItem = () => {
    setItens([
      ...itens,
      { 
        id: crypto.randomUUID(),
        nome: '', 
        quantidade: 1, 
        valor_unitario: 0, 
        valor_total: 0,
        pedido_id: '' 
      }
    ]);
  };
  
  const removerItem = (index: number) => {
    if (itens.length > 1) {
      const novosItens = [...itens];
      novosItens.splice(index, 1);
      setItens(novosItens);
    }
  };
  
  const atualizarItem = (index: number, campo: keyof Item, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = {
      ...novosItens[index],
      [campo]: valor,
    };
    
    // Update total value if quantity or unit value changes
    if (campo === 'quantidade' || campo === 'valor_unitario') {
      novosItens[index].valor_total = Number(novosItens[index].quantidade) * Number(novosItens[index].valor_unitario);
    }
    
    setItens(novosItens);
  };
  
  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + item.valor_total, 0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição*</label>
              <Input 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                placeholder="Descrição do pedido"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data*</label>
              <Input 
                type="date" 
                value={dataCompra} 
                onChange={(e) => setDataCompra(e.target.value)} 
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Secretaria*</label>
              <Select 
                value={setorId} 
                onValueChange={setSetorId} 
                disabled={loading || setores.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma secretaria" />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((setor) => (
                    <SelectItem key={setor.id} value={setor.id}>
                      {setor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fundo Monetário</label>
              <Input 
                value={fundoMonetario} 
                onChange={(e) => setFundoMonetario(e.target.value)} 
                placeholder="Fundo monetário"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Local de Entrega</label>
              <Input 
                value={localEntrega} 
                onChange={(e) => setLocalEntrega(e.target.value)} 
                placeholder="Local de entrega"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Justificativa</label>
              <Textarea 
                value={justificativa} 
                onChange={(e) => setJustificativa(e.target.value)} 
                placeholder="Justificativa para o pedido"
                disabled={loading}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Itens do Pedido</h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={adicionarItem}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar Item
            </Button>
          </div>
          
          {itens.map((item, index) => (
            <div key={item.id} className="grid gap-3 md:grid-cols-12 mb-4 pb-4 border-b last:border-0">
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-medium">Nome do Item*</label>
                <Input 
                  value={item.nome} 
                  onChange={(e) => atualizarItem(index, 'nome', e.target.value)} 
                  placeholder="Nome do item"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium">Qtd*</label>
                <Input 
                  type="number" 
                  min="1" 
                  value={item.quantidade} 
                  onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))} 
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium">Valor Unit.*</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  value={item.valor_unitario} 
                  onChange={(e) => atualizarItem(index, 'valor_unitario', Number(e.target.value))} 
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-medium">Total</label>
                <div className="h-10 px-3 border rounded flex items-center bg-gray-50 text-gray-500">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_total)}
                </div>
              </div>
              
              <div className="md:col-span-1 flex items-end">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removerItem(index)}
                  disabled={itens.length <= 1 || loading}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end pt-4">
            <div className="bg-gray-50 p-3 rounded border flex items-center gap-4">
              <span className="text-sm font-medium">Valor Total:</span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularValorTotal())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Textarea 
              value={observacoes} 
              onChange={(e) => setObservacoes(e.target.value)} 
              placeholder="Observações adicionais"
              disabled={loading}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4 justify-end mt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate('/pedidos')}
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Salvar Pedido
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PedidoForm;
