
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call for login
      setTimeout(() => {
        const mockUsers = [
          { email: "admin@caresync.com", password: "admin123", role: "admin" as const },
          { email: "doctor@caresync.com", password: "doctor123", role: "doctor" as const },
          { email: "patient@caresync.com", password: "patient123", role: "patient" as const }
        ];

        const user = mockUsers.find(user => user.email === email && user.password === password);
        
        if (user) {
          login(user);
          toast({
            title: "Login successful",
            description: `Welcome back, ${user.role}!`,
          });

          // Redirect based on role
          if (user.role === "admin") {
            navigate("/admin");
          } else if (user.role === "doctor") {
            navigate("/");
          } else {
            navigate("/patient");
          }
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <Button 
        type="submit" 
        className="w-full healthcare-gradient text-white hover:opacity-90 transition-opacity" 
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>Demo credentials:</p>
        <p>Admin: admin@caresync.com / admin123</p>
        <p>Doctor: doctor@caresync.com / doctor123</p>
        <p>Patient: patient@caresync.com / patient123</p>
      </div>
    </form>
  );
};
