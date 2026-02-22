import { Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and user management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">1,247</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +8%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">342</p>
            <p className="text-sm text-gray-600">Active Doctors</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                +15%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">892</p>
            <p className="text-sm text-gray-600">Patients</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                3 New
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">13</p>
            <p className="text-sm text-gray-600">Admin Users</p>
          </div>
        </div>

        {/* User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Doctors</span>
                  <span className="text-sm font-semibold text-gray-900">342 (27%)</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '27%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Patients</span>
                  <span className="text-sm font-semibold text-gray-900">892 (72%)</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Admins</span>
                  <span className="text-sm font-semibold text-gray-900">13 (1%)</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '1%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">System Health</span>
                </div>
                <span className="text-sm font-semibold text-green-700">Operational</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">AI Engine</span>
                </div>
                <span className="text-sm font-semibold text-blue-700">Running</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">Database</span>
                </div>
                <span className="text-sm font-semibold text-green-700">Connected</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-gray-400 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">Last Backup</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {[
              {
                user: 'Dr. Rodriguez',
                action: 'uploaded X-ray for patient #1234',
                time: '5 minutes ago',
                icon: Activity,
                color: 'blue',
              },
              {
                user: 'Admin Sarah',
                action: 'added new doctor account',
                time: '1 hour ago',
                icon: Users,
                color: 'green',
              },
              {
                user: 'Dr. Chen',
                action: 'generated clinical report',
                time: '2 hours ago',
                icon: Activity,
                color: 'purple',
              },
              {
                user: 'Patient John Doe',
                action: 'shared records via email',
                time: '3 hours ago',
                icon: Activity,
                color: 'orange',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`h-10 w-10 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`h-5 w-5 text-${activity.color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Trends */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Usage Trends</h2>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">+18% this month</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 mb-1">2,847</p>
              <p className="text-xs text-gray-600">X-rays Analyzed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 mb-1">1,523</p>
              <p className="text-xs text-gray-600">Reports Generated</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 mb-1">892</p>
              <p className="text-xs text-gray-600">Active Sessions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 mb-1">98.5%</p>
              <p className="text-xs text-gray-600">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
