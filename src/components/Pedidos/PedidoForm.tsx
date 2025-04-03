
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fundosMonetarios } from '@/data/mockData';
import { usePedidoForm } from './Form/usePedidoForm';
import ItemsSection from './Form/ItemsSection';
import TotalSection from './Form/TotalSection';
import ActionButtons from './Form/ActionButtons';
import DfdPreview from './Form/DfdPreview';

const PedidoForm: React.FC = () => {
  const {
    form,
    itens,
    adicionarItem,
    removerItem,
    atualizarItem,
    calcularValorTotal,
    onSubmit,
    isPreviewOpen,
    setIsPreviewOpen,
    handlePreview
  } = usePedidoForm();

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

            <ItemsSection
              items={itens}
              onAddItem={adicionarItem}
              onRemoveItem={removerItem}
              onUpdateItem={atualizarItem}
            />

            <TotalSection 
              total={calcularValorTotal()} 
              onPreview={handlePreview}
            />

            <ActionButtons 
              onPreview={handlePreview}
            />

            <DfdPreview
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              dataCompra={form.getValues().dataCompra}
              descricao={form.getValues().descricao}
              fundoMonetario={form.getValues().fundoMonetario}
              setor={form.getValues().setor}
              itens={itens}
              total={calcularValorTotal()}
              onConfirm={form.handleSubmit(onSubmit)}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PedidoForm;
