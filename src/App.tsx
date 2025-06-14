import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import UnifiedAuth from "./pages/UnifiedAuth";
import PatientAuth from "./pages/PatientAuth";
import SuperAdminAuth from "./pages/SuperAdminAuth";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SubscriptionPage from "./pages/SubscriptionPage";
import EnhancedSubscriptionPage from "./pages/EnhancedSubscriptionPage";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCanceled from "./pages/SubscriptionCanceled";
import Testing from "./pages/Testing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Make UnifiedAuth the main landing page */}
            <Route path="/" element={<UnifiedAuth />} />
            {/* Move the old landing page to /dashboard */}
            <Route path="/dashboard" element={<Index />} />
            <Route path="/auth" element={<UnifiedAuth />} />
            {/* Fully remove old /old-auth or /auth route using deprecated Auth component */}
            <Route path="/patient-auth" element={<PatientAuth />} />
            <Route path="/super-admin-auth" element={<SuperAdminAuth />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/enhanced-subscription" element={<EnhancedSubscriptionPage />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            <Route path="/subscription-canceled" element={<SubscriptionCanceled />} />
            {/* <Route path="/testing" element={<Testing />} /> */}
            
            {/* Protected Routes */}
            <Route 
              path="/patient" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/super-admin" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
