"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, UserPlus, Home, LogOut, User } from "lucide-react";
import { isMobile } from "react-device-detect";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/constants/user";
import { AUTH_ROUTES } from "@/constants/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const navigation = [
  {
    name: "Dashboard",
    href: ADMIN_ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    name: "All Users",
    href: ADMIN_ROUTES.ALL_USERS,
    icon: Users,
  },
  {
    name: "Add User",
    href: ADMIN_ROUTES.ADD_USER,
    icon: UserPlus,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push(AUTH_ROUTES.LOGIN);
  };

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <nav className="flex justify-around items-center">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center px-3 py-2 rounded-lg transition-colors min-w-0",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5 mb-1 flex-shrink-0" />
                <span className="text-xs font-medium truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}
          {/* Logout button for mobile */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center px-3 py-2 rounded-lg transition-colors min-w-0 text-red-600 hover:text-red-900"
          >
            <LogOut className="h-5 w-5 mb-1 flex-shrink-0" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </nav>
      </div>
    );
  }

  // Desktop/Tablet Sidebar with responsive behavior
  return (
    <TooltipProvider>
      <div className="flex h-full w-16 lg:w-64 flex-col bg-white border-r border-gray-200 transition-all duration-300">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl lg:text-2xl font-bold text-primary">
            <span className="lg:hidden">V</span>
            <span className="hidden lg:inline">Vistock</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 lg:p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="group">
                {/* Small screen: Icon with tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        // Small screens: center icon only
                        "justify-center w-12 h-12 lg:justify-start lg:w-full lg:px-4 lg:py-3",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5 lg:mr-3 flex-shrink-0" />
                      {/* Large screens: show text */}
                      <span className="hidden lg:inline text-sm font-medium">
                        {item.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {/* Tooltip only shows on small screens */}
                  <TooltipContent side="right" className="lg:hidden">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </nav>

        {/* User Section - Bottom of sidebar */}
        <div className="border-t border-gray-200 p-2 lg:p-4">
          {/* Logout Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleLogout}
                variant="outline"
                className={cn(
                  "w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300",
                  "lg:justify-start justify-center lg:px-3 px-0"
                )}
              >
                <LogOut className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="lg:hidden">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
          {/* User Info */}
          {user && (
            <div className="mt-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center lg:justify-start p-2 lg:p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-primary text-white rounded-full flex-shrink-0">
                      <User className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                    <div className="hidden lg:block ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:hidden">
                  <div className="text-left">
                    <p className="font-medium">{user.email.split("@")[0]}</p>
                    <p className="text-xs">{user.email}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
