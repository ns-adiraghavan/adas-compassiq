
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CountryProvider } from "@/contexts/CountryContext";
import Index from "./pages/Index";
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
    <CountryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/passenger-cars" element={<Navigate to="/passenger-cars/landscape" replace />} />
            <Route path="/passenger-cars/landscape" element={<PassengerCarsLandscape />} />
            <Route path="/passenger-cars/analytics" element={<PassengerCarsAnalytics />} />
            <Route path="/passenger-cars/intelligence" element={<PassengerCarsIntelligence />} />
            <Route path="/passenger-cars/modeling" element={<PassengerCarsModeling />} />
            <Route path="/passenger-cars/insights" element={<PassengerCarsInsights />} />
            <Route path="/ad-adas-cars" element={<Navigate to="/ad-adas-cars/homepage" replace />} />
            <Route path="/ad-adas-cars/homepage" element={<AdAdasHomepage />} />
            <Route path="/ad-adas-cars/current-snapshot" element={<AdAdasCurrentSnapshot />} />
            <Route path="/ad-adas-cars/core-systems" element={<AdAdasCoreSystems />} />
            <Route path="/ad-adas-cars/future-blueprint" element={<AdAdasFutureBlueprint />} />
            <Route path="/ad-adas-cars/ecosystem" element={<AdAdasEcosystem />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CountryProvider>
  </QueryClientProvider>
);

export default App;
