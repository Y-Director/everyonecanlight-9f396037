import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Articles from "./pages/Articles.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import LightingEquipment from "./pages/LightingEquipment.tsx";
import LightingEquipmentDetail from "./pages/LightingEquipmentDetail.tsx";
import Courses from "./pages/Courses.tsx";
import ControlApps from "./pages/ControlApps.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/lighting-equipment" element={<LightingEquipment />} />
          <Route path="/lighting-equipment/:slug" element={<LightingEquipmentDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/control-apps" element={<ControlApps />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
