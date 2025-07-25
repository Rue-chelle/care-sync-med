
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/integrations/supabase/client";
import { AuthService } from "@/services/authService";
import { MonitoringService } from "@/services/monitoringService";
import { User, Stethoscope, Shield, Crown, Eye, EyeOff, CheckCircle, Mail } from "lucide-react";

const UnifiedAuth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useUserStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for email confirmation or password reset in URL
    const confirmed = searchParams.get('confirmed');
    const reset = searchParams.get('reset');
    
    if (confirmed === 'true') {
      setEmailConfirmed(true);
      toast({
        title: "Email confirmed!",
        description: "Your email has been verified. You can now sign in.",
      });
    }
    
    if (reset === 'true') {
      toast({
        title: "Password reset link sent",
        description: "Check your email for password reset instructions.",
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      MonitoringService.logUserAction('auth_state_change', { event, userId: session?.user?.id });
      console.log('Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, processing...');
        try {
          await handleAuthenticatedUser(session.user);
        } catch (error) {
          console.error('Error handling authenticated user:', error);
          MonitoringService.logError({
            message: 'Authentication error during user processing',
            stack: error instanceof Error ? error.stack : String(error),
            userId: session.user.id,
            severity: 'high',
            timestamp: new Date()
          });
          toast({
            title: "Authentication Error",
            description: "There was an issue setting up your account. Please try again.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing store');
        useUserStore.getState().logout();
      }
    });

    // THEN check for existing session
    const checkSession = async () => {
      if (!mounted) return;
      
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          MonitoringService.logError({
            message: 'Session check error',
            stack: error.message,
            severity: 'medium',
            timestamp: new Date()
          });
          return;
        }
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          await handleAuthenticatedUser(session.user);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        MonitoringService.logError({
          message: 'Exception during session check',
          stack: error instanceof Error ? error.stack : String(error),
          severity: 'medium',
          timestamp: new Date()
        });
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'patient' ? '/patient' :
                          user.role === 'admin' ? '/admin' :
                          user.role === 'super_admin' ? '/super-admin' :
                          user.role === 'doctor' ? '/doctor' :
                          '/';
      console.log('User authenticated, redirecting to:', redirectPath);
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleAuthenticatedUser = async (authUser: any) => {
    console.log('Processing authenticated user:', authUser.id, authUser.email);
    
    try {
      // Check for existing profiles in order: patient, doctor, super_admin
      console.log('Checking for patient profile...');
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (patientError && patientError.code !== 'PGRST116') {
        console.error('Patient query error:', patientError);
        throw patientError;
      }

      if (patientData) {
        console.log('Found patient profile:', patientData);
        login({
          id: authUser.id,
          email: authUser.email,
          fullName: patientData.full_name,
          role: 'patient'
        });
        return;
      }

      // Check for doctor profile
      console.log('Checking for doctor profile...');
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (doctorError && doctorError.code !== 'PGRST116') {
        console.error('Doctor query error:', doctorError);
        throw doctorError;
      }

      if (doctorData) {
        console.log('Found doctor profile:', doctorData);
        login({
          id: authUser.id,
          email: authUser.email,
          fullName: doctorData.full_name,
          role: 'doctor'
        });
        return;
      }

      // Check for super admin profile
      console.log('Checking for super admin profile...');
      const { data: superAdminData, error: superAdminError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (superAdminError && superAdminError.code !== 'PGRST116') {
        console.error('Super admin query error:', superAdminError);
        throw superAdminError;
      }

      if (superAdminData) {
        console.log('Found super admin profile:', superAdminData);
        login({
          id: authUser.id,
          email: authUser.email,
          fullName: superAdminData.full_name,
          role: 'super_admin'
        });
        return;
      }

      // Check if should be admin based on email
      if (authUser.email?.includes('admin') && !authUser.email?.includes('superadmin')) {
        console.log('Setting as admin based on email');
        login({
          id: authUser.id,
          email: authUser.email,
          fullName: authUser.user_metadata?.full_name || 'Admin User',
          role: 'admin'
        });
        return;
      }

      // If no role found, create as patient by default
      console.log('No profile found, creating patient profile...');
      await createPatientProfile(authUser);

    } catch (error) {
      console.error('Error processing authenticated user:', error);
      throw error;
    }
  };

  const createPatientProfile = async (authUser: any) => {
    try {
      console.log('Creating patient profile for user:', authUser.id);
      
      const patientData = {
        user_id: authUser.id,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
      };

      console.log('Inserting patient data:', patientData);

      const { data, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();

      if (error) {
        console.error('Error creating patient profile:', error);
        
        // If it's a duplicate key error, try to fetch existing profile
        if (error.code === '23505') {
          console.log('Patient profile already exists, fetching...');
          const { data: existingData, error: fetchError } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (existingData && !fetchError) {
            console.log('Found existing patient profile:', existingData);
            login({
              id: authUser.id,
              email: authUser.email,
              fullName: existingData.full_name,
              role: 'patient'
            });
            return;
          }
        }
        
        throw error;
      }

      console.log('Patient profile created successfully:', data);

      login({
        id: authUser.id,
        email: authUser.email,
        fullName: data.full_name,
        role: 'patient'
      });

      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully.",
      });

    } catch (error) {
      console.error('Failed to create patient profile:', error);
      throw error;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      // Try enhanced auth service first
      const result = await AuthService.signIn(email, password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return;
      }

      // If auth service fails, fall back to mock authentication for demo purposes
      if (result.error?.message.includes('Invalid login credentials') || result.error?.code === 'invalid_credentials') {
        console.log('Checking for demo credentials...');
        const mockUsers = [
          { email: "patient@aloramedapp.com", password: "password123", role: "patient" as const, name: "John Patient" },
          { email: "doctor@aloramedapp.com", password: "password123", role: "doctor" as const, name: "Dr. Sarah Wilson" },
          { email: "admin@aloramedapp.com", password: "password123", role: "admin" as const, name: "Admin User" },
          { email: "superadmin@aloramedapp.com", password: "password123", role: "super_admin" as const, name: "Super Administrator" }
        ];

        const mockUser = mockUsers.find(user => user.email === email.trim() && user.password === password);
        
        if (mockUser) {
          console.log('Using mock authentication for:', mockUser.role);
          
          login({
            id: "mock-" + mockUser.role,
            email: mockUser.email,
            fullName: mockUser.name,
            role: mockUser.role
          });
          
          toast({
            title: "Login successful (Demo Mode)",
            description: `Welcome back, ${mockUser.name}!`,
          });

          MonitoringService.logUserAction('demo_login', { 
            email: mockUser.email, 
            role: mockUser.role 
          });
          return;
        }
      }

      toast({
        title: "Login failed",
        description: result.error?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Login error:', error);
      MonitoringService.logError({
        message: 'Login exception',
        stack: error instanceof Error ? error.stack : String(error),
        severity: 'medium',
        timestamp: new Date()
      });
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
      console.log('Attempting patient registration for:', email);
      
      if (!fullName.trim()) {
        toast({
          title: "Registration failed",
          description: "Please enter your full name.",
          variant: "destructive",
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: "Registration failed",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }

      const result = await AuthService.signUp(email, password, fullName, 'patient');

      if (result.success) {
        if (result.requiresConfirmation) {
          toast({
            title: "Registration successful",
            description: "Please check your email to verify your account before signing in.",
          });
          setActiveTab("login");
          setEmail("");
          setPassword("");
          setFullName("");
        } else {
          toast({
            title: "Registration successful",
            description: "Welcome to AloraMed! Setting up your patient account...",
          });
        }
        return;
      }

      toast({
        title: "Registration failed",
        description: result.error?.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Registration error:', error);
      MonitoringService.logError({
        message: 'Registration exception',
        stack: error instanceof Error ? error.stack : String(error),
        severity: 'medium',
        timestamp: new Date()
      });
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
                Welcome to AloraMed
              </CardTitle>
              <CardDescription className="text-slate-600">
                {activeTab === "register" 
                  ? "Register as a new patient" 
                  : "Sign in to access your healthcare dashboard"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Patient Registration</TabsTrigger>
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
                        autoComplete="email"
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
                          autoComplete="current-password"
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
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-2">Patient Registration</p>
                      <p className="text-xs text-blue-600">
                        This registration is for patients only. Doctor and admin accounts are created internally through the administrative dashboard.
                      </p>
                    </div>
                    
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
                          autoComplete="name"
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
                          autoComplete="email"
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
                            minLength={6}
                            autoComplete="new-password"
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
                        <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 healthcare-gradient text-white hover:opacity-90 transition-opacity font-medium" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating patient account..." : "Register as Patient"}
                      </Button>
                    </form>
                  </div>
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
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-sm font-medium text-amber-900 mb-2">🏥 For Healthcare Staff:</h4>
                <p className="text-xs text-amber-700">
                  Doctor and admin accounts are created internally through the administrative dashboard. 
                  Contact your system administrator for access.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuth;
