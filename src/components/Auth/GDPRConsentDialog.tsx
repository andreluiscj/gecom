
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface GDPRConsentDialogProps {
  open: boolean;
  onClose: () => void;
}

const GDPRConsentDialog: React.FC<GDPRConsentDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Política de Privacidade e Cookies</DialogTitle>
          <DialogDescription>
            Leia com atenção nossa política de privacidade e cookies.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-semibold text-base mb-2">1. Informações Coletadas</h3>
            <p>
              Coletamos informações necessárias para o funcionamento do sistema GECOM, 
              incluindo dados pessoais como nome, email e cargo, além de informações 
              sobre o uso do sistema.
            </p>
          </section>
          
          <section>
            <h3 className="font-semibold text-base mb-2">2. Uso das Informações</h3>
            <p>
              Utilizamos seus dados para gerenciar o sistema de compras públicas, 
              incluindo autenticação, autorização e auditoria de operações realizadas.
              Seus dados serão armazenados somente durante o período necessário para 
              cumprir as finalidades para as quais foram coletados.
            </p>
          </section>
          
          <section>
            <h3 className="font-semibold text-base mb-2">3. Cookies</h3>
            <p>
              Utilizamos cookies para manter sua sessão ativa e armazenar preferências 
              de uso. Cookies são pequenos arquivos que seu navegador armazena em seu 
              dispositivo para melhorar sua experiência.
            </p>
          </section>
          
          <section>
            <h3 className="font-semibold text-base mb-2">4. Direitos do Usuário</h3>
            <p>
              Você tem direito a acessar, corrigir, portar, eliminar seus dados, além 
              de revogar o consentimento a qualquer momento, conforme previsto na 
              Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Entendi e Concordo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentDialog;
