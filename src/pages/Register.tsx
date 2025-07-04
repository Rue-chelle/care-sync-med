
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const Register = () => {
  return (
    <ResponsiveContainer maxWidth="md" className="py-8">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold healthcare-gradient bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription>
            Join AloraMed to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
};

export default Register;
