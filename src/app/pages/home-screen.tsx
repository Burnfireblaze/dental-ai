import { Link } from 'react-router';
import { Upload, FileText, Bot, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCases } from '../hooks/useCases';

const formatDateTime = (value: string) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

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

export default function HomeScreen() {
  const { cases, loading, error } = useCases(8);
  const urgentCases = cases.filter((case_) => case_.urgencyLevel === 'urgent');
  const urgentAlerts = urgentCases.slice(0, 3).map((case_) => {
    const patientLabel = case_.patientId ? `Patient ${case_.patientId}` : 'Patient';
    const caseLabel = case_.caseId ? `Case ${case_.caseId}` : '';
    return {
      id: case_.caseId,
      message: `${patientLabel}${caseLabel ? ` • ${caseLabel}` : ''} - ${case_.summary}`,
      time: timeAgo(case_.createdAt),
    };
  });

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600">Today is {todayLabel}</p>
      </div>

      {/* Urgent Alerts */}
      {!loading && urgentAlerts.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-red-900 mb-2">Urgent Cases Requiring Attention</h3>
              <div className="space-y-2">
                {urgentAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-md p-3 border border-red-100">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/upload">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Upload X-ray</h3>
                  <p className="text-sm text-gray-600 mt-1">Start new analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Recent Cases</h3>
                  <p className="text-sm text-gray-600 mt-1">Review analysis history</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/ai-assistant">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Open AI Assistant</h3>
                  <p className="text-sm text-gray-600 mt-1">Get clinical insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!loading && !cases.length && !error && (
            <p className="text-sm text-gray-600">No cases found yet.</p>
          )}
          <div className="space-y-3">
            {cases.map((case_) => {
              const status = case_.urgencyLevel || (case_.status === 'processing' ? 'processing' : 'routine');
              return (
                <Link 
                  key={case_.caseId} 
                  to={`/analysis/${case_.caseId}`}
                  className="block"
                >
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {case_.patientId ? `Patient ${case_.patientId}` : 'Patient'}{case_.caseId ? ` • Case ${case_.caseId}` : ''}
                          </h4>
                          <Badge 
                            variant={status === 'urgent' ? 'destructive' : status === 'attention' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{case_.summary}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDateTime(case_.createdAt)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
