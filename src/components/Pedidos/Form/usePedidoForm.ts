
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Item, PedidoCompra, PedidoStatus } from '@/types';
import { toast } from 'sonner';
import { adicionarPedido } from '@/services/dfdService';
import { initializeWorkflow } from '@/utils/workflowHelpers';

// Helper function to generate ID
function gerarId(): string {
  return crypto.randomUUID();
}

// Schema for form validation
const pedidoSchema = z.object({
  dataCompra: z.string().nonempty('Data da compra é obrigatória'),
  descricao: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  fundoMonetario: z.string().nonempty('Fundo monetário é obrigatório'),
  setor: z.string().nonempty('Setor é obrigatório'),
  items: z.array(
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
  const [items, setItems] = useState<Item[]>([
    { id: gerarId(), nome: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 },
  ]);

  const form = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      dataCompra: new Date().toISOString().split('T')[0],
      descricao: '',
      fundoMonetario: '',
      setor: '',
      items: [{ nome: '', quantidade: 1, valorUnitario: 0 }],
    },
  });

  const adicionarItem = () => {
    setItems([
      ...items,
      { id: gerarId(), nome: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 },
    ]);
  };

  const removerItem = (index: number) => {
    if (items.length > 1) {
      const novosItems = [...items];
      novosItems.splice(index, 1);
      setItems(novosItems);
    }
  };

  const atualizarItem = (index: number, campo: keyof Item, valor: string | number) => {
    const novosItems = [...items];
    novosItems[index] = {
      ...novosItems[index],
      [campo]: valor,
    };

    // Recalcular valor total
    if (campo === 'quantidade' || campo === 'valorUnitario') {
      novosItems[index].valorTotal =
        Number(novosItems[index].quantidade) * Number(novosItems[index].valorUnitario);
    }

    setItems(novosItems);
    
    // Atualiza os valores no formulário também
    const formItems = form.getValues().items || [];
    formItems[index] = {
      nome: novosItems[index].nome,
      quantidade: Number(novosItems[index].quantidade),
      valorUnitario: Number(novosItems[index].valorUnitario),
    };
    form.setValue('items', formItems);
  };

  const calcularValorTotal = () => {
    return items.reduce((total, item) => total + (item.valorTotal || 0), 0);
  };

  const onSubmit = async (data: PedidoFormValues) => {
    try {
      // Garantir que os items tenham valores corretos
      const itemsCompletos = items.map((item) => ({
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
        items: itemsCompletos,
        valorTotal: calcularValorTotal(),
        fundoMonetario: data.fundoMonetario,
        setor: data.setor,
        status: 'Pendente' as PedidoStatus,
        solicitante: '',
        localEntrega: '',
        justificativa: '',
      };

      if (initializeWorkflow) {
        novoPedido.workflow = initializeWorkflow();
      }

      console.log("Salvando pedido:", novoPedido);
      
      const result = await adicionarPedido(novoPedido);
      
      if (result) {
        toast.success('Pedido de compra cadastrado com sucesso!');
        navigate('/pedidos');
      } else {
        toast.error('Erro ao cadastrar pedido. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      toast.error('Erro ao cadastrar pedido. Verifique os dados e tente novamente.');
    }
  };

  return {
    form,
    items,
    adicionarItem,
    removerItem,
    atualizarItem,
    calcularValorTotal,
    onSubmit,
    gerarId
  };
};
