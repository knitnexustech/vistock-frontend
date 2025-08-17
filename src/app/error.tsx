"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft,
  Bug 
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

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Log the error to monitoring service
    console.error("Application Error:", error);
  }, [error]);

  const handleGoHome = () => {
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
  };

  const handleGoBack = () => {
    router.back();
  };

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Main Error Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                We encountered an unexpected error. Don&apos;t worry, it&apos;s not your fault.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details (Development Only) */}
            {isDevelopment && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Bug className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Development Error Details:
                    </h4>
                    <p className="text-sm text-red-700 font-mono break-all">
                      {error.message}
                    </p>
                    {error.digest && (
                      <p className="text-xs text-red-600 mt-1">
                        Error ID: {error.digest}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                onClick={reset}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
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
            </div>

            {/* Helpful Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                What can you do?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Quick Fixes:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Try refreshing the page</li>
                    <li>• Check your internet connection</li>
                    <li>• Clear your browser cache</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Still having issues?</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Go back to the previous page</li>
                    <li>• Return to the homepage</li>
                    <li>• Contact support if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact{" "}
            <span className="font-medium text-gray-700">support@knitnexus.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}