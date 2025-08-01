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
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AOCPage from "./pages/AOC/AOCPage";
import ATOPage from "./pages/ATO/ATOPage";
import ACStatusPage from "./pages/ACStatus/ACStatusPage";

// AI Pages
import AIDashboard from "./pages/AI/AIDashboard";
import AIChatPage from "./pages/AI/AIChatPage";
import DocumentAnalysisPage from "./pages/AI/DocumentAnalysisPage";
import PredictiveAnalyticsPage from "./pages/AI/PredictiveAnalyticsPage";
import SmartReportsPage from "./pages/AI/SmartReportsPage";

// New Pages
import ForeignAirlineDACLPage from "./pages/ForeignAirlineDACL/ForeignAirlineDACLPage";
import ForeignAMOPage from "./pages/AMO/Foreign/ForeignAMOPage";
import LocalAMOPage from "./pages/AMO/Local/LocalAMOPage";
import AircraftManufacturerPage from "./pages/Global/AircraftManufacturer/AircraftManufacturerPage";
import AircraftTypePage from "./pages/Global/AircraftType/AircraftTypePage";
import FOCCMCCPage from "./pages/FOCC/FOCCMCCPage";
import AcceptanceCertificatePage from "./pages/AcceptanceCertificate/AcceptanceCertificatePage";

// Global Operations Pages
import ForeignRegistrationMarkPage from "./pages/Global/ForeignRegistrationMark/ForeignRegistrationMarkPage";
import GeneralAviationPage from "./pages/Global/GeneralAviation/GeneralAviationPage";
import OperationTypePage from "./pages/Global/OperationType/OperationTypePage";
import UserRolesPage from "./pages/Global/UserRoles/UserRolesPage";
import GlobalForeignAMOPage from "./pages/Global/ForeignAMO/ForeignAMOPage";
import StateOfRegistryPage from "./pages/Global/StateOfRegistry/StateOfRegistryPage";
import TrainingOrganizationPage from "./pages/Global/TrainingOrganization/TrainingOrganizationPage";
import TravelAgencyPage from "./pages/Global/TravelAgency/TravelAgencyPage";
import ForeignAirlinePage from "./pages/Global/ForeignAirline/ForeignAirlinePage";
import CertificateTypePage from "./pages/Global/CertificateType/CertificateTypePage";

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
                
                {/* Profile Page - All authenticated users */}
                <Route path="profile" element={<ProfilePage />} />
                
                {/* AI Features - All authenticated users except Read and View */}
                <Route 
                  path="ai" 
                  element={
                    <ProtectedRoute requireAIAccess={true}>
                      <AIDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="ai/chat" 
                  element={
                    <ProtectedRoute requireAIAccess={true}>
                      <AIChatPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="ai/document-analysis" 
                  element={
                    <ProtectedRoute requireAIAccess={true}>
                      <DocumentAnalysisPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="ai/analytics" 
                  element={
                    <ProtectedRoute requireAIAccess={true}>
                      <PredictiveAnalyticsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="ai/reports" 
                  element={
                    <ProtectedRoute requireAIAccess={true}>
                      <SmartReportsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Users Management */}
                <Route 
                  path="users" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <UsersPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* AOC Management - DAWS only, excluding DOLTS */}
                <Route 
                  path="aoc" 
                  element={
                    <ProtectedRoute requiredDirectorate="DAWS">
                      <AOCPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ATO Management - DAAS only */}
                <Route 
                  path="ato" 
                  element={
                    <ProtectedRoute requiredDirectorate="DAAS">
                      <ATOPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Aircraft Status - DAWS only, excluding DOLTS */}
                <Route 
                  path="ac-status" 
                  element={
                    <ProtectedRoute requiredDirectorate="DAWS" excludeDirectorates={["DOLTS"]}>
                      <ACStatusPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Foreign Airline DACL - DOLTS access */}
                <Route 
                  path="foreign-airline-dacl" 
                  element={
                    <ProtectedRoute requiredDirectorate="DOLTS">
                      <ForeignAirlineDACLPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* AMO Routes - DAWS only, excluding DOLTS */}
                <Route 
                  path="amo/foreign" 
                  element={
                    <ProtectedRoute requiredDirectorate="DAWS" excludeDirectorates={["DOLTS"]}>
                      <ForeignAMOPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="amo/local" 
                  element={
                    <ProtectedRoute requiredDirectorate="DAWS" excludeDirectorates={["DOLTS"]}>
                      <LocalAMOPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* FOCC/MCC Route - DAWS only */}
                <Route 
                  path="focc-mcc" 
                  element={
                    <ProtectedRoute requiredDirectorate="DAWS">
                      <FOCCMCCPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Acceptance Certificate Route - DAWS only */}
                <Route 
                  path="acceptance-certificate" 
                  element={
                    <ProtectedRoute requiredDirectorate="DAWS">
                      <AcceptanceCertificatePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="settings" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Global Operations routes - only Super Users can access */}
                <Route 
                  path="global/aircraft-manufacturer" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <AircraftManufacturerPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/aircraft-type" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <AircraftTypePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/foreign-registration" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <ForeignRegistrationMarkPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/general-aviation" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <GeneralAviationPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/operation-type" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <OperationTypePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/user-roles" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <UserRolesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/foreign-amo" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <GlobalForeignAMOPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/state-registry" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <StateOfRegistryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/training-organization" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <TrainingOrganizationPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/travel-agency" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <TravelAgencyPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/foreign-airline" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
                      <ForeignAirlinePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="global/certificate-type" 
                  element={
                    <ProtectedRoute requiredRole="Super User">
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
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
