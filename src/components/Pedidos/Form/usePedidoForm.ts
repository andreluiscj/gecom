
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Item } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const pedidoSchema = z.object({
  data_compra: z.string().nonempty('Data da compra é obrigatória'),
  descricao: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  fundo_monetario: z.string().nonempty('Fundo monetário é obrigatório'),
  setor_id: z.string().nonempty('Setor é obrigatório'),
  itens: z.array(
    z.object({
      nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      quantidade: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
      valor_unitario: z.number().min(0.01, 'Valor unitário deve ser maior que zero'),
    })
  ).min(1, 'Pelo menos um item é obrigatório'),
});

export type PedidoFormValues = z.infer<typeof pedidoSchema>;

export const usePedidoForm = () => {
  const navigate = useNavigate();
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

  const form = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      data_compra: new Date().toISOString().split('T')[0],
      descricao: '',
      fundo_monetario: '',
      setor_id: '',
      itens: [{ nome: '', quantidade: 1, valor_unitario: 0 }],
    },
  });

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

  const atualizarItem = (index: number, campo: keyof Item, valor: string | number) => {
    const novosItens = [...itens];
    novosItens[index] = {
      ...novosItens[index],
      [campo]: valor,
    };

    // Recalcular valor total
    if (campo === 'quantidade' || campo === 'valor_unitario') {
      novosItens[index].valor_total =
        Number(novosItens[index].quantidade) * Number(novosItens[index].valor_unitario);
    }

    setItens(novosItens);
    
    // Atualiza os valores no formulário também
    const formItens = form.getValues().itens || [];
    formItens[index] = {
      nome: novosItens[index].nome,
      quantidade: Number(novosItens[index].quantidade),
      valor_unitario: Number(novosItens[index].valor_unitario),
    };
    form.setValue('itens', formItens);
  };

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + (item.valor_total || 0), 0);
  };

  const onSubmit = async (data: PedidoFormValues) => {
    try {
      // Criar o pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos_compra')
        .insert({
          descricao: data.descricao,
          data_compra: data.data_compra,
          setor_id: data.setor_id,
          fundo_monetario: data.fundo_monetario,
          valor_total: calcularValorTotal(),
          status: 'Pendente',
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // Criar os itens do pedido
      const itensParaInserir = itens.map(item => ({
        ...item,
        pedido_id: pedido.id
      }));

      const { error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itensParaInserir);

      if (itensError) throw itensError;

      toast.success('Pedido de compra cadastrado com sucesso!');
      navigate('/pedidos');
    } catch (error: any) {
      console.error("Erro ao salvar pedido:", error);
      toast.error('Erro ao cadastrar pedido. Verifique os dados e tente novamente.');
    }
  };

  return {
    form,
    itens,
    adicionarItem,
    removerItem,
    atualizarItem,
    calcularValorTotal,
    onSubmit,
  };
};
