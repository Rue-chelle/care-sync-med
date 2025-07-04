
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const Login = () => {
  return (
    <ResponsiveContainer maxWidth="md" className="py-8">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold healthcare-gradient bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your AloraMed account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
};

export default Login;
