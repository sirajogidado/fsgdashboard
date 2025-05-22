
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
import AircraftTypePage from "./pages/Global/AircraftType/AircraftTypePage";
import FOCCMCCPage from "./pages/FOCC/FOCCMCCPage";
import AcceptanceCertificatePage from "./pages/AcceptanceCertificate/AcceptanceCertificatePage";

// Create QueryClient outside the component
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
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
                    <ProtectedRoute requiredDirectorate="AOC">
                      <AOCPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ATO Management */}
                <Route 
                  path="ato" 
                  element={
                    <ProtectedRoute requiredDirectorate="ATO">
                      <ATOPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Aircraft Status */}
                <Route 
                  path="ac-status" 
                  element={
                    <ProtectedRoute requiredDirectorate="AOC">
                      <ACStatusPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Foreign Airline DACL */}
                <Route 
                  path="foreign-airline-dacl" 
                  element={
                    <ProtectedRoute requiredDirectorate="DACL">
                      <ForeignAirlineDACLPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* AMO Routes */}
                <Route 
                  path="amo/foreign" 
                  element={
                    <ProtectedRoute requiredDirectorate="AMO">
                      <ForeignAMOPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="amo/local" 
                  element={
                    <ProtectedRoute requiredDirectorate="AMO">
                      <LocalAMOPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* FOCC/MCC Route */}
                <Route 
                  path="focc-mcc" 
                  element={
                    <ProtectedRoute requiredDirectorate="FOCC">
                      <FOCCMCCPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Acceptance Certificate Route */}
                <Route 
                  path="acceptance-certificate" 
                  element={
                    <ProtectedRoute requiredDirectorate="AOC">
                      <AcceptanceCertificatePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="settings" 
                  element={
                    <ProtectedRoute>
                      <div className="p-8">Settings Page - Coming Soon</div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Global Operations routes - these should be accessible by all with proper role */}
                <Route 
                  path="global/aircraft-manufacturer" 
                  element={
                    <ProtectedRoute requiredRole="Technical">
                      <AircraftManufacturerPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/aircraft-type" 
                  element={
                    <ProtectedRoute requiredRole="Technical">
                      <AircraftTypePage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="global/foreign-registration" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">Foreign Registration Mark Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/foreign-amo" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">Foreign AMO Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/general-aviation" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">General Aviation Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/operation-type" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">Operation Type Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/state-registry" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">State of Registry Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/training-organization" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">Training Organization Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/travel-agency" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">Travel Agency Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/foreign-airline" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">Foreign Airline Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/certificate-type" element={<ProtectedRoute requiredRole="Technical"><div className="p-8">Certificate Type Page - Coming Soon</div></ProtectedRoute>} />
                <Route path="global/user-roles" element={<ProtectedRoute requiredRole="Super User"><div className="p-8">User Roles Page - Coming Soon</div></ProtectedRoute>} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
