
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const MunicipioNovo = () => {
  const [form, setForm] = useState({
    name: '',
    state: '',
    population: '',
    budget: '',
    mayor: '',
    logo: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Campos obrigatórios: name, state
    if (!form.name || !form.state) {
      toast.error("Preencha todos os campos obrigatórios!");
      setLoading(false);
      return;
    }
    // Registrar município no banco
    const { error, data } = await supabase.from('municipalities').insert([{
      name: form.name,
      state: form.state,
      population: form.population ? Number(form.population) : null,
      budget: form.budget ? Number(form.budget) : null,
      mayor: form.mayor,
      logo: form.logo
    }]);
    if (error) {
      toast.error("Erro ao cadastrar município: " + error.message);
    } else {
      toast.success("Município cadastrado com sucesso!");
      navigate('/admin/municipios');
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar novo Município</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="name" placeholder="Nome do município *" value={form.name} onChange={handleChange} required/>
            <Input name="state" placeholder="Estado *" value={form.state} onChange={handleChange} required/>
            <Input name="population" placeholder="População" value={form.population} onChange={handleChange} type="number" />
            <Input name="budget" placeholder="Orçamento anual (R$)" value={form.budget} onChange={handleChange} type="number"/>
            <Input name="mayor" placeholder="Nome do prefeito" value={form.mayor} onChange={handleChange}/>
            <Input name="logo" placeholder="URL do logo" value={form.logo} onChange={handleChange} />
            <Button className="w-full bg-blue-600 text-white" type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Salvar município"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
};

export default MunicipioNovo;
