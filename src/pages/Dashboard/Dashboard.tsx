
// Painel de Gestão atualizado: exibe perfis (usuários) e informações detalhadas do banco de dados

import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, User, Building2 } from "lucide-react";

const Dashboard = () => {
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [profiles, setProfiles] = useState([]);
 const [municipality, setMunicipality] = useState(null);

 useEffect(() => {
  async function fetchData() {
   setLoading(true);
   try {
    // pelo menos um município como referência
    const municipioId = JSON.parse(localStorage.getItem("municipio-selecionado") || "{}")?.id || null;

    // Busca profiles e município do usuário
    const [{ data: profilesData, error: profilesError }, { data: municipalityData, error: municipalityError }] = await Promise.all([
     supabase.from("profiles").select("*"),
     municipioId
      ? supabase.from("municipalities").select("*").eq("id", municipioId).single()
      : { data: null, error: null }
    ]);

    if (profilesError) throw profilesError;
    if (municipalityError) throw municipalityError;

    setProfiles(profilesData || []);
    setMunicipality(municipalityData || null);
    setError(null);
   } catch (err) {
    setError("Falha ao carregar os dados do painel");
   } finally {
    setLoading(false);
   }
  }
  fetchData();
 }, []);

 if (loading) {
  return (
   <div className="p-6 space-y-6">
    <h2 className="text-2xl font-bold">Painel de Gestão</h2>
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
   </div>
  );
 }

 if (error) {
  return (
   <div className="p-6">
    <Alert variant="destructive">
     <AlertCircle className="h-4 w-4" />
     <AlertTitle>Erro</AlertTitle>
     <AlertDescription>
      {error}. Recarregue a página ou contate o suporte.
     </AlertDescription>
    </Alert>
   </div>
  );
 }

 return (
  <div className="p-6 space-y-6">
   <h2 className="text-2xl font-bold mb-6">Painel de Gestão</h2>

   {municipality && (
    <Card className="mb-4">
     <CardHeader>
      <div className="flex items-center gap-3">
       <Building2 className="h-5 w-5 text-blue-600" />
       <div>
        <CardTitle>{municipality.name}</CardTitle>
        <CardDescription>{municipality.state} — População: {municipality.population || 'N/I'}</CardDescription>
       </div>
      </div>
     </CardHeader>
     <CardContent>
      <span>Prefeito(a): {municipality.mayor || '-'}</span>
     </CardContent>
    </Card>
   )}

   <Card>
    <CardHeader>
     <div className="flex items-center gap-3">
      <User className="h-5 w-5 text-blue-600" />
      <CardTitle>Usuários do Município</CardTitle>
     </div>
    </CardHeader>
    <CardContent>
     <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-100">
       <thead>
        <tr>
         <th className="px-3 py-2 text-left font-semibold">Nome</th>
         <th className="px-3 py-2 text-left font-semibold">CPF</th>
         <th className="px-3 py-2 text-left font-semibold">E-mail</th>
         <th className="px-3 py-2 text-left font-semibold">Data de Nascimento</th>
         <th className="px-3 py-2 text-left font-semibold">Cargo</th>
         <th className="px-3 py-2 text-left font-semibold">Secretaria(s)</th>
         <th className="px-3 py-2 text-left font-semibold">CEP</th>
         <th className="px-3 py-2 text-left font-semibold">Endereço</th>
         <th className="px-3 py-2 text-left font-semibold">Número</th>
         <th className="px-3 py-2 text-left font-semibold">Bairro</th>
        </tr>
       </thead>
       <tbody>
        {profiles.map((u, idx) => (
         <tr key={u.id} className={idx % 2 === 0 ? "bg-blue-50" : ""}>
          <td className="px-3 py-2">{u.name}</td>
          <td className="px-3 py-2">{u.cpf}</td>
          <td className="px-3 py-2">{u.email || "-"}</td>
          <td className="px-3 py-2">{u.birthdate ? new Date(u.birthdate).toLocaleDateString() : "-"}</td>
          <td className="px-3 py-2 capitalize">{u.role || "-"}</td>
          <td className="px-3 py-2">
           {/* Secretaria(s): chama setores relacionados ao usuário */}
           <UserSectorsDisplay userId={u.id} />
          </td>
          <td className="px-3 py-2">{u.zip_code}</td>
          <td className="px-3 py-2">{u.address}</td>
          <td className="px-3 py-2">{u.street_number || '-'}</td>
          <td className="px-3 py-2">{u.district}</td>
         </tr>
        ))}
        {profiles.length === 0 && (
         <tr>
          <td colSpan={10} className="text-center py-6 text-muted-foreground">Nenhum usuário encontrado.</td>
         </tr>
        )}
       </tbody>
      </table>
     </div>
    </CardContent>
   </Card>
  </div>
 );
};

// Mostra as secretarias do usuário (setores vinculados)
function UserSectorsDisplay({ userId }) {
 const [sectors, setSectors] = React.useState([]);
 React.useEffect(() => {
  async function load() {
   const { data, error } = await supabase
    .from("user_sectors")
    .select("sectors(name)")
    .eq("user_id", userId);
   if (!error && data) setSectors(data.map(s => s.sectors?.name).filter(Boolean));
  };
  load();
 }, [userId]);
 return <span>{sectors.length > 0 ? sectors.join(", ") : "—"}</span>;
}

export default Dashboard;
