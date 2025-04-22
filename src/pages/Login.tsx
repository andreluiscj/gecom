
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

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false);
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
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

    try {
      const { success, data, error } = await signIn({ email: username, password });

      if (success && data.session) {
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
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="Seu email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
          newPassword=""
          confirmPassword=""
          setNewPassword={() => {}}
          setConfirmPassword={() => {}}
          onSubmit={() => {}}
          isSubmitting={false}
        />
        
        <GDPRConsentDialog
          open={showGDPRDialog}
          onOpenChange={setShowGDPRDialog}
          onAccept={() => {
            localStorage.setItem(`gdpr-accepted-${currentUserId}`, 'true');
            navigate('/dashboard');
          }}
        />
      </div>
    </div>
  );
};

export default Login;
