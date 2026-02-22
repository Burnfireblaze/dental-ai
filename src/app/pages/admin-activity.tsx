import { useState } from 'react';
import { Activity, Calendar, Filter, Download } from 'lucide-react';
import { Button } from '../components/ui/button';

const activityLogs = [
  {
    id: 1,
    timestamp: '2026-02-21 14:32:15',
    user: 'Dr. Michael Rodriguez',
    action: 'Uploaded X-ray',
    details: 'Patient #1234 - Panoramic X-ray',
    type: 'clinical',
    severity: 'info',
  },
  {
    id: 2,
    timestamp: '2026-02-21 14:15:42',
    user: 'Admin Kate Wilson',
    action: 'Created user account',
    details: 'New doctor: Dr. Sarah Chen',
    type: 'admin',
    severity: 'info',
  },
  {
    id: 3,
    timestamp: '2026-02-21 13:58:27',
    user: 'Dr. James Park',
    action: 'Generated clinical report',
    details: 'Patient #5678 - Report ID: RPT-2024',
    type: 'clinical',
    severity: 'info',
  },
  {
    id: 4,
    timestamp: '2026-02-21 13:45:11',
    user: 'System',
    action: 'AI Analysis completed',
    details: '3 findings detected - Case #9876',
    type: 'system',
    severity: 'success',
  },
  {
    id: 5,
    timestamp: '2026-02-21 13:22:06',
    user: 'Patient Sarah Johnson',
    action: 'Shared records',
    details: 'Records shared via email to external provider',
    type: 'data',
    severity: 'info',
  },
  {
    id: 6,
    timestamp: '2026-02-21 12:58:33',
    user: 'System',
    action: 'Backup completed',
    details: 'Automated daily backup - 2.4GB',
    type: 'system',
    severity: 'success',
  },
  {
    id: 7,
    timestamp: '2026-02-21 12:15:48',
    user: 'Admin Kate Wilson',
    action: 'Updated user role',
    details: 'Changed role for user #4523 from Patient to Doctor',
    type: 'admin',
    severity: 'warning',
  },
  {
    id: 8,
    timestamp: '2026-02-21 11:42:19',
    user: 'Dr. Rodriguez',
    action: 'Modified AI finding',
    details: 'Corrected detection on tooth #16',
    type: 'clinical',
    severity: 'info',
  },
  {
    id: 9,
    timestamp: '2026-02-21 11:28:55',
    user: 'System',
    action: 'Login attempt failed',
    details: 'Failed login for user: test@example.com',
    type: 'security',
    severity: 'error',
  },
  {
    id: 10,
    timestamp: '2026-02-21 11:05:32',
    user: 'Patient Emily Davis',
    action: 'Viewed clinical report',
    details: 'Report ID: RPT-2019',
    type: 'data',
    severity: 'info',
  },
];

export default function AdminActivity() {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredLogs = activityLogs.filter((log) => 
    filterType === 'all' || log.type === filterType
  );

  const getTypeBadge = (type: string) => {
    const styles = {
      clinical: 'bg-blue-100 text-blue-700',
      admin: 'bg-purple-100 text-purple-700',
      system: 'bg-gray-100 text-gray-700',
      data: 'bg-green-100 text-green-700',
      security: 'bg-red-100 text-red-700',
    };
    return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const getSeverityIndicator = (severity: string) => {
    const styles = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500',
    };
    return styles[severity as keyof typeof styles] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">System Activity</h1>
            <p className="text-gray-600">Monitor system events and user actions</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">1,247</span>
            </div>
            <p className="text-sm text-gray-600">Events Today</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">892</span>
            </div>
            <p className="text-sm text-gray-600">Active Sessions</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">3</span>
            </div>
            <p className="text-sm text-gray-600">Failed Logins</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">98.5%</span>
            </div>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filter Logs</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilterType('clinical')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'clinical'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clinical
            </button>
            <button
              onClick={() => setFilterType('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setFilterType('system')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'system'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              System
            </button>
            <button
              onClick={() => setFilterType('data')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'data'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Data Access
            </button>
            <button
              onClick={() => setFilterType('security')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'security'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
          
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {/* Severity Indicator */}
                <div className="flex-shrink-0 mt-1">
                  <div className={`h-2 w-2 rounded-full ${getSeverityIndicator(log.severity)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{log.action}</h3>
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {log.timestamp}
                        </span>
                        <span>•</span>
                        <span>{log.user}</span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getTypeBadge(
                        log.type
                      )}`}
                    >
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <Button variant="outline">Load More</Button>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Security Events
          </h3>
          <div className="space-y-2 text-sm text-red-800">
            <div className="flex justify-between items-center py-2 border-b border-red-200 last:border-0">
              <span>Failed login attempts</span>
              <span className="font-semibold">3 today</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-red-200 last:border-0">
              <span>Suspicious activity detected</span>
              <span className="font-semibold">0 today</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Account lockouts</span>
              <span className="font-semibold">1 today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
