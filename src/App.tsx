
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

// Import existing pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Import AI pages
import DocumentAnalysisPage from "./pages/AI/DocumentAnalysisPage";
import ComplianceMonitoringPage from "./pages/AI/ComplianceMonitoringPage";
import PredictiveAnalyticsPage from "./pages/AI/PredictiveAnalyticsPage";
import IntelligentSearchPage from "./pages/AI/IntelligentSearchPage";
import ReportGenerationPage from "./pages/AI/ReportGenerationPage";
import ChatbotAssistantPage from "./pages/AI/ChatbotAssistantPage";

import CertificatesPage from "./pages/CertificatesPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import AircraftsPage from "./pages/AircraftsPage";
import OperationsPage from "./pages/OperationsPage";
import AerodromesPage from "./pages/AerodromesPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import AuditTrailPage from "./pages/AuditTrailPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                
                {/* AI Feature Routes */}
                <Route path="ai/document-analysis" element={<DocumentAnalysisPage />} />
                <Route path="ai/compliance-monitoring" element={<ComplianceMonitoringPage />} />
                <Route path="ai/predictive-analytics" element={<PredictiveAnalyticsPage />} />
                <Route path="ai/intelligent-search" element={<IntelligentSearchPage />} />
                <Route path="ai/report-generation" element={<ReportGenerationPage />} />
                <Route path="ai/chatbot-assistant" element={<ChatbotAssistantPage />} />
                
                <Route path="certificates" element={<CertificatesPage />} />
                <Route path="users" element={
                  <ProtectedRoute requiredRole="Super User">
                    <UsersPage />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute requiredRole="Super User">
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="aircrafts" element={<AircraftsPage />} />
                <Route path="operations" element={<OperationsPage />} />
                <Route path="aerodromes" element={<AerodromesPage />} />
                <Route path="organizations" element={<OrganizationsPage />} />
                <Route path="audit-trail" element={
                  <ProtectedRoute requiredRole="Super User">
                    <AuditTrailPage />
                  </ProtectedRoute>
                } />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
