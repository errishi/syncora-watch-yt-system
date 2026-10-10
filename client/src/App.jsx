import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CreateRoom from './pages/CreateRoom';
import Dashboard from './pages/Dashboard';
import JoinRoom from './pages/JoinRoom';
import WatchRoom from './pages/WatchRoom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { Toaster } from './components/ui/sonner';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function RouteChangeLoader() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, [location.pathname]); // Trigger on path change

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300">
      <LoadingScreen />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isRoomRoute = location.pathname.startsWith('/room/');

  return (
    <AuthProvider>
      <div className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground flex flex-col selection:bg-primary/30">
        <div className="background-dots" aria-hidden="true" />
        {!isRoomRoute && <Navbar />}
        <main className={`relative z-10 flex-1 flex flex-col w-full mx-auto ${isRoomRoute ? '' : 'max-w-7xl pt-24 pb-8 px-4 sm:px-6'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<CreateRoom />} />
              <Route path="/join" element={<JoinRoom />} />
              <Route path="/room/:roomId" element={<WatchRoom />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isRoomRoute && <Footer />}
        <RouteChangeLoader />
        <Toaster 
          position="top-center" 
          richColors
        />
      </div>
    </AuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
