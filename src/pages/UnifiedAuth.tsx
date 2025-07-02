import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/integrations/supabase/client";
import { User, Stethoscope, Shield, Crown, Eye, EyeOff } from "lucide-react";

const UnifiedAuth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useUserStore();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'patient' ? '/patient' :
                          user.role === 'admin' ? '/admin' :
                          user.role === 'super_admin' ? '/super-admin' :
                          user.role === 'doctor' ? '/doctor' :
                          '/';
      navigate(redirectPath);
    }

    // Check for existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Handle existing session based on user data
        handleExistingSession(session);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        handleExistingSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isAuthenticated, user]);

  const handleExistingSession = async (session: any) => {
    if (!session.user) return;

    // Check user role from database
    const { data: patientData } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (patientData) {
      login({
        id: session.user.id,
        email: session.user.email!,
        fullName: patientData.full_name,
        role: 'patient'
      });
      navigate("/patient");
      return;
    }

    const { data: doctorData } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (doctorData) {
      login({
        id: session.user.id,
        email: session.user.email!,
        fullName: doctorData.full_name,
        role: 'doctor'
      });
      navigate("/doctor");
      return;
    }

    const { data: superAdminData } = await supabase
      .from('super_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (superAdminData) {
      login({
        id: session.user.id,
        email: session.user.email!,
        fullName: superAdminData.full_name,
        role: 'super_admin'
      });
      navigate("/super-admin");
      return;
    }

    // Default to admin if no specific role found
    if (session.user.email?.includes('admin')) {
      login({
        id: session.user.id,
        email: session.user.email!,
        role: 'admin'
      });
      navigate("/admin");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
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

          // Redirect based on role - Fixed the doctor redirect issue
          const redirectPath = mockUser.role === 'patient' ? '/patient' :
                              mockUser.role === 'admin' ? '/admin' :
                              mockUser.role === 'super_admin' ? '/super-admin' :
                              mockUser.role === 'doctor' ? '/doctor' :
                              '/';
          
          console.log('Redirecting to:', redirectPath);
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
        await handleExistingSession(data);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'patient' // Default to patient for new registrations
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
        // Create patient profile
        const { error: profileError } = await supabase
          .from('patients')
          .insert({
            user_id: data.user.id,
            full_name: fullName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        toast({
          title: "Registration successful",
          description: `Welcome to AloraMed, ${fullName}!`,
        });

        navigate("/patient");
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

  const demoCredentials = [
    { role: "Patient", email: "patient@aloramedapp.com", password: "password123", icon: User, color: "text-blue-600" },
    { role: "Doctor", email: "doctor@aloramedapp.com", password: "password123", icon: Stethoscope, color: "text-green-600" },
    { role: "Admin", email: "admin@aloramedapp.com", password: "password123", icon: Shield, color: "text-orange-600" },
    { role: "Super Admin", email: "superadmin@aloramedapp.com", password: "password123", icon: Crown, color: "text-purple-600" }
  ];

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 healthcare-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <div className="h-8 w-8 text-white font-bold text-xl">AM</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            AloraMed
          </h1>
          <p className="text-lg text-slate-600">Healthcare Management System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Auth Card */}
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-600">
                Sign in to access your healthcare dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 healthcare-gradient text-white hover:opacity-90 transition-opacity font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        placeholder="John Doe" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        required 
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <Input 
                        id="registerEmail" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <div className="relative">
                        <Input 
                          id="registerPassword" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 healthcare-gradient text-white hover:opacity-90 transition-opacity font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Demo Credentials Card */}
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                Demo Access
              </CardTitle>
              <CardDescription className="text-slate-600">
                Quick login with demo credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoCredentials.map((credential, index) => {
                const IconComponent = credential.icon;
                return (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group"
                    onClick={() => quickLogin(credential.email, credential.password)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <IconComponent className={`h-6 w-6 ${credential.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {credential.role}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{credential.email}</p>
                        <p className="text-xs text-slate-400">Password: {credential.password}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Login
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">🎯 MVP Features Available:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Patient: Book appointments, view prescriptions</li>
                  <li>• Doctor: Manage patients, appointments, prescriptions</li>
                  <li>• Admin: User management, clinic oversight</li>
                  <li>• Super Admin: Global system management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuth;
