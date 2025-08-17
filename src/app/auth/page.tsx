"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { AUTH_ROUTES, DASHBOARD_ROUTES } from '@/constants/auth';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'admin') {
        router.push(DASHBOARD_ROUTES.ADMIN);
      } else {
        router.push(DASHBOARD_ROUTES.CLIENT);
      }
    } else {
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}