
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ForgotPasswordDialog } from "@/components/Auth/ForgotPasswordDialog";
import { PasswordChangeDialog } from "@/components/Auth/PasswordChangeDialog";
import { GDPRConsentDialog } from "@/components/Auth/GDPRConsentDialog";

export const LoginForm = () => {
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

  useEffect(() => {
    // Verifica se o usuário já está logado apenas uma vez na inicialização
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
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
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'prefeito' || role === 'gestor') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/pedidos', { replace: true });
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro durante o login. Por favor, tente novamente.");
      setIsSubmitting(false);
    }
  };

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
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error("Erro ao atualizar senha: " + error.message);
        setIsSubmitting(false);
        return;
      }
      await supabase.auth.updateUser({
        data: { primeiroAcesso: false }
      });
      toast.success("Senha alterada com sucesso!");
      setShowPasswordChangeDialog(false);
      setShowGDPRDialog(true);
    } catch (error: any) {
      toast.error("Ocorreu um erro ao atualizar a senha");
      setIsSubmitting(false);
    }
  };

  const handleGDPRConsent = async () => {
    try {
      localStorage.setItem(`gdpr-accepted-${currentUserId}`, 'true');
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("Erro ao identificar usuário");
        return;
      }
      const role = data.user.user_metadata?.role || 'servidor';
      toast.success("Termos aceitos. Redirecionando...");
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'prefeito' || role === 'gestor') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/pedidos', { replace: true });
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao processar o consentimento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
    </>
  );
};
