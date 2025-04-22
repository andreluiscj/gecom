
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { canAccessUserManagement, getUserRole } from "@/utils/authHelpers";

const PROFILE_ROLE_MAP = {
  admin: "Administrador",
  prefeito: "Prefeito",
  gestor: "Gestor",
  servidor: "Servidor",
};

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [countGestores, setCountGestores] = useState(0);
  const [countServidores, setCountServidores] = useState(0);
  const [loading, setLoading] = useState(false);

  // Decide quem pode cadastrar quem
  const userRole = getUserRole();

  useEffect(() => {
    if (!canAccessUserManagement() && userRole !== "gestor") {
      toast.error("Você não tem permissão para acessar esta página.");
      navigate("/dashboard");
      return;
    }
    carregarUsuarios();
    // eslint-disable-next-line
  }, []);

  async function carregarUsuarios() {
    setLoading(true);
    // Pega perfis dos usuários
    const { data: profiles, error: profError } = await supabase
      .from("profiles")
      .select("*");
    if (profError) {
      setLoading(false);
      toast.error("Erro ao buscar perfis.");
      return;
    }
    
    // Como não temos a tabela 'user_roles', vamos usar o campo 'role' direto da tabela profiles
    // Junta as informações
    const usuariosList = profiles.map(profile => {
      return {
        ...profile,
        papel: profile.role || "servidor"
      };
    });

    // Contagem: exclui admin e prefeito dos contadores se não for admin
    setUsuarios(usuariosList);
    setCountGestores(
      usuariosList.filter(u => u.papel === "gestor").length
    );
    setCountServidores(
      usuariosList.filter(u => u.papel === "servidor").length
    );
    setLoading(false);
  }

  // Quem pode cadastrar qual papel
  const podeCadastrar = (role: string) => {
    if (userRole === "admin") return true;
    if (userRole === "prefeito") return role !== "admin" && role !== "prefeito";
    if (userRole === "gestor") return role === "servidor";
    return false;
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie todos os usuários: perfis de gestor, servidor e prefeito.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="flex flex-row items-center gap-3 bg-blue-100">
              <div className="bg-blue-500 text-white rounded-full p-3 flex items-center justify-center mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg font-bold">
                  {countGestores}
                </span>
                <p className="text-sm text-muted-foreground">Gestores Cadastrados</p>
              </div>
            </Card>
            <Card className="flex flex-row items-center gap-3 bg-blue-100">
              <div className="bg-blue-500 text-white rounded-full p-3 flex items-center justify-center mr-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg font-bold">
                  {countServidores}
                </span>
                <p className="text-sm text-muted-foreground">Servidores Cadastrados</p>
              </div>
            </Card>
          </div>
          <div className="flex justify-end mb-4">
            {["prefeito", "gestor", "servidor"].filter(role => podeCadastrar(role)).map(roleOpt => (
              <Button 
                key={roleOpt} 
                className="ml-2 bg-blue-600 text-white"
                onClick={() => toast.info(`Funcionalidade de cadastro de ${PROFILE_ROLE_MAP[roleOpt]} ainda não implementada.`)}
              >
                Novo {PROFILE_ROLE_MAP[roleOpt]}
              </Button>
            ))}
          </div>
          <div className="overflow-x-auto mt-4 rounded border bg-white">
            <table className="min-w-full divide-y divide-blue-100">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left">Cargo</th>
                  <th className="px-4 py-2 text-left">Setor</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, idx) => (
                  <tr key={u.id} className={cn("border-b", idx % 2 === 0 ? "bg-blue-50" : "")}>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email || "-"}</td>
                    <td className="px-4 py-2">{u.cargo || "-"}</td>
                    <td className="px-4 py-2">{u.setor || "-"}</td>
                    <td className="px-4 py-2">
                      {PROFILE_ROLE_MAP[u.papel] || u.papel}
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-muted-foreground">
                      {loading ? "Carregando..." : "Nenhum usuário encontrado."}
                    </td>
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

export default Usuarios;
