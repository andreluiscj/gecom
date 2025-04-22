
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createMunicipality } from "@/services/municipalityService";
import { Building2, ArrowLeft } from "lucide-react";

const MunicipioForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    population: "",
    budget: "",
    mayor: "",
    logo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.state) {
      toast.error("Nome e Estado são campos obrigatórios");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data for API
      const municipalityData = {
        name: formData.name,
        state: formData.state,
        population: formData.population ? parseInt(formData.population, 10) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        mayor: formData.mayor || null,
        logo: formData.logo || null
      };
      
      const result = await createMunicipality(municipalityData);
      
      if (result.success) {
        toast.success("Município cadastrado com sucesso!");
        navigate("/admin/municipios");
      } else {
        toast.error("Erro ao cadastrar município: " + (result.error?.message || "Erro desconhecido"));
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro ao cadastrar o município: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/municipios")}
        className="mb-4 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <CardTitle>Cadastrar Novo Município</CardTitle>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Município*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: São Paulo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado*</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Ex: SP"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="population">População</Label>
                <Input
                  id="population"
                  name="population"
                  type="number"
                  value={formData.population}
                  onChange={handleInputChange}
                  placeholder="Ex: 12000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento Anual (R$)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Ex: 1000000.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mayor">Nome do Prefeito</Label>
                <Input
                  id="mayor"
                  name="mayor"
                  value={formData.mayor}
                  onChange={handleInputChange}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">URL do Logo (opcional)</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar Município"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MunicipioForm;
