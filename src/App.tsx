import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { ProGuard } from "@/components/guards/ProGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AppPage from "./pages/App";
import Pricing from "./pages/Pricing";
import Billing from "./pages/Billing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/app"
              element={
                <ProGuard>
                  <AppPage />
                </ProGuard>
              }
            />
            <Route
              path="/billing"
              element={
                <AuthGuard>
                  <Billing />
                </AuthGuard>
              }
            />
            <Route
              path="/payment-success"
              element={
                <AuthGuard>
                  <PaymentSuccess />
                </AuthGuard>
              }
            />
            <Route
              path="/payment-failed"
              element={
                <AuthGuard>
                  <PaymentFailed />
                </AuthGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
