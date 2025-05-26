
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/stores/userStore";

export const SuperAdminLoginForm = () => {
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
        if (email === "superadmin@caresync.com" && password === "superadmin123") {
          login({
            id: "mock-super-admin",
            email: "superadmin@caresync.com",
            fullName: "Super Administrator",
            role: "super_admin"
          });
          
          toast({
            title: "Login successful",
            description: "Welcome back, Super Admin!",
          });
          navigate("/super-admin");
        } else {
          toast({
            title: "Login failed",
            description: "Invalid super admin credentials",
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        // Check if user has super admin privileges
        const { data: superAdminData } = await supabase
          .from('super_admins')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (superAdminData) {
          // User is a super admin
          login({
            id: data.user.id,
            email: data.user.email!,
            fullName: superAdminData.full_name,
            role: 'super_admin'
          });

          toast({
            title: "Login successful",
            description: "Welcome back, Super Admin!",
          });
          navigate("/super-admin");
        } else {
          await supabase.auth.signOut();
          toast({
            title: "Access denied",
            description: "Super admin privileges required.",
            variant: "destructive",
          });
        }
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
          placeholder="superadmin@caresync.com" 
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
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity" 
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Super Admin Sign In"}
      </Button>
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>Demo credentials:</p>
        <p>Super Admin: superadmin@caresync.com / superadmin123</p>
      </div>
    </form>
  );
};
