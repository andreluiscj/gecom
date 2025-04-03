
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Item, PedidoCompra, Setor } from '@/types';
import { adicionarPedido, gerarId } from '@/data/mockData';
import { toast } from 'sonner';

// Schema for form validation
const pedidoSchema = z.object({
  dataCompra: z.string().nonempty('Data da compra é obrigatória'),
  descricao: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  fundoMonetario: z.string().nonempty('Fundo monetário é obrigatório'),
  setor: z.string().nonempty('Setor é obrigatório'),
  itens: z.array(
    z.object({
      nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      quantidade: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
      valorUnitario: z.number().min(0.01, 'Valor unitário deve ser maior que zero'),
    })
  ).min(1, 'Pelo menos um item é obrigatório'),
});

export type PedidoFormValues = z.infer<typeof pedidoSchema>;

export const usePedidoForm = () => {
  const navigate = useNavigate();
  const [itens, setItens] = useState<Item[]>([
    { id: gerarId(), nome: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 },
  ]);

  const form = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      dataCompra: new Date().toISOString().split('T')[0],
      descricao: '',
      fundoMonetario: '',
      setor: '',
      itens: [{ nome: '', quantidade: 1, valorUnitario: 0 }],
    },
  });

  const adicionarItem = () => {
    setItens([
      ...itens,
      { id: gerarId(), nome: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 },
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
    if (campo === 'quantidade' || campo === 'valorUnitario') {
      novosItens[index].valorTotal =
        Number(novosItens[index].quantidade) * Number(novosItens[index].valorUnitario);
    }

    setItens(novosItens);
    
    // Atualiza os valores no formulário também
    const formItens = form.getValues().itens || [];
    formItens[index] = {
      nome: novosItens[index].nome,
      quantidade: Number(novosItens[index].quantidade),
      valorUnitario: Number(novosItens[index].valorUnitario),
    };
    form.setValue('itens', formItens);
  };

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + (item.valorTotal || 0), 0);
  };

  const onSubmit = (data: PedidoFormValues) => {
    try {
      // Garantir que os itens tenham valores corretos
      const itensCompletos = itens.map((item) => ({
        id: item.id,
        nome: item.nome,
        quantidade: Number(item.quantidade),
        valorUnitario: Number(item.valorUnitario),
        valorTotal: Number(item.quantidade) * Number(item.valorUnitario),
      }));

      const novoPedido: PedidoCompra = {
        id: gerarId(),
        dataCompra: new Date(data.dataCompra),
        descricao: data.descricao,
        itens: itensCompletos,
        valorTotal: calcularValorTotal(),
        fundoMonetario: data.fundoMonetario,
        setor: data.setor as Setor,
        status: 'Pendente',
        createdAt: new Date(),
      };

      console.log("Salvando pedido:", novoPedido);
      adicionarPedido(novoPedido);
      toast.success('Pedido de compra cadastrado com sucesso!');
      navigate('/pedidos');
    } catch (error) {
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
