import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, CheckCircle, Edit, TrendingUp, BarChart3 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getMetrics } from '../services/ai-api';
import type { MetricsResponse } from '../types/ai';

export default function StatsCalibration() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics().then(setMetrics).catch((err) => {
      setError(err instanceof Error ? err.message : 'Unable to load metrics');
    });
  }, []);

  const stats = metrics
    ? {
        sessionsAnalyzed: metrics.sessions_analyzed,
        acceptanceRate: metrics.acceptance_rate,
        correctionsMade: metrics.corrections_made,
        averageUrgency: metrics.average_urgency,
      }
    : {
        sessionsAnalyzed: 0,
        acceptanceRate: 0,
        correctionsMade: 0,
        averageUrgency: 0,
      };

  const calibrationData = metrics?.calibration ?? [];

  const urgencyDistribution = metrics?.urgency_distribution?.map((item) => ({
    level: item.level,
    count: item.count,
    percentage: item.percentage,
    color: item.level.toLowerCase().includes('urgent')
      ? 'bg-red-500'
      : item.level.toLowerCase().includes('attention')
      ? 'bg-yellow-500'
      : 'bg-green-500',
  })) ?? [];

  const recentCorrections = metrics?.recent_corrections?.map((item) => ({
    id: item.id,
    condition: item.condition,
    originalTooth: item.original_tooth || undefined,
    correctedTooth: item.corrected_tooth || undefined,
    change: item.change || undefined,
    date: item.date,
  })) ?? [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Stats & Calibration</h1>
        <p className="text-gray-600 mt-1">AI performance metrics and calibration data</p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sessions Analyzed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.sessionsAnalyzed}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Acceptance Rate</p>
                <p className="text-3xl font-bold text-gray-900">{`${stats.acceptanceRate}%`}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Corrections Made</p>
                <p className="text-3xl font-bold text-gray-900">{stats.correctionsMade}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Edit className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Urgency Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageUrgency}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Calibration by Category */}
        <Card>
          <CardHeader>
            <CardTitle>AI Calibration by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calibrationData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <Badge variant="outline">{item.accuracy}% accuracy</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-green-50 border border-green-200 rounded px-2 py-1 text-center">
                      <p className="text-green-900 font-semibold">{item.accepted}</p>
                      <p className="text-green-700">Accepted</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-center">
                      <p className="text-blue-900 font-semibold">{item.corrected}</p>
                      <p className="text-blue-700">Corrected</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded px-2 py-1 text-center">
                      <p className="text-red-900 font-semibold">{item.rejected}</p>
                      <p className="text-red-700">Rejected</p>
                    </div>
                  </div>
                </div>
              ))}
              {!calibrationData.length && (
                <p className="text-sm text-gray-600">No calibration data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Urgency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Urgency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {urgencyDistribution.map((item) => (
                <div key={item.level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.level}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.count} cases ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              {!urgencyDistribution.length && (
                <p className="text-sm text-gray-600">No urgency data yet.</p>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Distribution Analysis</p>
                  <p className="text-blue-800">
                    {urgencyDistribution.length
                      ? `Routine cases are ${urgencyDistribution.find((item) => item.level.toLowerCase().includes('routine'))?.percentage ?? 0}% of total. Urgent cases are ${urgencyDistribution.find((item) => item.level.toLowerCase().includes('urgent'))?.percentage ?? 0}%.`
                      : 'Distribution insights will appear once cases are analyzed.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Corrections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Corrections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCorrections.map((correction) => (
              <div key={correction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{correction.condition}</h4>
                  <p className="text-sm text-gray-600">
                    {correction.originalTooth && correction.correctedTooth 
                      ? `Tooth corrected: ${correction.originalTooth} → ${correction.correctedTooth}`
                      : correction.change
                    }
                  </p>
                </div>
                <div className="text-sm text-gray-500 flex-shrink-0 ml-4">
                  {correction.date}
                </div>
              </div>
            ))}
            {!recentCorrections.length && (
              <p className="text-sm text-gray-600">No corrections recorded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-900 mb-1">Overall Performance</h3>
            <p className="text-3xl font-bold text-green-700">
              {metrics
                ? metrics.acceptance_rate >= 90
                  ? 'Excellent'
                  : metrics.acceptance_rate >= 75
                  ? 'Good'
                  : 'Review'
                : '--'}
            </p>
            <p className="text-sm text-green-600 mt-1">
              {metrics ? `${metrics.acceptance_rate}% acceptance rate` : 'No data yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-1">Calibration Status</h3>
            <p className="text-3xl font-bold text-blue-700">
              {metrics
                ? metrics.corrections_made <= Math.max(metrics.total_findings * 0.1, 1)
                  ? 'Stable'
                  : 'Review'
                : '--'}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {metrics ? `${metrics.corrections_made} corrections logged` : 'No data yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-purple-900 mb-1">Improvement</h3>
            <p className="text-3xl font-bold text-purple-700">
              {metrics ? `${metrics.feedback_count}` : '--'}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {metrics ? 'Feedback entries recorded' : 'No data yet'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
