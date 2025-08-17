"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle,
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { DASHBOARD_ROUTES, AUTH_ROUTES } from "@/constants/auth";

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [countdown, setCountdown] = useState(10);

  const handleGoHome = useCallback(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "admin") {
        router.push(DASHBOARD_ROUTES.ADMIN);
      } else {
        router.push(DASHBOARD_ROUTES.CLIENT);
      }
    } else {
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [isAuthenticated, user, router]);

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleGoHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleGoHome]);

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Main 404 Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
                404
              </CardTitle>
              <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Sorry, the page you are looking for doesn&apos;t exist or has been moved.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Auto Redirect Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 font-medium">
                Automatically redirecting you to the homepage in{" "}
                <span className="font-bold text-blue-900">{countdown}</span> seconds
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={handleGoHome}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button
                onClick={() => router.push(isAuthenticated ? 
                  (user?.role === "admin" ? "/admin/products" : "/client/products") 
                  : AUTH_ROUTES.LOGIN
                )}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Quick Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isAuthenticated ? (
                  user?.role === "admin" ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => router.push("/admin/dashboard")}
                        className="justify-start"
                      >
                        Admin Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => router.push("/admin/users")}
                        className="justify-start"
                      >
                        User Management
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => router.push("/client/dashboard")}
                        className="justify-start"
                      >
                        Client Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => router.push("/client/products")}
                        className="justify-start"
                      >
                        Products
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(AUTH_ROUTES.LOGIN)}
                      className="justify-start"
                    >
                      Login
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/")}
                      className="justify-start"
                    >
                      Home
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Possible reasons:</span>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• The URL was typed incorrectly</li>
                <li>• The page has been moved or deleted</li>
                <li>• You don&apos;t have permission to access this page</li>
                <li>• The link you followed is broken</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact{" "}
            <span className="font-medium text-gray-700">support@knitnexus.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}