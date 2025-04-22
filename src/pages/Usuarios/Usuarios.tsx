import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PROFILE_ROLE_MAP = {
  admin: "Administrador",
  prefeito: "Prefeito",
  gestor: "Gestor",
  servidor: "Servidor"
};

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [countGestores, setCountGestores] = useState(0);
  const [countServidores, setCountServidores] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    name: "",
    email: "",
    role: "servidor",
    cpf: "",
    birthdate: "",
    position_title: "",
    setores: [],
    zip_code: "",
    address: "",
    street_number: "",
    district: "",
    city: "",
  });
  const [setores, setSetores] = useState([]);
  const [creating, setCreating] = useState(false);

  const userRole = localStorage.getItem("user-role");

  useEffect(() => {
    carregarUsuarios();
    carregarSetores();
  }, []);

  async function carregarUsuarios() {
    setLoading(true);
    const { data: profiles, error } = await supabase.from("profiles").select("*");
    if (error) {
      setLoading(false);
      toast.error("Erro ao buscar usuários.");
      return;
    }
    setUsuarios(profiles);
    setCountGestores(profiles.filter(u => u.role === "gestor").length);
    setCountServidores(profiles.filter(u => u.role === "servidor").length);
    setLoading(false);
  }

  async function carregarSetores() {
    const { data, error } = await supabase.from("sectors").select("id,name");
    if (!error) setSetores(data);
  }

  function podeCadastrar(role) {
    if (userRole === "admin") return true;
    if (userRole === "prefeito") return role !== "admin" && role !== "prefeito";
    if (userRole === "gestor") return role === "servidor";
    return false;
  }

  function abrirCadastro(role) {
    setNovoUsuario({ 
      name: "", 
      email: "", 
      role, 
      cpf: "",
      birthdate: "",
      position_title: "",
      setores: [],
      zip_code: "",
      address: "",
      street_number: "",
      district: "",
      city: "",
    });
    setShowCadastro(true);
  }

  async function handleSave() {
    setCreating(true);
    if (!novoUsuario.email || !novoUsuario.name) {
      toast.error("Nome e e-mail são obrigatórios!");
      setCreating(false);
      return;
    }
    const { data, error } = await supabase.auth.admin.createUser({
      email: novoUsuario.email,
      email_confirm: false,
      user_metadata: { 
        name: novoUsuario.name, 
        role: novoUsuario.role,
        cpf: novoUsuario.cpf,
        birthdate: novoUsuario.birthdate,
        position_title: novoUsuario.position_title,
        zip_code: novoUsuario.zip_code,
        address: novoUsuario.address,
        street_number: novoUsuario.street_number,
        district: novoUsuario.district,
        city: novoUsuario.city,
      },
    });
    if (error) {
      setCreating(false);
      toast.error("Erro ao criar usuário: " + error.message);
      return;
    }
    if (novoUsuario.role === "servidor" && novoUsuario.setores.length > 0) {
      for (const setorId of novoUsuario.setores) {
        await supabase.from("user_sectors").insert({
          user_id: data.user.id,
          sector_id: setorId,
          is_primary: (setorId === novoUsuario.setores[0])
        });
      }
    }
    toast.success("Novo usuário cadastrado! Um e-mail será enviado ao entrar pela primeira vez.");
    setShowCadastro(false);
    setCreating(false);
    carregarUsuarios();
  }

  const SetoresSelector = () => (
    <div className="mb-2">
      <label className="block text-sm font-semibold mb-1">Secretarias</label>
      <select
        multiple
        className="border rounded px-2 py-2 w-full"
        value={novoUsuario.setores}
        onChange={e =>{
          const selected = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
          setNovoUsuario({...novoUsuario, setores: selected});
        }}
        disabled={novoUsuario.role!=="servidor"}
      >
        {setores.map(s => (
          <option value={s.id} key={s.id}>{s.name}</option>
        ))}
      </select>
      <span className="text-xs text-muted-foreground">
        {novoUsuario.role!=="servidor" ? "Somente servidores necessitam setores" : ""}
      </span>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie todos os usuários: perfis, e-mails e secretarias associadas.
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
                onClick={() => abrirCadastro(roleOpt)}
              >
                Novo {PROFILE_ROLE_MAP[roleOpt]}
              </Button>
            ))}
          </div>
          {showCadastro && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" style={{ backdropFilter: "blur(2px)" }}>
              <div className="bg-white p-8 rounded max-w-md w-full">
                <h2 className="font-bold text-lg mb-2">Novo {PROFILE_ROLE_MAP[novoUsuario.role]}</h2>
                <form
                  onSubmit={e => { e.preventDefault(); handleSave(); }}
                  className="space-y-2"
                >
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Nome</label>
                    <input className="border rounded px-2 py-2 w-full" value={novoUsuario.name} 
                      onChange={e => setNovoUsuario({...novoUsuario, name: e.target.value})} required />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">CPF</label>
                    <input className="border rounded px-2 py-2 w-full" maxLength={11} value={novoUsuario.cpf} 
                      onChange={e => setNovoUsuario({...novoUsuario, cpf: e.target.value.replace(/\D/g, '').substring(0,11)})} required />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Data de nascimento</label>
                    <input className="border rounded px-2 py-2 w-full" type="date"
                      value={novoUsuario.birthdate}
                      onChange={e => setNovoUsuario({...novoUsuario, birthdate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Cargo</label>
                    <input className="border rounded px-2 py-2 w-full" value={novoUsuario.position_title}
                      onChange={e => setNovoUsuario({...novoUsuario, position_title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">E-mail</label>
                    <input type="email" className="border rounded px-2 py-2 w-full" 
                      value={novoUsuario.email} 
                      onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} required />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">CEP</label>
                    <input className="border rounded px-2 py-2 w-full" maxLength={9}
                        value={novoUsuario.zip_code}
                        onChange={e => setNovoUsuario({...novoUsuario, zip_code: e.target.value.replace(/\D/g, '').substring(0, 8)})} 
                        required 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Endereço</label>
                    <input className="border rounded px-2 py-2 w-full"
                      value={novoUsuario.address}
                      onChange={e => setNovoUsuario({...novoUsuario, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Número</label>
                    <input className="border rounded px-2 py-2 w-full" value={novoUsuario.street_number}
                      onChange={e => setNovoUsuario({...novoUsuario, street_number: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Bairro</label>
                    <input className="border rounded px-2 py-2 w-full" value={novoUsuario.district}
                      onChange={e => setNovoUsuario({...novoUsuario, district: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Cidade</label>
                    <input className="border rounded px-2 py-2 w-full" value={novoUsuario.city}
                      onChange={e => setNovoUsuario({...novoUsuario, city: e.target.value})}
                      required
                    />
                  </div>
                  {novoUsuario.role === "servidor" && <SetoresSelector />}
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowCadastro(false)}>Cancelar</Button>
                    <Button type="submit" disabled={creating}>{creating ? "Salvando..." : "Salvar"}</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-6 text-muted-foreground">
                {loading ? "Carregando..." : "Nenhum usuário encontrado."}
              </td>
            </tr>
          )}
          <div className="overflow-x-auto mt-4 rounded border bg-white">
            <table className="min-w-full divide-y divide-blue-100">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nome</th>
                  <th className="px-4 py-2 text-left font-semibold">E-mail</th>
                  <th className="px-4 py-2 text-left">Papel</th>
                  <th className="px-4 py-2 text-left">Secretarias</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, idx) => (
                  <tr key={u.id} className={cn("border-b", idx % 2 === 0 ? "bg-blue-50" : "")}>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email || "-"}</td>
                    <td className="px-4 py-2">{PROFILE_ROLE_MAP[u.role] || u.role}</td>
                    <td className="px-4 py-2">
                      {u.role === "servidor" ? (
                        <SetoresUsuario userId={u.id} />
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function SetoresUsuario({ userId }) {
  const [setores, setSetores] = useState([]);
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("user_sectors")
        .select("sectors(name)")
        .eq("user_id", userId);
      if (!error && data) {
        setSetores(data.map(s => s.sectors?.name).filter(Boolean));
      }
    }
    load();
  }, [userId]);
  return (
    <span>
      {setores.length > 0 ? setores.join(", ") : "—"}
    </span>
  );
}

export default Usuarios;
