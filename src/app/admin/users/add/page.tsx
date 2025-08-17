import AdminLayout from '@/components/admin/layout/AdminLayout';
import AddUserForm from '@/components/admin/users/AddUserForm';

export default function AdminAddUserPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Add User</h1>
        </div>
        <AddUserForm />
      </div>
    </AdminLayout>
  );
}