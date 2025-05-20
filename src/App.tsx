
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
import ATOPage from "./pages/ATO/ATOPage";
import ACStatusPage from "./pages/ACStatus/ACStatusPage";

// New Pages
import ForeignAirlineDACLPage from "./pages/ForeignAirlineDACL/ForeignAirlineDACLPage";
import ForeignAMOPage from "./pages/AMO/Foreign/ForeignAMOPage";
import LocalAMOPage from "./pages/AMO/Local/LocalAMOPage";
import AircraftManufacturerPage from "./pages/Global/AircraftManufacturer/AircraftManufacturerPage";

// Create QueryClient outside the component
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
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
                
                {/* ATO Management */}
                <Route 
                  path="ato" 
                  element={
                    <ProtectedRoute requiredRole="Technical">
                      <ATOPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Aircraft Status */}
                <Route 
                  path="ac-status" 
                  element={
                    <ProtectedRoute requiredRole="Technical">
                      <ACStatusPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Foreign Airline DACL */}
                <Route 
                  path="foreign-airline-dacl" 
                  element={
                    <ProtectedRoute requiredRole="Technical">
                      <ForeignAirlineDACLPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* AMO Routes */}
                <Route 
                  path="amo/foreign" 
                  element={
                    <ProtectedRoute requiredRole="Technical">
                      <ForeignAMOPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="amo/local" 
                  element={
                    <ProtectedRoute requiredRole="Technical">
                      <LocalAMOPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="focc-mcc" element={<div className="p-8">FOCC/MCC Page - Coming Soon</div>} />
                <Route path="acceptance-certificate" element={<div className="p-8">Type Acceptance Certificate Page - Coming Soon</div>} />
                <Route path="settings" element={<div className="p-8">Settings Page - Coming Soon</div>} />
                
                {/* Global Operations routes */}
                <Route 
                  path="global/aircraft-manufacturer" 
                  element={
                    <AircraftManufacturerPage />
                  } 
                />
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
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
