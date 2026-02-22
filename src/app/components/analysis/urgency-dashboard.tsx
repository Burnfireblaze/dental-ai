import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface UrgencyDashboardProps {
  urgency: {
    level: string;
    score: number;
    timeline: string;
    action: string;
    summary: string;
    priorityFindings: string[];
    recommendation: string;
  };
}

export default function UrgencyDashboard({ urgency }: UrgencyDashboardProps) {
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'urgent':
        return 'red';
      case 'attention':
        return 'yellow';
      default:
        return 'green';
    }
  };

  const color = getUrgencyColor(urgency.level);

  return (
    <Card className={`border-2 border-${color}-300 bg-${color}-50`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div className={`h-12 w-12 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
            <AlertTriangle className={`h-6 w-6 text-${color}-600`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-gray-900">Urgency Assessment</h2>
              <Badge variant="destructive" className="capitalize">
                {urgency.level} - Score {urgency.score}/10
              </Badge>
            </div>

            <p className="text-gray-700 mb-4">{urgency.summary}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-2">
                <Clock className={`h-5 w-5 text-${color}-600 flex-shrink-0 mt-0.5`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Timeline</p>
                  <p className="text-sm text-gray-600">{urgency.timeline}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className={`h-5 w-5 text-${color}-600 flex-shrink-0 mt-0.5`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Recommended Action</p>
                  <p className="text-sm text-gray-600">{urgency.action}</p>
                </div>
              </div>
            </div>

            {/* Priority Findings */}
            <div className={`bg-white border border-${color}-200 rounded-lg p-3`}>
              <h3 className="font-semibold text-gray-900 mb-2">Priority Findings:</h3>
              <ul className="space-y-1">
                {urgency.priorityFindings.map((finding, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className={`text-${color}-600`}>•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendation */}
            <div className={`mt-3 p-3 bg-${color}-100 rounded-lg`}>
              <p className="text-sm font-semibold text-gray-900">
                📞 {urgency.recommendation}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
