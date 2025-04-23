
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Item, Setor } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { Trash2, Plus } from 'lucide-react';

interface PedidoFormProps {
  id?: string;
}

const PedidoForm: React.FC<PedidoFormProps> = ({ id }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [setores, setSetores] = useState<Setor[]>([]);
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
  const [formData, setFormData] = useState({
    descricao: '',
    data_compra: new Date().toISOString().split('T')[0],
    setor_id: '',
    fundo_monetario: '',
    justificativa: '',
    local_entrega: '',
    observacoes: '',
  });

  // Fetch setores on component mount
  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const { data, error } = await supabase
          .from('setores')
          .select('*')
          .order('nome');
        
        if (error) throw error;
        if (data) setSetores(data);
      } catch (error) {
        console.error('Error fetching setores:', error);
        toast.error('Erro ao carregar setores');
      }
    };
    
    fetchSetores();
  }, []);

  // If editing, fetch pedido data
  useEffect(() => {
    if (id) {
      const fetchPedido = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('pedidos_compra')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFormData({
              descricao: data.descricao,
              data_compra: new Date(data.data_compra).toISOString().split('T')[0],
              setor_id: data.setor_id,
              fundo_monetario: data.fundo_monetario || '',
              justificativa: data.justificativa || '',
              local_entrega: data.local_entrega || '',
              observacoes: data.observacoes || '',
            });
            
            // Fetch itens
            const { data: itensData, error: itensError } = await supabase
              .from('itens_pedido')
              .select('*')
              .eq('pedido_id', id);
              
            if (itensError) throw itensError;
            
            if (itensData && itensData.length > 0) {
              setItens(itensData);
            }
          }
        } catch (error) {
          console.error('Error fetching pedido:', error);
          toast.error('Erro ao carregar dados do pedido');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPedido();
    }
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Recalcular valor total
    if (campo === 'quantidade' || campo === 'valor_unitario') {
      const quantidade = campo === 'quantidade' ? Number(valor) : novosItens[index].quantidade;
      const valorUnitario = campo === 'valor_unitario' ? Number(valor) : novosItens[index].valor_unitario;
      novosItens[index].valor_total = quantidade * valorUnitario;
    }

    setItens(novosItens);
  };
  
  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + item.valor_total, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.data_compra || !formData.setor_id) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (itens.some(item => !item.nome || item.quantidade <= 0)) {
      toast.error('Preencha todos os itens corretamente');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Preparar o pedido
      const pedidoData = {
        descricao: formData.descricao,
        data_compra: formData.data_compra,
        setor_id: formData.setor_id,
        fundo_monetario: formData.fundo_monetario || null,
        justificativa: formData.justificativa || null,
        local_entrega: formData.local_entrega || null, 
        observacoes: formData.observacoes || null,
        valor_total: calcularValorTotal(),
        status: 'Pendente',
      };
      
      if (id) {
        // Atualizar pedido existente
        const { error } = await supabase
          .from('pedidos_compra')
          .update(pedidoData)
          .eq('id', id);
          
        if (error) throw error;
        
        // Deletar itens antigos
        const { error: deleteError } = await supabase
          .from('itens_pedido')
          .delete()
          .eq('pedido_id', id);
          
        if (deleteError) throw deleteError;
        
        // Inserir novos itens
        const itensParaInserir = itens.map(item => ({
          ...item,
          pedido_id: id
        }));
        
        const { error: itensError } = await supabase
          .from('itens_pedido')
          .insert(itensParaInserir);
          
        if (itensError) throw itensError;
        
        toast.success('Pedido atualizado com sucesso!');
      } else {
        // Criar novo pedido
        const { data: pedido, error } = await supabase
          .from('pedidos_compra')
          .insert(pedidoData)
          .select()
          .single();
          
        if (error) throw error;
        
        // Inserir itens
        const itensParaInserir = itens.map(item => ({
          nome: item.nome,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          pedido_id: pedido.id
        }));
        
        const { error: itensError } = await supabase
          .from('itens_pedido')
          .insert(itensParaInserir);
          
        if (itensError) throw itensError;
        
        toast.success('Pedido criado com sucesso!');
      }
      
      navigate('/pedidos');
    } catch (error) {
      console.error('Error saving pedido:', error);
      toast.error('Erro ao salvar pedido');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Demanda</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  placeholder="Insira uma descrição para a demanda"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_compra">Data da Demanda</Label>
                <Input
                  id="data_compra"
                  name="data_compra"
                  type="date"
                  value={formData.data_compra}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setor">Setor Solicitante</Label>
                <Select
                  value={formData.setor_id}
                  onValueChange={(value) => handleSelectChange('setor_id', value)}
                  required
                >
                  <SelectTrigger id="setor">
                    <SelectValue placeholder="Selecione um setor" />
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
                <Label htmlFor="fundo_monetario">Fundo Monetário</Label>
                <Input
                  id="fundo_monetario"
                  name="fundo_monetario"
                  placeholder="Ex: Fundo Municipal de Saúde"
                  value={formData.fundo_monetario}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Itens</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarItem}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Item
                </Button>
              </div>

              {itens.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <Label htmlFor={`item-nome-${index}`}>Nome</Label>
                      <Input
                        id={`item-nome-${index}`}
                        value={item.nome}
                        onChange={(e) => atualizarItem(index, 'nome', e.target.value)}
                        placeholder="Nome do item"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`item-quantidade-${index}`}>Quantidade</Label>
                      <Input
                        id={`item-quantidade-${index}`}
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`item-valor-${index}`}>Valor Unitário</Label>
                      <Input
                        id={`item-valor-${index}`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.valor_unitario}
                        onChange={(e) => atualizarItem(index, 'valor_unitario', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Valor Total</Label>
                      <div className="h-10 flex items-center px-3 border rounded-md bg-gray-100">
                        {formatCurrency(item.valor_total)}
                      </div>
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removerItem(index)}
                        disabled={itens.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Valor Total:</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(calcularValorTotal())}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="justificativa">Justificativa</Label>
                <Textarea
                  id="justificativa"
                  name="justificativa"
                  placeholder="Insira a justificativa para esta demanda"
                  value={formData.justificativa}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="local_entrega">Local de Entrega</Label>
                <Input
                  id="local_entrega"
                  name="local_entrega"
                  placeholder="Endereço de entrega"
                  value={formData.local_entrega}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Observações adicionais"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/pedidos')}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : id ? 'Atualizar Pedido' : 'Salvar Pedido'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PedidoForm;
