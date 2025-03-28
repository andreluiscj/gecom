
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Item, PedidoCompra, Setor } from '@/types';
import { adicionarPedido, fundosMonetarios, gerarId } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

type PedidoFormValues = z.infer<typeof pedidoSchema>;

const PedidoForm: React.FC = () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dataCompra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Compra</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="setor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o setor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                        <SelectItem value="Educação">Educação</SelectItem>
                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                        <SelectItem value="Transporte">Transporte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o pedido de compra..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fundoMonetario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fundo Monetário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o fundo monetário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fundosMonetarios.map((fundo) => (
                        <SelectItem key={fundo} value={fundo}>
                          {fundo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
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

              <div className="space-y-4">
                {itens.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md"
                  >
                    <div className="md:col-span-2">
                      <FormLabel htmlFor={`item-${index}-nome`}>
                        Nome do Item
                      </FormLabel>
                      <Input
                        id={`item-${index}-nome`}
                        value={item.nome}
                        onChange={(e) =>
                          atualizarItem(index, 'nome', e.target.value)
                        }
                        placeholder="Nome do item"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor={`item-${index}-quantidade`}>
                        Quantidade
                      </FormLabel>
                      <Input
                        id={`item-${index}-quantidade`}
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) =>
                          atualizarItem(
                            index,
                            'quantidade',
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor={`item-${index}-valor`}>
                        Valor Unitário
                      </FormLabel>
                      <Input
                        id={`item-${index}-valor`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.valorUnitario}
                        onChange={(e) =>
                          atualizarItem(
                            index,
                            'valorUnitario',
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removerItem(index)}
                        disabled={itens.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Valor Total:</span>
                <span className="text-lg font-bold">
                  {formatCurrency(calcularValorTotal())}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/pedidos')}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Pedido</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PedidoForm;
