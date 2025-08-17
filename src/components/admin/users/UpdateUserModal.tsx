"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Key, Lock, User, Mail, Calendar, Building } from "lucide-react";
import { useMutate } from "@/hooks/core/useApi";
import { USER_API_ENDPOINTS } from "@/constants/user";
import { User as UserType } from "@/types/user";
import { queryKeys } from "@/lib/api/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import FormInput from "@/components/shared/FormInput";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const updateUserSchema = z.object({
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  password: z.string().optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UpdateUserRequest {
  apiKey?: string;
  apiSecret?: string;
  password?: string;
}

interface UpdateUserModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateUserModal({
  user,
  isOpen,
  onClose,
}: UpdateUserModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  const updateUserMutation = useMutate<UserType, UpdateUserRequest>(
    `${USER_API_ENDPOINTS.UPDATE}/${user?.id}`,
    "PUT",
    {
      onSuccess: () => {
        toast.success("User updated successfully!");
        queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
        reset();
        onClose();
      },
      onError: (error: ApiError) => {
        toast.error(
          error?.message || "Failed to update user. Please try again."
        );
      },
    }
  );

  const onSubmit = (data: UpdateUserFormData) => {
    // Filter out empty values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value && value.trim() !== "")
    );
    
    if (Object.keys(filteredData).length === 0) {
      toast.error("Please provide at least one field to update");
      return;
    }

    updateUserMutation.mutate(filteredData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Update User</span>
          </DialogTitle>
          <DialogDescription>
            Update user credentials and API settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information Display */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>User Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Role:</span>
                <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              
              {user.erpDomain && (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">ERP Domain:</span>
                  <span>{user.erpDomain}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Created:</span>
                <span>{format(new Date(user.createdAt), "dd-MM-yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Update Fields</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <FormInput
                  id="apiKey"
                  label="API Key (optional)"
                  type="text"
                  placeholder="Enter new API key"
                  icon={Key}
                  error={errors.apiKey?.message}
                  register={register("apiKey")}
                />

                <FormInput
                  id="apiSecret"
                  label="API Secret (optional)"
                  type="password"
                  placeholder="Enter new API secret"
                  icon={Key}
                  error={errors.apiSecret?.message}
                  register={register("apiSecret")}
                />

                <FormInput
                  id="password"
                  label="Password (optional)"
                  type="password"
                  placeholder="Enter new password"
                  icon={Lock}
                  error={errors.password?.message}
                  register={register("password")}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}