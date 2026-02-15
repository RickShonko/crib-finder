import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import HouseDetails from "./pages/HouseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewListing from "./pages/NewListing";
import EditListing from "./pages/EditListing";
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentVerify from "./pages/PaymentVerify";
import NotFound from "./pages/NotFound";

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
            <Route path="/listings" element={<Listings />} />
            <Route path="/house/:id" element={<HouseDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/new" element={<NewListing />} />
            <Route path="/dashboard/edit/:id" element={<EditListing />} />
            <Route path="/payment/checkout/:id" element={<PaymentCheckout />} />
            <Route path="/payment/verify" element={<PaymentVerify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
