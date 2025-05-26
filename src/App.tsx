
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import NotFound from "./pages/NotFound";
import UnifiedAuth from "./pages/UnifiedAuth";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
            {/* Unified authentication route */}
            <Route path="/auth" element={
              isAuthenticated ? (
                <Navigate to={
                  user?.role === 'admin' ? '/admin' : 
                  user?.role === 'patient' ? '/patient' : 
                  user?.role === 'super_admin' ? '/super-admin' :
                  '/'
                } />
              ) : (
                <UnifiedAuth />
              )
            } />
            
            {/* Legacy auth routes - redirect to unified auth */}
            <Route path="/patient/auth" element={<Navigate to="/auth" replace />} />
            <Route path="/super-admin/auth" element={<Navigate to="/auth" replace />} />
            
            {/* Doctor routes */}
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
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
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
            
            {/* Super Admin routes */}
            <Route 
              path="/super-admin" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="*" element={
              isAuthenticated ? <NotFound /> : <Navigate to="/auth" replace />
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
