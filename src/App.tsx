
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PatientAuth from "./pages/PatientAuth";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminAuth from "./pages/SuperAdminAuth";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useUserStore } from "./stores/userStore";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, user } = useUserStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Legacy auth route for admin/doctor */}
            <Route path="/auth" element={
              isAuthenticated ? (
                <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'patient' ? '/patient' : '/'} />
              ) : (
                <Auth />
              )
            } />
            
            {/* Patient authentication route */}
            <Route path="/patient/auth" element={<PatientAuth />} />
            
            {/* Doctor routes - Updated to use DoctorDashboard */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Patient routes */}
            <Route 
              path="/patient" 
              element={<PatientDashboard />} 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
