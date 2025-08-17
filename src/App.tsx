
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Offerings from "./pages/Offerings";
import Community from "./pages/Community";
import Support from "./pages/Support";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Events from "./pages/Events";
import Stories from "./pages/Stories";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import NGODashboard from "./pages/NGODashboard";
import UserProfile from "./pages/UserProfile";
import AdminSetup from "./pages/AdminSetup";
import PlatformGuide from "./pages/PlatformGuide";
import DonationGuide from "./pages/DonationGuide";
import CommunityRules from "./pages/CommunityRules";
import SupportGroups from "./pages/SupportGroups";
import Resources from "./pages/Resources";
import Connect from "./pages/Connect";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import ContactUs from "./pages/ContactUs";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/offerings" element={<Offerings />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/connect" element={<Connect />} />
              
              {/* Community features - now accessible to all users */}
              <Route path="/community" element={<Community />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/support-groups" element={<SupportGroups />} />
              <Route path="/events" element={<Events />} />
              <Route path="/stories" element={<Stories />} />
              
              <Route path="/support" element={<Support />} />
              <Route path="/donate" element={<Support />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/docs/platform" element={<PlatformGuide />} />
              <Route path="/docs/donate" element={<DonationGuide />} />
              <Route path="/docs/rules" element={<CommunityRules />} />
              
              {/* Policy and Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/contact" element={<ContactUs />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/ngo-dashboard" element={<NGODashboard />} />
                <Route path="/user/:userId" element={<UserProfile />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
