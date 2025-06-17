
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PassengerCars from "./pages/PassengerCars";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/passenger-cars" element={<PassengerCars />} />
          <Route path="/two-wheelers" element={<div className="min-h-screen bg-black text-white flex items-center justify-center"><h1 className="text-4xl">Two Wheelers - Coming Soon</h1></div>} />
          <Route path="/commercial-vehicles" element={<div className="min-h-screen bg-black text-white flex items-center justify-center"><h1 className="text-4xl">Commercial Vehicles - Coming Soon</h1></div>} />
          <Route path="/agriculture-vehicles" element={<div className="min-h-screen bg-black text-white flex items-center justify-center"><h1 className="text-4xl">Agriculture Vehicles - Coming Soon</h1></div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
