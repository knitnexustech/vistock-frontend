"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
import { ArrowUpDown, MoreHorizontal, Edit } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import ServerDataTable from "@/components/shared/ServerDataTable";

interface UsersTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  isLoading?: boolean;
  // Server-side pagination props (required)
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  // Search props (required)
  searchValue: string;
  onSearchChange: (search: string) => void;
}

export default function UsersTable({ 
  users, 
  onEdit,
  isLoading = false,
  pagination,
  onPageChange,
  onNextPage,
  onPreviousPage,
  searchValue,
  onSearchChange,
}: UsersTableProps) {

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="font-medium">{row.getValue("email")}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <div className="min-w-[80px]">
            <Badge variant={role === "admin" ? "destructive" : "secondary"}>
              {role}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "erpDomain",
      header: "ERP Domain",
      cell: ({ row }) => {
        const domain = row.getValue("erpDomain") as string | null;
        return (
          <div className="text-sm text-gray-600 min-w-[150px]">
            {domain || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm text-gray-600 min-w-[120px]">
            <div>{format(date, "dd-MM-yyyy")}</div>
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(date)}
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <ServerDataTable
      data={users}
      columns={columns}
      searchPlaceholder="Search users..."
      emptyMessage="No users found! Go to previous page or create a new user."
      itemName="user"
      enableColumnVisibility={true}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      onNextPage={onNextPage}
      onPreviousPage={onPreviousPage}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchMinLength={3}
    />
  );
}

