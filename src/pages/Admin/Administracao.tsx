
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, Database } from "lucide-react";

const Administracao = () => {
 return (
  <div className="p-6 space-y-6">
   <Card>
    <CardHeader className="flex flex-row items-center gap-2">
     <Building2 className="h-5 w-5 text-blue-600" />
     <CardTitle>Administração Municipal</CardTitle>
    </CardHeader>
    <CardContent>
     <ul className="list-disc list-inside text-blue-800">
      <li>Gerencie municípios cadastrados</li>
      <li>Administre usuários do sistema</li>
      <li>Acesse e edite toda a base de dados relacionada ao município</li>
      <li>Funções avançadas de auditoria (em breve)</li>
     </ul>
    </CardContent>
   </Card>
   <Card>
    <CardHeader className="flex flex-row items-center gap-2">
     <Database className="h-5 w-5 text-blue-600" />
     <CardTitle>Base de Dados</CardTitle>
    </CardHeader>
    <CardContent>
     <span className="text-blue-800">
      Aqui você pode administrar dados sensíveis de gestão municipal.
      <br />
      <b>Funções de edição e exclusão em breve.</b>
     </span>
    </CardContent>
   </Card>
  </div>
 );
};

export default Administracao;
