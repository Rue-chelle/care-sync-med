
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import Index from "./pages/Index";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AppointmentBooking } from "@/components/patient/AppointmentBooking";
import { EnhancedAppointmentBooking } from "@/components/patient/EnhancedAppointmentBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const { clearUser, user, isAuthenticated, login, setLoading } = useUserStore();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        clearUser();
      }

      if (session) {
        const { user } = session;
        login({
          id: user.id,
          email: user.email ?? 'example@email.com',
          fullName: user?.user_metadata?.full_name as string,
          role: user?.user_metadata?.role as "patient" | "doctor" | "admin" | "super_admin" ?? 'patient',
        });
      } else {
        clearUser();
      }
      setLoading(false);
    };

    fetchSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        login({
          id: session.user.id,
          email: session.user.email ?? 'example@email.com',
          fullName: session.user?.user_metadata?.full_name as string,
          role: session.user?.user_metadata?.role as "patient" | "doctor" | "admin" | "super_admin" ?? 'patient',
        });
      } else if (event === 'SIGNED_OUT') {
        clearUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearUser, login, setLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/book-appointment" element={<AppointmentBooking />} />
              <Route path="/enhanced-booking" element={<EnhancedAppointmentBooking />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
