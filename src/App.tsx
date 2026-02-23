import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Clients from "@/pages/Clients";
import Services from "@/pages/Services";
import ServiceRequests from "@/pages/ServiceRequests";
import Projects from "@/pages/Projects";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import RequestService from "@/pages/RequestService";
import UsersPage from "@/pages/UsersPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function RoleBasedRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
      
      {/* Admin Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout><Dashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/Employees" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout><Employees /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout><Clients /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/service-requests" element={
        <ProtectedRoute allowedRoles={['admin', 'employee']}>
          <DashboardLayout><ServiceRequests /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute allowedRoles={['admin', 'employee', 'client']}>
          <DashboardLayout><Projects /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute allowedRoles={['admin', 'employee', 'client']}>
          <DashboardLayout><Messages /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/request-service" element={
        <ProtectedRoute allowedRoles={['client']}>
          <DashboardLayout><RequestService /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardLayout><Profile /></DashboardLayout>
        </ProtectedRoute>
      } />
      
      {/* Additional Admin Routes */}
      <Route path="/services" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout><Services /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout><UsersPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <RoleBasedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
