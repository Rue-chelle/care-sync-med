
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/integrations/supabase/client";

export const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"doctor" | "admin">("doctor");
  const [specialization, setSpecialization] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Create role-specific profile
        if (role === "doctor") {
          const { error: doctorError } = await supabase
            .from('doctors')
            .insert({
              user_id: data.user.id,
              full_name: fullName,
              email: email,
              specialization: specialization || 'General Practice',
            });

          if (doctorError) {
            console.error('Doctor profile creation error:', doctorError);
          }
        } else if (role === "admin") {
          const { error: adminError } = await supabase
            .from('admins')
            .insert({
              user_id: data.user.id,
              full_name: fullName,
              email: email,
            });

          if (adminError) {
            console.error('Admin profile creation error:', adminError);
          }
        }

        register({
          id: data.user.id,
          fullName,
          email,
          role,
        });
        
        toast({
          title: "Registration successful",
          description: `Welcome to AloraMed, ${fullName}!`,
        });

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "doctor") {
          navigate("/");
        }
      }
    } catch (error) {
      toast({
        title: "Registration failed",
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
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          placeholder="John Doe" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          required 
        />
      </div>
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
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value: "doctor" | "admin") => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {role === "doctor" && (
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input 
            id="specialization" 
            placeholder="e.g., Cardiology, General Practice" 
            value={specialization} 
            onChange={(e) => setSpecialization(e.target.value)} 
          />
        </div>
      )}
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
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          placeholder="••••••••" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
      </div>
      <Button 
        type="submit" 
        className="w-full healthcare-gradient text-white hover:opacity-90 transition-opacity" 
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};
