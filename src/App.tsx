
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CountryProvider } from "@/contexts/CountryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdAdasHomepage from "./pages/ad-adas-cars/Homepage";
import AdAdasCurrentSnapshot from "./pages/ad-adas-cars/CurrentSnapshot";
import AdAdasCoreSystems from "./pages/ad-adas-cars/CoreSystems";
import AdAdasFutureBlueprint from "./pages/ad-adas-cars/FutureBlueprint";
import AdAdasEcosystem from "./pages/ad-adas-cars/Ecosystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CountryProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
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
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
