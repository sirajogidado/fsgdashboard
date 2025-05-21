
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuditProvider } from "./context/AuditContext";

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
import AuditTrailPage from "./pages/AuditTrail/AuditTrailPage";

// New Pages
import ForeignAirlineDACLPage from "./pages/ForeignAirlineDACL/ForeignAirlineDACLPage";
import ForeignAMOPage from "./pages/AMO/Foreign/ForeignAMOPage";
import LocalAMOPage from "./pages/AMO/Local/LocalAMOPage";
import AircraftManufacturerPage from "./pages/Global/AircraftManufacturer/AircraftManufacturerPage";
import AircraftTypePage from "./pages/Global/AircraftType/AircraftTypePage";

// Global Operations Pages
import ForeignRegistrationPage from "./pages/Global/ForeignRegistration/ForeignRegistrationPage";
import GlobalForeignAMOPage from "./pages/Global/ForeignAMO/ForeignAMOPage";
import GeneralAviationPage from "./pages/Global/GeneralAviation/GeneralAviationPage";
import OperationTypePage from "./pages/Global/OperationType/OperationTypePage";
import StateRegistryPage from "./pages/Global/StateRegistry/StateRegistryPage";
import TrainingOrganizationPage from "./pages/Global/TrainingOrganization/TrainingOrganizationPage";
import TravelAgencyPage from "./pages/Global/TravelAgency/TravelAgencyPage";
import ForeignAirlinePage from "./pages/Global/ForeignAirline/ForeignAirlinePage";
import CertificateTypePage from "./pages/Global/CertificateType/CertificateTypePage";

// Create QueryClient outside the component
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuditProvider>
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
                  
                  {/* Audit Trail */}
                  <Route 
                    path="audit-trail" 
                    element={
                      <ProtectedRoute requiredRole="Super User">
                        <AuditTrailPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* AOC Management */}
                  <Route 
                    path="aoc" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DAWS", "DAAS", "DOLTS"]} allowReadOnly={true}>
                        <AOCPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* ATO Management */}
                  <Route 
                    path="ato" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DOLTS"]} allowReadOnly={true}>
                        <ATOPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Aircraft Status */}
                  <Route 
                    path="ac-status" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DAWS", "DAAS", "DOLTS"]} allowReadOnly={true}>
                        <ACStatusPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Foreign Airline DACL */}
                  <Route 
                    path="foreign-airline-dacl" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DAWS"]} allowReadOnly={true}>
                        <ForeignAirlineDACLPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* AMO Routes */}
                  <Route 
                    path="amo/foreign" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DAWS"]} allowReadOnly={true}>
                        <ForeignAMOPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="amo/local" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DAWS"]} allowReadOnly={true}>
                        <LocalAMOPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="focc-mcc" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DAWS", "DOLTS"]} allowReadOnly={true}>
                        <div className="p-8">FOCC/MCC Page - Coming Soon</div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="acceptance-certificate" 
                    element={
                      <ProtectedRoute requiredDirectorate={["DAWS"]} allowReadOnly={true}>
                        <div className="p-8">Type Acceptance Certificate Page - Coming Soon</div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="settings" 
                    element={<div className="p-8">Settings Page - Coming Soon</div>} 
                  />
                  
                  {/* Global Operations routes */}
                  <Route 
                    path="global/aircraft-manufacturer" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <AircraftManufacturerPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/aircraft-type" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <AircraftTypePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/foreign-registration" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <ForeignRegistrationPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/foreign-amo" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <GlobalForeignAMOPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/general-aviation" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <GeneralAviationPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/operation-type" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <OperationTypePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/state-registry" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <StateRegistryPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/training-organization" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <TrainingOrganizationPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/travel-agency" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <TravelAgencyPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/foreign-airline" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <ForeignAirlinePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="global/certificate-type" 
                    element={
                      <ProtectedRoute globalOperations={true} allowReadOnly={false}>
                        <CertificateTypePage />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QueryClientProvider>
        </AuditProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
