
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import GecomLogo from "@/assets/GecomLogo";
import { signIn } from "@/services/authService";
import { ForgotPasswordDialog } from "@/components/Auth/ForgotPasswordDialog";
import { PasswordChangeDialog } from "@/components/Auth/PasswordChangeDialog";
import { GDPRConsentDialog } from "@/components/Auth/GDPRConsentDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false);
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.info("Iniciando login com:", { usuario });

    try {
      // Usando o email do usuário para autenticar
      const { success, data, error } = await signIn({ email: usuario, password });

      if (!success || !data) {
        console.error("Login error:", error);
        toast.error(error?.message || "Erro ao fazer login. Verifique suas credenciais.");
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        // Check if it's first login
        if (data.user?.user_metadata?.primeiroAcesso) {
          setCurrentUserId(data.user.id);
          setShowPasswordChangeDialog(true);
          setIsSubmitting(false);
          return;
        }

        // Check if GDPR consent is needed
        const gdprAccepted = localStorage.getItem(`gdpr-accepted-${data.user.id}`);
        if (!gdprAccepted) {
          setCurrentUserId(data.user.id);
          setShowGDPRDialog(true);
          setIsSubmitting(false);
          return;
        }

        // Regular login
        const userProfile = data.user?.user_metadata;
        const role = userProfile?.role || 'servidor';
        
        toast.success("Login realizado com sucesso!");

        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'prefeito') {
          navigate('/dashboard');
        } else if (role === 'gestor') {
          navigate('/dashboard');
        } else {
          navigate('/pedidos');
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Ocorreu um erro durante o login. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle password change for first-time login
  const handlePasswordChange = async (newPassword: string, confirmPassword: string) => {
    if (!currentUserId || newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast.error("Erro ao atualizar senha: " + error.message);
        return;
      }
      
      // Update user metadata to remove first login flag
      await supabase.auth.updateUser({
        data: { primeiroAcesso: false }
      });
      
      toast.success("Senha alterada com sucesso!");
      setShowPasswordChangeDialog(false);
      setShowGDPRDialog(true);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Ocorreu um erro ao atualizar a senha");
    }
  };

  // Handle submitting the password change form
  const handleSubmitPasswordChange = () => {
    handlePasswordChange(newPassword, confirmPassword);
  };

  // Handle GDPR consent
  const handleGDPRConsent = async () => {
    localStorage.setItem(`gdpr-accepted-${currentUserId}`, 'true');
    
    // Get user profile data
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const userProfile = user.user_metadata;
      const role = userProfile?.role || 'servidor';
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'prefeito' || role === 'gestor') {
        navigate('/dashboard');
      } else {
        navigate('/pedidos');
      }
    } else {
      // Fallback if user data is not available
      navigate('/pedidos');
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
                <Label htmlFor="usuario">Usuário</Label>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Seu usuário"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
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
          onSubmit={handleSubmitPasswordChange}
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
