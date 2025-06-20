
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import PassengerCarsLandscape from "./pages/passenger-cars/Landscape";
import PassengerCarsAnalytics from "./pages/passenger-cars/Analytics";
import PassengerCarsIntelligence from "./pages/passenger-cars/Intelligence";
import PassengerCarsModeling from "./pages/passenger-cars/Modeling";
import PassengerCarsInsights from "./pages/passenger-cars/Insights";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
