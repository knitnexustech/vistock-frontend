"use client";

import AdminSidebar from './AdminSidebar';
import AuthGuard from '@/components/shared/AuthGuard';
import { isMobile} from 'react-device-detect';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="flex h-screen bg-gray-50">
        {!isMobile && <AdminSidebar />}
        <main className="flex-1 overflow-auto">
          <div className={`p-6 ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </div>
        </main>
        {isMobile && <AdminSidebar />}
      </div>
    </AuthGuard>
  );
}