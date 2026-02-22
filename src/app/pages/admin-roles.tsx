import { Check, X, Shield, Stethoscope, User } from 'lucide-react';

const permissions = [
  { id: 'upload_xray', label: 'Upload X-rays', category: 'Clinical' },
  { id: 'view_ai_analysis', label: 'View AI Analysis', category: 'Clinical' },
  { id: 'edit_findings', label: 'Edit Findings', category: 'Clinical' },
  { id: 'generate_reports', label: 'Generate Reports', category: 'Clinical' },
  { id: 'view_patient_records', label: 'View Patient Records', category: 'Patient Data' },
  { id: 'edit_patient_records', label: 'Edit Patient Records', category: 'Patient Data' },
  { id: 'share_records', label: 'Share Records', category: 'Patient Data' },
  { id: 'manage_users', label: 'Manage Users', category: 'Administration' },
  { id: 'manage_roles', label: 'Manage Roles', category: 'Administration' },
  { id: 'view_system_logs', label: 'View System Logs', category: 'Administration' },
  { id: 'system_settings', label: 'System Settings', category: 'Administration' },
];

const rolePermissions = {
  doctor: {
    upload_xray: true,
    view_ai_analysis: true,
    edit_findings: true,
    generate_reports: true,
    view_patient_records: true,
    edit_patient_records: true,
    share_records: true,
    manage_users: false,
    manage_roles: false,
    view_system_logs: false,
    system_settings: false,
  },
  patient: {
    upload_xray: false,
    view_ai_analysis: false,
    edit_findings: false,
    generate_reports: false,
    view_patient_records: true,
    edit_patient_records: false,
    share_records: true,
    manage_users: false,
    manage_roles: false,
    view_system_logs: false,
    system_settings: false,
  },
  admin: {
    upload_xray: true,
    view_ai_analysis: true,
    edit_findings: true,
    generate_reports: true,
    view_patient_records: true,
    edit_patient_records: true,
    share_records: true,
    manage_users: true,
    manage_roles: true,
    view_system_logs: true,
    system_settings: true,
  },
};

export default function AdminRoles() {
  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Roles & Permissions
          </h1>
          <p className="text-gray-600">Manage role definitions and permissions</p>
        </div>

        {/* Role Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Doctor</h3>
                <p className="text-sm text-blue-100">342 users</p>
              </div>
            </div>
            <p className="text-sm text-blue-100 mb-3">
              Full clinical access with patient management capabilities
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4" />
              <span>7 of 11 permissions</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Patient</h3>
                <p className="text-sm text-green-100">892 users</p>
              </div>
            </div>
            <p className="text-sm text-green-100 mb-3">
              View personal records and share with healthcare providers
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4" />
              <span>2 of 11 permissions</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Admin</h3>
                <p className="text-sm text-purple-100">13 users</p>
              </div>
            </div>
            <p className="text-sm text-purple-100 mb-3">
              Full system access with user and role management
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4" />
              <span>11 of 11 permissions</span>
            </div>
          </div>
        </div>

        {/* Permissions Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Permission
                  </th>
                  <th className="text-center px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">Doctor</span>
                    </div>
                  </th>
                  <th className="text-center px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <User className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">Patient</span>
                    </div>
                  </th>
                  <th className="text-center px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-900">Admin</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <>
                    <tr key={category} className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-3">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {category}
                        </span>
                      </td>
                    </tr>
                    {permissions
                      .filter((p) => p.category === category)
                      .map((permission) => (
                        <tr key={permission.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{permission.label}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {rolePermissions.doctor[permission.id as keyof typeof rolePermissions.doctor] ? (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Check className="h-4 w-4 text-blue-600" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  <X className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {rolePermissions.patient[permission.id as keyof typeof rolePermissions.patient] ? (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <Check className="h-4 w-4 text-green-600" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  <X className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {rolePermissions.admin[permission.id as keyof typeof rolePermissions.admin] ? (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Check className="h-4 w-4 text-purple-600" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  <X className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {['doctor', 'patient', 'admin'].map((role) => (
            <div key={role} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                {role === 'doctor' && <Stethoscope className="h-6 w-6 text-blue-600" />}
                {role === 'patient' && <User className="h-6 w-6 text-green-600" />}
                {role === 'admin' && <Shield className="h-6 w-6 text-purple-600" />}
                <h3 className="font-semibold text-lg text-gray-900 capitalize">{role}</h3>
              </div>

              {categories.map((category) => (
                <div key={category} className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {permissions
                      .filter((p) => p.category === category)
                      .map((permission) => {
                        const hasPermission =
                          rolePermissions[role as keyof typeof rolePermissions][
                            permission.id as keyof typeof rolePermissions.doctor
                          ];
                        return (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between py-2"
                          >
                            <span className="text-sm text-gray-900">{permission.label}</span>
                            {hasPermission ? (
                              <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <X className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Permission Legend */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-3">Permission Notes</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Doctors</strong> have full clinical access to upload X-rays, review AI findings, and manage patient records
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Patients</strong> can view their own records and share them with other healthcare providers
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Admins</strong> have full system access including user management and system configuration
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
