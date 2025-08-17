"use client";

import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Settings, Calendar } from 'lucide-react';
import AdminLayout from '@/components/admin/layout/AdminLayout';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.email}! Manage your system from here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Access</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{user?.role}</div>
              <p className="text-xs text-muted-foreground">
                Full system access
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">
                System status
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Created</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Admin since
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>
                Monitor and manage your system from this central dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                As an administrator, you have full access to manage users, system settings, and all application features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks and shortcuts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                More admin features and quick actions will be available here as the system grows.
              </p>
            </CardContent>
          </Card>
        </div>

        {user?.apiKey && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
                <CardDescription>
                  Your API access credentials for system integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-1 font-mono">
                      {user.apiKey}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Secret</label>
                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-1 font-mono">
                      {user.apiSecret}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}