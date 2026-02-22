import { useState } from 'react';
import { Search, MoreVertical, Plus, UserPlus, Mail, Shield, Eye, Ban } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router';

const users = [
  {
    id: 1,
    name: 'Dr. Michael Rodriguez',
    email: 'rodriguez@dentalclinic.com',
    role: 'doctor',
    status: 'active',
    lastLogin: '2 hours ago',
    patients: 124,
  },
  {
    id: 2,
    name: 'Dr. Sarah Chen',
    email: 'chen@dentalcare.com',
    role: 'doctor',
    status: 'active',
    lastLogin: '1 day ago',
    patients: 98,
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    role: 'patient',
    status: 'active',
    lastLogin: '3 hours ago',
    visits: 12,
  },
  {
    id: 4,
    name: 'Admin Kate Wilson',
    email: 'kate.admin@dentalai.com',
    role: 'admin',
    status: 'active',
    lastLogin: '30 minutes ago',
  },
  {
    id: 5,
    name: 'Dr. James Park',
    email: 'jpark@dental.com',
    role: 'doctor',
    status: 'inactive',
    lastLogin: '2 weeks ago',
    patients: 67,
  },
  {
    id: 6,
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    role: 'patient',
    status: 'active',
    lastLogin: '1 week ago',
    visits: 5,
  },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const navigate = useNavigate();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      doctor: 'bg-blue-100 text-blue-700',
      patient: 'bg-green-100 text-green-700',
      admin: 'bg-purple-100 text-purple-700',
    };
    return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage users, roles, and permissions</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">342</span>
            </div>
            <p className="text-sm text-gray-600">Doctors</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">892</span>
            </div>
            <p className="text-sm text-gray-600">Patients</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">13</span>
            </div>
            <p className="text-sm text-gray-600">Admins</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRole('doctor')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === 'doctor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Doctors
              </button>
              <button
                onClick={() => setFilterRole('patient')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === 'patient'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Patients
              </button>
              <button
                onClick={() => setFilterRole('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admins
              </button>
            </div>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Info
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{user.lastLogin}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {user.role === 'doctor' && `${user.patients} patients`}
                        {user.role === 'patient' && `${user.visits} visits`}
                        {user.role === 'admin' && '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{user.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="text-gray-900">{user.lastLogin}</span>
                </div>
                {user.role === 'doctor' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patients:</span>
                    <span className="text-gray-900">{user.patients}</span>
                  </div>
                )}
                {user.role === 'patient' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visits:</span>
                    <span className="text-gray-900">{user.visits}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
