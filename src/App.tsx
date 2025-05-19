
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import UsersPage from "./pages/UsersPage";
import AOCPage from "./pages/AOC/AOCPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              
              {/* Users Management */}
              <Route 
                path="users" 
                element={
                  <ProtectedRoute requiredRole="Super User">
                    <UsersPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* AOC Management */}
              <Route 
                path="aoc" 
                element={
                  <ProtectedRoute requiredRole="Technical">
                    <AOCPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Placeholder routes for future implementation */}
              <Route path="ato" element={<div className="p-8">ATO Page - Coming Soon</div>} />
              <Route path="ac-status" element={<div className="p-8">Aircraft Status Page - Coming Soon</div>} />
              <Route path="foreign-airline-dacl" element={<div className="p-8">Foreign Airline DACL Page - Coming Soon</div>} />
              <Route path="amo/foreign" element={<div className="p-8">Foreign AMO Page - Coming Soon</div>} />
              <Route path="amo/local" element={<div className="p-8">Local AMO Page - Coming Soon</div>} />
              <Route path="focc-mcc" element={<div className="p-8">FOCC/MCC Page - Coming Soon</div>} />
              <Route path="acceptance-certificate" element={<div className="p-8">Type Acceptance Certificate Page - Coming Soon</div>} />
              <Route path="settings" element={<div className="p-8">Settings Page - Coming Soon</div>} />
              
              {/* Global Operations routes */}
              <Route path="global/aircraft-manufacturer" element={<div className="p-8">Aircraft Manufacturer Page - Coming Soon</div>} />
              <Route path="global/aircraft-type" element={<div className="p-8">Aircraft Type Page - Coming Soon</div>} />
              <Route path="global/foreign-registration" element={<div className="p-8">Foreign Registration Mark Page - Coming Soon</div>} />
              <Route path="global/foreign-amo" element={<div className="p-8">Foreign AMO Page - Coming Soon</div>} />
              <Route path="global/general-aviation" element={<div className="p-8">General Aviation Page - Coming Soon</div>} />
              <Route path="global/operation-type" element={<div className="p-8">Operation Type Page - Coming Soon</div>} />
              <Route path="global/state-registry" element={<div className="p-8">State of Registry Page - Coming Soon</div>} />
              <Route path="global/training-organization" element={<div className="p-8">Training Organization Page - Coming Soon</div>} />
              <Route path="global/travel-agency" element={<div className="p-8">Travel Agency Page - Coming Soon</div>} />
              <Route path="global/foreign-airline" element={<div className="p-8">Foreign Airline Page - Coming Soon</div>} />
              <Route path="global/certificate-type" element={<div className="p-8">Certificate Type Page - Coming Soon</div>} />
              <Route path="global/user-roles" element={<div className="p-8">User Roles Page - Coming Soon</div>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
