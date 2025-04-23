
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PedidoCompra, Item } from '@/types';
import { v4 as uuidv4 } from 'uuid';

import { adicionarPedido } from '@/data/mockData';
import { initializeWorkflow } from '@/utils/workflowHelpers';
import ActionButtons from './Form/ActionButtons';
import ItemsSection from './Form/ItemsSection';
import TotalSection from './Form/TotalSection';

const fundosMonetarios = [
  'Fundo Municipal de Saúde',
  'Fundo Municipal de Educação',
  'Fundo Municipal de Assistência Social',
  'Fundo Municipal de Meio Ambiente',
  'Recursos Próprios',
  'Recursos Federais',
  'Recursos Estaduais'
];

const secretarias = [
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

const PedidoForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<any>({});
  const [itens, setItens] = useState<Item[]>([
    { id: uuidv4(), nome: '', quantidade: 1, valor_unitario: 0, valor_total: 0, pedido_id: '' }
  ]);

  const form = useForm({
    defaultValues: {
      dataCompra: new Date().toISOString().split('T')[0],
      setor: '',
      fundoMonetario: '',
      responsavel: '',
      justificativa: '',
      descricao: '',
      localEntrega: '',
      valorEstimado: ''
    },
    resolver: zodResolver(
      currentStep === 1
        ? firstStepSchema
        : secondStepSchema
    ),
  });

  const adicionarItem = () => {
    setItens([
      ...itens,
      { id: uuidv4(), nome: '', quantidade: 1, valor_unitario: 0, valor_total: 0, pedido_id: '' },
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

    if (campo === 'quantidade' || campo === 'valor_unitario') {
      novosItens[index].valor_total =
        Number(novosItens[index].quantidade) * Number(novosItens[index].valor_unitario);
    }

    setItens(novosItens);
  };

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + (item.valor_total || 0), 0);
  };

  const total = calcularValorTotal();

  const handleNextStep = async () => {
    const isValid = await form.trigger([
      'setor',
      'fundoMonetario', 
      'responsavel', 
      'justificativa', 
      'dataCompra', 
      'descricao'
    ]);
    
    if (!isValid) return;
    
    const hasEmptyItems = itens.some(item => !item.nome);
    if (hasEmptyItems) {
      toast.error('Preencha todos os itens antes de continuar.');
      return;
    }
    
    const step1Data = form.getValues();
    setFormData({ ...step1Data, itens });
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (data: any) => {
    try {
      const combinedData = {
        ...formData,
        localEntrega: data.localEntrega,
        valorEstimado: parseFloat(data.valorEstimado) || total,
      };

      const novoPedido: PedidoCompra = {
        id: uuidv4(),
        descricao: combinedData.descricao,
        justificativa: combinedData.justificativa,
        data_compra: new Date(combinedData.dataCompra),
        setor_id: combinedData.setor,
        setor: combinedData.setor,
        solicitante: combinedData.responsavel,
        valor_total: combinedData.valorEstimado || total,
        itens: itens.map(item => ({
          ...item,
          valor_total: item.quantidade * item.valor_unitario
        })),
        status: 'Pendente',
        fundo_monetario: combinedData.fundoMonetario,
        created_at: new Date(),
        observacoes: '',
        workflow: initializeWorkflow(),
        local_entrega: combinedData.localEntrega
      };

      const pedidoAdicionado = adicionarPedido(novoPedido);
      toast.success('DFD cadastrada com sucesso! A DFD já está disponível na página da secretaria e nos relatórios do sistema.');
      navigate(`/pedidos/${pedidoAdicionado.id}`);
    } catch (error) {
      console.error('Erro ao submeter o formulário:', error);
      toast.error('Erro ao cadastrar DFD. Tente novamente.');
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={
          currentStep === 1 
            ? (e) => { e.preventDefault(); handleNextStep(); }
            : form.handleSubmit(handleSubmit)
        } className="space-y-6">
          {currentStep === 1 ? (
            <>
              <h2 className="text-lg font-semibold">Informações Básicas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="setor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identificação do Requisitante (Secretaria)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a secretaria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {secretarias.map(secretaria => (
                            <SelectItem key={secretaria} value={secretaria}>
                              {secretaria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fundoMonetario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade Administrativa Requisitante (Fundo)</FormLabel>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável pela solicitação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <FormField
                control={form.control}
                name="justificativa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justificativa da Necessidade</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Justifique a necessidade deste pedido..."
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
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Pedido</FormLabel>
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

              <ItemsSection
                items={itens}
                onAddItem={adicionarItem}
                onRemoveItem={removerItem}
                onUpdateItem={atualizarItem}
              />

              <div className="flex justify-end space-x-4">
                <button 
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                >
                  Próxima Etapa
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Informações Complementares</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="valorEstimado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimativa de Valor</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder={`Valor sugerido: ${total.toFixed(2)}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localEntrega"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local de Entrega</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo para entrega" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <TotalSection total={total} />

              <div className="flex justify-between">
                <button
                  type="button"
                  className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md"
                  onClick={handlePreviousStep}
                >
                  Voltar
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
                >
                  Finalizar Cadastro
                </button>
              </div>
            </>
          )}
        </form>
      </Form>
    </Card>
  );
};

import * as z from 'zod';

const firstStepSchema = z.object({
  dataCompra: z.string().nonempty('Data do pedido é obrigatória'),
  setor: z.string().nonempty('Secretaria solicitante é obrigatória'),
  fundoMonetario: z.string().nonempty('Fundo monetário é obrigatório'),
  responsavel: z.string().nonempty('Nome do responsável é obrigatório'),
  descricao: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  justificativa: z.string().min(5, 'Justificativa deve ter pelo menos 5 caracteres'),
});

const secondStepSchema = z.object({
  valorEstimado: z.string().optional(),
  localEntrega: z.string().nonempty('Local de entrega é obrigatório'),
});

export default PedidoForm;
