"use client";

import ClientLayout from "@/components/client/layout/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, Archive } from "lucide-react";

export default function ClientDashboard() {
  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      icon: Package,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Low Stock Items",
      value: "23",
      icon: AlertTriangle,
      change: "-5%",
      changeType: "negative" as const,
    },
    {
      title: "Categories",
      value: "12",
      icon: Archive,
      change: "+2%",
      changeType: "positive" as const,
    },
    {
      title: "Total Value",
      value: "₹2,45,678",
      icon: TrendingUp,
      change: "+8%",
      changeType: "positive" as const,
    },
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s an overview of your inventory.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Product added</p>
                    <p className="text-xs text-gray-500">Cotton Premium - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Stock updated</p>
                    <p className="text-xs text-gray-500">Fabric SKU123 - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low stock alert</p>
                    <p className="text-xs text-gray-500">Silk Fabric - 6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cotton Fabrics</span>
                  <span className="text-sm font-medium">456 items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Silk Fabrics</span>
                  <span className="text-sm font-medium">234 items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wool Fabrics</span>
                  <span className="text-sm font-medium">123 items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Synthetic Fabrics</span>
                  <span className="text-sm font-medium">421 items</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}