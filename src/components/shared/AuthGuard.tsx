"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useGet } from '@/hooks/core/useApi';
import { queryKeys } from '@/lib/api/apiClient';
import { API_ENDPOINTS, AUTH_ROUTES } from '@/constants/auth';
import { User } from '@/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "client" | "admin";
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = AUTH_ROUTES.LOGIN 
}: AuthGuardProps) {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth, setLoading, hasHydrated } = useAuthStore();

  // Verify token with /auth/me endpoint if we have a token but no user
  const { data: userData, isLoading, error } = useGet<{ user: User }>(
    queryKeys.user.me(),
    API_ENDPOINTS.ME,
    undefined,
    {
      enabled: !!token && !user,
      retry: false,
    }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (userData?.user && token) {
      setAuth(userData.user, token);
    }
  }, [userData, token, setAuth]);

  useEffect(() => {
    // Don't do anything until store has hydrated
    if (!hasHydrated) return;

    if (error || (!token && !isLoading)) {
      clearAuth();
      router.push(redirectTo);
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      // Check role-based access
      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user's actual role
        const userDashboard = user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
        router.push(userDashboard);
        return;
      }
    }
  }, [error, token, isLoading, isAuthenticated, user, requiredRole, router, redirectTo, clearAuth, hasHydrated]);

  // Show loading state while hydrating or loading user data
  if (!hasHydrated || isLoading || (!user && token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (only after hydration is complete)
  if (hasHydrated && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}