
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Item, PedidoStatus } from '@/types';
import ItemsSection from './Form/ItemsSection';
import TotalSection from './Form/TotalSection';
import ActionButtons from './Form/ActionButtons';
import { usePedidoForm } from './Form/usePedidoForm';
import { setorService, funcionarioService } from '@/services/supabase';

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
  observacoes: z.string().optional(),
  solicitante_id: z.string().optional(),
  local_entrega: z.string().optional(),
  justificativa: z.string().optional(),
});

export type PedidoFormValues = z.infer<typeof pedidoSchema>;

const PedidoForm: React.FC = () => {
  const navigate = useNavigate();
  const [setores, setSetores] = useState<{ id: string; nome: string; municipio_id: string }[]>([]);
  const [funcionarios, setFuncionarios] = useState<{ id: string; nome: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    form,
    itens,
    adicionarItem,
    removerItem,
    atualizarItem,
    calcularValorTotal,
    onSubmit,
  } = usePedidoForm();

  useEffect(() => {
    const fetchSetores = async () => {
      try {
        const data = await setorService.getAll();
        setSetores(data);
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    };

    const fetchFuncionarios = async () => {
      try {
        const data = await funcionarioService.getAll();
        setFuncionarios(data.map(f => ({ id: f.id, nome: f.nome })));
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };

    fetchSetores();
    fetchFuncionarios();
  }, []);

  const handleSetorChange = (setorId: string) => {
    const setor = setores.find(s => s.id === setorId);
    
    if (setor) {
      form.setValue('setor_id', setorId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva o pedido" {...field} />
                </FormControl>
                <FormDescription>
                  Descreva detalhadamente a necessidade da demanda.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_compra"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Compra</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString());
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2000-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data em que a compra foi realizada.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fundo_monetario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fundo Monetário</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fundo monetário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fundo Rotativo">Fundo Rotativo</SelectItem>
                    <SelectItem value="Fundo Administrativo">Fundo Administrativo</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione o fundo monetário utilizado na compra.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="setor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSetorChange(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {setores.map(setor => (
                      <SelectItem key={setor.id} value={setor.id}>{setor.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione o setor responsável pela compra.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="solicitante_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitante</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o solicitante" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {funcionarios.map(funcionario => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>{funcionario.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione o solicitante da compra.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="local_entrega"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local de Entrega</FormLabel>
                <FormControl>
                  <Input placeholder="Informe o local de entrega" {...field} />
                </FormControl>
                <FormDescription>
                  Informe o local de entrega dos produtos.
                </FormDescription>
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
              <FormLabel>Justificativa</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Justifique a necessidade da compra"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Justifique a necessidade da compra.
              </FormDescription>
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

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione alguma observação"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Adicione alguma observação relevante sobre o pedido.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <TotalSection total={calcularValorTotal()} />
        <ActionButtons isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default PedidoForm;
