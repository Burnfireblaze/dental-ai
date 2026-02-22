import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getMetrics } from '../services/ai-api';
import type { MetricsResponse } from '../types/ai';
import { useCases } from '../hooks/useCases';

const timeAgo = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

export default function DashboardScreen() {
  const { cases, loading: casesLoading } = useCases(20);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    getMetrics()
      .then(setMetrics)
      .catch(() => undefined);
  }, []);

  const urgentCount = cases.filter((case_) => case_.urgencyLevel === 'urgent').length;

  const stats = [
    { label: 'Sessions Analyzed', value: metrics ? metrics.sessions_analyzed : cases.length, icon: Activity, color: 'blue' },
    { label: 'Urgent Cases', value: casesLoading ? '--' : urgentCount, icon: AlertTriangle, color: 'red' },
    { label: 'AI Acceptance Rate', value: metrics ? `${metrics.acceptance_rate}%` : '0%', icon: CheckCircle, color: 'green' },
    { label: 'Corrections Made', value: metrics ? metrics.corrections_made : 0, icon: TrendingUp, color: 'orange' },
  ];

  const recentActivity = useMemo(() => {
    return cases.slice(0, 6).map((case_) => ({
      id: case_.caseId,
      action: case_.status === 'processing' ? 'Analysis in progress' : 'Analysis completed',
      patient: case_.patientId ? `Patient ${case_.patientId}` : 'Patient',
      caseId: case_.caseId,
      time: timeAgo(case_.createdAt),
      urgent: case_.urgencyLevel === 'urgent',
    }));
  }, [cases]);

  const urgencyDistribution = useMemo(() => {
    const counts = { Urgent: 0, Attention: 0, Routine: 0 };
    cases.forEach((case_) => {
      if (case_.urgencyLevel === 'urgent') counts.Urgent += 1;
      else if (case_.urgencyLevel === 'attention') counts.Attention += 1;
      else if (case_.urgencyLevel === 'routine') counts.Routine += 1;
    });
    const total = counts.Urgent + counts.Attention + counts.Routine || 1;
    return [
      { level: 'Urgent', count: counts.Urgent, percentage: Math.round((counts.Urgent / total) * 100), color: 'bg-red-500' },
      { level: 'Attention', count: counts.Attention, percentage: Math.round((counts.Attention / total) * 100), color: 'bg-yellow-500' },
      { level: 'Routine', count: counts.Routine, percentage: Math.round((counts.Routine / total) * 100), color: 'bg-green-500' },
    ];
  }, [cases]);

  const processedToday = useMemo(() => {
    const today = new Date().toDateString();
    return cases.filter((case_) => {
      const created = new Date(case_.createdAt);
      return !Number.isNaN(created.getTime()) && created.toDateString() === today;
    }).length;
  }, [cases]);

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
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-600">No recent activity yet.</p>
              )}
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      {activity.urgent && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {activity.patient}{activity.caseId ? ` • Case ${activity.caseId}` : ''}
                    </p>
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
              {cases.length === 0 && (
                <p className="text-sm text-gray-600">No urgency data yet.</p>
              )}
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
                    {metrics
                      ? `AI acceptance rate is ${metrics.acceptance_rate}%. Average urgency score: ${metrics.average_urgency}.`
                      : 'Metrics will appear once cases are analyzed.'}
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
            <p className="text-3xl font-bold text-blue-700">{processedToday}</p>
            <p className="text-sm text-blue-600 mt-1">Updated from live cases</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-900 mb-1">Average Confidence</h3>
            <p className="text-3xl font-bold text-green-700">
              {metrics ? `${metrics.average_confidence}%` : '0%'}
            </p>
            <p className="text-sm text-green-600 mt-1">Across all findings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-purple-900 mb-1">AI Interactions</h3>
            <p className="text-3xl font-bold text-purple-700">
              {metrics ? metrics.total_findings : 0}
            </p>
            <p className="text-sm text-purple-600 mt-1">Findings analyzed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
