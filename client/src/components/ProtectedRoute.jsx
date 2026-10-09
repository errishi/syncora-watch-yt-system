import { useAuth } from '@clerk/react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk to load the auth state
  if (!isLoaded) {
    return (
      <LoadingScreen />
    );
  }

  // Redirect to sign-in page if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Render the protected child routes
  return <Outlet />;
}