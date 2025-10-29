
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CountryProvider } from "@/contexts/CountryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PassengerCarsLandscape from "./pages/passenger-cars/Landscape";
import PassengerCarsAnalytics from "./pages/passenger-cars/Analytics";
import PassengerCarsIntelligence from "./pages/passenger-cars/Intelligence";
import PassengerCarsModeling from "./pages/passenger-cars/Modeling";
import PassengerCarsInsights from "./pages/passenger-cars/Insights";
import AdAdasHomepage from "./pages/ad-adas-cars/Homepage";
import AdAdasCurrentSnapshot from "./pages/ad-adas-cars/CurrentSnapshot";
import AdAdasCoreSystems from "./pages/ad-adas-cars/CoreSystems";
import AdAdasFutureBlueprint from "./pages/ad-adas-cars/FutureBlueprint";
import AdAdasEcosystem from "./pages/ad-adas-cars/Ecosystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CountryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/passenger-cars" element={<Navigate to="/passenger-cars/landscape" replace />} />
            <Route path="/passenger-cars/landscape" element={<ProtectedRoute><PassengerCarsLandscape /></ProtectedRoute>} />
            <Route path="/passenger-cars/analytics" element={<ProtectedRoute><PassengerCarsAnalytics /></ProtectedRoute>} />
            <Route path="/passenger-cars/intelligence" element={<ProtectedRoute><PassengerCarsIntelligence /></ProtectedRoute>} />
            <Route path="/passenger-cars/modeling" element={<ProtectedRoute><PassengerCarsModeling /></ProtectedRoute>} />
            <Route path="/passenger-cars/insights" element={<ProtectedRoute><PassengerCarsInsights /></ProtectedRoute>} />
            <Route path="/ad-adas-cars" element={<Navigate to="/ad-adas-cars/homepage" replace />} />
            <Route path="/ad-adas-cars/homepage" element={<ProtectedRoute><AdAdasHomepage /></ProtectedRoute>} />
            <Route path="/ad-adas-cars/current-snapshot" element={<ProtectedRoute><AdAdasCurrentSnapshot /></ProtectedRoute>} />
            <Route path="/ad-adas-cars/core-systems" element={<ProtectedRoute><AdAdasCoreSystems /></ProtectedRoute>} />
            <Route path="/ad-adas-cars/future-blueprint" element={<ProtectedRoute><AdAdasFutureBlueprint /></ProtectedRoute>} />
            <Route path="/ad-adas-cars/ecosystem" element={<ProtectedRoute><AdAdasEcosystem /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CountryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
