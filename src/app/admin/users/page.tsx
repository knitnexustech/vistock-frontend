import AdminLayout from '@/components/admin/layout/AdminLayout';
import AllUsersPage from '@/components/admin/users/AllUsersPage';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <AllUsersPage />
    </AdminLayout>
  );
}