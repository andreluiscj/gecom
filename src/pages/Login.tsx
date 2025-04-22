
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import GecomLogo from "@/assets/GecomLogo";
import { supabase } from "@/integrations/supabase/client";
import { ForgotPasswordDialog } from "@/components/Auth/ForgotPasswordDialog";
import { PasswordChangeDialog } from "@/components/Auth/PasswordChangeDialog";
import { GDPRConsentDialog } from "@/components/Auth/GDPRConsentDialog";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false);
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Verifica se o usuário já está logado apenas uma vez na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Usuário já está logado, redirecionar para dashboard
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.info("Iniciando login com:", { email });
      
      // Autenticação com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Erro no login:", error.message);
        toast.error(error.message || "Erro ao fazer login. Verifique suas credenciais.");
        setIsSubmitting(false);
        return;
      }
      
      if (!data.session) {
        toast.error("Não foi possível iniciar sessão");
        setIsSubmitting(false);
        return;
      }
      
      // Verificar se é primeiro acesso
      const userMetadata = data.user?.user_metadata;
      if (userMetadata?.primeiroAcesso) {
        setCurrentUserId(data.user.id);
        setShowPasswordChangeDialog(true);
        setIsSubmitting(false);
        return;
      }
      
      // Verificar se precisa aceitar GDPR
      const gdprAccepted = localStorage.getItem(`gdpr-accepted-${data.user.id}`);
      if (!gdprAccepted) {
        setCurrentUserId(data.user.id);
        setShowGDPRDialog(true);
        setIsSubmitting(false);
        return;
      }
      
      // Login normal (sem primeiro acesso e GDPR já aceito)
      const role = userMetadata?.role || 'servidor';
      toast.success("Login realizado com sucesso!");

      // IMPORTANTE: Redirecionar DEPOIS de todas as verificações
      // Usar replace: true para evitar retornos indesejados
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'prefeito' || role === 'gestor') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/pedidos', { replace: true });
      }
    } catch (error: any) {
      console.error("Erro inesperado no login:", error);
      toast.error("Ocorreu um erro durante o login. Por favor, tente novamente.");
      setIsSubmitting(false);
    }
  };
  
  // Troca de senha para primeiro login
  const handlePasswordChange = async () => {
    if (!currentUserId) {
      toast.error("Erro ao identificar usuário");
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Atualiza a senha no Supabase
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        toast.error("Erro ao atualizar senha: " + error.message);
        setIsSubmitting(false);
        return;
      }
      
      // Atualiza os metadados para remover a flag de primeiro acesso
      await supabase.auth.updateUser({
        data: { primeiroAcesso: false }
      });
      
      toast.success("Senha alterada com sucesso!");
      setShowPasswordChangeDialog(false);
      
      // Depois de mudar a senha, exibir o diálogo de GDPR
      setShowGDPRDialog(true);
    } catch (error: any) {
      console.error("Erro ao atualizar a senha:", error);
      toast.error("Ocorreu um erro ao atualizar a senha");
      setIsSubmitting(false);
    }
  };

  // Aceitar os termos de GDPR
  const handleGDPRConsent = async () => {
    try {
      // Salva o consentimento no localStorage
      localStorage.setItem(`gdpr-accepted-${currentUserId}`, 'true');
      
      // Busca dados do usuário para redirecionar
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("Erro ao identificar usuário");
        return;
      }
      
      const role = data.user.user_metadata?.role || 'servidor';
      toast.success("Termos aceitos. Redirecionando...");
      
      // Redirecionar baseado no papel do usuário
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'prefeito' || role === 'gestor') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/pedidos', { replace: true });
      }
    } catch (error) {
      console.error("Erro ao processar consentimento GDPR:", error);
      toast.error("Ocorreu um erro ao processar o consentimento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GecomLogo className="w-64 h-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo ao GECOM</h1>
          <p className="text-gray-600">Sistema de Gestão de Compras Municipal</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <ForgotPasswordDialog
          open={showForgotPassword}
          onOpenChange={setShowForgotPassword}
        />
        
        <PasswordChangeDialog
          open={showPasswordChangeDialog}
          onOpenChange={setShowPasswordChangeDialog}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handlePasswordChange}
          isSubmitting={isSubmitting}
        />
        
        <GDPRConsentDialog
          open={showGDPRDialog}
          onOpenChange={setShowGDPRDialog}
          onAccept={handleGDPRConsent}
        />
      </div>
    </div>
  );
};

export default Login;
