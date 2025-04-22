
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TotalSection from "./Form/TotalSection";
import ItemsSection from "./Form/ItemsSection";
import ActionButtons from "./Form/ActionButtons";
import { toast } from "sonner";
import { createDfd } from "@/services/dfdService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export interface PedidoFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const PedidoForm: React.FC<PedidoFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const { user, userMunicipality, userSectors } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dataCompra: initialData?.dataCompra || new Date().toISOString().split("T")[0],
    descricao: initialData?.descricao || "",
    fundoMonetario: initialData?.fundoMonetario || "",
    setor: initialData?.setor || (userSectors?.[0]?.sectors?.id || ""),
    observacoes: initialData?.observacoes || "",
    localEntrega: initialData?.localEntrega || "",
  });

  const [itens, setItens] = useState(
    initialData?.itens || [
      { id: crypto.randomUUID(), nome: "", quantidade: 1, valorUnitario: 0, valorTotal: 0 }
    ]
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarItem = () => {
    setItens([
      ...itens,
      { id: crypto.randomUUID(), nome: "", quantidade: 1, valorUnitario: 0, valorTotal: 0 }
    ]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      const novosItens = [...itens];
      novosItens.splice(index, 1);
      setItens(novosItens);
    }
  };

  const atualizarItem = (index: number, campo: string, valor: string | number) => {
    const novosItens = [...itens];
    novosItens[index] = {
      ...novosItens[index],
      [campo]: valor
    };

    // Recalcular valor total
    if (campo === "quantidade" || campo === "valorUnitario") {
      novosItens[index].valorTotal =
        Number(novosItens[index].quantidade) * Number(novosItens[index].valorUnitario);
    }

    setItens(novosItens);
  };

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + (item.valorTotal || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMunicipality) {
      toast.error("Nenhum município selecionado");
      return;
    }
    
    // Validate form data
    if (formData.setor === "") {
      toast.error("Selecione um setor");
      return;
    }
    
    if (formData.fundoMonetario === "") {
      toast.error("Informe o fundo monetário");
      return;
    }
    
    // Validate items
    const isItemsValid = itens.every(item => 
      item.nome.trim() !== "" && 
      item.quantidade > 0 &&
      item.valorUnitario > 0
    );
    
    if (!isItemsValid) {
      toast.error("Verifique os itens. Todos precisam ter nome, quantidade e valor.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dfdData = {
        description: formData.descricao,
        purchase_date: formData.dataCompra,
        sector_id: formData.setor,
        total_value: calcularValorTotal(),
        status: "Pendente",
        monetary_fund: formData.fundoMonetario,
        requester_id: user?.id,
        observations: formData.observacoes,
        delivery_location: formData.localEntrega,
        municipality_id: userMunicipality.id
      };
      
      if (onSubmit) {
        onSubmit({
          ...dfdData,
          items: itens
        });
      } else {
        // Create new DFD directly
        const { success, data } = await createDfd(dfdData, itens);
        
        if (success) {
          toast.success("DFD cadastrada com sucesso!");
          navigate("/pedidos");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar DFD:", error);
      toast.error("Erro ao cadastrar DFD. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/pedidos");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataCompra">Data da Compra</Label>
                    <Input
                      id="dataCompra"
                      name="dataCompra"
                      type="date"
                      value={formData.dataCompra}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setor">Setor / Secretaria</Label>
                    <Select
                      value={formData.setor}
                      onValueChange={(value) => handleSelectChange("setor", value)}
                      required
                    >
                      <SelectTrigger id="setor">
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {userSectors?.map((sectorItem) => (
                          <SelectItem key={sectorItem.sector_id} value={sectorItem.sector_id}>
                            {sectorItem.sectors.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição da Demanda</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    placeholder="Descreva o propósito desta compra"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fundoMonetario">Fundo Monetário</Label>
                    <Input
                      id="fundoMonetario"
                      name="fundoMonetario"
                      value={formData.fundoMonetario}
                      onChange={handleInputChange}
                      placeholder="Ex: Fundo Municipal de Saúde"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localEntrega">Local de Entrega</Label>
                    <Input
                      id="localEntrega"
                      name="localEntrega"
                      value={formData.localEntrega}
                      onChange={handleInputChange}
                      placeholder="Local de entrega dos itens"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Alguma observação adicional? (opcional)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <ItemsSection
              itens={itens}
              atualizarItem={atualizarItem}
              adicionarItem={adicionarItem}
              removerItem={removerItem}
            />
          </div>
        </div>

        <div>
          <TotalSection valorTotal={calcularValorTotal()} />

          <ActionButtons
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        </div>
      </div>
    </form>
  );
};

export default PedidoForm;
