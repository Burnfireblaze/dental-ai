import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function DashboardScreen() {
  const stats = [
    { label: 'Sessions Analyzed', value: '247', icon: Activity, color: 'blue' },
    { label: 'Urgent Cases', value: '8', icon: AlertTriangle, color: 'red' },
    { label: 'AI Acceptance Rate', value: '94%', icon: CheckCircle, color: 'green' },
    { label: 'Corrections Made', value: '15', icon: TrendingUp, color: 'orange' },
  ];

  const recentActivity = [
    { id: 1, action: 'Analysis completed', patient: 'Patient #1234', time: '10 minutes ago', urgent: true },
    { id: 2, action: 'AI finding accepted', patient: 'Patient #1233', time: '25 minutes ago', urgent: false },
    { id: 3, action: 'Correction submitted', patient: 'Patient #1232', time: '1 hour ago', urgent: false },
    { id: 4, action: 'Report generated', patient: 'Patient #1231', time: '2 hours ago', urgent: false },
    { id: 5, action: 'Analysis completed', patient: 'Patient #1230', time: '3 hours ago', urgent: true },
  ];

  const urgencyDistribution = [
    { level: 'Urgent', count: 8, percentage: 65, color: 'bg-red-500' },
    { level: 'Attention', count: 3, percentage: 25, color: 'bg-yellow-500' },
    { level: 'Routine', count: 2, percentage: 15, color: 'bg-green-500' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">System insights and activity summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      {activity.urgent && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{activity.patient}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Urgency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgencyDistribution.map((item) => (
                <div key={item.level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.level}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count} cases</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">System Performance</h4>
                  <p className="text-sm text-blue-800">
                    AI acceptance rate is above target. Average processing time: 2.3 minutes per case.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-1">Total Processed Today</h3>
            <p className="text-3xl font-bold text-blue-700">23</p>
            <p className="text-sm text-blue-600 mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-900 mb-1">Average Confidence</h3>
            <p className="text-3xl font-bold text-green-700">96.2%</p>
            <p className="text-sm text-green-600 mt-1">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-purple-900 mb-1">AI Interactions</h3>
            <p className="text-3xl font-bold text-purple-700">47</p>
            <p className="text-sm text-purple-600 mt-1">Questions answered</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
