import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReservationModalProvider } from "@/components/ReservationModal";
import Navbar from "@/components/Navbar";
import FloatingReservationButton from "@/components/FloatingReservationButton";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import GastroBoxesPage from "@/pages/GastroBoxesPage";
import CateringPage from "@/pages/CateringPage";
import CateringGastronomicosPage from "@/pages/CateringGastronomicosPage";
import CateringInfantilesPage from "@/pages/CateringInfantilesPage";
import CateringAdultosPage from "@/pages/CateringAdultosPage";
import GalleryPage from "@/pages/GalleryPage";
import CartPage from "@/pages/CartPage";
import CancelPage from "@/pages/CancelPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider>
          <ReservationModalProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <ScrollToTop />
            <FloatingReservationButton />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/gastro-boxes" element={<GastroBoxesPage />} />
              <Route path="/catering" element={<CateringPage />} />
              <Route path="/catering/gastronomicos" element={<CateringGastronomicosPage />} />
              <Route path="/catering/infantiles" element={<CateringInfantilesPage />} />
              <Route path="/catering/adultos" element={<CateringAdultosPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cancel" element={<CancelPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </ReservationModalProvider>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
