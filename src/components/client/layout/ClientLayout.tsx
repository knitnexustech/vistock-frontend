"use client";

import ClientSidebar from './ClientSidebar';
import AuthGuard from '@/components/shared/AuthGuard';
import { isMobile } from 'react-device-detect';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthGuard requiredRole="client">
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {!isMobile && <ClientSidebar />}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className={`p-6 flex-1 overflow-y-auto ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </div>
        </main>
        {isMobile && <ClientSidebar />}
      </div>
    </AuthGuard>
  );
}