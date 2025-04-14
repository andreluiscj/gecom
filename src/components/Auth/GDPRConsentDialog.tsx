
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

interface GDPRConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onOpenChange: (open: boolean) => void;
}

export function GDPRConsentDialog({
  open,
  onAccept,
  onOpenChange,
}: GDPRConsentDialogProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Termos de Uso e Política de Privacidade</DialogTitle>
          <DialogDescription>
            Para continuar utilizando o GECOM, é necessário aceitar os termos de uso e política de privacidade.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <h3 className="font-medium text-lg">Termos de Uso</h3>
          <div className="text-sm text-muted-foreground space-y-2 bg-muted/20 p-4 rounded-md max-h-[200px] overflow-y-auto">
            <p>
              Ao utilizar o GECOM - Sistema de Gerenciamento de Compras Públicas, você concorda
              com os seguintes termos e condições:
            </p>
            <p>
              1. O sistema deve ser utilizado apenas para fins de gerenciamento de compras
              públicas municipais, de acordo com a legislação vigente.
            </p>
            <p>
              2. Todas as ações realizadas no sistema são registradas e monitoradas para
              fins de auditoria e transparência.
            </p>
            <p>
              3. O usuário é responsável por manter suas credenciais de acesso em sigilo
              e não compartilhá-las com terceiros.
            </p>
            <p>
              4. O uso indevido do sistema pode resultar em responsabilização administrativa,
              civil e criminal, conforme aplicável.
            </p>
            <p>
              5. O sistema é propriedade do município e deve ser utilizado apenas por
              funcionários autorizados.
            </p>
          </div>

          <Separator />

          <h3 className="font-medium text-lg">Política de Privacidade</h3>
          <div className="text-sm text-muted-foreground space-y-2 bg-muted/20 p-4 rounded-md max-h-[200px] overflow-y-auto">
            <p>
              A sua privacidade é importante para nós. Esta política de privacidade
              descreve como coletamos, usamos e compartilhamos suas informações:
            </p>
            <p>
              1. Dados Coletados: Coletamos informações pessoais como nome, cargo,
              setor, email institucional e informações de login.
            </p>
            <p>
              2. Uso dos Dados: Utilizamos seus dados para autenticação, auditoria de
              ações no sistema, notificações relacionadas a processos de compras e relatórios
              administrativos.
            </p>
            <p>
              3. Compartilhamento: Seus dados podem ser compartilhados com outros setores
              da administração municipal envolvidos nos processos de compras.
            </p>
            <p>
              4. Segurança: Implementamos medidas técnicas e organizacionais para proteger
              suas informações contra acesso não autorizado ou alteração.
            </p>
            <p>
              5. Direitos: Você tem o direito de acessar, corrigir e atualizar seus dados
              pessoais conforme necessário.
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              Eu li e concordo com os Termos de Uso e Política de Privacidade
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} disabled={!accepted}>
            Aceitar e Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
