import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { dark } from '@clerk/themes';
import { shadcn } from '@clerk/ui/themes';
import { ClerkProvider, SignIn, SignUp } from '@clerk/react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const isRoomRoute = location.pathname.startsWith('/room/');

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      appearance={{
        baseTheme: dark,
        theme: shadcn,
        variables: {
          colorBackground: 'hsl(240 10% 6%)',
          colorInputBackground: 'hsl(240 10% 10%)',
          colorInputText: 'hsl(0 0% 98%)',
          colorText: 'hsl(0 0% 98%)',
          colorTextSecondary: 'hsl(240 5% 70%)',
          colorTextOnBackground: 'hsl(0 0% 98%)',
          colorPrimary: 'hsl(140 49% 61%)',
          colorDanger: 'hsl(0 84% 60%)',
          colorSuccess: 'hsl(140 49% 61%)',
          colorNeutral: 'hsl(240 10% 16%)',
        },
        elements: {
          cardBox: "shadow-2xl border border-white/10 rounded-2xl bg-card",
          card: "bg-card",
          headerTitle: "text-foreground font-bold text-xl",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "bg-background border border-border hover:bg-muted transition-all",
          socialButtonsBlockButtonText: "text-foreground font-semibold",
          socialButtonsProviderIcon: "opacity-100",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground font-medium",
          formFieldLabel: "text-foreground text-sm font-medium",
          formFieldInput: "bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all",
          formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
          formFieldHintText: "text-muted-foreground",
          formFieldErrorText: "text-red-400",
          formFieldSuccessText: "text-primary",
          otpCodeFieldInput: "bg-background border border-border text-foreground caret-primary",
          otpCodeFieldInputFocused: "border-primary ring-1 ring-primary",
          otpCodeFieldInputError: "border-red-500 text-red-300",
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 transition-all",
          formResendCodeLink: "text-primary hover:text-primary/90 font-semibold",
          formFieldAction: "text-primary hover:text-primary/90",
          alert: "bg-red-950/40 border border-red-500/40 text-red-200",
          alertText: "text-red-200",
          footerActionText: "text-muted-foreground",
          footerActionLink: "text-primary hover:text-primary/90 font-semibold",
          footer: "border-border",
          identityPreview: "bg-background border border-border rounded-md",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary hover:text-primary/90",
          identityPreviewEditButtonIcon: "text-primary",
          breadcrumbs: "text-muted-foreground",
          breadcrumbsItem: "text-muted-foreground",
          breadcrumbsItemCurrent: "text-foreground",
        }
      }}
    >
      <div className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground flex flex-col selection:bg-primary/30">
        <div className="background-dots" aria-hidden="true" />
        {!isRoomRoute && <Navbar />}
        <main className={`relative z-10 flex-1 flex flex-col w-full mx-auto ${isRoomRoute ? '' : 'max-w-7xl pt-24 pb-8 px-4 sm:px-6'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/sign-in/*"
              element={
                <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center my-20">
                  <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
                </div>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center my-20">
                  <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
                </div>
              }
            />
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
    </ClerkProvider>
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
