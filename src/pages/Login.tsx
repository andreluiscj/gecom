
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import GecomLogo from "@/assets/GecomLogo";
import { LoginForm } from "@/components/Auth/LoginForm";

const Login: React.FC = () => {
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
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
