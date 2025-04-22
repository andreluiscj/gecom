import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Building } from "lucide-react";  // Use Building2 or Building
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MunicipiosAdmin = () => {
 const [municipalities, setMunicipalities] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showForm, setShowForm] = useState(false);
 const [form, setForm] = useState({
  name: "",
  state: "",
  population: "",
  mayor: "",
  logo: "",
  budget: "",
 });

 const loadMunicipalities = async () => {
  setLoading(true);
  const { data, error } = await supabase.from("municipalities").select("*").order('name', {ascending:true});
  if (!error) setMunicipalities(data);
  setLoading(false);
 };

 useEffect(() => {
  loadMunicipalities();
 }, []);

 const handleCreate = async (e) => {
  e.preventDefault();

  if (!form.name || !form.state || !form.population || !form.mayor || !form.budget) {
   toast.error("Preencha todos os campos obrigatórios.");
   return;
  }

  const { data, error } = await supabase.from("municipalities").insert({
   name: form.name,
   state: form.state,
   population: Number(form.population),
   mayor: form.mayor,
   logo: form.logo || null,
   budget: Number(form.budget),
  });

  if (error) {
   toast.error("Erro: " + error.message);
   return;
  }

  toast.success("Município cadastrado com sucesso!");
  setShowForm(false);
  setForm({
   name: "",
   state: "",
   population: "",
   mayor: "",
   logo: "",
   budget: "",
  });
  loadMunicipalities(); // atualiza
 };

 return (
  <div className="p-6 space-y-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Municípios Cadastrados</h2>
    <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white">
     <Plus className="w-4 h-4" />
     Cadastrar novo Município
    </Button>
   </div>
   {loading ? (
    <div>Carregando municípios...</div>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     {municipalities.map((m) => (
      <Card key={m.id}>
       <CardHeader className="flex flex-row items-center gap-2">
        <Building className="h-5 w-5 text-blue-600" />
        <CardTitle>{m.name}</CardTitle>
       </CardHeader>
       <CardContent>
        <div className="space-y-2">
         <div>Estado: <b>{m.state}</b></div>
         <div>População: <b>{m.population?.toLocaleString() || 'N/I'}</b></div>
         <div>Prefeito(a): <b>{m.mayor || "-"}</b></div>
         <div>Orçamento: <b>R${m.budget?.toLocaleString() || "0,00"}</b></div>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   )}

   {/* Modal simples para criar município */}
   {showForm && (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" style={{ backdropFilter: "blur(2px)" }}>
     <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
       <Building className="w-5 h-5 text-blue-700" />
       Cadastrar novo Município
      </h3>
      <form className="space-y-3" onSubmit={handleCreate}>
       <div>
        <label className="block text-sm mb-1 font-semibold">Nome</label>
        <input className="border rounded px-3 py-2 w-full" required value={form.name} onChange={e=>setForm({...form,name: e.target.value})}/>
       </div>
       <div>
        <label className="block text-sm mb-1 font-semibold">Estado</label>
        <input className="border rounded px-3 py-2 w-full" required value={form.state} onChange={e=>setForm({...form,state: e.target.value})}/>
       </div>
       <div>
        <label className="block text-sm mb-1 font-semibold">População</label>
        <input className="border rounded px-3 py-2 w-full" required type="number" min="1" value={form.population} onChange={e=>setForm({...form,population: e.target.value})}/>
       </div>
       <div>
        <label className="block text-sm mb-1 font-semibold">Prefeito(a)</label>
        <input className="border rounded px-3 py-2 w-full" required value={form.mayor} onChange={e=>setForm({...form,mayor: e.target.value})}/>
       </div>
       <div>
        <label className="block text-sm mb-1 font-semibold">Orçamento</label>
        <input className="border rounded px-3 py-2 w-full" required type="number" min="0" value={form.budget} onChange={e=>setForm({...form,budget: e.target.value})}/>
       </div>
       <div>
        <label className="block text-sm mb-1 font-semibold">Logo&nbsp;<span className="text-xs text-muted-foreground">(URL, opcional)</span></label>
        <input className="border rounded px-3 py-2 w-full" value={form.logo} onChange={e=>setForm({...form,logo: e.target.value})}/>
       </div>
       <div className="flex gap-2 mt-4 justify-end">
        <Button variant="outline" onClick={e => {e.preventDefault();setShowForm(false);}}>Cancelar</Button>
        <Button type="submit" className="bg-blue-600 text-white">Salvar</Button>
       </div>
      </form>
     </div>
    </div>
   )}
  </div>
 );
};

export default MunicipiosAdmin;
