
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PedidoCompra } from '@/types';
import { v4 as uuidv4 } from 'uuid';

import { usePedidoForm } from './Form/usePedidoForm';
import ActionButtons from './Form/ActionButtons';
import ItemsSection from './Form/ItemsSection';
import TotalSection from './Form/TotalSection';
import { adicionarPedido } from '@/data/mockData';
import { initializeWorkflow } from '@/utils/workflowHelpers';

// Array of monetary funds
const fundosMonetarios = [
  'Fundo Municipal de Saúde',
  'Fundo Municipal de Educação',
  'Fundo Municipal de Assistência Social',
  'Fundo Municipal de Meio Ambiente',
  'Recursos Próprios',
  'Recursos Federais',
  'Recursos Estaduais'
];

const PedidoForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    form,
    itens,
    adicionarItem,
    removerItem,
    atualizarItem,
    calcularValorTotal,
    onSubmit,
  } = usePedidoForm();

  const total = calcularValorTotal();

  const handleSubmit = async (data: any) => {
    try {
      const novoPedido: PedidoCompra = {
        id: uuidv4(),
        descricao: data.descricao,
        justificativa: data.justificativa,
        dataCompra: new Date(),
        setor: data.setor,
        solicitante: data.solicitante,
        valorTotal: total,
        itens: itens.map(item => ({
          ...item,
          valorTotal: item.quantidade * item.valorUnitario
        })),
        status: 'Pendente',
        fundoMonetario: data.fundoMonetario || `Fundo Municipal de ${data.setor}`,
        createdAt: new Date(),
        observacoes: data.observacoes || '',
        workflow: initializeWorkflow(),
      };

      const pedidoAdicionado = adicionarPedido(novoPedido);

      toast.success('DFD cadastrada com sucesso!');
      navigate(`/pedidos/workflow/${pedidoAdicionado.id}`);
    } catch (error) {
      console.error('Erro ao submeter o formulário:', error);
      toast.error('Erro ao cadastrar DFD. Tente novamente.');
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

          <ItemsSection
            items={itens}
            onAddItem={adicionarItem}
            onRemoveItem={removerItem}
            onUpdateItem={atualizarItem}
          />

          <TotalSection total={total} />

          <ActionButtons />
        </form>
      </Form>
    </Card>
  );
};

export default PedidoForm;
