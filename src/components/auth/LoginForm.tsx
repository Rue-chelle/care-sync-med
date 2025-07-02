
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/integrations/supabase/client";

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
      // First try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If Supabase fails, try mock authentication for demo purposes
        const mockUsers = [
          { email: "patient@aloramedapp.com", password: "password123", role: "patient" as const, name: "John Patient" },
          { email: "doctor@aloramedapp.com", password: "password123", role: "doctor" as const, name: "Dr. Sarah Wilson" },
          { email: "admin@aloramedapp.com", password: "password123", role: "admin" as const, name: "Admin User" },
          { email: "superadmin@aloramedapp.com", password: "password123", role: "super_admin" as const, name: "Super Administrator" }
        ];

        const mockUser = mockUsers.find(user => user.email === email && user.password === password);
        
        if (mockUser) {
          login({
            id: "mock-" + mockUser.role,
            email: mockUser.email,
            fullName: mockUser.name,
            role: mockUser.role
          });
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${mockUser.name}!`,
          });

          // Redirect based on role
          const redirectPath = mockUser.role === 'patient' ? '/patient' :
                              mockUser.role === 'admin' ? '/admin' :
                              mockUser.role === 'super_admin' ? '/super-admin' :
                              '/doctor';
          navigate(redirectPath);
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please use the demo credentials provided.",
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        // Check user role from database
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (doctorData) {
          // User is a doctor
          login({
            id: data.user.id,
            email: data.user.email!,
            fullName: doctorData.full_name,
            role: 'doctor'
          });

          toast({
            title: "Login successful",
            description: "Welcome back, Doctor!",
          });
          navigate("/doctor");
          return;
        }

        // Check if admin (you can implement admin table later)
        // For now, checking if email contains admin
        if (data.user.email?.includes('admin')) {
          login({
            id: data.user.id,
            email: data.user.email!,
            role: 'admin'
          });

          toast({
            title: "Login successful",
            description: "Welcome back, Admin!",
          });
          navigate("/admin");
          return;
        }

        // If no specific role found, sign out
        await supabase.auth.signOut();
        toast({
          title: "Access denied",
          description: "Your account doesn't have the required permissions for this portal.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        <p>Patient: patient@aloramedapp.com / password123</p>
        <p>Doctor: doctor@aloramedapp.com / password123</p>
        <p>Admin: admin@aloramedapp.com / password123</p>
        <p>Super Admin: superadmin@aloramedapp.com / password123</p>
      </div>
    </form>
  );
};
