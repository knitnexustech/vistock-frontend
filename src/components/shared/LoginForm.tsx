"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useMutate } from "@/hooks/core/useApi";
import { useAuthStore } from "@/stores/authStore";
import { AuthResponse, LoginCredentials } from "@/types/auth";
import { API_ENDPOINTS, DASHBOARD_ROUTES } from "@/constants/auth";
import FormInput from "@/components/shared/FormInput";
import { toast } from "sonner";
import loginSchema from "@/schemas/loginSchema";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutate<AuthResponse, LoginCredentials>(
    API_ENDPOINTS.LOGIN,
    "POST",
    {
      onSuccess: (data) => {
        setAuth(data.user, data.token);

        // Redirect based on user role
        if (data.user.role === "admin") {
          router.push(DASHBOARD_ROUTES.ADMIN);
        } else {
          router.push(DASHBOARD_ROUTES.CLIENT);
        }
      },
      onError: (error: Error | unknown) => {
        toast.error((error as Error)?.message || "Login failed. Please try again.");
      },
    }
  );

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your email and password to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInput
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  error={errors.email?.message}
                  register={register("email")}
                />

                <FormInput
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  icon={Lock}
                  error={errors.password?.message}
                  register={register("password")}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

