
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ItemsSection from './Form/ItemsSection';
import TotalSection from './Form/TotalSection';
import ActionButtons from './Form/ActionButtons';
import { PedidoCompra, Item } from '@/types';
import { adicionarPedido } from '@/services/dfdService';
import { getUserNameSync, getUserRoleSync } from '@/utils/authHelpers';
import { UserRole } from '@/types';

export interface PedidoFormProps {
  initialData?: PedidoCompra | null;
  isEditing?: boolean;
  onCancel: () => void;
  onSubmit: (pedido: PedidoCompra) => void;
}

const PedidoForm: React.FC<PedidoFormProps> = ({ 
  initialData, 
  isEditing = false, 
  onCancel = () => window.history.back(),
  onSubmit = () => {},
}) => {
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [justificativa, setJustificativa] = useState(initialData?.justificativa || '');
  const [setor, setSetor] = useState(initialData?.setor || '');
  const [localEntrega, setLocalEntrega] = useState(initialData?.localEntrega || '');
  const [items, setItems] = useState<Item[]>(initialData?.items || [
    { id: crypto.randomUUID(), nome: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 }
  ]);
  const [total, setTotal] = useState(initialData?.valorTotal || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userRole = getUserRoleSync();
  const userName = getUserNameSync();

  // Calculate total when items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.valorTotal, 0);
    setTotal(newTotal);
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { 
      id: crypto.randomUUID(), 
      nome: '', 
      quantidade: 1, 
      valorUnitario: 0,
      valorTotal: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleUpdateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    // Recalculate the total value
    if (field === 'quantidade' || field === 'valorUnitario') {
      const quantidade = field === 'quantidade' ? Number(value) : Number(newItems[index].quantidade);
      const valorUnitario = field === 'valorUnitario' ? Number(value) : Number(newItems[index].valorUnitario);
      newItems[index].valorTotal = quantidade * valorUnitario;
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao.trim()) {
      toast.error('Por favor, adicione uma descrição para o pedido');
      return;
    }
    
    if (!setor) {
      toast.error('Por favor, selecione um setor');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Por favor, adicione pelo menos um item ao pedido');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newPedido: PedidoCompra = {
        id: initialData?.id || crypto.randomUUID(),
        descricao,
        justificativa,
        setor,
        items,
        valorTotal: total,
        status: initialData?.status || 'Pendente',
        dataCompra: initialData?.dataCompra || new Date(),
        solicitante: userName || 'Usuário',
        localEntrega,
      };
      
      // For managers and users, auto-approve
      if (userRole === 'gestor' || userRole === 'admin') {
        newPedido.status = 'Aprovado';
      }
      
      // If creating a new pedido
      if (!isEditing) {
        const savedPedido = await adicionarPedido(newPedido);
        onSubmit(savedPedido);
        toast.success('Pedido criado com sucesso!');
      } 
      // If editing existing pedido
      else {
        onSubmit(newPedido);
        toast.success('Pedido atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast.error('Ocorreu um erro ao salvar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição do Pedido</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o pedido de compra"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="justificativa">Justificativa</Label>
            <Textarea
              id="justificativa"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Justifique a necessidade desta compra"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="setor">Setor/Secretaria</Label>
              <Select
                value={setor}
                onValueChange={setSetor}
              >
                <SelectTrigger id="setor">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                  <SelectItem value="Obras">Obras</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="localEntrega">Local de Entrega</Label>
              <Input
                id="localEntrega"
                value={localEntrega}
                onChange={(e) => setLocalEntrega(e.target.value)}
                placeholder="Informe o local de entrega"
              />
            </div>
          </div>
        </div>
      </Card>
      
      <ItemsSection 
        items={items} 
        onAddItem={handleAddItem} 
        onRemoveItem={handleRemoveItem}
        onUpdateItem={handleUpdateItem}
      />
      
      <TotalSection total={total} />
      
      <ActionButtons 
        isSubmitting={isSubmitting} 
        onCancel={onCancel} 
        isEditing={isEditing}
      />
    </form>
  );
};

export default PedidoForm;
