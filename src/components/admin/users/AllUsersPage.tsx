"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { usePaginatedUsers } from "@/hooks/usePaginatedUsers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsersTable from "./UsersTable";
import UpdateUserModal from "./UpdateUserModal";
import { Users } from "lucide-react";
import LoadingState from "@/components/layout/LoadingState";
import ErrorState from "@/components/layout/ErrorState";
import { ApiError } from "next/dist/server/api-utils";

export default function AllUsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: usersData,
    isLoading,
    error,
    pagination,
    search,
    setSearch,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  } = usePaginatedUsers(1, 10);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load users"
        description={(error as ApiError)?.message || "Please try again later"}
        onRetry={() => refetch()}
      />
    );
  }

  const users = usersData?.users || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === "admin").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.role === "client").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>Manage and view all system users</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable 
            users={users} 
            onEdit={handleEditUser}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={goToPage}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
            searchValue={search}
            onSearchChange={setSearch}
          />
        </CardContent>
      </Card>

      <UpdateUserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
