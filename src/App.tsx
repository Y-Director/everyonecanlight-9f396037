import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Articles from "./pages/Articles.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import LightingEquipment from "./pages/LightingEquipment.tsx";
import LightingEquipmentDetail from "./pages/LightingEquipmentDetail.tsx";
import EquipmentCompare from "./pages/EquipmentCompare.tsx";
import Learn from "./pages/Learn.tsx";
import ControlApps from "./pages/ControlApps.tsx";
import Masterclass from "./pages/Masterclass.tsx";
import RentEquipment from "./pages/RentEquipment.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminRentals from "./pages/admin/AdminRentals.tsx";
import ContributorAuth from "./pages/contributors/ContributorAuth.tsx";
import ContributorDashboard from "./pages/contributors/ContributorDashboard.tsx";
import ContributorEditor from "./pages/contributors/ContributorEditor.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import NotFound from "./pages/NotFound.tsx";
import StarlightWidget from "./components/StarlightWidget.tsx";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

/** contributors.everyonecanlight.co serves the contributor portal at its root. */
const SubdomainRedirect = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const host = window.location.hostname;
    if (!host.startsWith("contributors.")) return;
    if (!pathname.startsWith("/contributors")) {
      navigate(`/contributors${pathname === "/" ? "" : pathname}`, { replace: true });
    }
  }, [pathname, navigate]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SubdomainRedirect />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/rent-equipment" element={<RentEquipment />} />
          <Route path="/lighting-equipment" element={<LightingEquipment />} />
          <Route path="/lighting-equipment/compare" element={<EquipmentCompare />} />
          <Route path="/lighting-equipment/:slug" element={<LightingEquipmentDetail />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/courses" element={<Learn />} />
          <Route path="/control-apps" element={<ControlApps />} />
          <Route path="/masterclass" element={<Masterclass />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/rentals" element={<AdminRentals />} />
          <Route path="/contributors" element={<ContributorDashboard />} />
          <Route path="/contributors/auth" element={<ContributorAuth />} />
          <Route path="/contributors/editor/:id" element={<ContributorEditor />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <StarlightWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
