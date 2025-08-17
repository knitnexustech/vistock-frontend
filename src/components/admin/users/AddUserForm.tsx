"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Key, Globe, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useMutate } from "@/hooks/core/useApi";
import { USER_API_ENDPOINTS, ADMIN_ROUTES } from "@/constants/user";
import { CreateUserRequest, User } from "@/types/user";
import { queryKeys } from "@/lib/api/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import FormInput from "@/components/shared/FormInput";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/api";
import createUserSchema from "@/schemas/createUserSchema";

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function AddUserForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const createUserMutation = useMutate<User, CreateUserRequest>(
    USER_API_ENDPOINTS.CREATE,
    "POST",
    {
      onSuccess: () => {
        toast.success("User created successfully!");
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
        reset();
        router.push(ADMIN_ROUTES.ALL_USERS);
      },
      onError: (error: ApiError) => {
        toast.error(
          error?.message || "Failed to create user. Please try again."
        );
      },
    }
  );

  const onSubmit = (data: CreateUserFormData) => {
    createUserMutation.mutate({
      ...data,
      role: "client",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-6 w-6 text-primary" />
            <span>Add New User</span>
          </CardTitle>
          <CardDescription>
            Create a new user account with system access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="md:col-span-2">
                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="user@example.com"
                  icon={Mail}
                  error={errors.email?.message}
                  register={register("email")}
                />
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <FormInput
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter secure password"
                  icon={Lock}
                  error={errors.password?.message}
                  register={register("password")}
                />
              </div>

              {/* ERP Domain */}
              <div className="md:col-span-2">
                <FormInput
                  id="erpDomain"
                  label="ERP Domain"
                  type="text"
                  placeholder="company.m.frappe.cloud"
                  icon={Globe}
                  error={errors.erpDomain?.message}
                  register={register("erpDomain")}
                />
              </div>

              {/* API Key */}
              <FormInput
                id="apiKey"
                label="API Key"
                type="text"
                placeholder="Enter API key"
                icon={Key}
                error={errors.apiKey?.message}
                register={register("apiKey")}
              />

              {/* API Secret */}
              <FormInput
                id="apiSecret"
                label="API Secret"
                type="text"
                placeholder="Enter API secret"
                icon={Key}
                error={errors.apiSecret?.message}
                register={register("apiSecret")}
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

