
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import GecomLogo from "@/assets/GecomLogo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          redirectBasedOnRole(data.session.user?.user_metadata?.role || 'servidor');
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const redirectBasedOnRole = (role: string) => {
    // Redirect based on role
    console.log("Redirecting based on role:", role);
    
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'prefeito') {
      navigate('/dashboard');
    } else if (role === 'gestor') {
      navigate('/dashboard');
    } else {
      navigate('/pedidos');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsSubmitting(true);

    try {
      console.log("Iniciando login com:", { email });
      console.log("Tentando login com:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Erro ao fazer login");
        setIsSubmitting(false);
        return;
      }

      if (data?.session) {
        console.log("Login successful:", data.session);
        toast.success("Login realizado com sucesso");
        
        // Get user profile and additional data if needed
        const userProfile = data.user?.user_metadata;
        const role = userProfile?.role || 'servidor';
        
        redirectBasedOnRole(role);
      } else {
        console.error("No session data returned");
        toast.error("Erro ao fazer login: sessão não iniciada");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      toast.error(error.message || "Erro inesperado ao fazer login");
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
                <Label htmlFor="password">Senha</Label>
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
      </div>
    </div>
  );
};

export default Login;
