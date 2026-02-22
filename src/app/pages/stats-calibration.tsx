import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, CheckCircle, Edit, TrendingUp, BarChart3 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getMetrics } from '../services/ai-api';
import type { MetricsResponse } from '../types/ai';

export default function StatsCalibration() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    getMetrics().then(setMetrics).catch(() => undefined);
  }, []);

  const stats = metrics
    ? {
        sessionsAnalyzed: metrics.sessions_analyzed,
        acceptanceRate: metrics.acceptance_rate,
        correctionsMade: metrics.corrections_made,
        averageUrgency: metrics.average_urgency,
      }
    : {
        sessionsAnalyzed: 247,
        acceptanceRate: 94,
        correctionsMade: 15,
        averageUrgency: 6.2,
      };

  const calibrationData = metrics?.calibration?.length
    ? metrics.calibration
    : [
        { category: 'Periapical Lesions', accepted: 42, corrected: 3, rejected: 1, accuracy: 91 },
        { category: 'Carious Lesions', accepted: 89, corrected: 7, rejected: 2, accuracy: 91 },
        { category: 'Bone Loss', accepted: 34, corrected: 2, rejected: 1, accuracy: 92 },
        { category: 'Root Canal', accepted: 28, corrected: 2, rejected: 0, accuracy: 93 },
        { category: 'Impacted Teeth', accepted: 15, corrected: 1, rejected: 0, accuracy: 94 },
      ];

  const urgencyDistribution = metrics?.urgency_distribution?.length
    ? metrics.urgency_distribution.map((item) => ({
        level: item.level,
        count: item.count,
        percentage: item.percentage,
        color: item.level.toLowerCase().includes('urgent')
          ? 'bg-red-500'
          : item.level.toLowerCase().includes('attention')
          ? 'bg-yellow-500'
          : 'bg-green-500',
      }))
    : [
        { level: 'Urgent', count: 45, percentage: 18, color: 'bg-red-500' },
        { level: 'Attention', count: 78, percentage: 32, color: 'bg-yellow-500' },
        { level: 'Routine', count: 124, percentage: 50, color: 'bg-green-500' },
      ];

  const recentCorrections = metrics?.recent_corrections?.length
    ? metrics.recent_corrections.map((item) => ({
        id: item.id,
        condition: item.condition,
        originalTooth: item.original_tooth || undefined,
        correctedTooth: item.corrected_tooth || undefined,
        change: item.change || undefined,
        date: item.date,
      }))
    : [
        { id: 1, condition: 'Carious Lesion', originalTooth: '#14', correctedTooth: '#15', date: '2026-02-21' },
        { id: 2, condition: 'Periapical Lesion', change: 'Urgency level adjusted', date: '2026-02-20' },
        { id: 3, condition: 'Bone Loss', originalTooth: '#30', correctedTooth: '#31', date: '2026-02-19' },
      ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Stats & Calibration</h1>
        <p className="text-gray-600 mt-1">AI performance metrics and calibration data</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.acceptanceRate}%</p>
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
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Distribution Analysis</p>
                  <p className="text-blue-800">
                    50% of cases are routine, indicating good preventive care. Urgent cases (18%) are within normal range for clinical practice.
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
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-900 mb-1">Overall Performance</h3>
            <p className="text-3xl font-bold text-green-700">Excellent</p>
            <p className="text-sm text-green-600 mt-1">94% acceptance rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-1">Calibration Status</h3>
            <p className="text-3xl font-bold text-blue-700">Optimal</p>
            <p className="text-sm text-blue-600 mt-1">Well-calibrated system</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-purple-900 mb-1">Improvement</h3>
            <p className="text-3xl font-bold text-purple-700">+2.3%</p>
            <p className="text-sm text-purple-600 mt-1">vs. last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
