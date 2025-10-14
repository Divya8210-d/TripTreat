import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigationType,
  Navigate,
} from 'react-router-dom';
import Index from './pages/Index';
import BecomeHostPage from './pages/BecomeHostPage';
import HomestaysPage from './pages/HomestaysPage';
import HomestayDetailsPage from './pages/HomestayDetailsPage';
import ToursPage from './pages/ToursPage';
import ExperiencesPage from './pages/ExperiencesPage';
import EateriesPage from './pages/EateriesPage';
import HotspotsPage from './pages/HotspotsPage';
import ItineraryPage from './pages/ItineraryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HostingGuidelinesPage from './pages/HostingGuidelinesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import FloatingChatbot from './components/FloatingChatbot';
import Loader from './components/Loader';
import { preloadImages, staticImages } from './utils/imagePreloader';
import StorePage from './pages/StorePage';
import TransportPage from './pages/TransportPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
}

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);

  useEffect(() => {
    preloadImages(staticImages, progress => {
      setPreloadProgress(progress);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <Loader progress={preloadProgress} />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="trip-and-treat-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/become-host" element={<BecomeHostPage />} />
                  <Route path="/homestays" element={<HomestaysPage />} />
                  <Route
                    path="/homestays/:id"
                    element={<HomestayDetailsPage />}
                  />
                  <Route path="/tours" element={<ToursPage />} />
                  <Route path="/experiences" element={<ExperiencesPage />} />
                  <Route path="/eateries" element={<EateriesPage />} />
                  <Route path="/hotspots" element={<HotspotsPage />} />
                  <Route path="/itinerary" element={<ItineraryPage />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/transport" element={<TransportPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/host-guidelines" element={<HostingGuidelinesPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  {/* Protected routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <ProtectedRoute>
                        <BookingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <FloatingChatbot />
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
