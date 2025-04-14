
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Setor, Item, PedidoCompra } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ItemsSection from './Form/ItemsSection';
import TotalSection from './Form/TotalSection';
import { initializeWorkflow } from '@/utils/workflowHelpers';
import { addPedido } from '@/services/pedidoService';

const setores: Setor[] = [
  'Saúde',
  'Educação',
  'Administrativo',
  'Transporte',
  'Assistência Social',
  'Cultura',
  'Meio Ambiente',
  'Obras',
  'Segurança Pública',
  'Fazenda',
  'Turismo',
  'Esportes e Lazer',
  'Planejamento',
  'Comunicação',
  'Ciência e Tecnologia'
];

// Form schema
const formSchema = z.object({
  descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  dataCompra: z.string().nonempty('Data da compra é obrigatória'),
  setor: z.string().nonempty('Setor é obrigatório'),
  fundoMonetario: z.string().nonempty('Fundo monetário é obrigatório'),
  justificativa: z.string().optional(),
  observacoes: z.string().optional(),
  localEntrega: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PedidoForm = () => {
  const [items, setItems] = useState<Item[]>([
    { id: uuidv4(), nome: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: '',
      dataCompra: format(new Date(), 'yyyy-MM-dd'),
      setor: '',
      fundoMonetario: '',
      justificativa: '',
      observacoes: '',
      localEntrega: ''
    },
  });

  const addItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), nome: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // Calculate total value if quantity or unit price changes
    if (field === 'quantidade' || field === 'valorUnitario') {
      item.valorTotal = Number(item.quantidade) * Number(item.valorUnitario);
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const calculateTotal = (): number => {
    return items.reduce((total, item) => total + (item.valorTotal || 0), 0);
  };

  const onSubmit = async (values: FormValues) => {
    // Validate items
    const validItems = items.filter(item => item.nome.trim() !== '' && item.quantidade > 0);
    if (validItems.length === 0) {
      toast.error('Adicione pelo menos um item válido ao pedido.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare workflow
      const workflow = initializeWorkflow();
      
      // Create pedido object
      const newPedido: Omit<PedidoCompra, 'id'> = {
        descricao: values.descricao,
        dataCompra: new Date(values.dataCompra),
        setor: values.setor as Setor,
        itens: validItems,
        valorTotal: calculateTotal(),
        status: 'Pendente',
        fundoMonetario: values.fundoMonetario,
        createdAt: new Date(),
        justificativa: values.justificativa,
        observacoes: values.observacoes,
        localEntrega: values.localEntrega,
        workflow
      };
      
      // Submit to API
      const savedPedido = await addPedido(newPedido);
      
      toast.success('Pedido criado com sucesso!');
      navigate(`/pedidos/visualizar/${savedPedido.id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao salvar o pedido. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input placeholder="Descrição do pedido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                  
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="dataCompra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data do Pedido</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="setor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Setor</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um setor" />
                              </SelectTrigger>
                              <SelectContent>
                                {setores.map((setor) => (
                                  <SelectItem key={setor} value={setor}>
                                    {setor}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                  
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="fundoMonetario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fundo Monetário</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Fundo Municipal de Saúde" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <ItemsSection
                items={items}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onUpdateItem={updateItem}
              />
              <Separator className="my-4" />
              <TotalSection total={calculateTotal()} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="justificativa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justificativa</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Justificativa para a solicitação" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
                
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="localEntrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local de Entrega</FormLabel>
                        <FormControl>
                          <Input placeholder="Local onde os itens devem ser entregues" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
                
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Observações adicionais" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/pedidos')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Pedido'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default PedidoForm;
