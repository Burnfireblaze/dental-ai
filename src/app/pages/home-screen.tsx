import { Link } from 'react-router';
import { Upload, FileText, Bot, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function HomeScreen() {
  const recentCases = [
    { id: 'case-001', patient: 'Patient #1234', date: '2026-02-21 09:30', status: 'urgent', findings: 'Periapical lesion detected' },
    { id: 'case-002', patient: 'Patient #1235', date: '2026-02-21 08:15', status: 'normal', findings: 'No significant findings' },
    { id: 'case-003', patient: 'Patient #1236', date: '2026-02-20 16:45', status: 'attention', findings: 'Early caries detected' },
  ];

  const urgentAlerts = [
    { id: 1, message: 'Patient #1234 - Periapical lesion requires immediate attention', time: '30 min ago' },
    { id: 2, message: 'Patient #1229 - Large carious lesion detected', time: '2 hours ago' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Dr. Rodriguez</h1>
        <p className="text-gray-600">Today is Saturday, February 21, 2026</p>
      </div>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
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
          <div className="space-y-3">
            {recentCases.map((case_) => (
              <Link 
                key={case_.id} 
                to={`/analysis/${case_.id}`}
                className="block"
              >
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{case_.patient}</h4>
                        <Badge 
                          variant={case_.status === 'urgent' ? 'destructive' : case_.status === 'attention' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {case_.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{case_.findings}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{case_.date}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
